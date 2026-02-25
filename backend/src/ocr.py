import re
from typing import Optional, Tuple

def extract_address_from_text(text: str) -> Optional[dict]:
    """Extract address components from OCR text."""
    lines = text.split("\n")
    address_pattern = re.compile(
        r'(\d{1,5}\s+[\w\s.]+(?:St|Street|Ave|Avenue|Blvd|Boulevard|Dr|Drive|Ln|Lane|Rd|Road|Way|Ct|Court|Pl|Place|Cir|Circle)\.?)',
        re.IGNORECASE
    )
    city_state_zip = re.compile(
        r'([A-Za-z\s]+),?\s*([A-Z]{2})\s*(\d{5}(?:-\d{4})?)',
        re.IGNORECASE
    )
    
    address = None
    city = state = zip_code = None
    
    for line in lines:
        if not address:
            m = address_pattern.search(line)
            if m:
                address = m.group(1).strip()
        m2 = city_state_zip.search(line)
        if m2:
            city = m2.group(1).strip()
            state = m2.group(2).upper()
            zip_code = m2.group(3)
    
    if address and city and state and zip_code:
        return {"address": address, "city": city, "state": state, "zip": zip_code}
    return None

def extract_dates_from_text(text: str) -> Tuple[Optional[str], Optional[str]]:
    """Extract move-in/move-out dates from OCR text."""
    date_pattern = re.compile(r'(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})')
    dates = date_pattern.findall(text)
    move_in = dates[0] if len(dates) >= 1 else None
    move_out = dates[1] if len(dates) >= 2 else None
    return move_in, move_out

def process_document(file_path: str) -> Optional[dict]:
    """Run OCR on a document and extract address info."""
    try:
        import pytesseract
        from PIL import Image
        
        if file_path.lower().endswith(".pdf"):
            from pdf2image import convert_from_path
            images = convert_from_path(file_path, first_page=1, last_page=1)
            text = pytesseract.image_to_string(images[0]) if images else ""
        else:
            text = pytesseract.image_to_string(Image.open(file_path))
        
        address_info = extract_address_from_text(text)
        if not address_info:
            return None
        
        move_in, move_out = extract_dates_from_text(text)
        address_info["move_in_date"] = move_in
        address_info["move_out_date"] = move_out
        return address_info
    except Exception:
        return None
