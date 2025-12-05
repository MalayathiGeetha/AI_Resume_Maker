import React, { useRef } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFilePdf,
  FaPrint,
  FaEdit,
  FaUndo,
} from "react-icons/fa";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { useReactToPrint } from "react-to-print";

// ---------------------- TEMPLATE STYLES ----------------------

// TEMPLATE 1 → ATS MINIMAL (Gray + Black)
const template1Style = `
  bg-white text-gray-900 border border-gray-300 p-8 
  [font-family:Arial, Helvetica, sans-serif]
`;

const template1Title = `
  text-lg font-bold border-b border-gray-800 pb-1 text-gray-800 uppercase
`;

// TEMPLATE 2 → MODERN BLUE THEME
const template2Style = `
  bg-gradient-to-b from-blue-50 to-blue-100 
  text-gray-900 p-10 rounded-xl shadow-xl
  border border-blue-300
  [font-family:'Inter', sans-serif]
`;

const template2Title = `
  text-xl font-bold text-blue-800 
  border-l-4 border-blue-600 pl-3 
  uppercase tracking-wide mb-2
`;

// TEMPLATE 3 → CLASSIC ELEGANT (Brown/Gold Theme)
const template3Style = `
  bg-[#fdf8f3] text-[#4a3f35] p-10 shadow-2xl 
  border border-[#c4a484] rounded-md
  [font-family:'Georgia', serif]
`;

const template3Title = `
  text-xl font-bold text-[#5e4632]
  border-b-2 border-[#b89b72] pb-1 mb-2 uppercase
`;

const Resume = ({ data, template, onEdit, onGenerateAnother }) => {
  const resumeRef = useRef(null);

  // ---------------------- STYLE SELECTION ----------------------
  let appliedStyle = template1Style;
  let selectedTitleClass = template1Title;

  if (template === "template2") {
    appliedStyle = template2Style;
    selectedTitleClass = template2Title;
  }

  if (template === "template3") {
    appliedStyle = template3Style;
    selectedTitleClass = template3Title;
  }

  // Ensure array for all sections
  const ensureArray = (field) => {
    if (Array.isArray(field)) return field;
    if (typeof field === "string" && field.includes(",")) {
      return field.split(",").map((item) => item.trim());
    }
    if (field) return [field];
    return [];
  };

  // PDF Download
  const handleDownloadPdf = () => {
    toPng(resumeRef.current, { quality: 1.0 })
      .then((dataUrl) => {
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 190;
        const imgHeight =
          (resumeRef.current.offsetHeight * imgWidth) /
          resumeRef.current.offsetWidth;

        pdf.addImage(dataUrl, "PNG", 10, 10, imgWidth, imgHeight);
        pdf.save(`${data.personalInformation.fullName}-Resume.pdf`);
      })
      .catch((err) => console.error("Error generating PDF", err));
  };

  // Print
  const handlePrint = useReactToPrint({
    content: () => resumeRef.current,
    documentTitle: `${data.personalInformation.fullName}-Resume`,
  });

  return (
    <>
      <div
        ref={resumeRef}
        className={`max-w-4xl mx-auto space-y-7 ${appliedStyle}`}
      >
        {/* ---------------- HEADER ---------------- */}
        <div className="text-center space-y-1 pb-2 border-b-2 border-gray-400">
          <h1 className="text-4xl font-bold uppercase">
            {data.personalInformation.fullName}
          </h1>

          <div className="flex flex-wrap justify-center space-x-4 text-sm">
            {data.personalInformation.phoneNumber && (
              <span className="flex items-center">
                <FaPhone className="mr-1 text-blue-800" />
                {data.personalInformation.phoneNumber}
              </span>
            )}
            {data.personalInformation.email && (
              <a
                href={`mailto:${data.personalInformation.email}`}
                className="flex items-center hover:underline"
              >
                <FaEnvelope className="mr-1 text-blue-800" />
                {data.personalInformation.email}
              </a>
            )}
            {data.personalInformation.location && (
              <span className="flex items-center">
                <FaMapMarkerAlt className="mr-1 text-blue-800" />{" "}
                {data.personalInformation.location}
              </span>
            )}
          </div>

          <div className="flex justify-center space-x-4 text-sm pt-1">
            {data.personalInformation.linkedIn && (
              <a
                href={data.personalInformation.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center text-blue-700"
              >
                <FaLinkedin className="mr-1" /> LinkedIn
              </a>
            )}
            {data.personalInformation.gitHub && (
              <a
                href={data.personalInformation.gitHub}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center"
              >
                <FaGithub className="mr-1" /> GitHub
              </a>
            )}
          </div>
        </div>

        {/* ---------------- SUMMARY ---------------- */}
        {data.summary && (
          <section>
            <h2 className={selectedTitleClass}>Professional Summary</h2>
            <p>{data.summary}</p>
          </section>
        )}

        {/* ---------------- SKILLS ---------------- */}
        <section>
          <h2 className={selectedTitleClass}>Technical Skills</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {ensureArray(data.skills).map((skill, i) => (
              <span key={i} className="text-sm">
                <strong>{skill.title}:</strong> {skill.level}
              </span>
            ))}
          </div>
        </section>

        {/* ---------------- EXPERIENCE ---------------- */}
        <section>
          <h2 className={selectedTitleClass}>Professional Experience</h2>
          {ensureArray(data.experience).map((exp, index) => (
            <div
              key={index}
              className={`pb-3 ${
                index > 0 ? "pt-3 border-t border-gray-200" : ""
              }`}
            >
              <div className="flex justify-between">
                <h3 className="text-lg font-bold">{exp.jobTitle}</h3>
                <p className="text-sm">{exp.duration}</p>
              </div>

              <div className="flex justify-between italic text-sm">
                <p className="font-semibold">{exp.company}</p>
                <p>{exp.location}</p>
              </div>

              <ul className="mt-2 list-disc ml-5 space-y-1 text-sm">
                {ensureArray(exp.responsibility).map((item, i) =>
                  item.trim() ? <li key={i}>{item.trim()}</li> : null
                )}
              </ul>
            </div>
          ))}
        </section>

        {/* ---------------- PROJECTS ---------------- */}
        <section>
          <h2 className={selectedTitleClass}>Projects</h2>
          {ensureArray(data.projects).map((proj, index) => (
            <div
              key={index}
              className={`pb-3 ${
                index > 0 ? "pt-3 border-t border-gray-200" : ""
              }`}
            >
              <h3 className="text-lg font-bold">{proj.title}</h3>
              <p className="text-sm">{proj.description}</p>

              <div className="mt-1 text-sm">
                <strong>Tech:</strong>{" "}
                {ensureArray(proj.technologiesUsed).join(" | ")}
              </div>

              {proj.githubLink && (
                <a
                  href={proj.githubLink}
                  target="_blank"
                  className="text-blue-700 hover:underline text-sm inline-block mt-1"
                >
                  <FaGithub className="inline mr-1" /> Project Link
                </a>
              )}
            </div>
          ))}
        </section>

        {/* ---------------- EDUCATION ---------------- */}
        <section>
          <h2 className={selectedTitleClass}>Education</h2>
          {ensureArray(data.education).map((edu, i) => (
            <div
              key={i}
              className={`flex justify-between pb-2 ${
                i > 0 ? "pt-2 border-t border-gray-200" : ""
              }`}
            >
              <div>
                <h3 className="text-lg font-bold">{edu.degree}</h3>
                <p className="text-sm italic">
                  {edu.university}, {edu.location}
                </p>
              </div>
              <p className="text-sm font-medium">
                Graduation: {edu.graduationYear}
              </p>
            </div>
          ))}
        </section>

        {/* ---------------- ADDITIONAL ---------------- */}
        {(data.certifications.length > 0 ||
          data.languages.length > 0 ||
          data.interests.length > 0) && (
          <section>
            <h2 className={selectedTitleClass}>Additional Information</h2>

            {ensureArray(data.certifications).length > 0 && (
              <p className="mb-1 text-sm">
                <strong>Certifications:</strong>{" "}
                {ensureArray(data.certifications)
                  .map((c) => `${c.title} (${c.year})`)
                  .join(" | ")}
              </p>
            )}

            {ensureArray(data.achievements).length > 0 && (
              <ul className="list-disc ml-5 mb-1 text-sm">
                {ensureArray(data.achievements).map((a, i) => (
                  <li key={i}>{a.title} ({a.year})</li>
                ))}
              </ul>
            )}

            {ensureArray(data.languages).length > 0 && (
              <p className="mb-1 text-sm">
                <strong>Languages:</strong>{" "}
                {ensureArray(data.languages).map((l) => l.name).join(", ")}
              </p>
            )}

            {ensureArray(data.interests).length > 0 && (
              <p className="text-sm">
                <strong>Interests:</strong>{" "}
                {ensureArray(data.interests)
                  .map((i) => i.name)
                  .join(", ")}
              </p>
            )}
          </section>
        )}
      </div>

      {/* ---------------- ACTION BUTTONS ---------------- */}
      <section className="flex justify-center mt-6 space-x-4 p-4 sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 shadow-xl print:hidden">
        <button
          onClick={handlePrint}
          className="btn bg-blue-800 hover:bg-blue-900 text-white shadow-lg"
        >
          <FaPrint className="mr-2" /> Print
        </button>

        <button
          onClick={handleDownloadPdf}
          className="btn bg-gray-700 hover:bg-gray-800 text-white shadow-lg"
        >
          <FaFilePdf className="mr-2" /> Export PDF
        </button>

        {onEdit && (
          <button
            onClick={onEdit}
            className="btn bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
          >
            <FaEdit className="mr-2" /> Edit
          </button>
        )}

        {onGenerateAnother && (
          <button
            onClick={onGenerateAnother}
            className="btn bg-red-600 hover:bg-red-700 text-white shadow-lg"
          >
            <FaUndo className="mr-2" /> Generate New
          </button>
        )}
      </section>
    </>
  );
};

export default Resume;

