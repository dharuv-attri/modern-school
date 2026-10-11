import os
import zipfile
import sys

def make_zip(output_filename, source_dir):
    exclude_dirs = {
        'node_modules',
        'dist',
        '.git',
        '.vite',
        '.cache',
        '__pycache__'
    }
    exclude_files = {
        output_filename,
        'bun.lock'
    }

    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            # filter out exclude dirs
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            
            for file in files:
                if file in exclude_files or file.endswith('.zip'):
                    continue
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, source_dir)
                print(f"Adding: {rel_path}")
                zipf.write(file_path, rel_path)

if __name__ == '__main__':
    source_directory = '.'
    target_zip = os.path.join('public', 'modern-public-school-swarghat.zip')
    
    # Ensure public folder exists
    os.makedirs('public', exist_ok=True)
    
    make_zip(target_zip, source_directory)
    print(f"\nSuccessfully created {target_zip} with size {os.path.getsize(target_zip)} bytes")
