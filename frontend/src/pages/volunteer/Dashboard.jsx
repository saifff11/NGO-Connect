import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../services/authService";
import { volunteerService } from "../../services/volunteerService";
import RoleBasedNavbar from "../../components/RoleBasedNavbar";

const VolunteerDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    campaignsJoined: 2,
    ngosAssociated: 3,
    tasksCompleted: 0,
    hoursContributed: 4,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();

    if (!currentUser || currentUser.role !== "volunteer") {
      window.location.href = "/login";
      return;
    }

    setUser(currentUser);
    fetchVolunteerDashboard();
  }, []);

  // ✅ REAL BACKEND CALL
  const fetchVolunteerDashboard = async () => {
    try {
      setLoading(true);

      const res = await volunteerService.getDashboard();

      setStats({
        campaignsJoined: res.data.campaigns_joined,
        ngosAssociated: res.data.ngos_associated,
        tasksCompleted: res.data.tasks_completed,
        hoursContributed: res.data.hours_contributed,
      });
    } catch (error) {
      console.error("Error loading volunteer dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg">
      <RoleBasedNavbar userRole="volunteer" />

      <div className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Volunteer Dashboard 🤝
            </h1>
            <p className="text-white/70">
              Track your contributions and impact with NGOs
            </p>
          </div>

          {/* Welcome */}
          <div className="glass-card mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Welcome, {user?.first_name}! 🌟
              </h2>
              <p className="text-white/70">
                Thank you for volunteering your time and skills.
              </p>
            </div>
            <div className="text-right">
              <div className="text-white/60 text-sm">Volunteer ID</div>
              <div className="text-white font-mono">
                {String(user?.id).slice(-6)}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Campaigns Joined"
              value={loading ? "..." : stats.campaignsJoined}
            />
            <StatCard
              title="NGOs Associated"
              value={loading ? "..." : stats.ngosAssociated}
            />
            <StatCard
              title="Tasks Completed"
              value={loading ? "..." : stats.tasksCompleted}
            />
            <StatCard
              title="Hours Contributed"
              value={loading ? "..." : stats.hoursContributed}
            />
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <QuickCard
              icon="🔍"
              title="Browse Campaigns"
              description="Find campaigns that need volunteers"
              link="/volunteer/campaigns"
            />
            <QuickCard
              icon="🏢"
              title="Explore NGOs"
              description="Connect with NGOs you care about"
              link="/volunteer/ngos"
            />
            <QuickCard
              icon="📋"
              title="My Tasks"
              description="View and manage assigned tasks"
              link="/volunteer/tasks"
            />
          </div>

          {/* Activity (static for now – acceptable for demo) */}
          <div className="glass-card">
            <h3 className="text-xl font-semibold text-white mb-4">
              Recent Activity
            </h3>

            <div className="space-y-3">
              <ActivityItem text="Joined an NGO campaign" time="2 days ago" />
              <ActivityItem text="Completed a volunteer task" time="5 days ago" />
              <ActivityItem text="Assigned a new task" time="1 week ago" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Components ---------- */

const StatCard = ({ title, value }) => (
  <div className="glass-card text-center">
    <div className="text-3xl font-bold text-white mb-2">{value}</div>
    <div className="text-white/70">{title}</div>
  </div>
);

const QuickCard = ({ icon, title, description, link }) => (
  <div className="glass-card group hover:scale-105 transition">
    <div className="text-center space-y-4">
      <div className="text-4xl">{icon}</div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-white/70">{description}</p>
      <Link
        to={link}
        className="glass-button text-white hover:bg-white hover:text-gray-800 block"
      >
        Open
      </Link>
    </div>
  </div>
);

const ActivityItem = ({ text, time }) => (
  <div className="flex justify-between border-b border-white/10 pb-2">
    <span className="text-white/70">{text}</span>
    <span className="text-white/50 text-sm">{time}</span>
  </div>
);

export default VolunteerDashboard;
