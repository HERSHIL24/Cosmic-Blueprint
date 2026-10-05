from fastapi import APIRouter, HTTPException
from models.schemas import NumerologyRequest, NumerologyResponse, KundliRequest, KundliResponse
from services.numerology import calculate_mulank, calculate_bhagyank, calculate_namank
from services.astrology import generate_mock_kundli

router = APIRouter()

@router.post("/numerology/calculate", response_model=NumerologyResponse)
def calculate_numerology(request: NumerologyRequest):
    try:
        mulank, mulank_steps = calculate_mulank(request.dob)
        bhagyank, bhagyank_steps = calculate_bhagyank(request.dob, request.preserve_master_numbers)
        namank, namank_steps = calculate_namank(request.name, request.preserve_master_numbers)
        
        return NumerologyResponse(
            mulank=mulank,
            bhagyank=bhagyank,
            namank=namank,
            mulank_steps=mulank_steps,
            bhagyank_steps=bhagyank_steps,
            namank_steps=namank_steps
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/astrology/kundli", response_model=KundliResponse)
def generate_kundli(request: KundliRequest):
    try:
        # Using mock Kundli generator since pyswisseph is unavailable
        kundli = generate_mock_kundli(request.dob, request.time, request.lat, request.lon)
        return kundli
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
