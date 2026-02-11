import { useEffect, useState } from "react";
import RoleBasedNavbar from "../../components/RoleBasedNavbar";
import { volunteerService } from "../../services/volunteerService";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await volunteerService.getLeaderboard();
      setLeaders(res.data || []);
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg">
      <RoleBasedNavbar userRole="volunteer" />

      <div className="pt-20 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Volunteer Leaderboard 🏆
            </h1>
            <p className="text-white/70">
              Top volunteers based on completed impact tasks
            </p>
          </div>

          {/* Leaderboard Table */}
          <div className="glass-card overflow-x-auto">
            <table className="w-full text-left text-white">
              <thead>
                <tr className="border-b border-white/20 text-white/70">
                  <th className="py-3">Rank</th>
                  <th>Volunteer</th>
                  <th>Tasks Completed</th>
                  <th>Impact Score</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6">
                      Loading leaderboard...
                    </td>
                  </tr>
                ) : leaders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6">
                      No leaderboard data yet
                    </td>
                  </tr>
                ) : (
                  leaders.map((v, index) => (
                    <tr key={v.id} className="border-b border-white/10">
                      <td className="py-3 font-semibold">
                        #{index + 1}
                      </td>
                      <td>{v.name}</td>
                      <td>{v.tasks_completed}</td>
                      <td className="text-green-400 font-semibold">
                        {v.impact_score}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
