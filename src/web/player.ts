import { Manager } from "../manager.js";
import Fastify from "fastify";
import { getStatus } from "./route/getStatus.js";
import { getQueueStatus } from "./route/getQueueStatus.js";
import { getMemberStatus } from "./route/getMemberStatus.js";
import { getCurrentTrackStatus } from "./route/getCurrentTrackStatus.js";
import { getCurrentLoop } from "./route/getCurrentLoop.js";
import { getCurrentPaused } from "./route/getCurrentPaused.js";
import { getCurrentPosition } from "./route/getCurrentPosition.js";
import { PatchControl } from "./route/patchControl.js";

export class PlayerRoute {
  constructor(protected client: Manager) {}

  main(fastify: Fastify.FastifyInstance) {
    fastify.get("/:guildId", (req, res) => getStatus(this.client, req, res));
    fastify.get("/:guildId/loop", (req, res) => getCurrentLoop(this.client, req, res));
    fastify.get("/:guildId/pause", (req, res) => getCurrentPaused(this.client, req, res));
    fastify.get("/:guildId/position", (req, res) => getCurrentPosition(this.client, req, res));
    fastify.get("/:guildId/queue", (req, res) => getQueueStatus(this.client, req, res));
    fastify.get("/:guildId/current", (req, res) => getCurrentTrackStatus(this.client, req, res));
    fastify.get("/:guildId/member/:userId", (req, res) => getMemberStatus(this.client, req, res));
    fastify.patch("/:guildId/control", (req, res) => new PatchControl(this.client).main(req, res));
  }
}
