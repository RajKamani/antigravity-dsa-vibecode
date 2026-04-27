from fastapi import APIRouter, Depends
from beanie import PydanticObjectId
from typing import Dict, Any
import random

from api.models.user import User
from api.models.problem import Problem
from api.core.dependencies import get_current_user

router = APIRouter(prefix="/stats", tags=["stats"])

@router.get("/benchmark")
async def get_benchmark_stats(current_user: User = Depends(get_current_user)):
    """
    Get benchmarking stats comparing the current user to global averages.
    In a real app, this would query all users. For now, we calculate 
    real user stats and mock global averages.
    """
    # 1. User stats
    user_problems = await Problem.find(Problem.user_id == current_user.id).to_list()
    user_solved_count = len(user_problems)
    
    # Simple success rate calculation
    total_submits = 0
    solved_submits = 0
    for p in user_problems:
        for s in p.submits:
            total_submits += 1
            if s.outcome == "solved":
                solved_submits += 1
    
    user_success_rate = (solved_submits / total_submits * 100) if total_submits > 0 else 0
    
    # 2. Mock Global Averages (Stable but slightly randomized)
    # Using user's ID as seed to keep it stable for the user session
    random.seed(str(current_user.id))
    
    global_avg_solved = 42 + random.randint(-5, 10)
    global_avg_success = 68 + random.randint(-2, 5)
    global_avg_consistency = 4 + random.randint(-1, 3) # days per week
    
    # Percentiles (Logic: if user solved > global_avg, they are in top 30%, etc.)
    solved_percentile = 50
    if user_solved_count > global_avg_solved:
        solved_percentile = 70 + min(25, (user_solved_count - global_avg_solved))
    elif user_solved_count < global_avg_solved:
        solved_percentile = 30 + max(-25, (user_solved_count - global_avg_solved))
        
    return {
        "user": {
            "solved_count": user_solved_count,
            "success_rate": round(user_success_rate, 1),
            "percentile": round(solved_percentile, 0)
        },
        "global": {
            "avg_solved": global_avg_solved,
            "avg_success_rate": global_avg_success,
            "avg_consistency": global_avg_consistency
        },
        "percentiles": [
            {"label": "Solved Count", "value": round(solved_percentile, 0)},
            {"label": "Accuracy", "value": round(min(99, user_success_rate * 1.1), 0)},
            {"label": "Consistency", "value": 65} # Placeholder
        ]
    }
