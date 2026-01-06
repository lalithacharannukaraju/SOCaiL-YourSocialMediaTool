import importlib
import sys

MODULES = [
    "flask",
    "flask_cors",
    "google.genai",
    "dotenv",
    "pandas",
    "numpy",
    "sentence_transformers",
    "sklearn.metrics.pairwise",
]


def test_import(module_name: str) -> bool:
    print(f"Testing import: {module_name} ...", end=" ")
    
    try:
        importlib.import_module(module_name)
        print("OK")
        return True
    except Exception as e:
        print(f"FAILED -> {e.__class__.__name__}: {e}")
        return False


if __name__ == "__main__":
    print("=== Testing Python imports required by gemini.py ===")
    all_ok = True
    for mod in MODULES:
        ok = test_import(mod)
        all_ok = all_ok and ok

    if all_ok:
        print("\nAll imports succeeded. Your issue is likely NOT missing Python packages.")
        sys.exit(0)
    else:
        print(
            "\nOne or more imports FAILED.\n"
            "Install the missing packages, for example (from the project root):\n"
            "    pip install flask flask-cors google-genai python-dotenv pandas numpy sentence-transformers scikit-learn\n"
        )
        sys.exit(1)

