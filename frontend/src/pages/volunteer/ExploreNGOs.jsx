import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { volunteerService } from "../../services/volunteerService";
import RoleBasedNavbar from "../../components/RoleBasedNavbar";

const VolunteerNGOs = () => {
  const navigate = useNavigate();

  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 AUTH CHECK
  useEffect(() => {
    const currentUser = authService.getCurrentUser();

    if (!currentUser || currentUser.role !== "volunteer") {
      navigate("/login");
      return;
    }

    fetchNGOs();
  }, []);

  // 📥 FETCH NGOs AVAILABLE FOR VOLUNTEERS
  const fetchNGOs = async () => {
    try {
      setLoading(true);
      const res = await volunteerService.getNGOs();
      setNgos(res.data || []);
    } catch (err) {
      console.error("Failed to load NGOs:", err);
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
              Explore NGOs 🏢
            </h1>
            <p className="text-white/70">
              Connect with NGOs that are looking for volunteers
            </p>
          </div>

          {/* NGO Grid */}
          <div className="glass-card p-6">
            {loading ? (
              <div className="text-center text-white/70 py-20">
                Loading NGOs...
              </div>
            ) : ngos.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No NGOs available
                </h3>
                <p className="text-white/70">
                  Approved NGOs will appear here soon.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ngos.map((ngo) => (
                  <div
                    key={ngo.id}
                    className="glass-card hover:scale-105 transition-transform"
                  >
                    <div className="space-y-4 text-center">
                      <div className="w-20 h-20 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center text-3xl">
                        🏢
                      </div>

                      <h3 className="text-xl font-semibold text-white">
                        {ngo.name}
                      </h3>

                      <p className="text-white/60 text-sm">
                        Registered NGO
                      </p>

                      <div className="text-sm text-green-400 font-medium">
                        ✔ Approved
                      </div>

                      <Link
                        to={`/volunteer/ngos/${ngo.id}`}
                        className="glass-button text-white hover:bg-white hover:text-gray-800 block"
                      >
                        View NGO
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

export default VolunteerNGOs;
