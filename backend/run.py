import uvicorn
import os
import sys

if __name__ == "__main__":
    # Ensure current directory is in python path
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    print("Starting NoteFlow AI Backend API Server on http://127.0.0.1:8000 ...")
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
