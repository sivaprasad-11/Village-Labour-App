import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import { ddb, TABLE_BATCHES, TABLE_BOOKINGS } from "./db.js";

import {
  ScanCommand,
  GetCommand,
  PutCommand
} from "@aws-sdk/lib-dynamodb";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("joinBatch", (batchId) => {
    socket.join(`batch:${batchId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

app.get("/api/batches", async (req, res) => {

  const data = await ddb.send(new ScanCommand({
    TableName: TABLE_BATCHES
  }));

  res.json(data.Items || []);
});

app.get("/api/booking", async (req, res) => {

  const { batchId, date } = req.query;

  const pk = `${batchId}#${date}`;

  const data = await ddb.send(new GetCommand({
    TableName: TABLE_BOOKINGS,
    Key: { pk }
  }));

  res.json(data.Item || null);
});

app.post("/api/book", async (req, res) => {

  const { batchId, date, farmerName, village, address, workType } = req.body;

  const pk = `${batchId}#${date}`;

  const item = {
    pk,
    batchId,
    date,
    farmerName,
    village,
    address,
    workType,
    status: "BOOKED",
    createdAt: new Date().toISOString()
  };

  try {

    await ddb.send(new PutCommand({
      TableName: TABLE_BOOKINGS,
      Item: item,
      ConditionExpression: "attribute_not_exists(pk)"
    }));

    io.to(`batch:${batchId}`).emit("bookingUpdated", item);

    res.json({ success: true });

  } catch (error) {

    res.status(400).json({
      error: "Already booked for this date"
    });

  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});