from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from . import models, database
from sqlalchemy.orm import Session

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
