import os

def delete_file(path: str) -> bool:
    """Permanently delete a file. Used after OCR verification."""
    try:
        if os.path.exists(path):
            os.remove(path)
            return True
    except Exception:
        pass
    return False
