import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function History({ refreshTrigger, user }) {
  const [data, setData] = useState([]);

  const fetchHistory = () => {
    fetch(`http://127.0.0.1:5000/history?email=${user.email}&role=${user.role}`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const clearHistory = async () => {
    await fetch("http://127.0.0.1:5000/clear-history", {
      method: "DELETE",
    });
    fetchHistory();
  };

  return (
    <div className="history-container">

      <div style={{ display: "flex", justifyContent: "center", gap: "20px", alignItems: "center" }}>
        <h2 className="history-title">📊 Prediction History</h2>

        <button className="glass-btn" onClick={clearHistory}>
          Clear History
        </button>
      </div>

      {data.length === 0 && <p style={{ color: "white" }}>No history yet</p>}

      <motion.div
        className="history-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {[...data].reverse().map((item, index) => (
          <motion.div
            key={index}
            className="history-card"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className={item.disease === "healthy" ? "healthy" : "disease"}>
              {item.disease}
            </h3>

            <p><b>Confidence:</b> {item.confidence || "N/A"}%</p>
            <p className="time">{item.timestamp || "No time"}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default History;