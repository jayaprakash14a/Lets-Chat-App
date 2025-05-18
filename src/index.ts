import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket,
    room: string
}

let allSockets: User[] = [];

wss.on("connection", (socket) => {

    socket.on("message", (message: string) => {

        let parsedMessage = JSON.parse(message);
        if (parsedMessage.type === 'join') {

            console.log("user join room : " + parsedMessage.payload.roomId);
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            })

        } else if (parsedMessage.type === 'chat') {

            const currentUserRoom = allSockets.find(x => x.socket === socket)?.room;

            const users = allSockets.forEach((x) => {
                if (x.room === currentUserRoom) {
                    x.socket.send(parsedMessage.payload.message);
                }
            })

        }

    })

    socket.on("disconnect", () => {
        allSockets = allSockets.filter((x) => x.socket !== socket);
    })

})

// join a room
// {
//     "type": "join",
//         "payload": {
//         "roomId": "123"
//     }
// }
//  Send a message
// {
//     "type": "chat",
//         "payload": {
//         "message: "hi there"
//     }
// }