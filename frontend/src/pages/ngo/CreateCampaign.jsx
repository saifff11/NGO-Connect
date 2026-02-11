import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { campaignService } from "../../services/campaignService";
import RoleBasedNavbar from "../../components/RoleBasedNavbar";

const CreateCampaign = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: "",
    category: "",
    deadline: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔐 NGO AUTH CHECK
  useEffect(() => {
    const currentUser = authService.getCurrentUser();

    if (!currentUser || currentUser.role !== "ngo") {
      navigate("/login");
      return;
    }

    setUser(currentUser);
  }, []);

  // ✏️ HANDLE INPUT
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🚀 SUBMIT CAMPAIGN
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.title ||
      !formData.targetAmount ||
      !formData.category ||
      !formData.deadline
    ) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        target_amount: Number(formData.targetAmount),
        category: formData.category,
        end_date: formData.deadline, // ✅ FIXED
      };

      await campaignService.create(payload);

      setSuccess("🎉 Campaign created successfully!");

      setFormData({
        title: "",
        description: "",
        targetAmount: "",
        category: "",
        deadline: "",
      });

      setTimeout(() => {
        navigate("/ngo/campaigns");
      }, 1500);
    } catch (err) {
      console.error("Create campaign error:", err.response?.data || err);
      setError("Failed to create campaign. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg">
      <RoleBasedNavbar userRole="ngo" />

      <div className="pt-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Create Campaign 📝
            </h1>
            <p className="text-white/70">
              Start a new fundraising campaign for your NGO
            </p>
          </div>

          {/* Form Card */}
          <div className="glass-card p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <input
                type="text"
                name="title"
                placeholder="Campaign Title"
                value={formData.title}
                onChange={handleChange}
                className="glass-input"
                required
              />

              {/* Description */}
              <textarea
                name="description"
                placeholder="Campaign Description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="glass-input"
              />

              {/* Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="number"
                  name="targetAmount"
                  placeholder="Target Amount (₹)"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  className="glass-input"
                  required
                />

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="glass-input"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Poverty">Poverty</option>
                  <option value="Women">Women</option>
                </select>
              </div>

              {/* Deadline */}
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="glass-input"
              />

              {/* Messages */}
              {error && <div className="text-red-400 text-sm">{error}</div>}
              {success && (
                <div className="text-green-400 text-sm">{success}</div>
              )}

              {/* Actions */}
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => navigate("/ngo/dashboard")}
                  className="text-white/60 hover:text-white"
                >
                  ← Back
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="glass-button text-white"
                >
                  {loading ? "Creating..." : "Create Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;
