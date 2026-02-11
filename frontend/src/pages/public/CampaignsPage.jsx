import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

const HARD_CODED_CAMPAIGNS = [
  {
    id: 1,
    title: "Education for Underprivileged Children",
    description:
      "Providing books, uniforms, and digital education to children in rural areas.",
    category: "education",
    goal: 500000,
    raised: 275000,
    daysLeft: 18,
    image: "https://images.unsplash.com/photo-1603575448364-3e1a70c7f76c",
    ngo: "Helping Hands Foundation",
    location: "Delhi",
  },
  {
    id: 2,
    title: "Women Skill Development Program",
    description:
      "Empowering women with vocational training and employment opportunities.",
    category: "womenempowerment",
    goal: 300000,
    raised: 190000,
    daysLeft: 12,
    image: "https://images.unsplash.com/photo-1599058917212-d750089bc07c",
    ngo: "Bright Future NGO",
    location: "Mumbai",
  },
  {
    id: 3,
    title: "Free Health Checkup Camps",
    description:
      "Organizing medical camps in remote villages for early diagnosis.",
    category: "healthcare",
    goal: 400000,
    raised: 340000,
    daysLeft: 7,
    image: "https://images.unsplash.com/photo-1580281657527-47c5c8d3a4df",
    ngo: "Care & Cure Trust",
    location: "Bangalore",
  },
  {
    id: 4,
    title: "Plant Trees Save Earth",
    description:
      "Large-scale plantation drives to combat climate change.",
    category: "environmentprotection",
    goal: 250000,
    raised: 120000,
    daysLeft: 25,
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
    ngo: "Green Earth Trust",
    location: "Pune",
  },
];

const categories = [
  { value: "all", label: "All", icon: "🌟" },
  { value: "healthcare", label: "Healthcare", icon: "🏥" },
  { value: "womenempowerment", label: "Women Empowerment", icon: "👩‍💼" },
  { value: "environmentprotection", label: "Environment", icon: "🌱" },
  { value: "education", label: "Education", icon: "📚" },
];

const CampaignsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCampaigns = HARD_CODED_CAMPAIGNS.filter((campaign) => {
    const matchesCategory =
      selectedCategory === "all" ||
      campaign.category === selectedCategory;
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getProgressPercentage = (raised, goal) =>
    Math.min((raised / goal) * 100, 100);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="min-h-screen animated-bg">
      <Navbar />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Active <span className="text-gradient">Campaigns</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Explore and support impactful social initiatives.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="glass-card mb-8 grid md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input text-white placeholder-white/50"
            />

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`glass-button text-sm ${
                    selectedCategory === category.value
                      ? "bg-blue-500/30 ring-2 ring-blue-400"
                      : ""
                  }`}
                >
                  {category.icon} {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Campaign Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCampaigns.length === 0 ? (
              <div className="col-span-full text-center text-white/70">
                No campaigns found
              </div>
            ) : (
              filteredCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="glass-card hover:scale-105 transition"
                >
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />

                  <h3 className="text-xl font-semibold text-white mb-2">
                    {campaign.title}
                  </h3>

                  <p className="text-white/70 text-sm mb-3 line-clamp-2">
                    {campaign.description}
                  </p>

                  <div className="flex justify-between text-sm text-white/60 mb-3">
                    <span>by {campaign.ngo}</span>
                    <span>📍 {campaign.location}</span>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-white">
                      <span>
                        {formatCurrency(campaign.raised)} raised
                      </span>
                      <span>{formatCurrency(campaign.goal)}</span>
                    </div>
                    <div className="w-full bg-white/20 h-2 rounded-full mt-1">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        style={{
                          width: `${getProgressPercentage(
                            campaign.raised,
                            campaign.goal
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <Link
                    to={`/campaign/${campaign.id}`}
                    className="glass-button w-full text-center text-white"
                  >
                    Support This Campaign
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignsPage;
