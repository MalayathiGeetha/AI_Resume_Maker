import React from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="min-h-screen bg-base-100 px-6 py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Contact Form */}
        <div className="bg-base-200 p-8 rounded-xl shadow-xl space-y-6">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-600">
            Have questions? Want help with your resume?  
            Send us a message and we’ll get back to you!
          </p>

          <form className="space-y-5">
            <div>
              <label className="label">Name</label>
              <input type="text" className="input input-bordered w-full" placeholder="Your Name" />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input input-bordered w-full" placeholder="Your Email" />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea className="textarea textarea-bordered w-full" rows={5} placeholder="Your message"></textarea>
            </div>
            <button className="btn btn-primary w-full">Send Message</button>
          </form>
        </div>

        {/* Contact Info + Map */}
        <div className="space-y-8">
          
          <div className="bg-base-200 p-6 rounded-xl shadow-xl space-y-4">
            <h2 className="text-3xl font-bold">Get In Touch</h2>
            <p>
              Feel free to reach out through any of the following channels.
            </p>
            <p className="flex items-center gap-3">
              <FaEnvelope className="text-primary" /> support@airesumemaker.com
            </p>
            <p className="flex items-center gap-3">
              <FaPhone className="text-secondary" /> +91 98765 43210
            </p>
            <p className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-accent" /> Hyderabad, India
            </p>
          </div>

          {/* Map Placeholder */}
          <div className="rounded-xl overflow-hidden shadow-xl">
            <iframe
  title="map"
  width="100%"
  height="300"
  loading="lazy"
  allowFullScreen
  src="https://www.google.com/maps?q=Hyderabad,India&output=embed"
></iframe>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;

