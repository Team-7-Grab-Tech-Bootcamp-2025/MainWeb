import sys

def get_line(filepath, line_number):
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            for current_number, line in enumerate(file, start=1):
                if current_number == line_number:
                    return line.strip()
        print(f"Line {line_number} not found in the file.")
    except FileNotFoundError:
        print(f"File not found: {filepath}")
    except Exception as e:
        print(f"An error occurred: {e}")
    return None

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: python get_line.py <file_path> <line_number>")
    else:
        filepath = sys.argv[1]
        try:
            line_number = int(sys.argv[2])
            result = get_line(filepath, line_number)
            if result:
                print(f"Line {line_number}: {result}")
        except ValueError:
            print("Line number must be an integer.")
