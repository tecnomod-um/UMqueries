import json

def update_postcss_version(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)

    def update_version(obj):
        for key, val in obj.items():
            if isinstance(val, dict):
                update_version(val)
            elif key == "postcss":
                # Directly check if the version starts with '^8.4.31'
                if not val.startswith("^8.4.31"):
                    obj[key] = "^8.4.31"

    update_version(data)

    with open(file_path, 'w') as file:
        json.dump(data, file, indent=2)

# Replace 'your_package-lock.json' with the path to your package-lock.json file
update_postcss_version('./package-lock.json')
