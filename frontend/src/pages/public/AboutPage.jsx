import Navbar from "../../components/Navbar";
import frontendImg from "../../assets/frontend.jpeg";
import sampathImg from "../../assets/1000262740.jpg";
import backendImg from "../../assets/backend.jpeg";

const AboutPage = () => {
  const stats = [
    { number: "1000+", label: "SPeople Supported", icon: "🎯" },
    { number: "300+", label: "Active Volunteers", icon: "🤝" },
    { number: "100+", label: "Partner NGOs", icon: "🏢" },
    { number: "50L+", label: "Funds Raised", icon: "💰" },
  ];

  const values = [
    {
      icon: "🤝",
      title: "Community",
      description:
        "We believe strong communities create positive social change and lasting impact.",
    },
    {
      icon: "🎯",
      title: "Transparency",
      description:
        "We ensure every donation and campaign is tracked for accountability and trust.",
    },
    {
      icon: "💡",
      title: "Innovation",
      description:
        "We use technology to improve social support and service delivery.",
    },
    {
      icon: "❤️",
      title: "Empathy",
      description:
        "We approach every cause and community with care and compassion.",
    },
  ];

  const team = [
    {
      name: "Md Saif Ali",
      role: "FrontEnd Developer",
      // image: frontendImg,
      bio: "Creative Web Developer responsible for designing and building responsive, user-friendly interfaces for NGO Connect. Focused on delivering a smooth and engaging user experience.",
    },
    {
      name: "Md Saif Ali",
      role: "DataBase Developer",
      // image: sampathImg,
      bio: "Tech enthusiast managing the database architecture, ensuring secure data storage, efficient queries, and smooth data flow across the platform.",
    },
    {
      name: "Md Saif Ali",
      role: "BackEnd Developer",
      // image: backendImg,
      bio: "Responsible for server-side development, authentication, API integration, and overall system functionality to ensure NGO Connect runs securely and efficiently.",
    },
  ];

  return (
    <div className="min-h-screen animated-bg">
      <Navbar />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              About <span className="text-gradient">NGO Connect</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              We are dedicated to connecting NGOs, donors, and volunteers to
              create meaningful social impact. Through technology,
              collaboration, and compassion, NGO Connect helps build stronger
              communities and a better future for those in need.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="glass-card text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Mission Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-white mb-6">
                Our <span className="text-gradient">Mission</span>
              </h2>
              <p className="text-lg text-white/80 leading-relaxed">
                NGO Connect was created with a clear purpose: to bridge the gap
                between communities, NGOs, donors, and volunteers. Our mission
                is to make social support more accessible, transparent, and
                impactful for everyone involved.
              </p>
              <p className="text-lg text-white/80 leading-relaxed">
                Through our digital platform, we connect people who want to help
                with organizations that need support, creating a strong network
                that drives positive change and sustainable development.
              </p>
              <div className="flex flex-col sm:flex-row gap-4"></div>
            </div>
            <div className="glass-card p-8">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white">
                  Innovation in Social Impact
                </h3>
                <p className="text-white/70">
                  We use modern technology to create seamless connections
                  between NGOs, donors, and volunteers, making social support
                  more efficient, transparent, and impactful.
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Our <span className="text-gradient">Values</span>
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                These core values guide everything we do and shape our approach
                to social impact and community development.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="glass-card text-center group hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-white/70 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Meet Our <span className="text-gradient">Team</span>
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                The passionate individuals behind NGO Connect who are committed
                to transforming education.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="glass-card text-center group hover:scale-105 transition-transform duration-300"
                >
                  <div className="mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-white/20 group-hover:ring-blue-400/40 transition-all duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-300 mb-3">{member.role}</p>
                  <p className="text-white/70 text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="glass-card max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-4">
                Join Us in Making a Difference
              </h2>
              <p className="text-xl text-white/70 mb-8">
                Whether you're an NGO working for change, a volunteer ready to
                help, or a donor looking to create impact, there’s a place for
                you in the NGO Connect community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="glass-button text-white hover:bg-white hover:text-gray-800">
                  Get Started Today
                </button>
                <button className="glass-button text-white hover:bg-white hover:text-gray-800">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
