app.post("/api/book", async (req, res) => {

  const {
    farmerName,
    date,
    batchId,
    village,
    workType,
    address,
    phone
  } = req.body;

  const booking = {
    bookingId: Date.now().toString(),
    farmerName,
    date,
    batchId,
    village,
    workType,
    address,
    phone
  };

  await docClient.put({
    TableName: BOOKINGS_TABLE,
    Item: booking
  });

  res.json({ message: "Booking saved" });
});