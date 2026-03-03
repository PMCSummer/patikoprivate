from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from typing import List

app = FastAPI()

clients: List[WebSocket] = []

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def root():
    return FileResponse("static/index.html")


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)

    # если это первый клиент — скажем ему что он initiator
    if len(clients) == 1:
        await websocket.send_text('{"type": "initiator"}')

    try:
        while True:
            data = await websocket.receive_text()

            for client in clients:
                if client != websocket:
                    await client.send_text(data)

    except WebSocketDisconnect:
        clients.remove(websocket)