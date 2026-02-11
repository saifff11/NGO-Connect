import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import { useEffect } from "react";
import LandingPage from "./pages/public/LandingPage";
import LoginPage from "./pages/public/LoginPage";
import RegisterPage from "./pages/public/RegisterPage";
import CampaignsPage from "./pages/public/CampaignsPage";
import CampaignDetails from "./pages/public/CampaignDetails";
import ContactPage from "./pages/public/ContactPage";
import AboutPage from "./pages/public/AboutPage";
import NotFound from "./pages/public/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";

// Dashboard imports
import AdminDashboard from "./pages/admin/Dashboard";
import VolunteerDashboard from "./pages/volunteer/Dashboard";
import DonorDashboard from "./pages/donor/Dashboard";
import NGODashboard from "./pages/ngo/Dashboard";

// Test components
import NavigationTestPage from "./components/NavigationTestPage";
import ErrorPopupDemo from "./components/ErrorPopupDemo";

// Import the browser navigation hook
import { useBrowserNavigation } from "./hooks/useBrowserNavigation";
import NgoPage from "./pages/public/NgoPage";
import VolunteersPage from "./pages/public/VolunteersPage";
import BrowseCampaigns from "./pages/volunteer/BrowseCampaigns";
import ExploreNGOs from "./pages/volunteer/ExploreNGOs";
import DonorBrowseCampaigns from "./pages/donor/DonorBrowseCampaigns";
import MyDonations from "./pages/donor/MyDonations";
import Donations from "./pages/ngo/Donations";
import Reports from "./pages/ngo/Reports";
import CreateCampaign from "./pages/ngo/CreateCampaign";
import MyCampaigns from "./pages/ngo/MyCampaigns";
import DonorDonate from "./pages/donor/DonorDonate";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCampaigns from "./pages/admin/AdminCampaigns";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import VolunteerTasks from "./pages/volunteer/VolunteerTasks";
import NGOApproval from "./pages/admin/Approval";
import NGOApplicants from "./pages/ngo/NGOApplicants";
import Leaderboard from "./pages/volunteer/Leaderboard";
import ImpactDashboard from "./pages/donor/ImpactDashboard";

function AppContent() {
  // Use the browser navigation hook
  const { handleLogout, handleLogin, handleBackNavigation } =
    useBrowserNavigation();

  // Handle browser back/forward button clicks
  useEffect(() => {
    const handlePopState = (event) => {
      // This will be handled by the useBrowserNavigation hook
      console.log("Browser navigation detected");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/campaigns" element={<CampaignsPage />} />
      <Route path="/campaign/:id" element={<CampaignDetails />} />
      <Route path="/ngo" element={<NgoPage />} />
      <Route path="/volunteers" element={<VolunteersPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<AboutPage />} />

      {/* Test Pages */}
      <Route path="/test-navigation" element={<NavigationTestPage />} />
      <Route path="/test-errors" element={<ErrorPopupDemo />} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/campaigns" element={<AdminCampaigns />} />
      <Route path="/admin/analytics" element={<AdminAnalytics />} />
      <Route path="/admin/approvals" element={<NGOApproval />} />

      {/* Volunteer Routes */}
      <Route
        path="/volunteer/dashboard"
        element={
          <ProtectedRoute allowedRoles={["volunteer"]}>
            <VolunteerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/volunteer/campaigns"
        element={
          <ProtectedRoute allowedRoles={["volunteer"]}>
            <BrowseCampaigns />
          </ProtectedRoute>
        }
      />

      <Route
        path="/volunteer/ngos"
        element={
          <ProtectedRoute allowedRoles={["volunteer"]}>
            <ExploreNGOs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/volunteer/tasks"
        element={
          <ProtectedRoute allowedRoles={["volunteer"]}>
            <VolunteerTasks />
          </ProtectedRoute>
        }
      />

      <Route
        path="/volunteer/leaderboard"
        element={
          <ProtectedRoute allowedRoles={["volunteer"]}>
            <Leaderboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/volunteer/campaigns/create"
        element={
          <div className="min-h-screen animated-bg pt-20 px-4">
            <div className="glass-card text-center">
              <h1 className="text-2xl font-bold text-white">Create Campaign</h1>
              <p className="text-white/70">Coming soon...</p>
            </div>
          </div>
        }
      />

      {/* Donor Routes */}
      <Route
        path="/donor/dashboard"
        element={
          <ProtectedRoute allowedRoles={["donor"]}>
            <DonorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/donor/donations"
        element={
          <ProtectedRoute allowedRoles={["donor"]}>
            <MyDonations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donor/campaigns"
        element={
          <ProtectedRoute allowedRoles={["donor"]}>
            <DonorBrowseCampaigns />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donor/impact"
        element={
          <ProtectedRoute allowedRoles={["donor"]}>
            <ImpactDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/donor/campaigns/:id/donate" element={<DonorDonate />} />

      {/* NGO Routes */}
      <Route
        path="/ngo/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ngo"]}>
            <NGODashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ngo/campaigns"
        element={
          <ProtectedRoute allowedRoles={["ngo"]}>
            <MyCampaigns />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ngo/campaigns/create"
        element={
          <ProtectedRoute allowedRoles={["ngo"]}>
            <CreateCampaign />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ngo/donations"
        element={
          <ProtectedRoute allowedRoles={["ngo"]}>
            <Donations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ngo/applicants"
        element={
          <ProtectedRoute allowedRoles={["ngo"]}>
            <NGOApplicants />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ngo/reports/*"
        element={
          <ProtectedRoute allowedRoles={["ngo"]}>
            <Reports />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen animated-bg">
        <AppContent />
      </div>
    </Router>
  );
}
