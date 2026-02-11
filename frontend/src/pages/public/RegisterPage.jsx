
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import Navbar from "../../components/Navbar";
import SuccessPopup from "../../components/SuccessPopup";
import ErrorPopup from "../../components/ErrorPopup";
import { getErrorConfig } from "../../utils/errorHandler";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: null,
    organization: "",
  });

  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [successData, setSuccessData] = useState({});
  const [errorData, setErrorData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setErrorData({
        title: "🔒 Passwords Do Not Match",
        message: "Both passwords must be identical.",
        errorType: "validation",
        icon: "🔒",
        showRetryButton: true,
      });
      setShowErrorPopup(true);
      return;
    }

    if (formData.password.length < 6) {
      setErrorData({
        title: "🔒 Weak Password",
        message: "Password must be at least 6 characters long.",
        errorType: "validation",
        icon: "🔒",
        showRetryButton: true,
      });
      setShowErrorPopup(true);
      return;
    }

    // ✅ BUILD PAYLOAD CORRECTLY
    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role,
    };

    // ✅ ONLY for NGO
    if (formData.role === "ngo") {
      payload.ngo_name = formData.organization;
    }

    setLoading(true);

    try {
      const response = await authService.register(payload);

      const { access, refresh, user } = response.data;
      authService.saveAuth(access, refresh, user);

      setSuccessData({
        title: "🎉 Registration Successful!",
        message: `Welcome to NGO Connect, ${user.first_name}!`,
        icon: "🎉",
        user,
      });

      setShowSuccessPopup(true);

      setTimeout(() => {
        redirectUser(user.role);
      }, 2500);
    } catch (err) {
      const errorConfig = getErrorConfig(err, "registration");
      setErrorData(errorConfig);
      setShowErrorPopup(true);
    } finally {
      setLoading(false);
    }
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
      default:
        navigate("/");
    }
  };

  return (
    <div className="min-h-screen animated-bg">
      <Navbar />

      {/* Popups */}
      <SuccessPopup
        isVisible={showSuccessPopup}
        onClose={() => redirectUser(successData?.user?.role)}
        title={successData.title}
        message={successData.message}
        icon={successData.icon}
        autoClose
        autoCloseDelay={2500}
      />

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
          <div className="glass-card p-6">
            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-white">
                Join NGO Connect
              </h1>
              <p className="text-white/70 mt-2">
                Create your account and start making a difference
              </p>
            </div>

            {/* Step 1: Role Selection */}
            {step === 1 && (
              <>
                <h2 className="text-xl text-white font-semibold text-center mb-4">
                  Choose your role
                </h2>

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
                          ? "bg-white/20 border-2 border-white"
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

            {/* Step 2: Registration Form */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="glass-input"
                  />
                  <input
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="glass-input"
                  />
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="glass-input"
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="glass-input"
                />

                {formData.role === "ngo" && (
                  <input
                    name="organization"
                    placeholder="NGO Name"
                    value={formData.organization}
                    onChange={handleChange}
                    required
                    className="glass-input"
                  />
                )}

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="glass-input"
                />

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="glass-input"
                />

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-white/60 hover:text-white"
                  >
                    ← Back
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="glass-button text-white"
                  >
                    {loading ? "Creating..." : "Create Account"}
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

export default RegisterPage;
