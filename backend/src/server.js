import express from "express";
import cors from "cors";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand
} from "@aws-sdk/lib-dynamodb";

const app = express();
app.use(cors());
app.use(express.json());

const AWS_REGION = process.env.AWS_REGION || "ap-south-1";
const BATCHES_TABLE = process.env.TABLE_BATCHES || "LabourBatches";
const BOOKINGS_TABLE = process.env.TABLE_BOOKINGS || "Bookings";

const ddb = new DynamoDBClient({ region: AWS_REGION });
const docClient = DynamoDBDocumentClient.from(ddb);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

app.get("/api/batches", async (req, res) => {
  try {
    const out = await docClient.send(
      new ScanCommand({ TableName: BATCHES_TABLE })
    );
    res.json(out.Items || []);
  } catch (err) {
    console.error("batches error:", err);
    res.status(500).json({ error: "Failed to fetch batches" });
  }
});

app.get("/api/bookings", async (req, res) => {
  try {
    const { batchId, date } = req.query;

    const out = await docClient.send(
      new ScanCommand({ TableName: BOOKINGS_TABLE })
    );

    let items = out.Items || [];

    if (batchId) {
      items = items.filter((item) => item.batchId === batchId);
    }

    if (date) {
      items = items.filter((item) => item.date === date);
    }

    items.sort((a, b) => (a.date || "").localeCompare(b.date || ""));

    res.json(items);
  } catch (err) {
    console.error("bookings error:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

app.post("/api/book", async (req, res) => {
  try {
    const {
      farmerName,
      date,
      batchId,
      village,
      workType,
      address,
      phone,
      labourCount,
      mapLink
    } = req.body;

    if (!farmerName || !date || !batchId) {
      return res
        .status(400)
        .json({ error: "farmerName, date, batchId are required" });
    }

    const existing = await docClient.send(
      new ScanCommand({
        TableName: BOOKINGS_TABLE
      })
    );

    const alreadyBooked = (existing.Items || []).find(
      (item) => item.batchId === batchId && item.date === date
    );

    if (alreadyBooked) {
      return res.status(400).json({
        error: "This labour batch is already booked for this date"
      });
    }

    const bookingId = BOOKING#${Date.now()};

    const booking = {
      pk: bookingId,
      batchId,
      date,
      farmerName,
      village: village || "",
      workType: workType || "",
      address: address || "",
      phone: phone || "",
      labourCount: labourCount || "",
      mapLink: mapLink || "",
      status: "BOOKED",
      createdAt: new Date().toISOString()
    };

    await docClient.send(
      new PutCommand({
        TableName: BOOKINGS_TABLE,
        Item: booking
      })
    );

    res.json({ message: "Booking saved", booking });
  } catch (err) {
    console.error("book error:", err);
    res.status(500).json({ error: "Booking failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Server running on port ${PORT}));
