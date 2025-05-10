#!/usr/bin/env python3
import csv
import os
import re
import datetime

def escape_sql_string(value):
    """Escape special characters in strings for SQL"""
    if value is None or value == '':
        return 'NULL'
    # Replace backslashes with double backslashes first (to avoid double-escaping)
    escaped = str(value).replace("\\", "\\\\")
    # Replace single quotes with two single quotes (SQL escape for single quote)
    escaped = escaped.replace("'", "''")
    # Handle other potentially problematic characters
    # These replacements are typically not needed as MySQL handles them correctly
    # when properly quoted, but added for extra safety
    escaped = escaped.replace("\0", "\\0")  # Null byte
    escaped = escaped.replace("\b", "\\b")  # Backspace
    escaped = escaped.replace("\n", "\\n")  # Newline
    escaped = escaped.replace("\r", "\\r")  # Carriage return
    escaped = escaped.replace("\t", "\\t")  # Tab
    escaped = escaped.replace("\x1a", "\\Z") # Ctrl+Z
    # Commas don't need escaping within quoted strings in SQL
    return f"'{escaped}'"

def convert_date_to_timestamp(date_str):
    """Convert date from DD/MM/YYYY format to MySQL timestamp format (YYYY-MM-DD HH:MM:SS)"""
    try:
        # Handle different date formats that might exist
        if re.match(r'^\d{2}/\d{2}/\d{4}$', date_str):
            # DD/MM/YYYY format
            day, month, year = date_str.split('/')
            # Default time to midnight (00:00:00)
            return f"'{year}-{month}-{day} 00:00:00'"
        elif re.match(r'^\d{1,2}/\d{1,2}/\d{4}$', date_str):
            # D/M/YYYY format - add padding
            parts = date_str.split('/')
            day = parts[0].zfill(2)
            month = parts[1].zfill(2)
            year = parts[2]
            return f"'{year}-{month}-{day} 00:00:00'"
        else:
            # If format is not recognized, return as escaped string
            return escape_sql_string(date_str)
    except (ValueError, IndexError):
        # If any error occurs during conversion, return as escaped string
        return escape_sql_string(date_str)

def csv_to_sql_inserts(csv_file, table_name, batch_size=100):
    """Convert a CSV file to SQL INSERT statements with batching to avoid max_allowed_packet issues"""
    inserts = []
    total_rows = 0
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.reader(file)
        headers = next(reader)  # Get column names from first row
        
        # Add database selection
        inserts.append(f"USE angi_db;")
        inserts.append("")
        inserts.append(f"-- Insert data into {table_name}")
        
        values_list = []
        row_count = 0
        batch_number = 1
        
        # Find index of review_time column if this is the Review table
        review_time_index = -1
        if table_name == 'Review':
            try:
                review_time_index = headers.index('review_time')
            except ValueError:
                print("Warning: 'review_time' column not found in Review.csv")
        
        for row in reader:
            # Process each value appropriately
            processed_values = []
            for i, value in enumerate(row):
                # Special handling for review_time column in Review table
                if table_name == 'Review' and i == review_time_index and value.strip():
                    processed_values.append(convert_date_to_timestamp(value.strip()))
                # Regular processing for other columns
                elif re.match(r'^-?\d+$', value.strip()):
                    processed_values.append(value)  # Integer
                elif re.match(r'^-?\d+\.\d+$', value.strip()):
                    processed_values.append(value)  # Float/Decimal
                elif value.strip().upper() in ('NULL', ''):
                    processed_values.append('NULL')  # NULL value
                else:
                    processed_values.append(escape_sql_string(value))  # String
                    
            values_list.append(f"({', '.join(processed_values)})")
            row_count += 1
            total_rows += 1
            
            # If we've reached the batch size, add the INSERT statement
            if row_count >= batch_size:
                inserts.append(f"-- Batch {batch_number}")
                inserts.append(f"INSERT INTO {table_name} ({', '.join(headers)}) VALUES")
                inserts.append(',\n'.join(values_list) + ';')
                inserts.append("")  # Add empty line between batches
                values_list = []
                row_count = 0
                batch_number += 1
        
        # Add any remaining rows
        if values_list:
            inserts.append(f"-- Batch {batch_number}")
            inserts.append(f"INSERT INTO {table_name} ({', '.join(headers)}) VALUES")
            inserts.append(',\n'.join(values_list) + ';')
    print(f"Processed {total_rows} rows from {csv_file}.")
    return inserts

def save_sql_file(file_path, lines):
    """Save SQL statements to a file, splitting into multiple files if exceeding GitHub limit (95MB)"""
    # GitHub file size limit in bytes (95MB)
    MAX_FILE_SIZE = 95 * 1024 * 1024
    
    # Get the base file name and extension
    file_dir, file_name = os.path.split(file_path)
    file_base, file_ext = os.path.splitext(file_name)
      # If headers will be included in each part, estimate their size
    header_lines = []
    data_lines = []
    
    # Identify header lines (e.g., USE database statement, comments)
    for line in lines:
        if line.startswith('USE ') or line.startswith('--') or line == '':
            header_lines.append(line)
        else:
            data_lines.append(line)
            
    # Calculate size of headers (they'll be included in each part)
    headers_text = '\n'.join(header_lines)
    headers_size = len(headers_text.encode('utf-8'))
    
    # Calculate total size
    data_text = '\n'.join(data_lines)
    data_size = len(data_text.encode('utf-8'))
    total_size = headers_size + data_size
    
    # If file size exceeds the limit, split it
    if total_size > MAX_FILE_SIZE:
        print(f"Warning: File size ({total_size / (1024 * 1024):.2f}MB) exceeds GitHub limit (95MB). Splitting file.")
        
        # Calculate the maximum size for data in each part (accounting for headers)
        max_data_size_per_part = MAX_FILE_SIZE - headers_size - 1024  # 1KB buffer
        
        # Split and save files
        current_part = 1
        total_parts = 0
        remaining_data = data_lines.copy()
        
        while remaining_data:
            # Create a new part with headers
            part_lines = header_lines.copy()
            
            # Add comment indicating this is a split file
            part_lines.insert(0, f"-- Split file part {current_part}, generated from {file_name}")
            
            # Build up this part until we reach the size limit
            current_part_data = []
            current_part_size = 0
            while remaining_data and current_part_size < max_data_size_per_part:
                next_line = remaining_data[0]
                next_line_size = len((next_line + '\n').encode('utf-8'))
                
                if current_part_size + next_line_size <= max_data_size_per_part:
                    current_part_data.append(next_line)
                    current_part_size += next_line_size
                    remaining_data.pop(0)
                else:
                    # This line would push us over the limit
                    break
                    
            # If we couldn't add any lines because a single line is too big,
            # take at least one line to avoid infinite loop
            if not current_part_data and remaining_data:
                print(f"Warning: Very large SQL line detected in part {current_part}.")
                current_part_data.append(remaining_data.pop(0))
              # Add the data lines for this part
            part_lines.extend(current_part_data)
            
            # Generate the filename for this part
            part_file_path = os.path.join(file_dir, f"{file_base}_part{current_part}{file_ext}")
            
            # Write the part file
            with open(part_file_path, 'w', encoding='utf-8') as f:
                f.write('\n'.join(part_lines))
            
            print(f"Split file part {current_part} written to {part_file_path}")
            current_part += 1
            total_parts += 1
        
        print(f"File split into {total_parts} parts.")
        return total_parts
    else:
        # File size is acceptable, write as a single file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines))
        print(f"SQL statements written to {file_path} ({total_size / (1024 * 1024):.2f}MB)")
        return 1  # Return 1 indicating a single file was created

def main():
    # Folder containing CSV files
    folder_path = os.path.join(os.path.dirname(__file__), 'final_table')
    output_dir = os.path.dirname(__file__)
    
    # Define table order based on foreign key dependencies
    table_order = [
        #'Platform.csv', 'City.csv', 'District.csv', 'Food_type.csv', 
        #'User.csv', 'Restaurant.csv', 'Dish.csv', 
        'Review.csv'
        #'Temp.csv'
    ]
    
    # Batch sizes for different tables - adjust based on your data size
    batch_sizes = {
        'Platform': 200,
        'City': 200,
        'District': 200, 
        'Food_type': 200,
        'User': 150,
        'Restaurant': 100,
        'Dish': 50,     # Smaller batch for potentially larger rows
        'Review': 25,   # Very small batch for likely largest table
        'Temp': 200
    }
    
    # Keep track of total files generated
    total_files = 0
    generated_files = []
    
    # Process each CSV file in correct order and create separate files
    for index, csv_filename in enumerate(table_order):
        csv_path = os.path.join(folder_path, csv_filename)
        table_name = os.path.splitext(csv_filename)[0]  # Remove .csv extension
        
        # Get appropriate batch size for this table
        batch_size = batch_sizes.get(table_name, 200)  # Default to 200 if not specified
        
        if os.path.exists(csv_path):
            print(f"Processing {csv_filename} with batch size {batch_size}...")
            output_file = os.path.join(output_dir, f"init2{index+8}_" + table_name + ".sql")
            sql_statements = csv_to_sql_inserts(csv_path, table_name, batch_size)
            
            # Save SQL statements to file(s) and get number of files created
            num_files = save_sql_file(output_file, sql_statements)
            total_files += num_files
            
            # Add file names to the generated files list
            base_file = os.path.basename(output_file)
            if num_files == 1:
                generated_files.append(base_file)
            else:
                file_base, file_ext = os.path.splitext(base_file)
                for i in range(1, num_files + 1):
                    generated_files.append(f"{file_base}_part{i}{file_ext}")
        else:
            print(f"Warning: {csv_filename} not found!")
    
    print(f"\nAll SQL files generated successfully ({total_files} total files).")
    print("You can run these files in the Docker container using:")
    
    # Show example for the first file
    if generated_files:
        print(f"docker exec -i mysql-container mysql -uroot -ppassword < {generated_files[0]}")
        
        # If we have split files, add a note about running them in order
        if total_files > len(table_order):
            print("\nNote: For split files, run them in the correct order (part1, part2, etc.).")

if __name__ == "__main__":
    main()