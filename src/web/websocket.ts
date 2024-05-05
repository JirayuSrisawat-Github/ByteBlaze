import Fastify from "fastify";
import { Manager } from "../manager.js";
import { WebSocket } from "@fastify/websocket";

export class WebsocketRoute {
  constructor(protected client: Manager) {}

  main(fastify: Fastify.FastifyInstance) {
    fastify.get("/websocket", { websocket: true }, (socket, req) => {
      this.client.logger.info(import.meta.url, `${req.method} ${req.routeOptions.url}`);

      socket.on("close", (code, reason) => {
        this.client.logger.websocket(import.meta.url, `Closed with code: ${code}, reason: ${reason}`);
        this.client.wsId.delete(String(req.headers["guild-id"]));
      });

      if (!this.checker(socket, req)) return;

      this.client.logger.websocket(import.meta.url, `Websocket opened for ${req.headers["guild-id"]}`);
      this.client.wsId.set(String(req.headers["guild-id"]), true);
    });
  }

  checker(socket: WebSocket, req: Fastify.FastifyRequest) {
    if (!req.headers["guild-id"]) {
      socket.send(JSON.stringify({ error: "Missing guild-id" }));
      socket.close(1000, JSON.stringify({ error: "Missing guild-id" }));
      return false;
    }
    if (!req.headers["authorization"]) {
      socket.send(JSON.stringify({ error: "Missing Authorization" }));
      socket.close(1000, JSON.stringify({ error: "Missing Authorization" }));
      return false;
    }
    if (req.headers["authorization"] !== this.client.config.features.WEB_SERVER.auth) {
      socket.send(JSON.stringify({ error: "Authorization failed" }));
      socket.close(1000, JSON.stringify({ error: "Authorization failed" }));
      return false;
    }

    return true;
  }
}
