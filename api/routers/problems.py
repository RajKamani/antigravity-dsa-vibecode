from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime, timedelta, timezone
from beanie import PydanticObjectId
from api.core.dependencies import get_current_user
from api.models.user import User
from api.models.problem import Problem, Submission
from api.schemas.problem import ProblemCreate, ProblemUpdate, ProblemResponse, AddSubmission

router = APIRouter(prefix="/problems", tags=["problems"])

def calculate_next_interval(current_interval: int, outcome: str) -> int:
    if outcome in ["struggled", "failed"]:
        return 7
    if current_interval == 0:
        return 7
    if current_interval == 7:
        return 14
    if current_interval == 14:
        return 30
    if current_interval == 30:
        return 60
    return 90

@router.get("", response_model=List[ProblemResponse])
async def get_problems(current_user: User = Depends(get_current_user)):
    problems = await Problem.find({"user_id": current_user.id}).to_list()
    # Convert PydanticObjectId to string for response
    for p in problems:
        p.id = str(p.id)
        p.user_id = str(p.user_id)
    return problems

@router.post("", response_model=ProblemResponse)
async def create_problem(problem_in: ProblemCreate, current_user: User = Depends(get_current_user)):
    # Initial setup for new problem
    initial_interval = 7
    initial_submission = Submission(
        interval=initial_interval,
        outcome="solved",
        timeTaken=problem_in.timeTaken
    )
    
    problem = Problem(
        user_id=current_user.id,
        **problem_in.model_dump(),
        submits=[initial_submission],
        nextReview=datetime.now(timezone.utc) + timedelta(days=initial_interval),
        status="learning",
        confidence="medium"
    )
    await problem.insert()
    problem.id = str(problem.id)
    problem.user_id = str(problem.user_id)
    return problem

@router.put("/{problem_id}", response_model=ProblemResponse)
async def update_problem(problem_id: str, problem_in: ProblemUpdate, current_user: User = Depends(get_current_user)):
    problem = await Problem.find_one({"_id": PydanticObjectId(problem_id), "user_id": current_user.id})
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    update_data = problem_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(problem, key, value)
        
    await problem.save()
    problem.id = str(problem.id)
    problem.user_id = str(problem.user_id)
    return problem

@router.delete("/{problem_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_problem(problem_id: str, current_user: User = Depends(get_current_user)):
    problem = await Problem.find_one({"_id": PydanticObjectId(problem_id), "user_id": current_user.id})
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    await problem.delete()

@router.post("/{problem_id}/submissions", response_model=ProblemResponse)
async def add_submission(problem_id: str, sub_in: AddSubmission, current_user: User = Depends(get_current_user)):
    problem = await Problem.find_one({"_id": PydanticObjectId(problem_id), "user_id": current_user.id})
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    current_interval = problem.submits[-1].interval if problem.submits else 0
    next_interval = calculate_next_interval(current_interval, sub_in.outcome)
    
    new_sub = Submission(
        interval=next_interval,
        timeTaken=sub_in.timeTaken,
        outcome=sub_in.outcome
    )
    
    problem.submits.append(new_sub)
    problem.confidence = sub_in.confidence
    problem.nextReview = datetime.now(timezone.utc) + timedelta(days=next_interval)
    
    # Update status based on interval
    if next_interval == 7:
        problem.status = "learning"
    elif next_interval >= 90:
        problem.status = "mastered"
    else:
        problem.status = "practicing"
        
    await problem.save()
    problem.id = str(problem.id)
    problem.user_id = str(problem.user_id)
    return problem
