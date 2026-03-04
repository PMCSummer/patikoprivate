from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

room = []

@app.get("/")
async def root():
    return FileResponse("static/index.html")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    if len(room) >= 2:
        await websocket.close()
        return

    room.append(websocket)
    print("Client connected:", len(room))

    # Первый — инициатор
    if len(room) == 1:
        await websocket.send_json({"type": "initiator"})

    # Когда двое — готовы
    if len(room) == 2:
        for ws in room:
            await ws.send_json({"type": "ready"})

    try:
        while True:
            data = await websocket.receive_text()

            for client in room:
                if client != websocket:
                    await client.send_text(data)

    except WebSocketDisconnect:
        room.remove(websocket)
        print("Client disconnected")

        # Сообщаем второму, что всё сломалось
        for client in room:
            await client.send_json({"type": "peer_disconnected"})