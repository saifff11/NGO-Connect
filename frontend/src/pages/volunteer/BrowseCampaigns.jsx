import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../services/authService";
import { campaignService } from "../../services/campaignService";
import RoleBasedNavbar from "../../components/RoleBasedNavbar";
import { volunteerService } from "../../services/volunteerService";

const BrowseCampaigns = () => {
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();

    if (!currentUser || currentUser.role !== "volunteer") {
      window.location.href = "/login";
      return;
    }

    setUser(currentUser);
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await volunteerService.getAll();

      // Safe fallback if API not fully ready
      setCampaigns(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setCampaigns([]);
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
              Browse Campaigns 🔍
            </h1>
            <p className="text-white/70">
              Discover campaigns where you can contribute as a volunteer
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center text-white/70 mt-20">
              Loading campaigns...
            </div>
          )}

          {/* Empty State */}
          {!loading && campaigns.length === 0 && (
            <div className="glass-card text-center mt-20">
              <h2 className="text-2xl font-semibold text-white mb-2">
                No Campaigns Available
              </h2>
              <p className="text-white/70">
                Please check back later. NGOs will post new campaigns soon.
              </p>
            </div>
          )}

          {/* Campaign List */}
          {!loading && campaigns.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------------- Campaign Card ---------------- */

const CampaignCard = ({ campaign }) => {
  const handleApply = async () => {
    try {
      await volunteerService.applyToCampaign(campaign.id);
      alert("Applied successfully 🤝");
    } catch (err) {
      alert(err.response?.data?.detail || "Already applied");
    }
  };

  return (
    <div className="glass-card hover:scale-105 transition-transform duration-300">
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-white">{campaign.title}</h3>

        <p className="text-white/70 text-sm line-clamp-3">
          {campaign.description}
        </p>

        <button
          onClick={handleApply}
          className="glass-button text-white hover:bg-white hover:text-gray-800 w-full"
        >
          Apply as Volunteer
        </button>
      </div>
    </div>
  );
};

export default BrowseCampaigns;
