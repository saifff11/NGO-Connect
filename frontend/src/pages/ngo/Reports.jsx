import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { campaignService } from "../../services/campaignService";
import { donationService } from "../../services/donationService";
import RoleBasedNavbar from "../../components/RoleBasedNavbar";

const NGOReports = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [report, setReport] = useState({
    totalCampaigns: 0,
    totalDonations: 0,
    totalAmount: 0,
    avgDonation: 0,
  });

  // 🔐 NGO AUTH CHECK
  useEffect(() => {
    const currentUser = authService.getCurrentUser();

    if (!currentUser || currentUser.role !== "ngo") {
      navigate("/login");
      return;
    }

    setUser(currentUser);
    fetchReportData(currentUser.id);
  }, []);

  // 📊 FETCH REPORT DATA (SAFE)
  const fetchReportData = async (ngoId) => {
    try {
      setLoading(true);

      let campaigns = [];
      let donations = [];

      // Campaigns
      if (campaignService?.getAll) {
        try {
          const res = await campaignService.getAll();
          campaigns = res?.data?.results || res?.data || [];
        } catch {
          console.warn("Campaign API not ready");
        }
      }

      // Donations
      if (donationService?.getAll) {
        try {
          const res = await donationService.getAll();
          donations = res?.data?.results || res?.data || [];
        } catch {
          console.warn("Donation API not ready");
        }
      }

      // NGO campaigns
      const ngoCampaigns = campaigns.filter(
        (c) => c.ngo === ngoId || c.ngo_id === ngoId,
      );

      const ngoCampaignIds = ngoCampaigns.map((c) => c.id);

      // NGO donations
      const ngoDonations = donations.filter((d) =>
        ngoCampaignIds.includes(d.campaign || d.campaign_id),
      );

      const totalAmount = ngoDonations.reduce(
        (sum, d) => sum + Number(d.amount || 0),
        0,
      );

      setReport({
        totalCampaigns: ngoCampaigns.length,
        totalDonations: ngoDonations.length,
        totalAmount,
        avgDonation:
          ngoDonations.length > 0
            ? Math.floor(totalAmount / ngoDonations.length)
            : 0,
      });
    } catch (err) {
      console.error("Error generating NGO report:", err);
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              NGO Reports 📊
            </h1>
            <p className="text-white/70">
              Financial and impact overview of your organization
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {loading ? "..." : report.totalCampaigns}
              </div>
              <div className="text-white/70">Total Campaigns</div>
            </div>

            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {loading ? "..." : report.totalDonations}
              </div>
              <div className="text-white/70">Total Donations</div>
            </div>

            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {loading ? "..." : `₹${report.totalAmount}`}
              </div>
              <div className="text-white/70">Funds Raised</div>
            </div>

            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {loading ? "..." : `₹${report.avgDonation}`}
              </div>
              <div className="text-white/70">Avg Donation</div>
            </div>
          </div>

          {/* Detailed Reports */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Financial Report */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                💰 Financial Summary
              </h3>
              <ul className="space-y-3 text-white/70">
                <li>• Total income from donations</li>
                <li>• Campaign-wise fund distribution</li>
                <li>• Monthly and yearly trends</li>
                <li>• Ready for 80G / audit export</li>
              </ul>
            </div>

            {/* Impact Report */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                🌍 Impact Overview
              </h3>
              <ul className="space-y-3 text-white/70">
                <li>• Students supported</li>
                <li>• Campaign success rates</li>
                <li>• Donor engagement metrics</li>
                <li>• NGO performance insights</li>
              </ul>
            </div>
          </div>

          {/* Export Section */}
          <div className="glass-card p-6 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">
              📤 Export Reports
            </h3>
            <p className="text-white/70 mb-6">
              Download detailed reports for compliance, audits, and analysis.
            </p>

            <div className="flex justify-center gap-4">
              <button className="glass-button text-white">Download PDF</button>
              <button className="glass-button text-white">Download CSV</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGOReports;
