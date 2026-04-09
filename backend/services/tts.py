import pyttsx3

def generate_tts_wav(text: str, output_path: str):
    """
    Synthesize offline audio using pyttsx3 and dump to .wav file.
    """
    try:
        engine = pyttsx3.init()
        engine.save_to_file(text, output_path)
        engine.runAndWait()
        return output_path
    except Exception as e:
        print(f"TTS Synthesis Failed: {str(e)}")
        return None
