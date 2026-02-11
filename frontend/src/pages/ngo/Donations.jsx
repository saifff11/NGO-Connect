import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { donationService } from "../../services/donationService";
import RoleBasedNavbar from "../../components/RoleBasedNavbar";

const NGODonations = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || user.role !== "ngo") {
      navigate("/login");
      return;
    }
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await donationService.getNGODonations();
      setDonations(res.data || []);
    } catch (err) {
      console.error("Failed to fetch NGO donations", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg">
      <RoleBasedNavbar userRole="ngo" />

      <div className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-6">
            Donations 💰
          </h1>

          <div className="glass-card p-6">
            {loading ? (
              <p className="text-white/70">Loading...</p>
            ) : donations.length === 0 ? (
              <div className="text-center text-white/70 py-10">
                No donations yet
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-white/70 border-b border-white/10">
                    <th className="py-3">Campaign</th>
                    <th className="py-3">Amount</th>
                    <th className="py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d) => (
                    <tr key={d.id} className="border-b border-white/5">
                      <td className="py-3 text-white">
                        {d.campaign_title}
                      </td>
                      <td className="py-3 text-green-400">
                        ₹{d.amount}
                      </td>
                      <td className="py-3 text-white/70">
                        {new Date(d.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGODonations;
