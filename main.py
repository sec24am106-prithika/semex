from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import random

app = FastAPI(title="SEMEX AI Reasoning Engine", version="1.0.0")

class FarmerProfileSchema(BaseModel):
    soilPh: Optional[float] = None
    nitrogenLvl: Optional[str] = None
    potassiumLvl: Optional[str] = None
    irrigationType: Optional[str] = None
    droughtProne: Optional[bool] = False
    soilType: Optional[str] = None

@app.get("/")
def root():
    return {"status": "AI Engine Online", "version": "1.0.0"}

@app.post("/predict-crop")
def predict_crop(profile: FarmerProfileSchema):
    """
    Core AI Recommendation Logic built around a heuristic decision matrix.
    Given specific 68-question schema parameters, returns top suitable crops.
    """
    recommendations = []

    # Safe defaults
    ph = profile.soilPh if profile.soilPh else 6.5
    nitrogen = profile.nitrogenLvl.lower() if profile.nitrogenLvl else "medium"
    soil_type = profile.soilType.lower() if profile.soilType else "loamy"
    
    # ----------------------------------------------------
    # ALGORITHMIC DECISION MATRIX (Mock ML inference block)
    # ----------------------------------------------------
    
    # Scenario 1: Optimal Nitrogen & Neutral pH
    if 6.0 <= ph <= 7.5 and nitrogen == "high":
        recommendations.append({
            "crop": "Sugarcane",
            "confidence": 92.5,
            "reason": "High nitrogen and neutral pH strongly correlate with Sugarcane yield.",
            "risk": "Low"
        })
        recommendations.append({
            "crop": "Corn (Maize)",
            "confidence": 88.0,
            "reason": "Excellent soil vitality for heavy-feeding corn.",
            "risk": "Medium"
        })

    # Scenario 2: Acidic Soil + Drought Prone 
    elif ph < 6.0 and profile.droughtProne:
        recommendations.append({
            "crop": "Millet (Sorghum)",
            "confidence": 95.1,
            "reason": "Highly resilient to acidic/drought parameters.",
            "risk": "Low"
        })
        recommendations.append({
            "crop": "Groundnut",
            "confidence": 82.4,
            "reason": "Reasonable drought resistance suitable for acidic terrain.",
            "risk": "Medium"
        })

    # Scenario 3: Black Cotton Soil or High Potassium
    elif soil_type == "black cotton" or profile.potassiumLvl == "high":
        recommendations.append({
            "crop": "Cotton",
            "confidence": 91.0,
            "reason": "Black cotton soil properties unlock maximum cotton fiber yield.",
            "risk": "Low"
        })
        recommendations.append({
            "crop": "Soybean",
            "confidence": 84.5,
            "reason": "Good secondary candidate for potassium-rich black soils.",
            "risk": "Medium"
        })
        
    # Scenario 4: General Fallback for suboptimal conditions
    else:
        recommendations.append({
            "crop": "Wheat",
            "confidence": 75.0,
            "reason": "Standard robust crop for average conditions.",
            "risk": "Low"
        })
        recommendations.append({
            "crop": "Pulses (Lentils)",
            "confidence": 89.0,
            "reason": "Fixes nitrogen in the soil automatically, great for restorative farming.",
            "risk": "Low"
        })

    # Dynamic pricing estimate simulation
    for rec in recommendations:
        rec['estimated_profit_per_acre_inr'] = int(random.uniform(40000, 120000))

    return {
        "status": "success",
        "predictions": recommendations,
        "input_analysis": {
            "soil_ph_status": "Acidic" if ph < 6.0 else "Alkaline" if ph > 7.5 else "Optimal",
            "water_risk_flag": profile.droughtProne
        }
    }
