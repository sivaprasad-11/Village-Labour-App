import React, { useEffect, useState } from "react";
import { getBatches, bookBatch } from "./api";

export default function App() {

  const [batches, setBatches] = useState([]);

  const [farmerName, setFarmerName] = useState("");

  const [date, setDate] = useState("");

  const [selectedBatch, setSelectedBatch] = useState("");

  useEffect(() => {

    getBatches().then(setBatches);

  }, []);

  const book = async () => {

    await bookBatch({
      batchId: selectedBatch,
      date,
      farmerName
    });

    alert("Booking done");

  };

  return (

    <div>

      <h3>Farmer Booking</h3>

      <input
        placeholder="Farmer Name"
        onChange={e => setFarmerName(e.target.value)}
      />

      <br/><br/>

      <input
        type="date"
        onChange={e => setDate(e.target.value)}
      />

      <br/><br/>

      <select onChange={e => setSelectedBatch(e.target.value)}>

        <option>Select Batch</option>

        {batches.map(b => (
          <option key={b.batchId} value={b.batchId}>
            {b.batchId} - {b.leaderName}
          </option>
        ))}

      </select>

      <br/><br/>

      <button onClick={book}>
        Book Labour
      </button>

    </div>

  );

}