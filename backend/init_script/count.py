import os
import sys

def count_entries(input_file):
    with open(input_file, 'r', encoding='utf-8') as infile:
        line_count = 0
        for line in infile:
            if line.startswith('('):
                line_count += 1

    print(f"Processed {line_count} lines from {input_file}.")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python get_line.py <file_path>")
    else:
        input_file = sys.argv[1]
        count_entries(input_file)

    
