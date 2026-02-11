import { useEffect, useState } from "react";
import RoleBasedNavbar from "../../components/RoleBasedNavbar";
import { adminUserService } from "../../services/adminUserService";

const Approvals = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const approveUser = async (id) => {
    await adminUserService.toggleUser(id);
    fetchPendingUsers();
  };

  const fetchPendingUsers = async () => {
    try {
      const res = await adminUserService.getPendingUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch pending approvals:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg">
      <RoleBasedNavbar userRole="admin" />

      <div className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">
            Pending Approvals ✅
          </h1>

          <div className="glass-card overflow-x-auto">
            <table className="w-full text-left text-white">
              <thead>
                <tr className="text-white/70 border-b border-white/20">
                  <th className="py-3">ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-6 text-center">
                      Loading approvals...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-6 text-center">
                      No pending approvals
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="border-b border-white/10">
                      <td className="py-3">{u.id}</td>
                      <td>{u.first_name} {u.last_name}</td>
                      <td>{u.email}</td>
                      <td className="capitalize">{u.role}</td>
                      <td>
                        <span className="text-yellow-400">Pending</span>
                      </td>
                      <td>{new Date(u.created_at).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => approveUser(u.id)}
                          className="glass-button text-xs"
                        >
                          Approve
                        </button>
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

export default Approvals;
