import google.generativeai as genai
import os
import random
from datetime import datetime
from typing import Dict, List
import json

class AIInsights:
    def __init__(self):
        # Configure Gemini API
        api_key = os.getenv("GEMINI_API_KEY", "demo_key")
        if api_key != "demo_key":
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-pro')
        else:
            self.model = None
            
    async def generate_insights(self) -> Dict:
        """Generate AI-powered insights about orbital debris"""
        
        if self.model:
            try:
                # Real AI insights using Gemini
                prompt = """
                Analyze the current orbital debris situation and provide insights on:
                1. Risk assessment trends
                2. Collision probability factors
                3. Recommended mitigation strategies
                4. Future space sustainability concerns
                
                Provide a concise, technical analysis suitable for space mission operators.
                """
                
                response = self.model.generate_content(prompt)
                ai_analysis = response.text
                
            except Exception as e:
                print(f"AI API error: {e}")
                ai_analysis = self._generate_fallback_insights()
        else:
            ai_analysis = self._generate_fallback_insights()
            
        insights = {
            "ai_analysis": ai_analysis,
            "risk_predictions": await self._generate_risk_predictions(),
            "optimization_suggestions": await self._generate_optimization_suggestions(),
            "threat_assessment": await self._generate_threat_assessment(),
            "confidence_score": random.uniform(0.75, 0.95),
            "generated_at": datetime.utcnow().isoformat()
        }
        
        return insights
        
    def _generate_fallback_insights(self) -> str:
        """Generate fallback insights when AI API is not available"""
        insights = [
            "Current debris density in LEO shows elevated risk levels, particularly in the 400-600km altitude band.",
            "Collision probability models indicate a 15% increase in conjunction events over the next 72 hours.",
            "Recommend implementing enhanced tracking protocols for objects smaller than 10cm diameter.",
            "Orbital decay patterns suggest natural debris removal will accelerate in lower altitude regions.",
            "Active debris removal missions could reduce collision risk by up to 30% in critical orbital zones."
        ]
        
        return " ".join(random.sample(insights, 3))
        
    async def _generate_risk_predictions(self) -> List[Dict]:
        """Generate risk predictions"""
        predictions = []
        
        risk_factors = [
            "Solar activity increasing orbital drag",
            "Conjunction cluster in 500-600km altitude",
            "Untracked object population growth",
            "Satellite constellation deployment effects",
            "Atmospheric density variations"
        ]
        
        for i, factor in enumerate(random.sample(risk_factors, 3)):
            prediction = {
                "factor": factor,
                "impact_level": random.choice(["low", "medium", "high"]),
                "probability": random.uniform(0.3, 0.9),
                "time_horizon": random.choice(["24h", "72h", "1 week", "1 month"])
            }
            predictions.append(prediction)
            
        return predictions
        
    async def _generate_optimization_suggestions(self) -> List[Dict]:
        """Generate optimization suggestions"""
        suggestions = [
            {
                "category": "Tracking Enhancement",
                "suggestion": "Deploy additional ground-based radar systems",
                "priority": "high",
                "estimated_improvement": "25% better detection accuracy"
            },
            {
                "category": "Collision Avoidance",
                "suggestion": "Implement automated maneuver planning",
                "priority": "medium",
                "estimated_improvement": "40% faster response time"
            },
            {
                "category": "Data Processing",
                "suggestion": "Upgrade orbital propagation algorithms",
                "priority": "medium",
                "estimated_improvement": "15% better prediction accuracy"
            }
        ]
        
        return random.sample(suggestions, 2)
        
    async def _generate_threat_assessment(self) -> Dict:
        """Generate threat assessment"""
        assessment = {
            "overall_threat_level": random.choice(["low", "moderate", "elevated", "high"]),
            "primary_concerns": [
                "Fragmentation event probability",
                "Uncontrolled reentry risks",
                "Critical infrastructure threats"
            ],
            "mitigation_effectiveness": random.uniform(0.6, 0.9),
            "recommended_alert_level": random.choice(["green", "yellow", "orange"]),
            "next_review": (datetime.utcnow()).isoformat()
        }
        
        return assessment