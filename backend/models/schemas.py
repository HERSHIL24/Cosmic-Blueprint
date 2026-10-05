from pydantic import BaseModel, Field
from typing import Optional, List, Dict

class NumerologyRequest(BaseModel):
    name: str = Field(..., description="Full birth name")
    dob: str = Field(..., description="Date of birth in DD-MM-YYYY format")
    preserve_master_numbers: bool = Field(True, description="Whether to preserve master numbers 11, 22, 33")

class NumerologyResponse(BaseModel):
    mulank: int
    bhagyank: int
    namank: int
    mulank_steps: List[str]
    bhagyank_steps: List[str]
    namank_steps: List[str]

class KundliRequest(BaseModel):
    dob: str = Field(..., description="Date of birth in DD-MM-YYYY format")
    time: str = Field(..., description="Exact time of birth in HH:MM format")
    lat: float = Field(..., description="Latitude")
    lon: float = Field(..., description="Longitude")

class PlanetPosition(BaseModel):
    name: str
    degree: float
    rashi: str
    house: int
    retrograde: bool
    nakshatra: str
    pada: int

class KundliResponse(BaseModel):
    ascendant: float
    lagna_rashi: str
    houses: List[float]
    planets: List[PlanetPosition]
