from pathlib import Path

import uvicorn


BACKEND_DIR = Path(__file__).resolve().parent


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        reload_dirs=[str(BACKEND_DIR)],
        reload_excludes=[
            str(BACKEND_DIR / "venv"),
            str(BACKEND_DIR / "__pycache__"),
        ],
    )
