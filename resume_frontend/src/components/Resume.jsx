import React from "react";
// Import necessary icons
import { FaGithub, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFilePdf, FaPrint, FaEdit, FaUndo } from "react-icons/fa";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

// Define professional colors for ATS compatibility:
// Primary Text: text-gray-900 (Black/Deep Gray)
// Accent/Header Border: border-blue-800 (Deep Professional Blue)
// Background: bg-white

const Resume = ({ data, onEdit, onGenerateAnother }) => { 
  const resumeRef = useRef(null);

  // Added necessary null/array checks to prevent the previous TypeError
  const ensureArray = (field) => {
    if (Array.isArray(field)) return field;
    if (typeof field === 'string' && field.includes(',')) return field.split(',').map(item => item.trim());
    if (field) return [field];
    return [];
  };

  // --- PDF Download (Image-based) ---
  const handleDownloadPdf = () => {
    toPng(resumeRef.current, { quality: 1.0 })
      .then((dataUrl) => {
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 190;
        const imgHeight = (resumeRef.current.offsetHeight * imgWidth) / resumeRef.current.offsetWidth;

        pdf.addImage(dataUrl, "PNG", 10, 10, imgWidth, imgHeight);
        pdf.save(`${data.personalInformation.fullName}-Resume.pdf`);
      })
      .catch((err) => {
        console.error("Error generating PDF", err);
      });
  };

  // --- Print Functionality (Better for actual printing) ---
  const handlePrint = useReactToPrint({
    content: () => resumeRef.current,
    documentTitle: `${data.personalInformation.fullName}-Resume`,
  });

  return (
    <>
      <div
        ref={resumeRef}
        // Simplified styling for ATS: no shadows, solid white background, standard margin.
        className="max-w-4xl mx-auto p-8 space-y-7 bg-white text-gray-900 border border-gray-300"
        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
      >
        {/* Header Section (Simple, High Contrast) */}
        <div className="text-center space-y-1 pb-2 border-b-2 border-gray-400">
          <h1 className="text-4xl font-bold text-gray-900 uppercase">
            {data.personalInformation.fullName}
          </h1>
          <div className="flex flex-wrap justify-center space-x-4 text-sm text-gray-700">
            {data.personalInformation.phoneNumber && (
              <span className="flex items-center">
                <FaPhone className="mr-1 text-blue-800" /> {data.personalInformation.phoneNumber}
              </span>
            )}
            {data.personalInformation.email && (
              <a
                href={`mailto:${data.personalInformation.email}`}
                className="flex items-center text-gray-700 hover:underline"
              >
                <FaEnvelope className="mr-1 text-blue-800" /> {data.personalInformation.email}
              </a>
            )}
            {data.personalInformation.location && (
              <span className="flex items-center">
                <FaMapMarkerAlt className="mr-1 text-blue-800" /> {data.personalInformation.location}
              </span>
            )}
          </div>

          <div className="flex justify-center space-x-4 text-sm pt-1">
            {data.personalInformation.linkedIn && (
              <a
                href={data.personalInformation.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:underline flex items-center"
              >
                <FaLinkedin className="mr-1" /> LinkedIn
              </a>
            )}
            {data.personalInformation.gitHub && (
              <a
                href={data.personalInformation.gitHub}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:underline flex items-center"
              >
                <FaGithub className="mr-1" /> GitHub
              </a>
            )}
          </div>
        </div>

        {/* Summary Section (ATS-friendly, single block) */}
        {data.summary && (
            <section>
                <h2 className="text-xl font-bold border-b border-blue-800 pb-0.5 text-blue-800 mb-2 uppercase">
                    Professional Summary
                </h2>
                <p className="text-gray-800 leading-normal">{data.summary}</p>
            </section>
        )}
        
        {/* Skills Section (Clean, flat list) */}
        <section>
          <h2 className="text-xl font-bold border-b border-blue-800 pb-0.5 text-blue-800 mb-2 uppercase">
            Technical Skills
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-800">
            {ensureArray(data.skills).map((skill, index) => (
              <span key={index} className="text-sm">
                <strong className="font-semibold">{skill.title}:</strong> {skill.level}
              </span>
            ))}
          </div>
        </section>

        {/* Experience Section (Standard format) */}
        <section>
          <h2 className="text-xl font-bold border-b border-blue-800 pb-0.5 text-blue-800 mb-3 uppercase">
            Professional Experience
          </h2>
          {ensureArray(data.experience).map((exp, index) => (
            <div key={index} className={`pb-3 ${index > 0 ? 'pt-3 border-t border-gray-200' : ''}`}>
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-gray-900">{exp.jobTitle}</h3>
                <p className="text-sm text-gray-700 font-medium">{exp.duration}</p>
              </div>
              <div className="flex justify-between items-start text-sm text-gray-700 italic">
                 <p className="font-semibold">{exp.company}</p>
                 <p>{exp.location}</p>
              </div>
              <ul className="mt-2 text-gray-800 list-disc ml-5 space-y-1 text-sm">
                {/* Ensure responsibility is treated as bullet points */}
                {ensureArray(exp.responsibility).map((item, i) => (
                  item.trim() && <li key={i}>{item.trim()}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Projects Section (Clear separation) */}
        <section>
          <h2 className="text-xl font-bold border-b border-blue-800 pb-0.5 text-blue-800 mb-3 uppercase">
            Projects
          </h2>
          {ensureArray(data.projects).map((proj, index) => (
            <div key={index} className={`pb-3 ${index > 0 ? 'pt-3 border-t border-gray-200' : ''}`}>
              <h3 className="text-lg font-bold text-gray-900">{proj.title}</h3>
              <p className="text-sm text-gray-700 mt-0.5">{proj.description}</p>
              
              {/* Technologies List with the fix for non-array data */}
              <div className="mt-1 text-sm text-gray-700">
                <strong className="font-semibold text-blue-800">Technologies:</strong> 
                {/* Use the safer ensureArray function */}
                {ensureArray(proj.technologiesUsed).join(' | ')}
              </div>

              {proj.githubLink && (
                <a
                  href={proj.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline text-sm transition-colors mt-1 inline-block"
                >
                  <FaGithub className="mr-1 inline" /> Project Link
                </a>
              )}
            </div>
          ))}
        </section>

        {/* Education Section */}
        <section>
          <h2 className="text-xl font-bold border-b border-blue-800 pb-0.5 text-blue-800 mb-3 uppercase">
            Education
          </h2>
          {ensureArray(data.education).map((edu, index) => (
            <div key={index} className={`flex justify-between items-start pb-2 ${index > 0 ? 'pt-2 border-t border-gray-200' : ''}`}>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                <p className="text-sm text-gray-700 italic">{edu.university}, {edu.location}</p>
              </div>
              <p className="text-sm font-medium text-gray-700">Graduation: {edu.graduationYear}</p>
            </div>
          ))}
        </section>
        
        {/* Supplementary Sections (Merged for space and simplicity) */}
        {(data.certifications.length > 0 || data.languages.length > 0 || data.interests.length > 0) && (
            <section>
                <h2 className="text-xl font-bold border-b border-blue-800 pb-0.5 text-blue-800 mb-2 uppercase">
                    Additional Information
                </h2>
                
                {/* Certifications */}
                {ensureArray(data.certifications).length > 0 && (
                    <div className="mb-2">
                        <strong className="text-gray-900">Certifications:</strong> 
                        <span className="text-sm text-gray-700 ml-2">
                            {ensureArray(data.certifications).map(cert => `${cert.title} (${cert.year})`).join(' | ')}
                        </span>
                    </div>
                )}

                {/* Achievements */}
                {ensureArray(data.achievements).length > 0 && (
                    <div className="mb-2">
                        <strong className="text-gray-900">Achievements:</strong> 
                        <ul className="mt-1 text-gray-800 list-disc ml-5 space-y-1 text-sm">
                            {ensureArray(data.achievements).map((ach, index) => (
                                <li key={index}>{ach.title} ({ach.year})</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Languages */}
                {ensureArray(data.languages).length > 0 && (
                    <div className="mb-2">
                        <strong className="text-gray-900">Languages:</strong> 
                        <span className="text-sm text-gray-700 ml-2">
                            {ensureArray(data.languages).map(lang => lang.name).join(', ')}
                        </span>
                    </div>
                )}
                
                {/* Interests */}
                {ensureArray(data.interests).length > 0 && (
                    <div className="mb-2">
                        <strong className="text-gray-900">Interests:</strong> 
                        <span className="text-sm text-gray-700 ml-2">
                            {ensureArray(data.interests).map(interest => interest.name).join(', ')}
                        </span>
                    </div>
                )}

            </section>
        )}

      </div>

      {/* Action Buttons Section - Retained the previous high-contrast sticky style for usability */}
      <section className="flex justify-center mt-6 space-x-4 p-4 sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 shadow-xl print:hidden">
        {/* Print Button */}
        <button onClick={handlePrint} className="btn bg-blue-800 hover:bg-blue-900 text-white shadow-lg transition-transform transform hover:scale-[1.02]">
          <FaPrint className="mr-2" /> Print
        </button>

        {/* PDF Export Button */}
        <button onClick={handleDownloadPdf} className="btn bg-gray-600 hover:bg-gray-700 text-white shadow-lg transition-transform transform hover:scale-[1.02]">
          <FaFilePdf className="mr-2" /> Export PDF (Image)
        </button>

        {/* Edit Button */}
        {onEdit && (
          <button onClick={onEdit} className="btn bg-orange-500 hover:bg-orange-600 text-white shadow-lg transition-transform transform hover:scale-[1.02]">
            <FaEdit className="mr-2" /> Edit
          </button>
        )}

        {/* Generate Another Button */}
        {onGenerateAnother && (
          <button onClick={onGenerateAnother} className="btn bg-red-600 hover:bg-red-700 text-white shadow-lg transition-transform transform hover:scale-[1.02]">
            <FaUndo className="mr-2" /> Generate New
          </button>
        )}
      </section>
    </>
  );
};

export default Resume;
