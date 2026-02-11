import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

const HARD_CODED_NGOS = [
  {
    id: 1,
    name: "Helping Hands Foundation",
    description: "Supporting education and healthcare for underprivileged communities.",
    location: "Delhi, India",
    focus: "Education & Health",
    campaigns: 3,
    logo: "https://ui-avatars.com/api/?name=Helping+Hands",
  },
  {
    id: 2,
    name: "Bright Future NGO",
    description: "Empowering women and children through skill development.",
    location: "Mumbai, India",
    focus: "Women Empowerment",
    campaigns: 2,
    logo: "https://ui-avatars.com/api/?name=Bright+Future",
  },
  {
    id: 3,
    name: "Green Earth Trust",
    description: "Working towards environmental sustainability and awareness.",
    location: "Bangalore, India",
    focus: "Environment",
    campaigns: 4,
    logo: "https://ui-avatars.com/api/?name=Green+Earth",
  },
];

const NgoPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNgos = HARD_CODED_NGOS.filter(
    (ngo) =>
      ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.focus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen animated-bg">
      <Navbar />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Our <span className="text-gradient">NGO Partners</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Discover NGOs working to create real social impact.
            </p>
          </div>

          {/* Search */}
          <div className="glass-card mb-10">
            <input
              type="text"
              placeholder="Search NGOs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input text-white placeholder-white/50"
            />
          </div>

          {/* NGO Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNgos.map((ngo) => (
              <div
                key={ngo.id}
                className="glass-card group hover:scale-105 transition-transform duration-300"
              >
                {/* Logo */}
                <div className="flex justify-center mb-4">
                  <img
                    src={ngo.logo}
                    alt={ngo.name}
                    className="w-20 h-20 rounded-full"
                  />
                </div>

                {/* Info */}
                <div className="space-y-3 text-center">
                  <h3 className="text-xl font-semibold text-white">
                    {ngo.name}
                  </h3>

                  <p className="text-white/70 text-sm line-clamp-2">
                    {ngo.description}
                  </p>

                  <div className="flex justify-between text-sm text-white/60">
                    <span>📍 {ngo.location}</span>
                    <span>🎯 {ngo.focus}</span>
                  </div>

                  <div className="text-sm text-white/70">
                    Active Campaigns:{" "}
                    <span className="font-semibold text-white">
                      {ngo.campaigns}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-3">
                    <Link
                      to="/campaigns"
                      className="flex-1 glass-button text-white text-sm"
                    >
                      View Campaigns
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-20">
            <div className="glass-card max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">
                Are You an NGO?
              </h2>
              <p className="text-white/70 mb-6">
                Register on NGO Connect to reach donors and volunteers.
              </p>
              <Link
                to="/register"
                className="glass-button text-white"
              >
                Register Your NGO
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NgoPage;
