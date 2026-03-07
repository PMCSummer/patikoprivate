from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# статика
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/sound", StaticFiles(directory="sound"), name="sound")


@app.get("/")
def index():
    return FileResponse("index.html")