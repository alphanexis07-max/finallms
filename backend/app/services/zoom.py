import base64
from datetime import datetime, timezone

import httpx
from fastapi import HTTPException

from app.core.config import settings


def _basic_auth_header(client_id: str, client_secret: str) -> str:
    raw = f"{client_id}:{client_secret}".encode("utf-8")
    return base64.b64encode(raw).decode("utf-8")


async def _get_zoom_access_token() -> str:
    if not settings.account_id or not settings.client_id or not settings.client_secret:
        missing = []
        if not settings.account_id: missing.append("account_id")
        if not settings.client_id: missing.append("client_id")
        if not settings.client_secret: missing.append("client_secret")
        
        detail = f"Zoom credentials are not configured. Missing: {', '.join(missing)}"
        print(f"DEBUG: {detail}") # Server-side log
        raise HTTPException(status_code=500, detail=detail)

    auth = _basic_auth_header(settings.client_id, settings.client_secret)
    token_url = (
        "https://zoom.us/oauth/token"
        f"?grant_type=account_credentials&account_id={settings.account_id}"
    )

    async with httpx.AsyncClient(timeout=20) as client:
        try:
            resp = await client.post(token_url, headers={"Authorization": f"Basic {auth}"})
        except httpx.RequestError as exc:
            raise HTTPException(status_code=502, detail=f"Zoom token request failed: {exc}") from exc
        if resp.status_code >= 400:
            detail = f"Unable to fetch Zoom access token (status {resp.status_code}): {resp.text}"
            raise HTTPException(status_code=502, detail=detail)
        data = resp.json()
        token = data.get("access_token")
        if not token:
            raise HTTPException(status_code=502, detail="Zoom access token missing in response")
        return token


async def create_zoom_meeting(title: str, start_at: datetime, duration_minutes: int, timezone_name: str = "UTC") -> dict:
    token = await _get_zoom_access_token()
    start_utc = start_at.astimezone(timezone.utc)
    payload = {
        "topic": title,
        "type": 2,
        "start_time": start_utc.isoformat().replace("+00:00", "Z"),
        "duration": duration_minutes,
        "timezone": timezone_name,
        "settings": {
            "join_before_host": True,
            "waiting_room": False,
            "participant_video": True,
            "host_video": True,
        },
    }

    async with httpx.AsyncClient(timeout=20) as client:
        try:
            resp = await client.post(
                "https://api.zoom.us/v2/users/me/meetings",
                headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
                json=payload,
            )
        except httpx.RequestError as exc:
            raise HTTPException(status_code=502, detail=f"Zoom meeting request failed: {exc}") from exc
        if resp.status_code >= 400:
            detail = f"Unable to create Zoom meeting (status {resp.status_code}): {resp.text}"
            raise HTTPException(status_code=502, detail=detail)
        data = resp.json()

    return {
        "meeting_id": str(data.get("id", "")),
        "join_url": data.get("join_url", ""),
        "start_url": data.get("start_url", ""),
        "password": data.get("password", ""),
        "provider": "zoom",
    }
