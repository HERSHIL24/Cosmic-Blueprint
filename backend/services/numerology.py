# Numerology calculation engine

CHALDEAN_TABLE = {
    'A': 1, 'I': 1, 'J': 1, 'Q': 1, 'Y': 1,
    'B': 2, 'K': 2, 'R': 2,
    'C': 3, 'G': 3, 'L': 3, 'S': 3,
    'D': 4, 'M': 4, 'T': 4,
    'E': 5, 'H': 5, 'N': 5, 'X': 5,
    'U': 6, 'V': 6, 'W': 6,
    'O': 7, 'Z': 7,
    'F': 8, 'P': 8
}

def reduce_number(num: int, preserve_master: bool = True) -> int:
    if preserve_master and num in [11, 22, 33]:
        return num
    
    while num > 9:
        if preserve_master and num in [11, 22, 33]:
            return num
        num = sum(int(digit) for digit in str(num))
    return num

def calculate_mulank(dob: str) -> tuple[int, list[str]]:
    # DOB format: DD-MM-YYYY
    day_str = dob.split('-')[0]
    day = int(day_str)
    
    steps = [f"Day of birth: {day}"]
    
    if day > 9:
        digits = [int(d) for d in str(day)]
        sum_digits = sum(digits)
        steps.append(f"{' + '.join(str(d) for d in digits)} = {sum_digits}")
        
        # Mulank is always reduced to 1-9 (or 11/22/33 if master numbers allowed, wait.
        # Mulank from day of birth usually is 1-9. The spec says:
        # "29 -> 2+9 = 11 -> 1+1 = 2". Let's not preserve master for Mulank based on example.
        while sum_digits > 9:
            new_digits = [int(d) for d in str(sum_digits)]
            sum_digits = sum(new_digits)
            steps.append(f"{' + '.join(str(d) for d in new_digits)} = {sum_digits}")
            
        final_mulank = sum_digits
    else:
        final_mulank = day
        
    return final_mulank, steps

def calculate_bhagyank(dob: str, preserve_master: bool = True) -> tuple[int, list[str]]:
    # Remove hyphens
    digits = [int(d) for d in dob if d.isdigit()]
    
    steps = [f"Sum all digits: {' + '.join(str(d) for d in digits)}"]
    
    total = sum(digits)
    steps.append(f"= {total}")
    
    final_bhagyank = reduce_number(total, preserve_master)
    if total != final_bhagyank:
        # Show reduction steps
        temp = total
        while temp > 9:
            if preserve_master and temp in [11, 22, 33]:
                break
            temp_digits = [int(d) for d in str(temp)]
            temp = sum(temp_digits)
            steps.append(f"= {' + '.join(str(d) for d in temp_digits)}")
            steps.append(f"= {temp}")
            
    return final_bhagyank, steps

def calculate_namank(name: str, preserve_master: bool = True) -> tuple[int, list[str]]:
    name = name.upper()
    steps = []
    
    words = name.split()
    word_totals = []
    
    for word in words:
        word_sum = 0
        word_steps = []
        for char in word:
            if char in CHALDEAN_TABLE:
                val = CHALDEAN_TABLE[char]
                word_sum += val
                word_steps.append(f"{char} = {val}")
        
        steps.append(f"{word}:")
        steps.extend(word_steps)
        steps.append(f"Total = {word_sum}")
        
        # Reduce word total
        word_reduced = reduce_number(word_sum, False) # Usually words are reduced, but let's see. 
        # Wait, the spec example:
        # HERSHIL = 24 -> 2+4=6
        # MEHTA = 19 -> 1+9=10 -> 1+0=1
        # Full name: 24 + 19 = 43 -> 4+3=7. 
        # Ah, the example adds the *unreduced* totals! 24 + 19 = 43. 
        word_totals.append(word_sum)
        
        if word_sum > 9:
            temp = word_sum
            while temp > 9:
                temp_digits = [int(d) for d in str(temp)]
                temp = sum(temp_digits)
                steps.append(f"{' + '.join(str(d) for d in temp_digits)} = {temp}")
    
    total_name_sum = sum(word_totals)
    steps.append(f"Full name: {' + '.join(str(t) for t in word_totals)} = {total_name_sum}")
    
    final_namank = reduce_number(total_name_sum, preserve_master)
    if total_name_sum != final_namank:
        temp = total_name_sum
        while temp > 9:
            if preserve_master and temp in [11, 22, 33]:
                break
            temp_digits = [int(d) for d in str(temp)]
            temp = sum(temp_digits)
            steps.append(f"{' + '.join(str(d) for d in temp_digits)} = {temp}")
            
    steps.append(f"Name Number = {final_namank}")
    
    return final_namank, steps
