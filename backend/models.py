from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import datetime
from database import Base

class Folder(Base):
    __tablename__ = "folders"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    study_sets = relationship("StudySet", back_populates="folder")

class StudySet(Base):
    __tablename__ = "study_sets"

    id = Column(Integer, primary_key=True, index=True)
    folder_id = Column(Integer, ForeignKey("folders.id"), nullable=True)
    title = Column(String, index=True)
    original_content = Column(Text, nullable=True)
    generated_json = Column(Text, nullable=True) # Storing JSON as TEXT in SQLite
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    folder = relationship("Folder", back_populates="study_sets")

class Setting(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True)
    value = Column(String)

class FlashcardProgress(Base):
    __tablename__ = "flashcard_progress"

    id = Column(Integer, primary_key=True, index=True)
    study_set_id = Column(Integer, ForeignKey("study_sets.id"), index=True)
    card_index = Column(Integer)
    status = Column(String)  # 'easy', 'hard', etc.
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
