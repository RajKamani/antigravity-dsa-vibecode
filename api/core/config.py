from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "O(1) Knot Backend"
    MONGODB_URI: str = "mongodb://localhost:27017" # default fallback
    DATABASE_NAME: str = "o1knot"
    SECRET_KEY: str = "supersecretkey_please_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    CORS_ORIGINS: str = "*"  # comma-separated for production, e.g. "https://myapp.vercel.app"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
