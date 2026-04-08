from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "LMS API"
    env: str = "dev"
    api_prefix: str = "/api/v1"

    mongo_uri: str = "mongodb://localhost:27017"
    mongo_db: str = "lms"

    jwt_secret: str = "change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

    razorpay_key_id: str = ""
    razorpay_key_secret: str = ""
    razorpay_webhook_secret: str = ""
    account_id: str = ""
    client_id: str = ""
    client_secret: str = ""

    cors_origins: str = "http://localhost:5173"
    platform_commission_percent: float = 20.0
    sendgrid_api_key: str = ""
    sendgrid_from_email: str = ""
    frontend_url: str = "http://localhost:5173"

    @property
    def secret_key(self) -> str:
        """Alias for jwt_secret for compatibility"""
        return self.jwt_secret



settings = Settings()
