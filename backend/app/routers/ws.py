import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.realtime import ws_manager

router = APIRouter(tags=["ws"])


@router.websocket("/ws/{room}")
async def websocket_room(websocket: WebSocket, room: str):
    await ws_manager.connect(room, websocket)
    try:
        while True:
            message = await websocket.receive()
            if message.get("type") == "websocket.disconnect":
                break

            text = message.get("text")
            incoming: dict | str = text or message.get("bytes", b"").decode("utf-8", errors="ignore")

            if isinstance(incoming, str):
                try:
                    incoming = json.loads(incoming)
                except json.JSONDecodeError:
                    # Keep the socket alive even for non-JSON payloads.
                    incoming = {"message": incoming}

            await ws_manager.broadcast(room, {"type": "echo", "data": incoming})
    except WebSocketDisconnect:
        pass
    finally:
        ws_manager.disconnect(room, websocket)
