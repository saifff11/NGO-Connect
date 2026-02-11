import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { campaignService } from "../../services/campaignService";
import RoleBasedNavbar from "../../components/RoleBasedNavbar";

const DonorBrowseCampaigns = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await campaignService.getPublicCampaigns();
      setCampaigns(res.data || []);
    } catch (error) {
      console.error("Failed to load campaigns", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg">
      <RoleBasedNavbar userRole="donor" />

      <div className="pt-20 px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">
          Browse Campaigns 🔍
        </h1>
        <p className="text-white/70 mb-8">
          Discover meaningful campaigns and make a difference
        </p>

        {loading ? (
          <p className="text-white/70">Loading campaigns...</p>
        ) : campaigns.length === 0 ? (
          <p className="text-white/70">No campaigns available</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => {
              const percent =
                campaign.target_amount > 0
                  ? Math.min(
                      100,
                      Math.round(
                        (campaign.raised_amount / campaign.target_amount) * 100,
                      ),
                    )
                  : 0;

              return (
                <div key={campaign.id} className="glass-card p-6">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {campaign.title}
                  </h3>

                  <p className="text-white/70 text-sm mb-3 line-clamp-2">
                    {campaign.description}
                  </p>

                  <p className="text-sm text-white/60 mb-2">
                    Category: {campaign.category}
                  </p>

                  {/* Progress bar */}
                  <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                    <div
                      className="bg-green-400 h-2 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-sm text-white/70 mb-4">
                    <span>{percent}% raised</span>
                    <span>
                      ₹{campaign.raised_amount} / ₹{campaign.target_amount}
                    </span>
                  </div>

                  <Link
                    to={`/donor/campaigns/${campaign.id}/donate`}
                    className="glass-button w-full text-center"
                  >
                    Donate Now
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorBrowseCampaigns;
