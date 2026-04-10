import chromadb
from chromadb.api.types import Documents, EmbeddingFunction, Embeddings
import httpx
import os

OLLAMA_EMBED_URL = "http://localhost:11434/api/embeddings"

class OllamaEmbeddingFunction(EmbeddingFunction):
    def __init__(self, model_name: str = "nomic-embed-text"):
        self.model_name = model_name

    def __call__(self, input: Documents) -> Embeddings:
        embeddings = []
        with httpx.Client() as client:
            for doc in input:
                try:
                    response = client.post(OLLAMA_EMBED_URL, json={
                        "model": self.model_name,
                        "prompt": doc
                    })
                    if response.status_code == 200:
                        embeddings.append(response.json().get("embedding", []))
                    else:
                        embeddings.append([])
                except Exception as e:
                    print(f"Error communicating with Ollama Embeddings API: {e}")
                    embeddings.append([])
        return embeddings

def get_chroma_client():
    db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "chroma_db")
    client = chromadb.PersistentClient(path=db_path)
    return client

def index_document(study_set_id: int, content: str):
    client = get_chroma_client()
    embed_fn = OllamaEmbeddingFunction()
    collection = client.get_or_create_collection(name=f"study_set_{study_set_id}", embedding_function=embed_fn)
    
    # Simple chunking logic
    chunk_size = 500
    overlap = 50
    chunks = []
    
    # naive overlap loop
    i = 0
    while i < len(content):
        chunks.append(content[i:i+chunk_size])
        i += chunk_size - overlap
    
    ids = [f"chunk_{idx}" for idx in range(len(chunks))]
    metadatas = [{"study_set_id": study_set_id}] * len(chunks)
    
    collection.add(documents=chunks, metadatas=metadatas, ids=ids)

def query_document(study_set_id: int, query: str, n_results: int = 3) -> list:
    client = get_chroma_client()
    embed_fn = OllamaEmbeddingFunction()
    try:
        collection = client.get_collection(name=f"study_set_{study_set_id}", embedding_function=embed_fn)
        results = collection.query(query_texts=[query], n_results=n_results)
        if results and results["documents"]:
            return results["documents"][0]
    except Exception as e:
        print(f"Error querying Chroma: {e}")
    return []
