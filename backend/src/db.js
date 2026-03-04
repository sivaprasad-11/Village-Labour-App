import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-south-1"
});

export const ddb = DynamoDBDocumentClient.from(client);

export const TABLE_BATCHES = process.env.TABLE_BATCHES || "LabourBatches";
export const TABLE_BOOKINGS = process.env.TABLE_BOOKINGS || "Bookings";