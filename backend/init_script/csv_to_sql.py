#!/usr/bin/env python3
import csv
import os
import re

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

def csv_to_sql_inserts(csv_file, table_name, batch_size=100):
    """Convert a CSV file to SQL INSERT statements with batching to avoid max_allowed_packet issues"""
    inserts = []
    
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
        
        for row in reader:
            # Process each value appropriately
            processed_values = []
            for value in row:
                # Try to convert to number if possible
                if re.match(r'^-?\d+$', value.strip()):
                    processed_values.append(value)  # Integer
                elif re.match(r'^-?\d+\.\d+$', value.strip()):
                    processed_values.append(value)  # Float/Decimal
                elif value.strip().upper() in ('NULL', ''):
                    processed_values.append('NULL')  # NULL value
                else:
                    processed_values.append(escape_sql_string(value))  # String
                    
            values_list.append(f"({', '.join(processed_values)})")
            row_count += 1
            
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
    
    return inserts

def save_sql_file(file_path, lines):
    """Save SQL statements to a file"""
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print(f"SQL statements written to {file_path}")

def main():
    # Folder containing CSV files
    folder_path = os.path.join(os.path.dirname(__file__), 'final_table')
    output_dir = os.path.dirname(__file__)
    
    # Define table order based on foreign key dependencies
    table_order = [
        'Platform.csv', 'City.csv', 'District.csv', 'Food_type.csv', 
        'User.csv', 'Restaurant.csv', 'Dish.csv', 'Review.csv', 
        'Temp.csv'
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
    
    # Process each CSV file in correct order and create separate files
    for index, csv_filename in enumerate(table_order):
        csv_path = os.path.join(folder_path, csv_filename)
        table_name = os.path.splitext(csv_filename)[0]  # Remove .csv extension
        
        # Get appropriate batch size for this table
        batch_size = batch_sizes.get(table_name, 200)  # Default to 200 if not specified
        
        if os.path.exists(csv_path):
            print(f"Processing {csv_filename} with batch size {batch_size}...")
            output_file = os.path.join(output_dir, f"init2{index}_" + table_name + ".sql")
            sql_statements = csv_to_sql_inserts(csv_path, table_name, batch_size)
            save_sql_file(output_file, sql_statements)
        else:
            print(f"Warning: {csv_filename} not found!")
    
    print("\nAll SQL files generated successfully.")
    print("You can run these files in the Docker container using:")
    print("docker exec -i mysql-container mysql -uroot -ppassword < init20_Platform.sql")

if __name__ == "__main__":
    main()