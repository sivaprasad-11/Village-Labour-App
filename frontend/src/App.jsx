import { useEffect, useState } from "react";
import { getBatches, getBookings, bookBatch, markPaymentPaid } from "./api";

function App() {
  const [lang, setLang] = useState("en");
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
  const [leaderPin, setLeaderPin] = useState("");
  const [leaderAuthenticated, setLeaderAuthenticated] = useState(false);
  const [leaderMessage, setLeaderMessage] = useState("");
  const [leaderMessageType, setLeaderMessageType] = useState("");

  const t = {
    en: {
      title: "Paramatapalli Village Labour Booking App",
      subtitle:
        "This website is designed for Paramatapalli village labour booking. Farmers can easily request labour and labour leaders can view bookings, contact farmers, check payment status and open field location in map.",
      heroBadge: "Fast • Simple • Mobile Friendly",
      farmerTab: "Farmer Booking",
      leaderTab: "Leader Dashboard",
      bookLabour: "Book Labour",
      bookLabourDesc:
        "Enter farmer details and reserve an available labour batch.",
      farmerName: "Farmer Name",
      farmerNamePlaceholder: "Enter farmer name",
      date: "Date",
      village: "Village",
      villagePlaceholder: "Enter village",
      workType: "Work Type",
      selectWorkType: "Select Work Type",
      work1: "Tomato perakadam",
      work2: "Chetlu thogadam",
      work3: "Purri kattadam",
      work4: "Mulching paper veyadam, katti natadam",
      work5: "Other work",
      landmark: "Landmark / Field Name",
      landmarkPlaceholder: "Enter field or landmark",
      phone: "Phone Number",
      phonePlaceholder: "Enter phone number",
      labourCount: "Number of Labour Required",
      labourCountPlaceholder: "Enter labour count",
      selectBatch: "Select Batch",
      location: "Location",
      useMyLocation: "📍 Use My Location",
      mapPlaceholder: "Google Map Link (optional)",
      bookButton: "Book Labour",
      gettingLocation: "Getting current location...",
      locationAdded: "Current location added successfully",
      locationNotSupported: "Location is not supported on this device/browser",
      locationFailed: "Unable to fetch current location",
      fillRequired: "Please fill all required fields",
      bookingSuccess: "Booking successful",

      leaderTitle: "Leader Dashboard",
      leaderDesc:
        "Check bookings, contact farmers, view location and update payment.",
      leaderAccessTitle: "Leader Access",
      leaderAccessDesc: "Select your batch and enter leader PIN to open dashboard",
      leaderPin: "Leader PIN",
      leaderPinPlaceholder: "Enter leader PIN",
      leaderLogin: "Login",
      leaderLogout: "Logout",
      invalidLeaderPin: "Invalid leader PIN",
      unauthorizedLeader: "Unauthorized leader access",
      selectBatchAndPin: "Please select batch and enter PIN",
      showBookings: "Show Bookings",
      totalBookings: "Total Bookings",
      labourNeeded: "Labour Needed",
      paid: "Paid",
      pending: "Pending",
      noBookings:
        "No bookings found. Select date to view details.",
      callFarmer: "Call Farmer",
      openMap: "Open Map",
      noLocation: "Location not provided",
      batch: "Batch",
      paymentStatus: "Payment Status",
      markPaid: "Mark as PAID",
      paidDone: "Paid ✔",
      footer:
        "Paramatapalli Village Labour Booking App • Designed for village labour coordination • Created by Dumbu (Prasad Reddy)"
    },
    te: {
      title: "పరమటపల్లి గ్రామ కూలీల బుకింగ్ యాప్",
      subtitle:
        "ఈ వెబ్‌సైట్ పరమటపల్లి గ్రామ స్థాయి కూలీల బుకింగ్ కోసం రూపొందించబడింది. రైతులు సులభంగా కూలీలను బుక్ చేయవచ్చు. లీడర్లు బుకింగ్స్ చూడవచ్చు, రైతులను సంప్రదించవచ్చు, చెల్లింపు స్థితి తెలుసుకోవచ్చు, మ్యాప్ లో లొకేషన్ ఓపెన్ చేయవచ్చు.",
      heroBadge: "వేగంగా • సులభంగా • మొబైల్‌కు అనుకూలం",
      farmerTab: "రైతు బుకింగ్",
      leaderTab: "లీడర్ డాష్‌బోర్డ్",
      bookLabour: "కూలీలను బుక్ చేయండి",
      bookLabourDesc:
        "రైతు వివరాలు నమోదు చేసి అందుబాటులో ఉన్న కూలీల బ్యాచ్‌ను బుక్ చేయండి.",
      farmerName: "రైతు పేరు",
      farmerNamePlaceholder: "రైతు పేరు నమోదు చేయండి",
      date: "తేదీ",
      village: "గ్రామం",
      villagePlaceholder: "గ్రామం పేరు నమోదు చేయండి",
      workType: "పని రకం",
      selectWorkType: "పని రకం ఎంచుకోండి",
      work1: "టమోటా పెరకడం",
      work2: "చెట్లు తొగడం",
      work3: "పుర్రి కట్టడం",
      work4: "మల్చింగ్ పేపర్ వేయడం, కట్టి నాటడం",
      work5: "ఇతర పని",
      landmark: "ల్యాండ్‌మార్క్ / ఫీల్డ్ పేరు",
      landmarkPlaceholder: "ఫీల్డ్ లేదా గుర్తు నమోదు చేయండి",
      phone: "ఫోన్ నంబర్",
      phonePlaceholder: "ఫోన్ నంబర్ నమోదు చేయండి",
      labourCount: "అవసరమైన కూలీల సంఖ్య",
      labourCountPlaceholder: "కూలీల సంఖ్య నమోదు చేయండి",
      selectBatch: "బ్యాచ్ ఎంచుకోండి",
      location: "లొకేషన్",
      useMyLocation: "📍 నా ప్రస్తుత స్థానం",
      mapPlaceholder: "గూగుల్ మ్యాప్ లింక్ (ఐచ్చికం)",
      bookButton: "బుక్ చేయండి",
      gettingLocation: "ప్రస్తుత లొకేషన్ తీసుకుంటోంది...",
      locationAdded: "ప్రస్తుత లొకేషన్ విజయవంతంగా చేర్చబడింది",
      locationNotSupported: "ఈ డివైస్/బ్రౌజర్‌లో లొకేషన్ సపోర్ట్ లేదు",
      locationFailed: "ప్రస్తుత లొకేషన్ పొందలేకపోయాం",
      fillRequired: "అన్ని అవసరమైన వివరాలు నమోదు చేయండి",
      bookingSuccess: "బుకింగ్ విజయవంతమైంది",

      leaderTitle: "లీడర్ డాష్‌బోర్డ్",
      leaderDesc:
        "బుకింగ్స్ చూడండి, రైతులను సంప్రదించండి, లొకేషన్ చూడండి, చెల్లింపును అప్‌డేట్ చేయండి.",
      leaderAccessTitle: "లీడర్ యాక్సెస్",
      leaderAccessDesc: "మీ బ్యాచ్ ఎంచుకుని లీడర్ PIN ఇచ్చి డాష్‌బోర్డ్ ఓపెన్ చేయండి",
      leaderPin: "లీడర్ PIN",
      leaderPinPlaceholder: "లీడర్ PIN నమోదు చేయండి",
      leaderLogin: "లాగిన్",
      leaderLogout: "లాగౌట్",
      invalidLeaderPin: "తప్పు లీడర్ PIN",
      unauthorizedLeader: "అనుమతి లేని లీడర్ యాక్సెస్",
      selectBatchAndPin: "దయచేసి బ్యాచ్ ఎంచుకుని PIN నమోదు చేయండి",
      showBookings: "బుకింగ్స్ చూపించు",
      totalBookings: "మొత్తం బుకింగ్స్",
      labourNeeded: "అవసరమైన కూలీలు",
      paid: "చెల్లించినవి",
      pending: "పెండింగ్",
      noBookings:
        "బుకింగ్స్ లేవు. తేదీ ఎంచుకుని వివరాలు చూడండి.",
      callFarmer: "రైతుకు కాల్ చేయండి",
      openMap: "మ్యాప్ ఓపెన్ చేయండి",
      noLocation: "లొకేషన్ ఇవ్వలేదు",
      batch: "బ్యాచ్",
      paymentStatus: "చెల్లింపు స్థితి",
      markPaid: "PAID గా మార్చు",
      paidDone: "Paid ✔",
      footer:
        "పరమటపల్లి గ్రామ కూలీల బుకింగ్ యాప్ • గ్రామ కూలీల సమన్వయం కోసం రూపొందించబడింది • రూపొందించినవారు Dumbu (Prasad Reddy)"
    }
  };

  const text = t[lang];

  useEffect(() => {
    getBatches().then(setBatches);
  }, []);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setMessage(text.locationNotSupported);
      setMessageType("error");
      return;
    }

    setMessage(text.gettingLocation);
    setMessageType("success");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const link = `https://www.google.com/maps?q=${lat},${lng}`;
        setMapLink(link);
        setMessage(text.locationAdded);
        setMessageType("success");
      },
      () => {
        setMessage(text.locationFailed);
        setMessageType("error");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleLeaderAccess = async () => {
    setLeaderMessage("");
    setLeaderMessageType("");

    if (!leaderBatchId || !leaderPin) {
      setLeaderMessage(text.selectBatchAndPin);
      setLeaderMessageType("error");
      return;
    }

    const data = await getBookings(leaderBatchId, "", leaderPin);

    if (data?.error) {
      setLeaderAuthenticated(false);
      setLeaderMessage(
        data.error === "Unauthorized leader access"
          ? text.unauthorizedLeader
          : data.error
      );
      setLeaderMessageType("error");
      return;
    }

    setLeaderAuthenticated(true);
    setLeaderBookings([]);
    setLeaderDate("");
  };

  const handleLeaderLogout = () => {
    setLeaderAuthenticated(false);
    setLeaderPin("");
    setLeaderBatchId("");
    setLeaderDate("");
    setLeaderBookings([]);
    setLeaderMessage("");
    setLeaderMessageType("");
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
      setMessage(text.fillRequired);
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

    setMessage(text.bookingSuccess);
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
    setLeaderMessage("");
    setLeaderMessageType("");

    const data = await getBookings(leaderBatchId, leaderDate, leaderPin);

    if (data?.error) {
      setLeaderMessage(
        data.error === "Unauthorized leader access"
          ? text.unauthorizedLeader
          : data.error
      );
      setLeaderMessageType("error");
      setLeaderBookings([]);
      return;
    }

    setLeaderBookings(Array.isArray(data) ? data : []);
  };

  const handleMarkPaid = async (pk) => {
    const res = await markPaymentPaid(pk, leaderBatchId, leaderPin);

    if (res?.error) {
      alert(
        res.error === "Unauthorized leader access"
          ? text.unauthorizedLeader
          : res.error
      );
      return;
    }

    const updated = await getBookings(leaderBatchId, leaderDate, leaderPin);

    if (updated?.error) {
      setLeaderMessage(
        updated.error === "Unauthorized leader access"
          ? text.unauthorizedLeader
          : updated.error
      );
      setLeaderMessageType("error");
      return;
    }

    setLeaderBookings(Array.isArray(updated) ? updated : []);
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
          <div style={{ flex: 1 }}>
            <h1 style={styles.title}>{text.title}</h1>
            <p style={styles.subtitle}>{text.subtitle}</p>
          </div>

          <div style={styles.heroRight}>
            <button
              style={styles.langButton}
              onClick={() => setLang(lang === "en" ? "te" : "en")}
            >
              {lang === "en" ? "తెలుగు" : "English"}
            </button>
            <div style={styles.heroBadge}>{text.heroBadge}</div>
          </div>
        </div>

        <div style={styles.tabWrapper}>
          <button
            style={activeTab === "farmer" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("farmer")}
          >
            {text.farmerTab}
          </button>

          <button
            style={activeTab === "leader" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("leader")}
          >
            {text.leaderTab}
          </button>
        </div>

        {activeTab === "farmer" && (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <h2 style={styles.cardTitle}>{text.bookLabour}</h2>
                <p style={styles.cardSubtitle}>{text.bookLabourDesc}</p>
              </div>
            </div>

            {message && (
              <div style={messageType === "success" ? styles.success : styles.error}>
                {message}
              </div>
            )}

            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>{text.farmerName}</label>
                <input
                  style={styles.input}
                  placeholder={text.farmerNamePlaceholder}
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>{text.date}</label>
                <input
                  style={styles.input}
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>{text.village}</label>
                <input
                  style={styles.input}
                  placeholder={text.villagePlaceholder}
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>{text.workType}</label>
                <select
                  style={styles.input}
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                >
                  <option value="">{text.selectWorkType}</option>
                  <option value="Tomato perakadam">{text.work1}</option>
                  <option value="Chetlu thogadam">{text.work2}</option>
                  <option value="Purri kattadam">{text.work3}</option>
                  <option value="Mulching paper veyadam, katti natadam">
                    {text.work4}
                  </option>
                  <option value="Other work">{text.work5}</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>{text.landmark}</label>
                <input
                  style={styles.input}
                  placeholder={text.landmarkPlaceholder}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>{text.phone}</label>
                <input
                  style={styles.input}
                  placeholder={text.phonePlaceholder}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>{text.labourCount}</label>
                <input
                  style={styles.input}
                  type="number"
                  min="1"
                  placeholder={text.labourCountPlaceholder}
                  value={labourCount}
                  onChange={(e) => setLabourCount(e.target.value)}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>{text.selectBatch}</label>
                <select
                  style={styles.input}
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                >
                  <option value="">{text.selectBatch}</option>
                  {batches.map((b) => (
                    <option key={b.batchId} value={b.batchId}>
                      {b.batchId} - {b.leaderName}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
                <label style={styles.label}>{text.location}</label>
                <div style={styles.locationRow}>
                  <button
                    type="button"
                    style={styles.locationButton}
                    onClick={handleUseLocation}
                  >
                    {text.useMyLocation}
                  </button>
                </div>
                <input
                  style={{ ...styles.input, marginTop: "12px" }}
                  placeholder={text.mapPlaceholder}
                  value={mapLink}
                  onChange={(e) => setMapLink(e.target.value)}
                />
              </div>
            </div>

            <button style={styles.primaryButton} onClick={submit}>
              {text.bookButton}
            </button>
          </div>
        )}

        {activeTab === "leader" && (
          <div style={styles.card}>
            {!leaderAuthenticated ? (
              <>
                <div style={styles.cardHeader}>
                  <div>
                    <h2 style={styles.cardTitle}>{text.leaderAccessTitle}</h2>
                    <p style={styles.cardSubtitle}>{text.leaderAccessDesc}</p>
                  </div>
                </div>

                {leaderMessage && (
                  <div
                    style={
                      leaderMessageType === "success" ? styles.success : styles.error
                    }
                  >
                    {leaderMessage}
                  </div>
                )}

                <div style={styles.leaderLoginBox}>
                  <div style={styles.field}>
                    <label style={styles.label}>{text.selectBatch}</label>
                    <select
                      style={styles.input}
                      value={leaderBatchId}
                      onChange={(e) => setLeaderBatchId(e.target.value)}
                    >
                      <option value="">{text.selectBatch}</option>
                      {batches.map((b) => (
                        <option key={b.batchId} value={b.batchId}>
                          {b.batchId} - {b.leaderName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.field}>
                    <label style={styles.label}>{text.leaderPin}</label>
                    <input
                      style={styles.input}
                      type="password"
                      placeholder={text.leaderPinPlaceholder}
                      value={leaderPin}
                      onChange={(e) => setLeaderPin(e.target.value)}
                    />
                  </div>

                  <button style={styles.primaryButton} onClick={handleLeaderAccess}>
                    {text.leaderLogin}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={styles.cardHeaderRow}>
                  <div>
                    <h2 style={styles.cardTitle}>{text.leaderTitle}</h2>
                    <p style={styles.cardSubtitle}>{text.leaderDesc}</p>
                  </div>

                  <button style={styles.logoutButton} onClick={handleLeaderLogout}>
                    {text.leaderLogout}
                  </button>
                </div>

                {leaderMessage && (
                  <div
                    style={
                      leaderMessageType === "success" ? styles.success : styles.error
                    }
                  >
                    {leaderMessage}
                  </div>
                )}

                <div style={styles.grid}>
                  <div style={styles.field}>
                    <label style={styles.label}>{text.selectBatch}</label>
                    <input
                      style={styles.input}
                      value={leaderBatchId}
                      readOnly
                    />
                  </div>

                  <div style={styles.field}>
                    <label style={styles.label}>{text.date}</label>
                    <input
                      style={styles.input}
                      type="date"
                      value={leaderDate}
                      onChange={(e) => setLeaderDate(e.target.value)}
                    />
                  </div>
                </div>

                <button style={styles.primaryButton} onClick={loadLeaderBookings}>
                  {text.showBookings}
                </button>

                {leaderBookings.length > 0 && (
                  <div style={styles.summaryGrid}>
                    <div style={styles.summaryCard}>
                      <div style={styles.summaryLabel}>{text.totalBookings}</div>
                      <div style={styles.summaryValue}>{leaderBookings.length}</div>
                    </div>

                    <div style={styles.summaryCard}>
                      <div style={styles.summaryLabel}>{text.labourNeeded}</div>
                      <div style={styles.summaryValue}>{totalLabour}</div>
                    </div>

                    <div style={styles.summaryCard}>
                      <div style={styles.summaryLabel}>{text.paid}</div>
                      <div style={styles.summaryValue}>{paidCount}</div>
                    </div>

                    <div style={styles.summaryCard}>
                      <div style={styles.summaryLabel}>{text.pending}</div>
                      <div style={styles.summaryValue}>{pendingCount}</div>
                    </div>
                  </div>
                )}

                <div style={{ marginTop: "20px" }}>
                  {leaderBookings.length === 0 ? (
                    <div style={styles.emptyState}>{text.noBookings}</div>
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
                          <div style={styles.workBadge}>
                            {booking.workType || text.work5}
                          </div>
                        </div>

                        <div style={styles.detailGrid}>
                          <div><b>{text.batch}:</b> {booking.batchId}</div>
                          <div><b>{text.labourCount}:</b> {booking.labourCount || "-"}</div>
                          <div><b>{text.phone}:</b> {booking.phone}</div>
                          <div><b>{text.landmark}:</b> {booking.address}</div>
                        </div>

                        <div style={styles.actionRow}>
                          <a href={`tel:${booking.phone}`} style={styles.callButton}>
                            {text.callFarmer}
                          </a>

                          {booking.mapLink ? (
                            <a
                              href={booking.mapLink}
                              target="_blank"
                              rel="noreferrer"
                              style={styles.mapButton}
                            >
                              {text.openMap}
                            </a>
                          ) : (
                            <span style={styles.noMapText}>{text.noLocation}</span>
                          )}
                        </div>

                        <div style={styles.paymentRow}>
                          <span style={styles.paymentLabel}>{text.paymentStatus}:</span>

                          {booking.paymentStatus === "PAID" ? (
                            <span style={styles.paidBadge}>{text.paidDone}</span>
                          ) : (
                            <button
                              style={styles.paidButton}
                              onClick={() => handleMarkPaid(booking.pk)}
                            >
                              {text.markPaid}
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        )}

        <div style={styles.footer}>{text.footer}</div>
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
  heroRight: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "flex-end"
  },
  langButton: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700"
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
    fontSize: "15px",
    lineHeight: "1.6"
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
  cardHeaderRow: {
    marginBottom: "18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    flexWrap: "wrap"
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
    fontSize: "14px",
    lineHeight: "1.6"
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
  logoutButton: {
    background: "#475569",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700"
  },
  leaderLoginBox: {
    maxWidth: "420px"
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
    paddingBottom: "12px",
    lineHeight: "1.6"
  }
};

export default App;
