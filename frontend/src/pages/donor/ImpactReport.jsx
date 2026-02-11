import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { donationService } from "../../services/donationService";
import RoleBasedNavbar from "../../components/RoleBasedNavbar";

const ImpactReport = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [impact, setImpact] = useState({
    totalDonations: 0,
    totalAmount: 0,
    studentsHelped: 0,
    campaignsSupported: 0,
    impactScore: 0,
  });

  // 🔐 AUTH CHECK
  useEffect(() => {
    const currentUser = authService.getCurrentUser();

    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (currentUser.role !== "donor") {
      navigate("/");
      return;
    }

    setUser(currentUser);
    fetchImpactData(currentUser.id);
  }, []);

  // 📊 FETCH IMPACT DATA (SAFE)
  const fetchImpactData = async (donorId) => {
    try {
      setLoading(true);

      let donations = [];

      if (donationService?.getAll) {
        try {
          const res = await donationService.getAll();
          donations = res?.data?.results || res?.data || [];
        } catch {
          console.warn("Donation API not ready – using demo data");
        }
      }

      // 🧪 FALLBACK DATA
      if (!donations.length) {
        donations = [
          { amount: 5000, campaign: 1 },
          { amount: 3500, campaign: 2 },
          { amount: 7000, campaign: 3 },
        ];
      }

      const donorDonations = donations.filter(
        (d) => d.donor === donorId || d.donor_id === donorId || !d.donor,
      );

      const totalAmount = donorDonations.reduce(
        (sum, d) => sum + Number(d.amount || 0),
        0,
      );

      const campaignsSupported = new Set(donorDonations.map((d) => d.campaign))
        .size;

      const studentsHelped = campaignsSupported * 2; // demo logic
      const impactScore = Math.min(
        100,
        Math.floor((totalAmount / 10000) * 100),
      );

      setImpact({
        totalDonations: donorDonations.length,
        totalAmount,
        studentsHelped,
        campaignsSupported,
        impactScore,
      });
    } catch (err) {
      console.error("Error fetching impact data:", err);
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
              Impact Report 📈
            </h1>
            <p className="text-white/70">
              See how your contributions are making a difference
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-10">
            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {loading ? "..." : impact.totalDonations}
              </div>
              <div className="text-white/70">Donations Made</div>
            </div>

            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {loading ? "..." : `₹${impact.totalAmount}`}
              </div>
              <div className="text-white/70">Total Donated</div>
            </div>

            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {loading ? "..." : impact.campaignsSupported}
              </div>
              <div className="text-white/70">Campaigns Supported</div>
            </div>

            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {loading ? "..." : impact.studentsHelped}
              </div>
              <div className="text-white/70">Beneficiaries Supported</div>
            </div>
          </div>

          {/* Impact Score */}
          <div className="glass-card mb-10">
            <h3 className="text-xl font-semibold text-white mb-3">
              Overall Impact Score
            </h3>

            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70">Impact Level</span>
              <span className="text-white font-semibold">
                {impact.impactScore}%
              </span>
            </div>

            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all"
                style={{ width: `${impact.impactScore}%` }}
              />
            </div>
          </div>

          {/* Impact Highlights */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card">
              <h3 className="text-xl font-semibold text-white mb-4">
                🌍 Your Contribution Impact
              </h3>
              <ul className="space-y-3 text-white/70">
                <li>✔ Supported education initiatives</li>
                <li>✔ Enabled scholarships for students</li>
                <li>✔ Strengthened NGO programs</li>
                <li>✔ Created long-term social change</li>
              </ul>
            </div>

            <div className="glass-card">
              <h3 className="text-xl font-semibold text-white mb-4">
                🏆 Milestones Achieved
              </h3>
              <ul className="space-y-3 text-white/70">
                <li>🎯 First donation completed</li>
                <li>💝 ₹10,000+ donation milestone</li>
                <li>📊 Multiple campaigns supported</li>
                <li>🌱 High donor impact score</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactReport;
