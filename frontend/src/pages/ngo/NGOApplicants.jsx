import { useEffect, useState } from "react";
import RoleBasedNavbar from "../../components/RoleBasedNavbar";
import { ngoService } from "../../services/ngoService";

const NGOApplicants = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [activeApp, setActiveApp] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await ngoService.getApplications();
      setApplications(res.data || []);
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const approveApplicant = async (id) => {
    await ngoService.updateStatus(id, "approve");
    fetchApplications();
  };

  const submitTask = async () => {
    await ngoService.assignTask({
      application_id: activeApp,
      title: taskTitle,
      description: taskDesc,
    });

    alert("Task Assigned Successfully");

    setTaskTitle("");
    setTaskDesc("");
    setActiveApp(null);
    fetchApplications();
  };

  return (
    <div className="min-h-screen animated-bg">
      <RoleBasedNavbar userRole="ngo" />

      <div className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Volunteer Applicants 📋
            </h1>
            <p className="text-white/70">
              Review volunteer applications and assign tasks
            </p>
          </div>

          <div className="glass-card overflow-x-auto">
            <table className="w-full text-left text-white">
              <thead>
                <tr className="border-b border-white/20 text-white/70">
                  <th className="py-3">Volunteer</th>
                  <th>Campaign</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="py-6 text-center">
                      Loading applications...
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-6 text-center">
                      No applications yet
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="border-b border-white/10">
                      <td className="py-3">{app.volunteer_name}</td>
                      <td>{app.campaign_title}</td>
                      <td className="capitalize">
                        {app.status === "approved" ? (
                          <span className="text-green-400">Approved</span>
                        ) : (
                          <span className="text-yellow-400">Pending</span>
                        )}
                      </td>
                      <td className="space-x-2">
                        {app.status !== "approved" && (
                          <button
                            onClick={() => approveApplicant(app.id)}
                            className="glass-button text-xs"
                          >
                            Approve
                          </button>
                        )}

                        <button
                          onClick={() => setActiveApp(app.id)}
                          className="glass-button text-xs"
                        >
                          Assign Task
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* TASK INPUT PANEL */}
          {activeApp && (
            <div className="glass-card mt-6 p-6">
              <h3 className="text-white text-xl mb-4">Assign Task</h3>

              <input
                placeholder="Task Title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full p-3 mb-3 rounded"
              />

              <textarea
                placeholder="Task Description"
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                className="w-full p-3 mb-3 rounded"
              />

              <button onClick={submitTask} className="glass-button text-sm">
                Submit Task
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NGOApplicants;
