import os

def walk_the_line(root_dir):
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            # Join the folder path and file name
            full_path = os.path.join(root, file)
            if 'node_modules' not in full_path:
                print(full_path)

# Usage
walk_the_line('.')
# walk_the_line('my-app')