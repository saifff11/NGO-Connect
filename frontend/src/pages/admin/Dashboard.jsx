import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../services/authService";
import { userService } from "../../services/userService";
import { campaignService } from "../../services/campaignService";
import { donationService } from "../../services/donationService";
import RoleBasedNavbar from "../../components/RoleBasedNavbar";
import { adminUserService } from "../../services/adminUserService";
import { adminAnalyticsService } from "../../services/adminAnalyticsService";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCampaigns: 0,
    totalDonations: 0,
    totalAmount: 0,
  });
  const [pending, setPending] = useState({
    pending_ngos: 0,
    pending_volunteers: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      window.location.href = "/login";
      return;
    }
    setUser(currentUser);
    fetchStats();
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const res = await adminAnalyticsService.getAnalytics();
    setData(res.data);
  };

  

  const fetchStats = async () => {
    try {
      setLoading(true);
      // In a real app, you'd have dedicated admin endpoints
      // For now, we'll use the existing endpoints
      const [ pendingRes] =
        await Promise.all([
          adminUserService.getPending(),
        ]);

    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!data) {
    return <div className="text-white p-10">Loading analytics...</div>;
  }

  return (
    <div className="min-h-screen animated-bg">
      <RoleBasedNavbar userRole="admin" />

      <div className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Admin Dashboard 👨‍💼
            </h1>
            <p className="text-white/70">
              Manage users, campaigns, and monitor platform activity
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {loading ? "..." : data.stats.total_users}
              </div>
              <div className="text-white/70">Total Users</div>
            </div>
            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {loading ? "..." : data.stats.active_campaigns}
              </div>
              <div className="text-white/70">Active Campaigns</div>
            </div>
            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {loading ? "..." : data.stats.total_donations}
              </div>
              <div className="text-white/70">Total Donations</div>
            </div>
            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {loading ? "..." : `₹${data.stats.total_amount}`}
              </div>
              <div className="text-white/70">Total Raised</div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-yellow-400">
                {pending.pending_ngos}
              </div>
              <div className="text-white/70">Pending NGO Approvals</div>
            </div>

            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-yellow-400">
                {pending.pending_volunteers}
              </div>
              <div className="text-white/70">Pending Volunteer Approvals</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="glass-card group hover:scale-105 transition-transform duration-300">
              <div className="text-center space-y-4">
                <div className="text-4xl">👥</div>
                <h3 className="text-xl font-semibold text-white">
                  User Management
                </h3>
                <p className="text-white/70">View and manage all users</p>
                <Link
                  to="/admin/users"
                  className="glass-button text-white hover:bg-white hover:text-gray-800 block"
                >
                  Manage Users
                </Link>
              </div>
            </div>

            <div className="glass-card group hover:scale-105 transition-transform duration-300">
              <div className="text-center space-y-4">
                <div className="text-4xl">📊</div>
                <h3 className="text-xl font-semibold text-white">Analytics</h3>
                <p className="text-white/70">
                  View detailed platform analytics
                </p>
                <Link
                  to="/admin/analytics"
                  className="glass-button text-white hover:bg-white hover:text-gray-800 block"
                >
                  View Analytics
                </Link>
              </div>
            </div>

            <div className="glass-card group hover:scale-105 transition-transform duration-300">
              <div className="text-center space-y-4">
                <div className="text-4xl">✅</div>
                <h3 className="text-xl font-semibold text-white">Approvals</h3>
                <p className="text-white/70">Review pending approvals</p>
                <Link
                  to="/admin/approvals"
                  className="glass-button text-white hover:bg-white hover:text-gray-800 block"
                >
                  Review Approvals
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card">
            <h3 className="text-xl font-semibold text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white/70">System running normally</span>
                </div>
                <span className="text-white/50 text-sm">Just now</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-white/70">
                    Database backup completed
                  </span>
                </div>
                <span className="text-white/50 text-sm">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-white/70">New user registrations</span>
                </div>
                <span className="text-white/50 text-sm">5 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
