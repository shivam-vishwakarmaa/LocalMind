import fitz  # PyMuPDF
from faster_whisper import WhisperModel
import yt_dlp
import os
import tempfile

def extract_text_from_pdf(file_path: str) -> str:
    text = ""
    with fitz.open(file_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

def extract_text_from_audio(file_path: str) -> str:
    # Initialize faster-whisper. We use base.en for optimal offline performance.
    model = WhisperModel("base.en", device="cpu", compute_type="int8")
    segments, _ = model.transcribe(file_path, beam_size=5)
    
    text = " ".join([segment.text for segment in segments])
    return text.strip()

def extract_text_from_youtube(url: str) -> str:
    temp_dir = tempfile.gettempdir()
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': os.path.join(temp_dir, '%(id)s.%(ext)s'),
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'quiet': True,
        'no_warnings': True
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(url, download=True)
        video_id = info_dict.get("id", "temp_audio")
        audio_path = os.path.join(temp_dir, f"{video_id}.mp3")
        
    text = extract_text_from_audio(audio_path)
    
    try:
        os.remove(audio_path)
    except:
        pass
        
    return text
