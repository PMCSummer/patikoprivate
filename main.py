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

    print("Client connected. Total:", len(clients))

    if len(clients) == 1:
        await websocket.send_text('{"type": "initiator"}')

    if len(clients) == 2:
        for client in clients:
            await client.send_text('{"type": "ready"}')
        print("Both clients ready")

    try:
        while True:
            data = await websocket.receive_text()
            print("Received:", data)

            # если клиентов два, назначаем initiator первому подключившемуся
            if len(clients) == 2 and not any(getattr(c, "initiator_sent", False) for c in clients):
                clients[0].initiator_sent = True
                await clients[0].send_text('{"type": "initiator"}')
                print("Initiator assigned")

            for client in clients:
                if client != websocket:
                    await client.send_text(data)

    except WebSocketDisconnect:
        clients.remove(websocket)
        print("Client disconnected")