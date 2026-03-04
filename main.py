from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import uuid

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

class Room:
    def __init__(self):
        self.clients = {}
        self.started = {}

    async def broadcast(self, message: dict):
        for ws in self.clients.values():
            await ws.send_json(message)

room = Room()

@app.get("/")
async def root():
    return FileResponse("static/index.html")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    if len(room.clients) >= 2:
        await websocket.close()
        return

    client_id = str(uuid.uuid4())
    room.clients[client_id] = websocket
    room.started[client_id] = False

    print("Connected:", len(room.clients))

    # Первый — инициатор
    if len(room.clients) == 1:
        await websocket.send_json({"type": "initiator"})

    # Если двое — сообщаем готовность
    if len(room.clients) == 2:
        await room.broadcast({"type": "ready"})

    try:
        while True:
            data = await websocket.receive_json()

            # фиксируем кто нажал start
            if data["type"] == "start":
                room.started[client_id] = True

                if all(room.started.values()):
                    await room.broadcast({"type": "both_started"})
                continue

            # пересылаем сигнальные данные
            for cid, client in room.clients.items():
                if cid != client_id:
                    await client.send_json(data)

    except WebSocketDisconnect:
        print("Disconnected")
        room.clients.pop(client_id, None)
        room.started.pop(client_id, None)

        # если кто-то ушёл — сбрасываем комнату
        if room.clients:
            await room.broadcast({"type": "peer_disconnected"})

        # очищаем полностью
        if len(room.clients) == 0:
            room.started.clear()