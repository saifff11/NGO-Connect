import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { donationService } from "../../services/donationService";
import RoleBasedNavbar from "../../components/RoleBasedNavbar";

const BACKEND_BASE_URL = "http://127.0.0.1:8000"; // 👈 adjust if needed

const MyDonations = () => {
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 AUTH CHECK
  useEffect(() => {
    const currentUser = authService.getCurrentUser();

    if (!currentUser || currentUser.role !== "donor") {
      navigate("/login");
      return;
    }

    fetchDonations();
  }, []);

  // 📥 FETCH DONATIONS
  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await donationService.getMyDonations();
      setDonations(res.data || []);
    } catch (err) {
      console.error("Error fetching donations:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg">
      <RoleBasedNavbar userRole="donor" />

      <div className="pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              My Donations 📊
            </h1>
            <p className="text-white/70">
              View your donation history and certificates
            </p>
          </div>

          {/* Donations List */}
          {loading ? (
            <div className="text-white/70 text-center py-20">
              Loading donations...
            </div>
          ) : donations.length === 0 ? (
            <div className="glass-card text-center text-white/70 py-10">
              You have not made any donations yet.
            </div>
          ) : (
            <div className="space-y-4">
              {donations.map((d) => (
                <div
                  key={d.id}
                  className="glass-card flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-white font-semibold">
                      {d.campaign_title}
                    </h3>
                    <p className="text-white/70">
                      Amount: ₹{d.amount}
                    </p>
                    <p className="text-white/50 text-sm">
                      Date: {new Date(d.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {d.certificate && (
                    <a
                      href={`${BACKEND_BASE_URL}${d.certificate}`}
                      target="_blank"
                      rel="noreferrer"
                      className="glass-button text-white"
                    >
                      📄 Download Certificate
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyDonations;
