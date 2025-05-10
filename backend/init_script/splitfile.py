import os
import subprocess

def split_file(input_file, output_dir, lines_per_file):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    with open(input_file, 'r') as infile:
        file_count = 1
        lines = []
        for line in infile:
            lines.append(line)
            if len(lines) >= lines_per_file:
                output_file = os.path.join(output_dir, f'chunk_{file_count}.sql')
                with open(output_file, 'w') as outfile:
                    outfile.writelines(lines)
                lines = []
                file_count += 1
        if lines:
            output_file = os.path.join(output_dir, f'chunk_{file_count}.sql')
            with open(output_file, 'w') as outfile:
                outfile.writelines(lines)

def execute_chunks(output_dir, container_name, db_user, db_password):
    for file in sorted(os.listdir(output_dir)):
        if file.endswith('.sql'):
            file_path = os.path.join(output_dir, file)
            command = f'docker exec -i {container_name} mysql -u{db_user} -p{db_password} < {file_path}'
            print(f'Executing: {command}')
            result = subprocess.run(command, shell=True, capture_output=True, text=True)
            if result.returncode != 0:
                print(f"Error executing {file}: {result.stderr}")
                break

if __name__ == "__main__":
    input_file = './backend/init_script/init28_Review.sql'
    output_dir = './backend/init_script/split_chunks'
    lines_per_file = 1000  # Adjust this value as needed

    split_file(input_file, output_dir, lines_per_file)
