"""
TrustForge AI Microservice Gateway (FastAPI)
Smart India Hackathon 2026 - Problem Statement ID: SIH26188
Ministry of Home Affairs / SSB Police-II Division
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from services.ocr_engine import extract_ocr_data
from services.face_verifier import verify_face
from services.tampering_detector import detect_tampering

app = FastAPI(
    title="TrustForge AI Identity & Document Screening Microservice",
    description="FastAPI service for OCR, Face Verification, and Forensic Tampering Analysis (SIH26188)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VerificationRequest(BaseModel):
    documentType: Optional[str] = "Passport"
    scenarioType: Optional[str] = "GENUINE"
    fileName: Optional[str] = "document.jpg"
    subjectId: Optional[str] = None

@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "service": "TrustForge AI Microservice",
        "version": "1.0.0-SIH26188",
        "mode": "DEMO_INFERENCE_ENGINE"
    }

@app.post("/api/ocr")
def ocr_endpoint(req: VerificationRequest):
    return extract_ocr_data(req.documentType, req.scenarioType)

@app.post("/api/face-verification")
def face_endpoint(req: VerificationRequest):
    return verify_face(req.scenarioType)

@app.post("/api/tampering-analysis")
def tampering_endpoint(req: VerificationRequest):
    return detect_tampering(req.scenarioType)

@app.post("/api/verify-pipeline")
def verify_pipeline_endpoint(req: VerificationRequest):
    ocr = extract_ocr_data(req.documentType, req.scenarioType)
    face = verify_face(req.scenarioType)
    tampering = detect_tampering(req.scenarioType)
    
    hash_matched = req.scenarioType != "TAMPERED"
    integrity = {
        "hashMatched": hash_matched,
        "status": "MATCH" if hash_matched else "MISMATCH",
        "message": "Cryptographic hash verified." if hash_matched else "Hash mismatch against issuance baseline."
    }

    return {
        "ocr": ocr,
        "face": face,
        "tampering": tampering,
        "integrity": integrity
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
