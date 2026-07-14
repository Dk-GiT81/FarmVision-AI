import React, { useState } from "react";
import { motion } from "framer-motion";

function Upload({ setRefreshTrigger, user }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
  if (!file) {
    alert("Please select an image");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("email", user.email); // 👈 ADD THIS

  setLoading(true);

  try {
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setResult(data);
    setRefreshTrigger(prev => prev + 1);

  } catch (error) {
    alert("Error connecting to backend");
  }

  setLoading(false);
};

  return (
    <div style={{
      paddingBottom: "40px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: "40px"
    }}>

      <div style={{
        display: "flex",
        gap: "30px",
        flexWrap: "wrap"
      }}>

        {/* LEFT CARD */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          style={{
            backdropFilter: "blur(15px)",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "15px",
            padding: "25px",
            width: "300px",
            color: "#fff"
          }}
        >
          <h3>Upload Image</h3>

          <input type="file" onChange={handleFileChange} />

          {preview && (
            <motion.img
              src={preview}
              alt="preview"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              style={{
                width: "200px",
                marginTop: "15px",
                borderRadius: "10px"
              }}
            />
          )}

          <br /><br />

          <button
            onClick={handleUpload}
            disabled={loading}
            className="predict-btn"
          >
            {loading ? "Processing..." : "Predict"}
          </button>
        </motion.div>

        {/* RIGHT CARD */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          style={{
            backdropFilter: "blur(15px)",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "15px",
            padding: "25px",
            width: "350px",
            color: "#fff"
          }}
        >
          <h3>Prediction Result</h3>

          {!result && <p>No prediction yet</p>}

          {result && (
            <div>
              <h3 style={{
                color: result.disease === "healthy" ? "#00ff88" : "#ff4d4d"
              }}>
                {result.disease.toUpperCase()}
              </h3>

              <p><b>Confidence:</b> {result.confidence}%</p>
              <p><b>Diagnosis:</b> {result.diagnosis}</p>
              <p><b>Pesticide:</b> {result.recommended_pesticide}</p>
              <p><b>Precaution:</b> {result.precaution}</p>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}

export default Upload;