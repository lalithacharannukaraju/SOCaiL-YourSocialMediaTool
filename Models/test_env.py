import os
from dotenv import load_dotenv

backend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'Backend')
env_path = os.path.join(backend_dir, '.env')
print("Looking for .env at:", env_path)
print("File exists:", os.path.exists(env_path))
if os.path.exists(env_path):
    with open(env_path) as f:
        print("File contents:\n", f.read())

load_dotenv(dotenv_path=env_path)
print("Loaded GEMINI_API_KEY:", repr(os.getenv("GEMINI_API_KEY"))) 