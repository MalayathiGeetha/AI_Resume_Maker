import React from "react";
import { FaBrain, FaMagic, FaTools, FaUserTie } from "react-icons/fa";

const About = () => {
  return (
    <div className="min-h-screen bg-base-100 px-6 py-16">
      <div className="max-w-5xl mx-auto space-y-14">
        
        {/* Header */}
        <section className="text-center space-y-4">
          <h1 className="text-5xl font-bold">About Our AI Resume Maker</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We built this platform to empower job seekers with fast, 
            intelligent, and beautifully crafted resumes — generated using state-of-the-art AI.
          </p>
        </section>

        {/* Mission Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
            alt="mission-img"
            className="w-64 mx-auto"
          />
          <div className="space-y-4">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <FaBrain className="text-primary" /> Our Mission
            </h2>
            <p className="text-gray-700">
              Traditional resume building is stressful, time-consuming, and often confusing.
              Our mission is simple:  
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Use AI to simplify resume creation</li>
              <li>Help job seekers highlight their strengths</li>
              <li>Provide ATS-friendly resume structures</li>
              <li>Offer templates suitable for any industry</li>
            </ul>
          </div>
        </section>

        {/* Why Choose Us */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-10">
            Why Choose Our Platform?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-200 shadow-xl p-6 text-center">
              <FaMagic className="text-5xl mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">AI-Powered Precision</h3>
              <p className="text-gray-600">
                Your resume is generated intelligently based on your expertise and goals.
              </p>
            </div>

            <div className="card bg-base-200 shadow-xl p-6 text-center">
              <FaTools className="text-5xl mx-auto mb-4 text-secondary" />
              <h3 className="text-xl font-semibold mb-2">Customizable Output</h3>
              <p className="text-gray-600">
                Edit any part of the AI-generated resume using our advanced form editor.
              </p>
            </div>

            <div className="card bg-base-200 shadow-xl p-6 text-center">
              <FaUserTie className="text-5xl mx-auto mb-4 text-accent" />
              <h3 className="text-xl font-semibold mb-2">ATS-Friendly Format</h3>
              <p className="text-gray-600">
                We ensure your resume is clean, structured, and passes applicant tracking systems.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;

