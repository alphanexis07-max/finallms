from datetime import datetime, timezone, timedelta
import logging
import re
from jose import jwt, JWTError
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from app.db import mongo
from app.deps.auth import get_current_user
from app.schemas.auth import (
    LoginRequest, RegisterRequest, TokenResponse,
    ForgotPasswordRequest, ResetPasswordRequest, ForgotPasswordResponse
)
from app.utils.security import create_access_token, hash_password, verify_and_update_password
from app.services.email import send_transactional_email
from app.core.config import settings
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/auth", tags=["auth"])
logger = logging.getLogger("lms-api.auth")


class ProfileUpdateIn(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    mobile: str | None = None
    phone_number: str | None = None
    profile_image_url: str | None = None
    bank_account_holder: str | None = None
    bank_name: str | None = None
    bank_account_number: str | None = None
    bank_ifsc: str | None = None
    bank_upi_id: str | None = None


def email_match_query(email: str) -> dict:
    # Allow accidental whitespace and case differences in legacy data.
    return {"$regex": f"^\\s*{re.escape(email)}\\s*$", "$options": "i"}


@router.post("/register", response_model=TokenResponse)
async def register(payload: RegisterRequest):
    if mongo.db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")
    normalized_email = payload.email.strip().lower()
    existing = await mongo.db.users.find_one({"email": email_match_query(normalized_email)})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    user = {
        "full_name": payload.full_name,
        "email": normalized_email,
        "password_hash": hash_password(payload.password),
        "role": payload.role.value,
        "tenant_id": payload.tenant_id,
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
    }
    if getattr(payload, "phone", None):
        user["phone"] = payload.phone
    res = await mongo.db.users.insert_one(user)
    token = create_access_token(
        {"sub": str(res.inserted_id), "role": payload.role.value, "tenant_id": payload.tenant_id}
    )
    return TokenResponse(access_token=token, role=payload.role, tenant_id=payload.tenant_id)


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest):
    if mongo.db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")
    normalized_email = payload.email.strip().lower()
    projection = {
        "_id": 1,
        "role": 1,
        "tenant_id": 1,
        "password_hash": 1,
        "password": 1,
        "updated_at": 1,
        "created_at": 1,
    }
    users: list[dict] = []

    # Fast path (index-friendly): exact normalized email match.
    exact_user = await mongo.db.users.find_one(
        {"email": normalized_email, "is_active": {"$ne": False}},
        projection,
    )
    if exact_user:
        users.append(exact_user)

    # Legacy fallback for old rows that may contain whitespace/case variants.
    if not users:
        users = await mongo.db.users.find(
            {
                "email": email_match_query(normalized_email),
                "is_active": {"$ne": False},
            },
            projection,
        ).to_list(length=5)

    if not users:
        logger.info("login_failed reason=user_not_found email=%s", normalized_email)
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Prefer the newest records first if duplicates exist for the same email.
    users.sort(
        key=lambda u: (u.get("updated_at") or u.get("created_at") or datetime.min.replace(tzinfo=timezone.utc)),
        reverse=True,
    )

    matched_user = None
    matched_next_hash = None

    for user in users:
        ok = False
        next_hash = None
        stored_hash = user.get("password_hash")
        legacy_password = user.get("password")

        if isinstance(stored_hash, str) and stored_hash:
            try:
                ok, next_hash = verify_and_update_password(payload.password, stored_hash)
            except Exception:
                ok = False
            if not ok and stored_hash == payload.password:
                # Legacy migration path where raw password was mistakenly stored.
                ok = True
                next_hash = hash_password(payload.password)
        elif isinstance(legacy_password, str) and legacy_password:
            # Legacy migration path for records that used `password` field.
            if legacy_password == payload.password:
                ok = True
                next_hash = hash_password(payload.password)
            else:
                try:
                    ok, next_hash = verify_and_update_password(payload.password, legacy_password)
                except Exception:
                    ok = False

        if ok:
            matched_user = user
            matched_next_hash = next_hash
            break

    if not matched_user:
        logger.info(
            "login_failed reason=password_mismatch email=%s candidate_count=%s",
            normalized_email,
            len(users),
        )
        raise HTTPException(status_code=401, detail="Invalid credentials")

    updates = {"updated_at": datetime.now(timezone.utc)}
    if matched_next_hash:
        updates["password_hash"] = matched_next_hash
    if "password" in matched_user:
        updates["password"] = None

    await mongo.db.users.update_one(
        {"_id": matched_user["_id"]},
        {"$set": updates},
    )
    token = create_access_token(
        {
            "sub": str(matched_user["_id"]),
            "role": matched_user["role"],
            "tenant_id": matched_user.get("tenant_id"),
        }
    )
    return TokenResponse(
        access_token=token,
        role=matched_user["role"],
        tenant_id=matched_user.get("tenant_id"),
    )


@router.get("/me")
async def me(current_user=Depends(get_current_user)):
    if mongo.db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")
    user = await mongo.db.users.find_one({"_id": ObjectId(current_user["sub"])})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["_id"] = str(user["_id"])
    user.pop("password_hash", None)
    return user


@router.patch("/me")
async def update_me(payload: ProfileUpdateIn, current_user=Depends(get_current_user)):
    if mongo.db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")

    user_id = ObjectId(current_user["sub"])
    existing = await mongo.db.users.find_one({"_id": user_id})
    if not existing:
        raise HTTPException(status_code=404, detail="User not found")

    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        existing["_id"] = str(existing["_id"])
        existing.pop("password_hash", None)
        return existing

    normalized_phone = (
        updates.get("phone")
        or updates.get("mobile")
        or updates.get("phone_number")
    )
    if normalized_phone is not None:
        normalized_phone = normalized_phone.strip()
        updates["phone"] = normalized_phone
        updates["mobile"] = normalized_phone
        updates["phone_number"] = normalized_phone

    if "email" in updates:
        updates["email"] = updates["email"].strip().lower()
        if updates["email"] != str(existing.get("email", "")).strip().lower():
            duplicate = await mongo.db.users.find_one(
                {"email": email_match_query(updates["email"]), "_id": {"$ne": user_id}}
            )
            if duplicate:
                raise HTTPException(status_code=400, detail="Email already exists")

    # Avoid writing when values are effectively unchanged.
    effective_updates = {}
    for key, value in updates.items():
        if str(existing.get(key, "")).strip() != str(value).strip():
            effective_updates[key] = value

    if not effective_updates:
        existing["_id"] = str(existing["_id"])
        existing.pop("password_hash", None)
        return existing

    effective_updates["updated_at"] = datetime.now(timezone.utc)
    await mongo.db.users.update_one({"_id": user_id}, {"$set": effective_updates})

    user = await mongo.db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["_id"] = str(user["_id"])
    user.pop("password_hash", None)
    return user


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
async def forgot_password(payload: ForgotPasswordRequest):
    """Send password reset email to user"""
    if mongo.db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")
    
    normalized_email = payload.email.strip().lower()
    user = await mongo.db.users.find_one({"email": email_match_query(normalized_email)})
    
    if not user:
        # For security, don't reveal if email exists - return success anyway
        logger.info("forgot_password_request for non-existent email=%s", normalized_email)
        return ForgotPasswordResponse(
            message="If an account exists with this email, you will receive a password reset link shortly.",
            email=normalized_email
        )
    
    # Generate reset token with 24 hour expiry
    reset_token = jwt.encode(
        {
            "sub": str(user["_id"]),
            "email": normalized_email,
            "type": "password_reset",
            "exp": datetime.now(timezone.utc) + timedelta(hours=24)
        },
        settings.secret_key,
        algorithm="HS256"
    )
    
    # Store reset token attempt in DB for audit trail
    await mongo.db.password_resets.insert_one({
        "user_id": user["_id"],
        "email": normalized_email,
        "token_hash": hash_password(reset_token),
        "created_at": datetime.now(timezone.utc),
        "expires_at": datetime.now(timezone.utc) + timedelta(hours=24)
    })
    
    # Construct reset link
    frontend_url = settings.frontend_url or "http://localhost:5173"
    reset_link = f"{frontend_url}/reset-password?token={reset_token}"
    
    # Send email
    email_subject = "Password Reset Request - LMS Portal"
    email_message = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Password Reset Request</h2>
            <p>Hello {user.get('full_name', 'User')},</p>
            <p>We received a request to reset your password. Click the link below to create a new password:</p>
            <p style="margin: 30px 0;">
                <a href="{reset_link}" style="background-color: #ff8a33; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Reset Password
                </a>
            </p>
            <p>Or copy this link: <br><code style="background: #f4f4f4; padding: 10px; display: inline-block;">{reset_link}</code></p>
            <p><strong>This link expires in 24 hours.</strong></p>
            <p>If you didn't request this reset, please ignore this email or contact support.</p>
            <hr style="margin-top: 40px; border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; color: #666;">LMS Support Team</p>
        </div>
    </body>
    </html>
    """
    
    try:
        await send_transactional_email(normalized_email, email_subject, email_message)
        logger.info("password_reset_email_sent email=%s", normalized_email)
    except Exception as e:
        logger.error("password_reset_email_failed email=%s error=%s", normalized_email, str(e))
        # Don't fail the request if email fails - user can try again
    
    return ForgotPasswordResponse(
        message="If an account exists with this email, you will receive a password reset link shortly.",
        email=normalized_email
    )


@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest):
    """Reset password using token from email"""
    if mongo.db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")
    
    try:
        # Verify the reset token
        decoded = jwt.decode(
            payload.token,
            settings.secret_key,
            algorithms=["HS256"]
        )
        
        if decoded.get("type") != "password_reset":
            raise HTTPException(status_code=400, detail="Invalid token")
        
        user_id = ObjectId(decoded["sub"])
        email = decoded["email"]
        
    except JWTError as e:
        error_msg = str(e).lower()
        if "expired" in error_msg:
            raise HTTPException(status_code=400, detail="Reset link has expired. Please request a new one.")
        else:
            raise HTTPException(status_code=400, detail="Invalid or malformed reset token")
    
    # Find user
    user = await mongo.db.users.find_one({"_id": user_id})
    if not user or user.get("email", "").strip().lower() != email.strip().lower():
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update password
    new_password_hash = hash_password(payload.new_password)
    await mongo.db.users.update_one(
        {"_id": user_id},
        {
            "$set": {
                "password_hash": new_password_hash,
                "updated_at": datetime.now(timezone.utc)
            }
        }
    )
    
    # Clean up reset token from DB
    await mongo.db.password_resets.delete_many({"user_id": user_id})
    
    # Send confirmation email
    confirmation_subject = "Password Reset Successful - LMS Portal"
    confirmation_message = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Password Reset Successful</h2>
            <p>Hello {user.get('full_name', 'User')},</p>
            <p>Your password has been successfully reset. You can now log in with your new password.</p>
            <p style="margin: 30px 0;">
                <a href="{settings.frontend_url or 'http://localhost:5173'}/login" style="background-color: #ff8a33; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Go to Login
                </a>
            </p>
            <p>If you didn't make this change or suspect unauthorized access, please contact support immediately.</p>
            <hr style="margin-top: 40px; border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; color: #666;">LMS Support Team</p>
        </div>
    </body>
    </html>
    """
    
    try:
        await send_transactional_email(email, confirmation_subject, confirmation_message)
    except Exception as e:
        logger.error("password_reset_confirmation_email_failed email=%s error=%s", email, str(e))
    
    return {"message": "Password has been reset successfully. You can now log in with your new password."}
