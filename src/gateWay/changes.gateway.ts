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
    sendImageAdded() {
        this.server.emit('imageAdded',);
    }
    sendImageDeleted(imageId: number) {
        this.server.emit('imageDeleted', imageId);
    }
    sendImageChanged(imageId: number) {
        this.server.emit('imageChanged', imageId);
    }
    sendNoFolderUpdate() {
        this.server.emit('noFolderUpdate',);
    }

    sendDowloaded(photoId: number) {
        this.server.emit('downloaded', photoId);
    }
}
