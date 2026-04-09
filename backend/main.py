from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import shutil
import tempfile
import json
import os

from . import models, database
from .services.extractors import extract_text_from_pdf, extract_text_from_youtube, extract_text_from_audio
from .services.ollama_bridge import generate_7_way
from .services.tts import generate_tts_wav

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="LocalMind API (Cramberry Clone)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Since it's a local app, allowing all origins is fine for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to LocalMind API."}

@app.get("/folders")
def get_folders(db: Session = Depends(database.get_db)):
    folders = db.query(models.Folder).all()
    return folders

@app.post("/upload")
async def upload_file(
    file: UploadFile = File(None), 
    youtube_url: str = Form(None),
    pasted_text: str = Form(None),
    db: Session = Depends(database.get_db)
):
    text_content = ""
    title = "Untitled Study Set"
    
    if pasted_text:
        text_content = pasted_text
        title = "Pasted Notes"
    elif youtube_url:
        text_content = extract_text_from_youtube(youtube_url)
        title = "YouTube Video"
    elif file and file.filename:
        title = file.filename
        ext = file.filename.split('.')[-1].lower()
        
        # Save temp 
        temp_file = tempfile.NamedTemporaryFile(delete=False)
        shutil.copyfileobj(file.file, temp_file)
        temp_file.close()

        if ext == 'pdf':
            text_content = extract_text_from_pdf(temp_file.name)
        elif ext in ['mp3', 'wav', 'm4a', 'mp4']:
            text_content = extract_text_from_audio(temp_file.name)
        else:
            # Assume plain text for anything else
            with open(temp_file.name, 'r', encoding='utf-8') as f:
                text_content = f.read()
        
        os.remove(temp_file.name)
        
    if not text_content:
        raise HTTPException(status_code=400, detail="No content extracted")
        
    new_set = models.StudySet(title=title, original_content=text_content)
    db.add(new_set)
    db.commit()
    db.refresh(new_set)
    return {"id": new_set.id, "title": new_set.title}

@app.post("/generate/{study_set_id}")
async def generate_study_material(study_set_id: int, db: Session = Depends(database.get_db)):
    study_set = db.query(models.StudySet).filter(models.StudySet.id == study_set_id).first()
    if not study_set:
        raise HTTPException(status_code=404, detail="Study set not found")
        
    setting = db.query(models.Setting).filter(models.Setting.key == "ollama_model").first()
    model = setting.value if setting else "llama3.1"
    
    results = await generate_7_way(model, study_set.original_content)
    
    # Save the JSON back to db
    study_set.generated_json = json.dumps(results)
    db.commit()
    
    # TTS Podcast Synthesis
    if "podcast" in results and isinstance(results["podcast"], str):
        podcast_path = f"./podcast_{study_set.id}.wav"
        generate_tts_wav(results["podcast"], podcast_path)
        
    return {"status": "success", "study_set_id": study_set_id}

@app.get("/settings")
def get_settings(db: Session = Depends(database.get_db)):
    setting = db.query(models.Setting).filter(models.Setting.key == "ollama_model").first()
    return {"ollama_model": setting.value if setting else "llama3.1"}

@app.post("/settings")
def update_settings(ollama_model: str = Form(...), db: Session = Depends(database.get_db)):
    setting = db.query(models.Setting).filter(models.Setting.key == "ollama_model").first()
    if not setting:
        setting = models.Setting(key="ollama_model", value=ollama_model)
        db.add(setting)
    else:
        setting.value = ollama_model
    db.commit()
    return {"status": "success", "ollama_model": ollama_model}
