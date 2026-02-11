import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { campaignService } from "../../services/campaignService";
import { donationService } from "../../services/donationService";
import RoleBasedNavbar from "../../components/RoleBasedNavbar";

const DonorDonate = () => {
  const { id } = useParams(); // campaign id
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState("");

  // 🔹 Fetch campaign details
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await campaignService.getPublicCampaigns();
        const found = res.data.find((c) => c.id === Number(id));
        setCampaign(found);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCampaign();
  }, [id]);

  // 🔹 Donate handler
  const handleDonate = async () => {
    try {
      await donationService.donate({
        campaign: campaign.id, // ✅ MUST be `campaign`
        amount: amount,
      });

      alert("Donation successful 🎉");
      navigate("/donor/dashboard");
    } catch (err) {
      console.error(err);
      alert("Donation failed");
    }
  };

  if (!campaign) {
    return <div className="p-10 text-white">Campaign not found</div>;
  }

  return (
    <div className="min-h-screen animated-bg">
      <RoleBasedNavbar userRole="donor" />
      <div className="min-h-screen animated-bg flex items-center justify-center">
        <div className="glass-card p-6 w-96">
          <h2 className="text-2xl text-white font-bold mb-2">
            {campaign.title}
          </h2>

          <p className="text-white/70 mb-4">{campaign.description}</p>

          <p className="text-white mb-2">
            🎯 Target: ₹{campaign.target_amount}
          </p>

          <input
            type="number"
            placeholder="Enter amount"
            className="w-full p-2 rounded mb-4"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button
            onClick={handleDonate}
            className="glass-button w-full text-white"
          >
            Donate Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonorDonate;
