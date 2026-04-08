import httpx

from app.core.config import settings


async def send_transactional_email(to_email: str, subject: str, message: str) -> bool:
    if not to_email:
        return False
    if not settings.sendgrid_api_key or not settings.sendgrid_from_email:
        return False

    # Detect if message is HTML
    is_html = "<html>" in message.lower() or "<body>" in message.lower()
    content_type = "text/html" if is_html else "text/plain"

    payload = {
        "personalizations": [{"to": [{"email": to_email}], "subject": subject}],
        "from": {"email": settings.sendgrid_from_email},
        "content": [{"type": content_type, "value": message}],
    }

    headers = {
        "Authorization": f"Bearer {settings.sendgrid_api_key}",
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post("https://api.sendgrid.com/v3/mail/send", headers=headers, json=payload)
        return response.status_code in (200, 202)
    except Exception:
        return False