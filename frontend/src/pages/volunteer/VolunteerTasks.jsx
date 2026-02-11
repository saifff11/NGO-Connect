import { useEffect, useState } from "react";
import RoleBasedNavbar from "../../components/RoleBasedNavbar";
import { volunteerService } from "../../services/volunteerService";

const VolunteerTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await volunteerService.getTasks();
      setTasks(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (id) => {
    await volunteerService.completeTask(id);
    fetchTasks();
  };

  const downloadCertificate = async (id) => {
    const res = await volunteerService.downloadCertificate(id);

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "certificate.pdf");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="min-h-screen animated-bg">
      <RoleBasedNavbar userRole="volunteer" />

      <div className="pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">My Tasks 📋</h1>

          <div className="glass-card p-8">
            {loading ? (
              <div className="text-center text-white">Loading tasks...</div>
            ) : tasks.length === 0 ? (
              <div className="text-center text-white">
                No tasks assigned yet
              </div>
            ) : (
              tasks.map((t) => (
                <div key={t.id} className="glass-card mb-4 p-4">
                  <h3 className="text-xl text-white">{t.title}</h3>
                  <p className="text-white/70">{t.description}</p>
                  <p className="text-green-400 text-sm">
                    Campaign: {t.campaign}
                  </p>
                  <button
                    onClick={() => completeTask(t.id)}
                    className="glass-button text-xs mt-2"
                  >
                    Mark Completed
                  </button>
                  {t.status === "completed" && (
                    <button
                      onClick={() => downloadCertificate(t.id)}
                      className="glass-button text-xs mt-2"
                    >
                      Download Certificate
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerTasks;
