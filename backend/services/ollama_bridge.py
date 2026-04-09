import httpx
import json
import logging
from pydantic import BaseModel
from typing import List

logger = logging.getLogger(__name__)

OLLAMA_ENDPOINT = "http://localhost:11434/api/chat"

class Flashcard(BaseModel):
    front: str
    back: str

class FlashcardsOutput(BaseModel):
    flashcards: List[Flashcard]

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    answer: str

class QuizzesOutput(BaseModel):
    quizzes: List[QuizQuestion]

class KeyTerm(BaseModel):
    term: str
    definition: str

class KeyTermsOutput(BaseModel):
    key_terms: List[KeyTerm]


async def _generate(model: str, system_prompt: str, content: str, use_json: bool = False):
    async with httpx.AsyncClient(timeout=300.0) as client:
        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Here is the study material:\n\n{content}"}
            ],
            "stream": False
        }
        if use_json:
            payload["format"] = "json"
            
        try:
            response = await client.post(OLLAMA_ENDPOINT, json=payload)
            response.raise_for_status()
            
            result = response.json().get("message", {}).get("content", "")
            
            if use_json:
                cleaned = result.replace("```json", "").replace("```", "").strip()
                try:
                    return json.loads(cleaned)
                except json.JSONDecodeError:
                    return {}
            return result
        except Exception as e:
            logger.error(f"Ollama generation failed: {e}")
            return {} if use_json else f"Generation failed: {str(e)}"

async def generate_7_way(model: str, content: str) -> dict:
    prompts = {
        "notes": ("You are an expert tutor. Summarize this content into detailed structured notes.", False),
        "flashcards": ("You are a study assistant. Extract flashcards. Respond strictly in JSON format matching { \"flashcards\": [ {\"front\": \"text\", \"back\": \"text\"} ] }.", True),
        "quiz": ("You are a teacher. Create a multiple choice quiz. Respond strictly in JSON format matching { \"quizzes\": [ {\"question\": \"text\", \"options\": [\"opt1\", \"opt2\"], \"answer\": \"text\"} ] }", True),
        "short_answer": ("Create 5 short answer questions with their full comprehensive answers.", False),
        "practice_test": ("Create a comprehensive practice test mixing essay questions, true/false.", False),
        "key_terms": ("Extract key terms and definitions. Respond strictly in JSON format matching { \"key_terms\": [ {\"term\": \"text\", \"definition\": \"text\"} ] }", True),
        "podcast": ("Write a lively 2-person podcast script summarizing this material. Use 'Host:' and 'Co-host:' prefixes.", False)
    }

    results = {}
    for key, (sys_prompt, use_json) in prompts.items():
        results[key] = await _generate(model, sys_prompt, content, use_json)
        
    return results
