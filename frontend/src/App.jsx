import { useEffect, useState } from "react";
import { getBatches, bookBatch } from "./api";

function App() {
  const [batches, setBatches] = useState([]);
  const [farmerName, setFarmerName] = useState("");
  const [date, setDate] = useState("");
  const [batchId, setBatchId] = useState("");
  const [village, setVillage] = useState("");
  const [workType, setWorkType] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    getBatches().then(setBatches);
  }, []);

  const submit = async () => {
    await bookBatch({
      farmerName,
      date,
      batchId,
      village,
      workType,
      address,
      phone
    });

    alert("Booking done");
  };

  return (
    <div>
      <h1>Village Labour Booking App</h1>

      <h2>Farmer Booking</h2>

      <input
        placeholder="Farmer Name"
        value={farmerName}
        onChange={(e) => setFarmerName(e.target.value)}
      />

      <br/><br/>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <br/><br/>

      <input
        placeholder="Village"
        value={village}
        onChange={(e) => setVillage(e.target.value)}
      />

      <br/><br/>

      <input
        placeholder="Work Type"
        value={workType}
        onChange={(e) => setWorkType(e.target.value)}
      />

      <br/><br/>

      <input
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <br/><br/>

      <input
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <br/><br/>

      <select onChange={(e) => setBatchId(e.target.value)}>
        <option>Select Batch</option>

        {batches.map((b) => (
          <option key={b.batchId} value={b.batchId}>
            {b.batchId} - {b.leaderName}
          </option>
        ))}
      </select>

      <br/><br/>

      <button onClick={submit}>Book Labour</button>
    </div>
  );
}

export default App;