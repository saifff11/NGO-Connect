import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { volunteerService } from "../../services/volunteerService";
import RoleBasedNavbar from "../../components/RoleBasedNavbar";

const VolunteerCampaigns = () => {
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 AUTH CHECK
  useEffect(() => {
    const currentUser = authService.getCurrentUser();

    if (!currentUser || currentUser.role !== "volunteer") {
      navigate("/login");
      return;
    }

    fetchCampaigns();
  }, []);

  // 📥 FETCH CAMPAIGNS FOR VOLUNTEERS
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await volunteerService.getCampaigns();
      setCampaigns(res.data || []);
    } catch (err) {
      console.error("Failed to load campaigns:", err);
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

          {/* Campaign List */}
          <div className="glass-card p-6">
            {loading ? (
              <div className="text-center text-white/70 py-20">
                Loading campaigns...
              </div>
            ) : campaigns.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No campaigns available
                </h3>
                <p className="text-white/70">
                  NGOs will post volunteer campaigns soon.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="glass-card hover:scale-105 transition-transform"
                  >
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-white">
                        {campaign.title}
                      </h3>

                      <p className="text-white/70 text-sm line-clamp-3">
                        {campaign.description}
                      </p>

                      <div className="text-sm text-white/60">
                        NGO: {campaign.ngo_name}
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/60">
                          📅 Ends: {campaign.end_date}
                        </span>
                        <span className="text-green-400 font-semibold">
                          Active
                        </span>
                      </div>

                      <Link
                        to={`/campaign/${campaign.id}`}
                        className="glass-button text-white hover:bg-white hover:text-gray-800 text-center block"
                      >
                        View Campaign
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerCampaigns;
