import type { NextApiRequest, NextApiResponse } from "next";
import { WebSocketServer } from "ws";

const handler = (
  _: NextApiRequest,
  res: NextApiResponse & { socket?: { server: { wss?: WebSocketServer } } },
) => {
  if (!res.socket.server.wss) {
    console.log("Starting WebSocket server...");
    const wss = new WebSocketServer({ port: 3001 });

    wss.on("connection", (ws) => {
      console.log("Client connected");

      ws.on("message", (message) => {
        console.log("Received:", message.toString());
        ws.send(`Server received: ${message} ${new Date().toISOString()}`);
      });

      ws.on("close", () => {
        console.log("Client disconnected");
      });
    });
    res.socket.server.wss = wss;
    res.status(201).json({ status: "Socket is started" });
    return;
  }
  console.log("WebSocket server already started");
  res.status(200).json({ status: "Socket is already running" });
};

export default handler;
