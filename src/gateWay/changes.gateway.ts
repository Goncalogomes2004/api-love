import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
    cors: { origin: "*" },
})
export class ChangesGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;


    userSockets: Record<string, string> = {};



    handleConnection(client: any) {
        const userId = client.handshake.query.userId as string;

        if (userId) {
            this.userSockets[userId] = client.id;
        }
    }



    sendFolderEdited() {
        this.server.emit('folderEdited',);
    }

    sendFolderImageEdited() {
        this.server.emit('folderImageEdited',);
    }


    sendImageEdited(folderId: number) {
        this.server.emit('imageEdited', folderId);
    }


    sendNoFolderUpdate() {
        this.server.emit('noFolderUpdate',);
    }

    sendDowloaded(photoId: number) {
        this.server.emit('downloaded', photoId);
    }
}
