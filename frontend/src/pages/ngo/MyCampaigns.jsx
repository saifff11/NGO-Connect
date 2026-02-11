import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../services/authService";
import { campaignService } from "../../services/campaignService";
import RoleBasedNavbar from "../../components/RoleBasedNavbar";

const MyCampaigns = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 NGO AUTH CHECK
  useEffect(() => {
    const currentUser = authService.getCurrentUser();

    if (!currentUser || currentUser.role !== "ngo") {
      navigate("/login");
      return;
    }

    setUser(currentUser);
    fetchCampaigns();
  }, []);

  // 📊 FETCH NGO CAMPAIGNS (SAFE)
  const fetchCampaigns = async () => {
    try {
      setLoading(true);

      const res = await campaignService.getMyCampaigns();

      // backend already returns NGO-specific campaigns
      setCampaigns(res.data || []);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                My Campaigns 📊
              </h1>
              <p className="text-white/70">
                Manage all campaigns created by your NGO
              </p>
            </div>

            <Link
              to="/ngo/campaigns/create"
              className="glass-button text-white"
            >
              + Create Campaign
            </Link>
          </div>

          {/* Campaign List */}
          {loading ? (
            <div className="text-white/70">Loading campaigns...</div>
          ) : campaigns.length === 0 ? (
            <div className="glass-card text-center p-10">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No campaigns yet
              </h3>
              <p className="text-white/70 mb-4">
                Start your first campaign and help students today.
              </p>
              <Link
                to="/ngo/campaigns/create"
                className="glass-button text-white"
              >
                Create First Campaign
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="glass-card p-5">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {campaign.title}
                  </h3>

                  <p className="text-white/70 text-sm mb-4 line-clamp-3">
                    {campaign.description || "No description provided"}
                  </p>

                  <div className="space-y-1 text-white/70 text-sm mb-4">
                    <div>🎯 Target: ₹{campaign.target_amount || 0}</div>
                    <div>📅 Deadline: {campaign.end_date || "N/A"}</div>
                    <div>📂 Category: {campaign.category || "General"}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/ngo/campaigns/${campaign.id}`}
                      className="text-blue-300 hover:underline text-sm"
                    >
                      View Details
                    </Link>

                    <div className="flex gap-2">
                      <button className="text-yellow-300 text-sm hover:underline">
                        Edit
                      </button>
                      <button className="text-red-400 text-sm hover:underline">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCampaigns;
