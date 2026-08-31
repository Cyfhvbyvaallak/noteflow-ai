import os
import logging
from PyPDF2 import PdfReader

logger = logging.getLogger(__name__)

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extracts structured plain text from an uploaded PDF slide deck or document.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"PDF file not found at {file_path}")

    extracted_pages = []
    try:
        reader = PdfReader(file_path)
        for i, page in enumerate(reader.pages):
            page_text = page.extract_text()
            if page_text and page_text.strip():
                extracted_pages.append(f"--- [Slide / Page {i + 1}] ---\n{page_text.strip()}\n")
        
        full_text = "\n".join(extracted_pages)
        if not full_text.strip():
            return "No extractable text found in PDF. The document may be scanned or image-based."
        return full_text
    except Exception as e:
        logger.error(f"Error parsing PDF file {file_path}: {e}")
        return f"PDF Lecture Notes Content:\nCould not parse internal PDF stream completely ({str(e)}). Generating structured study companion from document meta."
