from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta, timezone

from api.core.dependencies import get_current_user
from api.models.user import User
from api.models.problem import Problem, Submission
from api.routers.problems import calculate_next_interval

router = APIRouter(prefix="/extension", tags=["extension"])

class ExtensionPayload(BaseModel):
    title: str
    platform: str
    difficulty: str
    topics: List[str]
    url: str
    code: str
    pattern: str

@router.post("/sync")
async def sync_from_extension(payload: ExtensionPayload, current_user: User = Depends(get_current_user)):
    # Check if problem already exists by URL
    existing_problem = await Problem.find_one({"user_id": current_user.id, "url": payload.url})
    
    if existing_problem:
        current_interval = existing_problem.submits[-1].interval if existing_problem.submits else 0
        next_interval = calculate_next_interval(current_interval, "solved")
        
        new_sub = Submission(
            interval=next_interval,
            outcome="solved"
        )
        existing_problem.submits.append(new_sub)
        existing_problem.nextReview = datetime.now(timezone.utc) + timedelta(days=next_interval)
        
        # Prepend new code
        if existing_problem.solutionSummary:
            existing_problem.solutionSummary = f"Latest Submission:\n```\n{payload.code}\n```\n\n" + existing_problem.solutionSummary
        else:
            existing_problem.solutionSummary = f"```\n{payload.code}\n```"
            
        await existing_problem.save()
        return {"status": "updated", "problem_id": str(existing_problem.id)}
    
    else:
        # Create new problem
        initial_interval = 7
        initial_submission = Submission(
            interval=initial_interval,
            outcome="solved"
        )
        
        new_problem = Problem(
            user_id=current_user.id,
            title=payload.title or "Unknown Problem",
            platform=payload.platform,
            difficulty=payload.difficulty,
            topics=payload.topics,
            url=payload.url,
            pattern=payload.pattern,
            solutionSummary=f"```\n{payload.code}\n```",
            submits=[initial_submission],
            nextReview=datetime.now(timezone.utc) + timedelta(days=initial_interval),
            status="learning",
            confidence="medium"
        )
        await new_problem.insert()
        return {"status": "created", "problem_id": str(new_problem.id)}
