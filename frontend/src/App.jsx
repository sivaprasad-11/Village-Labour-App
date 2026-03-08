import { useEffect, useState } from "react";
import { getBatches, getBookings, bookBatch } from "./api";

function App() {
  const [activeTab, setActiveTab] = useState("farmer");
  const [batches, setBatches] = useState([]);

  const [farmerName, setFarmerName] = useState("");
  const [date, setDate] = useState("");
  const [batchId, setBatchId] = useState("");
  const [village, setVillage] = useState("");
  const [workType, setWorkType] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [labourCount, setLabourCount] = useState("");
  const [mapLink, setMapLink] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [leaderBatchId, setLeaderBatchId] = useState("");
  const [leaderDate, setLeaderDate] = useState("");
  const [leaderBookings, setLeaderBookings] = useState([]);

  useEffect(() => {
    getBatches().then(setBatches);
  }, []);

  const submit = async () => {
    setMessage("");
    setMessageType("");

    if (
      !farmerName ||
      !date ||
      !batchId ||
      !village ||
      !workType ||
      !address ||
      !phone ||
      !labourCount
    ) {
      setMessage("Please fill all required fields");
      setMessageType("error");
      return;
    }

    const res = await bookBatch({
      farmerName,
      date,
      batchId,
      village,
      workType,
      address,
      phone,
      labourCount,
      mapLink
    });

    if (res?.error) {
      setMessage(res.error);
      setMessageType("error");
      return;
    }

    setMessage("Booking successful");
    setMessageType("success");

    setFarmerName("");
    setDate("");
    setBatchId("");
    setVillage("");
    setWorkType("");
    setAddress("");
    setPhone("");
    setLabourCount("");
    setMapLink("");
  };

  const loadLeaderBookings = async () => {
    const data = await getBookings(leaderBatchId, leaderDate);
    setLeaderBookings(data);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Farm Helper</h1>
        <p style={styles.subtitle}>Village Labour Booking App</p>

        <div style={styles.tabRow}>
          <button
            style={activeTab === "farmer" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("farmer")}
          >
            Farmer Booking
          </button>

          <button
            style={activeTab === "leader" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("leader")}
          >
            Leader Dashboard
          </button>
        </div>

        {activeTab === "farmer" && (
          <div style={styles.card}>
            <h2>Book Labour</h2>

            {message && (
              <div style={messageType === "success" ? styles.success : styles.error}>
                {message}
              </div>
            )}

            <div style={styles.grid}>
              <input
                style={styles.input}
                placeholder="Farmer Name"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
              />

              <input
                style={styles.input}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <input
                style={styles.input}
                placeholder="Village"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
              />

              <select
                style={styles.input}
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
              >
                <option value="">Select Work Type</option>
                <option value="Tomato perakadam">Tomato perakadam</option>
                <option value="Chetlu thogadam">Chetlu thogadam</option>
                <option value="Purri kattadam">Purri kattadam</option>
                <option value="Other work">Other work</option>
              </select>

              <input
                style={styles.input}
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <input
                style={styles.input}
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <input
                style={styles.input}
                type="number"
                min="1"
                placeholder="Number of labour required"
                value={labourCount}
                onChange={(e) => setLabourCount(e.target.value)}
              />

              <select
                style={styles.input}
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
              >
                <option value="">Select Batch</option>
                {batches.map((b) => (
                  <option key={b.batchId} value={b.batchId}>
                    {b.batchId} - {b.leaderName}
                  </option>
                ))}
              </select>

              <input
                style={{ ...styles.input, gridColumn: "1 / -1" }}
                placeholder="Google Map Link (optional)"
                value={mapLink}
                onChange={(e) => setMapLink(e.target.value)}
              />
            </div>

            <button style={styles.button} onClick={submit}>
              Book Labour
            </button>
          </div>
        )}

        {activeTab === "leader" && (
          <div style={styles.card}>
            <h2>Leader Dashboard</h2>

            <div style={styles.grid}>
              <select
                style={styles.input}
                value={leaderBatchId}
                onChange={(e) => setLeaderBatchId(e.target.value)}
              >
                <option value="">Select Batch</option>
                {batches.map((b) => (
                  <option key={b.batchId} value={b.batchId}>
                    {b.batchId} - {b.leaderName}
                  </option>
                ))}
              </select>

              <input
                style={styles.input}
                type="date"
                value={leaderDate}
                onChange={(e) => setLeaderDate(e.target.value)}
              />
            </div>

            <button style={styles.button} onClick={loadLeaderBookings}>
              Show Bookings
            </button>

            <div style={{ marginTop: "20px" }}>
              {leaderBookings.length === 0 ? (
                <p>No bookings found</p>
              ) : (
                leaderBookings.map((booking) => (
                  <div key={booking.pk} style={styles.bookingCard}>
                    <p><b>Farmer:</b> {booking.farmerName}</p>
                    <p><b>Date:</b> {booking.date}</p>
                    <p><b>Village:</b> {booking.village}</p>
                    <p><b>Work:</b> {booking.workType}</p>
                    <p><b>Address:</b> {booking.address}</p>
                    <p><b>Phone:</b> {booking.phone}</p>
                    <div style={styles.actionRow}>
                      <a href={`tel:${booking.phone}`} style={styles.callButton}>
                        Call Farmer
                      </a>
                    </div>
                    <p><b>Batch:</b> {booking.batchId}</p>
                    <p><b>Labour Count:</b> {booking.labourCount || "-"}</p>
                    <p><b>Payment Status:</b> {booking.paymentStatus || "PENDING"}</p>
                    <p><b>Status:</b> {booking.status}</p>
                    <p>
                      <b>Map:</b>{" "}
                      {booking.mapLink ? (
                        <a href={booking.mapLink} target="_blank" rel="noreferrer">
                          Open Map
                        </a>
                      ) : (
                        "Not provided"
                      )}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#f4f6fb",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "Arial"
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto"
  },
  title: {
    marginBottom: "4px"
  },
  subtitle: {
    color: "#555",
    marginTop: 0,
    marginBottom: "20px"
  },
  tabRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  },
  tab: {
    background: "#ddd",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer"
  },
  activeTab: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer"
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
    marginBottom: "16px"
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },
  button: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "8px",
    cursor: "pointer"
  },
  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "12px"
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "12px"
  },
  bookingCard: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "14px",
    marginBottom: "12px",
    background: "#fafafa"
  },
  actionRow: {
    marginBottom: "10px"
  },
  callButton: {
    display: "inline-block",
    background: "#2563eb",
    color: "#fff",
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    fontWeight: "600"
  }
};

export default App;
