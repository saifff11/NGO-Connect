import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../services/authService";
import { campaignService } from "../../services/campaignService";
import RoleBasedNavbar from "../../components/RoleBasedNavbar";
import { donationService } from "../../services/donationService";

const NGODashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalDonations: 0,
    totalAmount: 0,
    volunteersEngaged: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();

    if (!currentUser || currentUser.role !== "ngo") {
      window.location.href = "/login";
      return;
    }

    setUser(currentUser);
    fetchNGOData(currentUser.id);
  }, []);

  const fetchNGOData = async (ngoUserId) => {
    try {
      setLoading(true);

      /* ---------- Campaigns ---------- */
      let campaigns = [];
      try {
        const campaignsRes = await campaignService.getAll();
        campaigns = campaignsRes?.data || [];
      } catch (err) {
        console.warn("Campaign API not ready");
      }

      const ngoCampaigns = campaigns.filter((c) => c.ngo_id === ngoUserId);

      /* ---------- Donations ---------- */
      let donations = [];
      try {
        const donationRes = await donationService.getNGODonations();
        donations = donationRes?.data || [];
      } catch (err) {
        console.warn("Donation API not ready");
      }

      const totalAmount = donations.reduce(
        (sum, d) => sum + Number(d.amount || 0),
        0,
      );

      /* ---------- Volunteers (estimated) ---------- */
      const volunteersEngaged = ngoCampaigns.reduce(
        (sum, c) => sum + (c.volunteer_count || 0),
        0,
      );

      setStats({
        totalCampaigns: ngoCampaigns.length,
        totalDonations: donations.length,
        totalAmount: totalAmount,
        volunteersEngaged: volunteersEngaged,
      });
    } catch (err) {
      console.error("Error fetching NGO data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg">
      <RoleBasedNavbar userRole="ngo" />

      <div className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              NGO Dashboard 🏛️
            </h1>
            <p className="text-white/70">
              Manage campaigns and track your organization's impact
            </p>
          </div>

          {/* Welcome Card */}
          <div className="glass-card mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome back, {user?.first_name}! 🌟
                </h2>
                <p className="text-white/70">
                  Your organization is making a difference in education.
                </p>
              </div>

              <div className="text-right">
                <div className="text-white/70 text-sm">NGO ID</div>
                <div className="text-white font-mono">
                  {user?.id ? String(user.id).padStart(8, "0") : "--------"}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <StatCard
              label="Active Campaigns"
              value={stats.totalCampaigns}
              loading={loading}
            />
            <StatCard
              label="Total Donations"
              value={stats.totalDonations}
              loading={loading}
            />
            <StatCard
              label="Amount Raised"
              value={`₹${stats.totalAmount.toLocaleString()}`}
              loading={loading}
            />
            <StatCard
              label="Volunteers Engaged"
              value={stats.volunteersEngaged}
              loading={loading}
            />
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <QuickCard
              icon="📝"
              title="Create Campaign"
              link="/ngo/campaigns/create"
            />
            <QuickCard icon="📊" title="My Campaigns" link="/ngo/campaigns" />
            <QuickCard icon="💰" title="Donations" link="/ngo/donations" />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, loading }) => (
  <div className="glass-card text-center">
    <div className="text-3xl font-bold text-white mb-2">
      {loading ? "..." : value}
    </div>
    <div className="text-white/70">{label}</div>
  </div>
);

const QuickCard = ({ icon, title, link }) => (
  <div className="glass-card group hover:scale-105 transition-transform duration-300">
    <div className="text-center space-y-4">
      <div className="text-4xl">{icon}</div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <Link to={link} className="glass-button text-white block">
        Open
      </Link>
    </div>
  </div>
);

export default NGODashboard;
