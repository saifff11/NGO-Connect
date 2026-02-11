import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import Navbar from "../../components/Navbar";
import SuccessPopup from "../../components/SuccessPopup";
import ErrorPopup from "../../components/ErrorPopup";
import { getErrorConfig } from "../../utils/errorHandler";

const LoginPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = role selection, 2 = login form

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: null,
  });

  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [successData, setSuccessData] = useState({});
  const [errorData, setErrorData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const redirectUser = (role) => {
    switch (role) {
      case "volunteer":
        navigate("/volunteer/dashboard");
        break;
      case "donor":
        navigate("/donor/dashboard");
        break;
      case "ngo":
        navigate("/ngo/dashboard");
        break;
      case "admin":
        navigate("/admin/dashboard");
        break;
      default:
        navigate("/");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(formData);
      const { access, refresh, user } = response.data;

      authService.saveAuth(access, refresh, user);

      setSuccessData({
        title: "🎉 Login Successful!",
        message: `Welcome back to NGO Connect, ${user.first_name}!`,
        icon: "🎉",
        user,
      });

      setShowSuccessPopup(true);

      setTimeout(() => {
        redirectUser(user.role);
      }, 2000);
    } catch (err) {
      const errorConfig = getErrorConfig(err, "login");
      setErrorData(errorConfig);
      setShowErrorPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg">
      <Navbar />

      {/* Success Popup */}
      <SuccessPopup
        isVisible={showSuccessPopup}
        onClose={() => redirectUser(successData?.user?.role)}
        title={successData.title}
        message={successData.message}
        icon={successData.icon}
        autoClose
        autoCloseDelay={2000}
      />

      {/* Error Popup */}
      <ErrorPopup
        isVisible={showErrorPopup}
        onClose={() => setShowErrorPopup(false)}
        title={errorData.title}
        message={errorData.message}
        errorType={errorData.errorType}
        icon={errorData.icon}
        showRetryButton={errorData.showRetryButton}
      />

      <div className="flex items-center justify-center min-h-screen pt-20 px-4">
        <div className="w-full max-w-md">
          {/* Page Heading */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white mb-2">
              Login to NGO Connect
            </h1>
            <p className="text-white/70">
              Access your account and continue making a difference
            </p>
          </div>

          {/* Glass Card */}
          <div className="glass-card p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {step === 1 ? "Choose your role" : `Login as ${formData.role}`}
              </h2>
              <p className="text-white/70 mt-1">
                {step === 1
                  ? "Select your role to continue"
                  : "Enter your credentials"}
              </p>
            </div>

            {/* Step 1: Role Selection */}
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "volunteer", label: "Volunteer", icon: "🤝" },
                    { value: "donor", label: "Donor", icon: "💝" },
                    { value: "ngo", label: "NGO", icon: "🏢" },
                  ].map((role) => (
                    <div
                      key={role.value}
                      onClick={() =>
                        setFormData({ ...formData, role: role.value })
                      }
                      className={`cursor-pointer rounded-lg p-4 text-center transition ${
                        formData.role === role.value
                          ? "bg-white/20 border-2 border-white scale-105"
                          : "bg-white/10 border border-white/20 hover:bg-white/20"
                      }`}
                    >
                      <div className="text-3xl">{role.icon}</div>
                      <div className="text-white font-medium mt-1">
                        {role.label}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  disabled={!formData.role}
                  onClick={() => setStep(2)}
                  className={`mt-6 w-full glass-button text-white ${
                    !formData.role && "opacity-50 cursor-not-allowed"
                  }`}
                >
                  Continue
                </button>
              </>
            )}

            {/* Step 2: Login Form */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email address"
                  className="glass-input"
                />

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Password"
                  className="glass-input"
                />

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm text-white/60 hover:text-white"
                  >
                    ← Back
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="glass-button text-white"
                  >
                    {loading ? "Signing in..." : "Login"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
