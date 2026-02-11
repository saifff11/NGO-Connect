import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { adminAnalyticsService } from "../../services/adminAnalyticsService";
import RoleBasedNavbar from "../../components/RoleBasedNavbar";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const COLORS = ["#60a5fa", "#34d399", "#facc15", "#f87171"];

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const res = await adminAnalyticsService.getAnalytics();
    setData(res.data);
  };

  if (!data) {
    return <div className="text-white p-10">Loading analytics...</div>;
  }

  const roleData = [
    { name: "Donors", value: data.stats.donors },
    { name: "NGOs", value: data.stats.ngos },
    { name: "Volunteers", value: data.stats.volunteers },
  ];

  return (
    <div className="min-h-screen animated-bg">
      <RoleBasedNavbar userRole="admin" />

      <div className="pt-20 px-4 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          Platform Analytics 📊
        </h1>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <StatCard label="Total Users" value={data.stats.total_users} />
          <StatCard label="Active Campaigns" value={data.stats.active_campaigns} />
          <StatCard label="Total Donations" value={data.stats.total_donations} />
          <StatCard label="Total Raised" value={`₹${data.stats.total_amount}`} />
        </div>

        {/* CHARTS */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* BAR CHART */}
          <div className="glass-card h-96">
            <h3 className="text-white mb-4 font-semibold">
              Donations per Campaign
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.donations_by_campaign}>
                <XAxis dataKey="campaign__title" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* PIE CHART */}
          <div className="glass-card h-96">
            <h3 className="text-white mb-4 font-semibold">
              User Role Distribution
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >
                  {roleData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="glass-card text-center">
    <div className="text-3xl font-bold text-white mb-2">{value}</div>
    <div className="text-white/70">{label}</div>
  </div>
);

export default AdminAnalytics;
