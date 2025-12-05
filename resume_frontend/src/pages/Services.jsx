import React from "react";
import { FaFileAlt, FaRobot, FaPalette, FaSync, FaCloudDownloadAlt } from "react-icons/fa";

const Services = () => {
  const services = [
    {
      icon: <FaRobot className="text-5xl text-primary" />,
      title: "AI Resume Generation",
      desc: "Describe yourself and let our AI instantly generate a polished, professional resume."
    },
    {
      icon: <FaFileAlt className="text-5xl text-secondary" />,
      title: "Advanced Resume Editor",
      desc: "Edit any section of your resume using our rich, dynamic form editor."
    },
    {
      icon: <FaPalette className="text-5xl text-accent" />,
      title: "Multiple Resume Templates",
      desc: "Choose from elegant resume templates designed to impress recruiters."
    },
    {
      icon: <FaSync className="text-5xl text-info" />,
      title: "Real-Time Updates",
      desc: "Make changes and instantly preview updates on your resume layout."
    },
    {
      icon: <FaCloudDownloadAlt className="text-5xl text-success" />,
      title: "Download as PDF",
      desc: "Export your resume as a high-quality PDF suitable for professional use."
    }
  ];

  return (
    <div className="min-h-screen bg-base-100 px-6 py-16">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold text-center mb-12">Our Services</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {services.map((s, index) => (
            <div key={index} className="card bg-base-200 shadow-xl p-6 text-center">
              <div className="mb-4">{s.icon}</div>
              <h3 className="text-2xl font-semibold mb-2">{s.title}</h3>
              <p className="text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Services;

