from pydantic import BaseModel, Field
from beanie import Document, PydanticObjectId
from typing import List, Optional, Literal
from datetime import datetime, timezone

class Submission(BaseModel):
    date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    interval: int
    timeTaken: Optional[int] = None
    outcome: Literal["solved", "struggled", "failed"]

class Problem(Document):
    user_id: PydanticObjectId
    title: str
    platform: str
    difficulty: Literal["easy", "medium", "hard"]
    topics: List[str] = []
    pattern: Optional[str] = ""
    url: Optional[str] = ""
    youtubeLinks: List[str] = []
    solutionSummary: Optional[str] = ""
    notes: Optional[str] = ""
    timeTaken: Optional[int] = None
    status: Literal["learning", "practicing", "mastered"] = "learning"
    confidence: Literal["low", "medium", "high"] = "low"
    submits: List[Submission] = []
    nextReview: Optional[datetime] = None
    category: Literal["dsa", "system-design", "behavioural", "other"] = "dsa"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "problems"
