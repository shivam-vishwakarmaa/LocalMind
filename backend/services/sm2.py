from datetime import datetime, timedelta

def calculate_sm2(grade: int, ease_factor: float, interval: int, repetitions: int):
    """
    SuperMemo-2 Algorithm Implementation
    grade: 0-5
        0: Complete blackout
        1: Incorrect, but remembered right after
        2: Incorrect, but seemed familiar
        3: Correct, but required significant difficulty
        4: Correct, after a hesitation
        5: Perfect response
    """
    if grade >= 3:
        if repetitions == 0:
            interval = 1
        elif repetitions == 1:
            interval = 6
        else:
            interval = int(round(interval * ease_factor))
        
        repetitions += 1
    else:
        repetitions = 0
        interval = 1
        
    ease_factor = ease_factor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
    
    if ease_factor < 1.3:
        ease_factor = 1.3
        
    next_review_date = datetime.utcnow() + timedelta(days=interval)
    
    return ease_factor, interval, repetitions, next_review_date
