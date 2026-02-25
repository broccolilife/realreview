from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    secret_key: str = "change-me-to-a-random-secret"
    database_url: str = "sqlite:///./realreview.db"
    upload_dir: str = "./uploads"
    access_token_expire_minutes: int = 1440  # 24 hours
    algorithm: str = "HS256"
    subscription_price: float = 4.99

    class Config:
        env_file = ".env"

settings = Settings()
