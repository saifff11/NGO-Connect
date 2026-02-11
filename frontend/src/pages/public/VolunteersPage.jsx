import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

const HARD_CODED_VOLUNTEERS = [
  {
    id: 1,
    name: "Rahul Sharma",
    skills: "Teaching, Mentoring",
    location: "Delhi",
    availability: "Weekends",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Priya Verma",
    skills: "Healthcare Support, First Aid",
    location: "Mumbai",
    availability: "Full Time",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Amit Patel",
    skills: "Event Management, Fundraising",
    location: "Ahmedabad",
    availability: "Evenings",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
  },
  {
    id: 4,
    name: "Sneha Iyer",
    skills: "Content Writing, Social Media",
    location: "Bangalore",
    availability: "Remote",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 5,
    name: "Karan Singh",
    skills: "Environmental Awareness, Plantation",
    location: "Jaipur",
    availability: "Weekends",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
  },
];

const VolunteersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVolunteers = HARD_CODED_VOLUNTEERS.filter(
    (volunteer) =>
      volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.skills.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen animated-bg">
      <Navbar />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Our <span className="text-gradient">Volunteers</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Meet passionate individuals contributing their skills to social
              causes.
            </p>
          </div>

          {/* Search */}
          <div className="glass-card mb-10">
            <label className="block text-white/80 text-sm font-medium mb-2">
              Search Volunteers
            </label>
            <input
              type="text"
              placeholder="Search by name or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input text-white placeholder-white/50"
            />
          </div>

          {/* Volunteers Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVolunteers.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  No volunteers found
                </h3>
                <p className="text-white/70">
                  Try searching with different keywords.
                </p>
              </div>
            ) : (
              filteredVolunteers.map((volunteer) => (
                <div
                  key={volunteer.id}
                  className="glass-card group hover:scale-105 transition-transform duration-300"
                >
                  {/* Profile Image */}
                  <div className="flex justify-center mb-4">
                    <img
                      src={volunteer.image}
                      alt={volunteer.name}
                      className="w-24 h-24 rounded-full object-cover border-2 border-white/20"
                    />
                  </div>

                  {/* Volunteer Info */}
                  <div className="text-center space-y-3">
                    <h3 className="text-xl font-semibold text-white group-hover:text-blue-200">
                      {volunteer.name}
                    </h3>

                    <p className="text-white/70 text-sm">
                      🛠 Skills: {volunteer.skills}
                    </p>

                    <div className="flex justify-between text-sm text-white/60">
                      <span>📍 {volunteer.location}</span>
                      <span>⏱ {volunteer.availability}</span>
                    </div>

                    {/* Action */}
                    <Link
                      to="/login"
                      className="w-full glass-button text-white hover:bg-white hover:text-gray-800 text-sm mt-3"
                    >
                      Connect / Apply
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* CTA */}
          <div className="text-center mt-20">
            <div className="glass-card max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">
                Want to Become a Volunteer?
              </h2>
              <p className="text-white/70 mb-6">
                Join NGO Connect and contribute your skills to causes that truly
                matter.
              </p>
              <Link
                to="/register"
                className="glass-button text-white hover:bg-white hover:text-gray-800"
              >
                Join as Volunteer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteersPage;
