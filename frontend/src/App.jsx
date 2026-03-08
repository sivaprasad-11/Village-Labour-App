import { useEffect, useState } from "react";
import { getBatches, getBookings, bookBatch, markPaymentPaid } from "./api";

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

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setMessage("Location is not supported on this device/browser");
      setMessageType("error");
      return;
    }

    setMessage("Getting current location...");
    setMessageType("success");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const link = `https://www.google.com/maps?q=${lat},${lng}`;
        setMapLink(link);
        setMessage("Current location added successfully");
        setMessageType("success");
      },
      () => {
        setMessage("Unable to fetch current location");
        setMessageType("error");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

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

  const handleMarkPaid = async (pk) => {
    const res = await markPaymentPaid(pk);

    if (res?.error) {
      alert(res.error);
      return;
    }

    const updated = await getBookings(leaderBatchId, leaderDate);
    setLeaderBookings(updated);
  };

  const totalLabour = leaderBookings.reduce(
    (sum, item) => sum + Number(item.labourCount || 0),
    0
  );

  const paidCount = leaderBookings.filter(
    (item) => item.paymentStatus === "PAID"
  ).length;

  const pendingCount = leaderBookings.filter(
    (item) => item.paymentStatus !== "PAID"
  ).length;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.heroCard}>
          <div>
            <h1 style={styles.title}>Paramatapalli Village Labour Booking App</h1>
            <p style={styles.subtitle}>
This website is designed for Paramatapalli village labour booking. Farmers can easily request labour and labour leaders can view bookings, contact farmers, check payment status and open field location in map.
</p>
          </div>
          <div style={styles.heroBadge}>Fast • Simple • Mobile Friendly</div>
        </div>

        <div style={styles.tabWrapper}>
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
            <div style={styles.cardHeader}>
              <div>
                <h2 style={styles.cardTitle}>Book Labour</h2>
                <p style={styles.cardSubtitle}>
                  Enter farmer details and reserve an available labour batch.
                </p>
              </div>
            </div>

            {message && (
              <div style={messageType === "success" ? styles.success : styles.error}>
                {message}
              </div>
            )}

            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Farmer Name</label>
                <input
                  style={styles.input}
                  placeholder="Enter farmer name"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Date</label>
                <input
                  style={styles.input}
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Village</label>
                <input
                  style={styles.input}
                  placeholder="Enter village"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Work Type</label>
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
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Landmark / Field Name</label>
                <input
                  style={styles.input}
                  placeholder="Enter field or landmark"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Phone Number</label>
                <input
                  style={styles.input}
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Number of Labour Required</label>
                <input
                  style={styles.input}
                  type="number"
                  min="1"
                  placeholder="Enter labour count"
                  value={labourCount}
                  onChange={(e) => setLabourCount(e.target.value)}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Select Batch</label>
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
              </div>

              <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
                <label style={styles.label}>Location</label>
                <div style={styles.locationRow}>
                  <button
                    type="button"
                    style={styles.locationButton}
                    onClick={handleUseLocation}
                  >
                    📍 Use My Location
                  </button>
                </div>
                <input
                  style={{ ...styles.input, marginTop: "12px" }}
                  placeholder="Google Map Link (optional)"
                  value={mapLink}
                  onChange={(e) => setMapLink(e.target.value)}
                />
              </div>
            </div>

            <button style={styles.primaryButton} onClick={submit}>
              Book Labour
            </button>
          </div>
        )}

        {activeTab === "leader" && (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <h2 style={styles.cardTitle}>Leader Dashboard</h2>
                <p style={styles.cardSubtitle}>
                  Check bookings, contact farmers, view location and update payment.
                </p>
              </div>
            </div>

            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Select Batch</label>
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
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Select Date</label>
                <input
                  style={styles.input}
                  type="date"
                  value={leaderDate}
                  onChange={(e) => setLeaderDate(e.target.value)}
                />
              </div>
            </div>

            <button style={styles.primaryButton} onClick={loadLeaderBookings}>
              Show Bookings
            </button>

            {leaderBookings.length > 0 && (
              <div style={styles.summaryGrid}>
                <div style={styles.summaryCard}>
                  <div style={styles.summaryLabel}>Total Bookings</div>
                  <div style={styles.summaryValue}>{leaderBookings.length}</div>
                </div>

                <div style={styles.summaryCard}>
                  <div style={styles.summaryLabel}>Labour Needed</div>
                  <div style={styles.summaryValue}>{totalLabour}</div>
                </div>

                <div style={styles.summaryCard}>
                  <div style={styles.summaryLabel}>Paid</div>
                  <div style={styles.summaryValue}>{paidCount}</div>
                </div>

                <div style={styles.summaryCard}>
                  <div style={styles.summaryLabel}>Pending</div>
                  <div style={styles.summaryValue}>{pendingCount}</div>
                </div>
              </div>
            )}

            <div style={{ marginTop: "20px" }}>
              {leaderBookings.length === 0 ? (
                <div style={styles.emptyState}>
                  No bookings found. Select batch and date to view details.
                </div>
              ) : (
                leaderBookings.map((booking) => (
                  <div key={booking.pk} style={styles.bookingCard}>
                    <div style={styles.bookingTop}>
                      <div>
                        <div style={styles.farmerName}>{booking.farmerName}</div>
                        <div style={styles.smallText}>
                          {booking.village} • {booking.date}
                        </div>
                      </div>
                      <div style={styles.workBadge}>{booking.workType}</div>
                    </div>

                    <div style={styles.detailGrid}>
                      <div><b>Batch:</b> {booking.batchId}</div>
                      <div><b>Labour Count:</b> {booking.labourCount || "-"}</div>
                      <div><b>Phone:</b> {booking.phone}</div>
                      <div><b>Landmark / Field Name:</b> {booking.address}</div>
                    </div>

                    <div style={styles.actionRow}>
                      <a href={`tel:${booking.phone}`} style={styles.callButton}>
                        Call Farmer
                      </a>

                      {booking.mapLink ? (
                        <a
                          href={booking.mapLink}
                          target="_blank"
                          rel="noreferrer"
                          style={styles.mapButton}
                        >
                          Open Map
                        </a>
                      ) : (
                        <span style={styles.noMapText}>Location not provided</span>
                      )}
                    </div>

                    <div style={styles.paymentRow}>
                      <span style={styles.paymentLabel}>Payment Status:</span>

                      {booking.paymentStatus === "PAID" ? (
                        <span style={styles.paidBadge}>Paid ✔</span>
                      ) : (
                        <button
                          style={styles.paidButton}
                          onClick={() => handleMarkPaid(booking.pk)}
                        >
                          Mark as PAID
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div style={styles.footer}>
          Paramatapalli Village Labour Booking App • Designed for village labour coordination • Created by Dumbu (Prasad Reddy)
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "linear-gradient(180deg, #eef4ff 0%, #f7fafc 100%)",
    minHeight: "100vh",
    padding: "24px 16px",
    fontFamily: "Arial, sans-serif"
  },
  container: {
    maxWidth: "960px",
    margin: "0 auto"
  },
  heroCard: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 10px 30px rgba(37, 99, 235, 0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "18px"
  },
  title: {
    margin: 0,
    fontSize: "32px",
    color: "#0f172a"
  },
  subtitle: {
    color: "#475569",
    marginTop: "8px",
    marginBottom: 0,
    fontSize: "15px"
  },
  heroBadge: {
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "10px 14px",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "13px"
  },
  tabWrapper: {
    display: "flex",
    gap: "10px",
    marginBottom: "18px",
    flexWrap: "wrap"
  },
  tab: {
    background: "#e2e8f0",
    color: "#0f172a",
    border: "none",
    padding: "12px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700"
  },
  activeTab: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "12px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700"
  },
  card: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)"
  },
  cardHeader: {
    marginBottom: "18px"
  },
  cardTitle: {
    margin: 0,
    fontSize: "24px",
    color: "#0f172a"
  },
  cardSubtitle: {
    marginTop: "8px",
    marginBottom: 0,
    color: "#64748b",
    fontSize: "14px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
    marginBottom: "18px"
  },
  field: {
    display: "flex",
    flexDirection: "column"
  },
  label: {
    marginBottom: "6px",
    fontSize: "13px",
    fontWeight: "700",
    color: "#334155"
  },
  input: {
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: "14px",
    background: "#fff"
  },
  primaryButton: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px"
  },
  locationRow: {
    display: "flex",
    justifyContent: "flex-start"
  },
  locationButton: {
    background: "#0f766e",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700"
  },
  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: "12px 14px",
    borderRadius: "12px",
    marginBottom: "14px",
    fontWeight: "700"
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "12px 14px",
    borderRadius: "12px",
    marginBottom: "14px",
    fontWeight: "700"
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "12px",
    marginTop: "8px",
    marginBottom: "20px"
  },
  summaryCard: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "14px"
  },
  summaryLabel: {
    color: "#64748b",
    fontSize: "13px",
    marginBottom: "6px"
  },
  summaryValue: {
    color: "#0f172a",
    fontWeight: "800",
    fontSize: "24px"
  },
  emptyState: {
    background: "#f8fafc",
    border: "1px dashed #cbd5e1",
    color: "#64748b",
    padding: "18px",
    borderRadius: "16px",
    textAlign: "center"
  },
  bookingCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "18px",
    marginBottom: "14px",
    background: "#ffffff",
    boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)"
  },
  bookingTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginBottom: "14px"
  },
  farmerName: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#0f172a"
  },
  smallText: {
    color: "#64748b",
    marginTop: "4px",
    fontSize: "13px"
  },
  workBadge: {
    background: "#ede9fe",
    color: "#6d28d9",
    padding: "8px 12px",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "12px"
  },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "10px",
    color: "#334155",
    marginBottom: "14px"
  },
  actionRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "14px"
  },
  callButton: {
    display: "inline-block",
    background: "#2563eb",
    color: "#fff",
    textDecoration: "none",
    padding: "10px 14px",
    borderRadius: "12px",
    fontWeight: "700"
  },
  mapButton: {
    display: "inline-block",
    background: "#0f766e",
    color: "#fff",
    textDecoration: "none",
    padding: "10px 14px",
    borderRadius: "12px",
    fontWeight: "700"
  },
  noMapText: {
    color: "#64748b",
    fontSize: "14px"
  },
  paymentRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap"
  },
  paymentLabel: {
    fontWeight: "700",
    color: "#334155"
  },
  paidButton: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700"
  },
  paidBadge: {
    display: "inline-block",
    background: "#dcfce7",
    color: "#166534",
    padding: "7px 12px",
    borderRadius: "10px",
    fontWeight: "800"
  },
  footer: {
    textAlign: "center",
    color: "#64748b",
    fontSize: "13px",
    marginTop: "18px",
    paddingBottom: "12px"
  }
};

export default App;
