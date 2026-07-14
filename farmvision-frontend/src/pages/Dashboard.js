import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

function Dashboard({user}) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/history?email=${user.email}&role=${user.role}`)
      .then(res => res.json())
.then(data => {
  console.log("DASHBOARD DATA:", data); 

  if (!data || data.length === 0) {
    setData([]);
    return;
  }

  const count = {};

  data.forEach(item => {
    if (item.disease) {
      count[item.disease] = (count[item.disease] || 0) + 1;
    }
  });

  const chartData = Object.keys(count).map(key => ({
    disease: key,
    count: count[key]
  }));

  console.log("CHART DATA:", chartData); 

  setData(chartData);
  });
  }, []);

  if (data.length === 0) {
  return (
    <div style={{ textAlign: "center", color: "white", marginTop: "40px" }}>
      <h3>No analytics data available yet</h3>
    </div>
  );
  }

  return (
    <div style={{
      width: "100%",
      maxWidth: "700px",
      margin: "40px auto",
      padding: "20px",
      borderRadius: "20px",
      backdropFilter: "blur(20px)",
      background: "rgba(255,255,255,0.1)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
    }}>
      <h2 style={{ color: "#fff", textAlign: "center" }}>
        📊 Disease Analytics
      </h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.2)" />
            
            <XAxis 
            dataKey="disease" 
            stroke="#ffffff"
            tick={{ fill: "#ffffff" }}
            />

            <YAxis 
              stroke="#ffffff"
              tick={{ fill: "#ffffff" }}
            />
            
            <Tooltip 
              contentStyle={{
                backgroundColor: "#222",
                border: "none",
                borderRadius: "10px",
                color: "#fff"
              }}
            />

            <Bar 
              dataKey="count" 
              fill="#00ffcc" 
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;