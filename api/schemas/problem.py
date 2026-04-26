from pydantic import BaseModel
from typing import List, Optional, Literal
from datetime import datetime

class SubmissionSchema(BaseModel):
    date: Optional[datetime] = None
    interval: int
    timeTaken: Optional[int] = None
    outcome: Literal["solved", "struggled", "failed"]

class ProblemCreate(BaseModel):
    title: str
    platform: str
    difficulty: Literal["easy", "medium", "hard"]
    topics: Optional[List[str]] = []
    pattern: Optional[str] = ""
    url: Optional[str] = ""
    youtubeLinks: Optional[List[str]] = []
    solutionSummary: Optional[str] = ""
    notes: Optional[str] = ""
    timeTaken: Optional[int] = None
    category: Optional[Literal["dsa", "system-design", "behavioural", "other"]] = "dsa"

class ProblemUpdate(BaseModel):
    title: Optional[str] = None
    platform: Optional[str] = None
    difficulty: Optional[Literal["easy", "medium", "hard"]] = None
    topics: Optional[List[str]] = None
    pattern: Optional[str] = None
    url: Optional[str] = None
    youtubeLinks: Optional[List[str]] = None
    solutionSummary: Optional[str] = None
    notes: Optional[str] = None
    timeTaken: Optional[int] = None
    status: Optional[Literal["learning", "practicing", "mastered"]] = None
    confidence: Optional[Literal["low", "medium", "high"]] = None
    nextReview: Optional[datetime] = None
    category: Optional[Literal["dsa", "system-design", "behavioural", "other"]] = None

class AddSubmission(BaseModel):
    timeTaken: Optional[int] = None
    outcome: Literal["solved", "struggled", "failed"]
    confidence: Literal["low", "medium", "high"]

class ProblemResponse(BaseModel):
    id: str
    user_id: str
    title: str
    platform: str
    difficulty: str
    topics: List[str]
    pattern: str
    url: str
    youtubeLinks: List[str]
    solutionSummary: str
    notes: str
    timeTaken: Optional[int]
    status: str
    confidence: str
    submits: List[SubmissionSchema]
    nextReview: Optional[datetime]
    category: str
    created_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True
