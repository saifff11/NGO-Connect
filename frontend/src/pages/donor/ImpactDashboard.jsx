import { useEffect, useState } from "react";
import api from "../../services/apiService";
import RoleBasedNavbar from "../../components/RoleBasedNavbar";
import Navbar from "../../components/Navbar";

export default function ImpactDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/campaigns/impact/")
      .then(res => setData(res.data.impact))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen animated-bg">
      <Navbar />

      <div className="pt-20 px-4 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          Impact Dashboard 🌍
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {data.map((item, i) => (
            <div key={i} className="glass-card">
              <h3 className="text-xl font-semibold text-white">
                {item.campaign}
              </h3>

              <p className="text-white/70 mt-2">
                ₹{item.raised_amount} raised
              </p>

              <p className="text-green-400 text-lg font-bold mt-3">
                {item.impact_value} {item.metric}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
