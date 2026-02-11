import { useEffect, useState } from "react";
import { adminCampaignService } from "../../services/adminCampaignService";
import RoleBasedNavbar from "../../components/RoleBasedNavbar";

const AdminCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    try {
      const res = await adminCampaignService.getAll();
      setCampaigns(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await adminCampaignService.action(id, action);
      alert("Campaign updated");
      fetchCampaigns();
    } catch {
      alert("Action failed");
    }
  };

  return (
    <div className="min-h-screen animated-bg">
      <RoleBasedNavbar userRole="admin" />

      <div className="pt-20 max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-6">
          Campaign Management
        </h1>

        {loading ? (
          <p className="text-white">Loading...</p>
        ) : (
          <div className="space-y-4">
            {campaigns.map((c) => (
              <div key={c.id} className="glass-card flex justify-between">
                <div>
                  <h3 className="text-white font-semibold">{c.title}</h3>
                  <p className="text-white/70 text-sm">
                    Status:{" "}
                    {c.is_approved
                      ? c.is_active
                        ? "Active"
                        : "Inactive"
                      : "Pending Approval"}
                  </p>
                </div>

                <div className="flex gap-2">
                  {!c.is_approved && (
                    <button
                      onClick={() => handleAction(c.id, "approve")}
                      className="glass-button bg-green-500"
                    >
                      Approve
                    </button>
                  )}

                  {c.is_active ? (
                    <button
                      onClick={() => handleAction(c.id, "deactivate")}
                      className="glass-button bg-red-500"
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAction(c.id, "activate")}
                      className="glass-button bg-blue-500"
                    >
                      Activate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCampaigns;
