import { useEffect, useState } from "react";
import { campaignService } from "../../services/campaignService";
import { useNavigate } from "react-router-dom";
import RoleBasedNavbar from "../../components/RoleBasedNavbar";

const DonorCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await campaignService.getPublicCampaigns();
      setCampaigns(res.data || []);
    } catch (err) {
      console.error("Failed to fetch campaigns", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg">
      <RoleBasedNavbar userRole="donor" />

      <div className="pt-20 px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          Browse Campaigns 🔍
        </h1>

        {loading ? (
          <p className="text-white/70">Loading campaigns...</p>
        ) : campaigns.length === 0 ? (
          <p className="text-white/70">No campaigns available</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((c) => {
              const progress = Math.min(
                (c.raised_amount / c.target_amount) * 100,
                100
              );

              return (
                <div key={c.id} className="glass-card p-5">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {c.title}
                  </h3>

                  <p className="text-white/70 text-sm mb-3 line-clamp-2">
                    {c.description}
                  </p>

                  <div className="mb-2">
                    <div className="h-2 bg-white/20 rounded">
                      <div
                        className="h-2 bg-green-400 rounded"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-white/70 mt-1">
                      ₹{c.raised_amount} raised of ₹{c.target_amount}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/donor/campaigns/${c.id}/donate`)
                    }
                    className="glass-button w-full text-white mt-3"
                  >
                    Donate Now
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorCampaigns;
