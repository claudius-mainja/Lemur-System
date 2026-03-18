from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "LemurSystem API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Database
    DATABASE_TYPE: str = "postgres"
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://erpuser:erppassword@localhost:5432/erp"
    )
    DATABASE_HOST: str = os.getenv("DATABASE_HOST", "localhost")
    DATABASE_PORT: int = int(os.getenv("DATABASE_PORT", "5432"))
    DATABASE_USERNAME: str = os.getenv("DATABASE_USERNAME", "erpuser")
    DATABASE_PASSWORD: str = os.getenv("DATABASE_PASSWORD", "erppassword")
    DATABASE_DATABASE: str = os.getenv("DATABASE_DATABASE", "erp")

    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")

    # JWT
    JWT_SECRET: str = os.getenv("JWT_SECRET", "lemursystem-super-secret-jwt-key-2024")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRES_IN: int = 900  # 15 minutes
    JWT_REFRESH_EXPIRES_IN: int = 604800  # 7 days

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "lemursystem-secret-key-2024")

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
