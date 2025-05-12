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
            # if this is table Feedback_label, and the first digit of last value is ''F', add 10227556 to the first value
            # This is a special case for the Feedback_label table
            if table_name == 'Feedback_label' and processed_values[-1][1] == 'F':
                processed_values[0] = str(int(processed_values[0]) + 10227556)
                # Special handling for review_time column in Review table
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
    
    # Ensure we have a "USE angi_db;" statement at the beginning
    if not any(line.startswith('USE angi_db;') for line in lines):
        lines.insert(0, 'USE angi_db;')
    
    # Process the lines to properly identify SQL batches (complete INSERT statements)
    processed_lines = []
    current_insert = []
    in_insert = False
    
    for line in lines:
        # Start of a new INSERT statement
        if line.startswith('INSERT INTO'):
            if in_insert and current_insert:
                # Save the previous insert statement
                processed_lines.append(current_insert)
                current_insert = []
            in_insert = True
            current_insert.append(line)
        # Part of an ongoing INSERT or header/comment
        elif in_insert and (line.endswith(';') or not line.strip()):
            # End of the current INSERT statement
            current_insert.append(line)
            processed_lines.append(current_insert)
            current_insert = []
            in_insert = False
        elif in_insert:
            # Middle of an INSERT statement
            current_insert.append(line)
        else:
            # Headers, comments, or other non-INSERT lines
            processed_lines.append([line])
    
    # Handle any remaining INSERT statement
    if in_insert and current_insert:
        processed_lines.append(current_insert)
    
    # Calculate total size
    total_size = 0
    for lines_group in processed_lines:
        total_size += len('\n'.join(lines_group).encode('utf-8'))
    
    # Find headers (USE statements and comments)
    headers = []
    for lines_group in processed_lines:
        if len(lines_group) == 1 and (lines_group[0].startswith('USE ') or 
                                     lines_group[0].startswith('--') or 
                                     not lines_group[0].strip()):
            headers.append(lines_group[0])
    
    # If file size exceeds the limit, split it
    if total_size > MAX_FILE_SIZE:
        print(f"Warning: File size ({total_size / (1024 * 1024):.2f}MB) exceeds GitHub limit (95MB). Splitting file.")
        
        # Calculate approximate number of parts needed
        num_parts = (total_size // MAX_FILE_SIZE) + 1
        
        # Find all the complete INSERT statements
        insert_statements = []
        for lines_group in processed_lines:
            if len(lines_group) > 1 and lines_group[0].startswith('INSERT INTO'):
                insert_statements.append(lines_group)
        
        # Calculate size per part (approximately)
        inserts_per_part = len(insert_statements) // num_parts
        if inserts_per_part == 0:
            inserts_per_part = 1
        
        # Split and save files
        current_part = 1
        total_parts = 0
        remaining_inserts = insert_statements.copy()
        
        while remaining_inserts:
            # Create a new part with headers
            part_lines = headers.copy()
            
            # Add comment indicating this is a split file
            part_lines.insert(0, f"-- Split file part {current_part}, generated from {file_name}")
            
            # Add USE statement if not already present
            if not any(line.startswith('USE angi_db;') for line in part_lines):
                part_lines.insert(1, 'USE angi_db;')
            
            # Calculate how many INSERT statements to include in this part
            # Don't exceed MAX_FILE_SIZE
            current_part_inserts = []
            current_part_size = len('\n'.join(part_lines).encode('utf-8'))
            
            while remaining_inserts and current_part_size < MAX_FILE_SIZE - 1024:  # Keep 1KB buffer
                next_insert = remaining_inserts[0]
                next_insert_size = len('\n'.join(next_insert).encode('utf-8'))
                
                if current_part_size + next_insert_size <= MAX_FILE_SIZE - 1024:
                    current_part_inserts.extend(next_insert)
                    current_part_size += next_insert_size
                    remaining_inserts.pop(0)
                else:
                    # This insert would push us over the limit
                    break
            
            # If we couldn't add any inserts, add at least one to avoid infinite loop
            if not current_part_inserts and remaining_inserts:
                print(f"Warning: Very large INSERT statement detected in part {current_part}.")
                current_part_inserts.extend(remaining_inserts.pop(0))
            
            # Add the inserts to this part
            part_lines.extend(current_part_inserts)
            
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
        'Feedback_label.csv'
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
        'Temp': 200,
        'Feedback_label': 100
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
