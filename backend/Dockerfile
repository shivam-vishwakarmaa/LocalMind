FROM python:3.10-slim

WORKDIR /app

# Ensure FFmpeg is installed for yt-dlp/whisper audio dependencies
RUN apt-get update && apt-get install -y ffmpeg gcc curl && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
