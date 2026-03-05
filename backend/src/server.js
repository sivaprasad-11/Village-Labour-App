import express from "express";
import cors from "cors";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const app = express();
app.use(cors());
app.use(express.json());

// Env
const AWS_REGION = process.env.AWS_REGION || "ap-south-1";
const BATCHES_TABLE = process.env.TABLE_BATCHES || "LabourBatches";
const BOOKINGS_TABLE = process.env.TABLE_BOOKINGS || "Bookings";

// DynamoDB client
const ddb = new DynamoDBClient({ region: AWS_REGION });
const docClient = DynamoDBDocumentClient.from(ddb);

// Health
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// Get batches
app.get("/api/batches", async (req, res) => {
  try {
    const out = await docClient.send(new ScanCommand({ TableName: BATCHES_TABLE }));
    res.json(out.Items || []);
  } catch (err) {
    console.error("batches error:", err);
    res.status(500).json({ error: "Failed to fetch batches" });
  }
});

// Book labour (with new fields)
app.post("/api/book", async (req, res) => {
  try {
    const {
      farmerName,
      date,
      batchId,
      village,
      workType,
      address,
      phone
    } = req.body;

    if (!farmerName || !date || !batchId) {
      return res.status(400).json({ error: "farmerName, date, batchId are required" });
    }

    const booking = {
      bookingId: Date.now().toString(),
      farmerName,
      date,
      batchId,
      village: village || "",
      workType: workType || "",
      address: address || "",
      phone: phone || ""
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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));