import React, { useState } from "react";
import { generateCoverLetter } from "../api/ResumeService";

const CoverLetter = ({ resumeData, defaultRole = "Software Developer" }) => {
  const [jobRole, setJobRole] = useState(defaultRole);
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [letter, setLetter] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const resp = await generateCoverLetter(resumeData, jobRole, company, jobTitle, 220);
      setLetter(resp);
    } catch (err) {
      console.error(err);
      alert("Error generating cover letter. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!letter || !letter.coverLetter) return;
    navigator.clipboard.writeText(letter.coverLetter);
    alert("Cover letter copied to clipboard");
  };

  const downloadTxt = () => {
    if (!letter || !letter.coverLetter) return;
    const blob = new Blob([letter.coverLetter], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const filename = (letter.subject || 'cover-letter').replace(/\s+/g, '_') + ".txt";
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow">
      <h3 className="text-xl font-semibold mb-3">AI Cover Letter Generator</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div>
          <label className="text-sm">Job Role</label>
          <input value={jobRole} onChange={(e)=>setJobRole(e.target.value)} className="input input-bordered w-full" />
        </div>
        <div>
          <label className="text-sm">Company (optional)</label>
          <input value={company} onChange={(e)=>setCompany(e.target.value)} className="input input-bordered w-full" />
        </div>
        <div>
          <label className="text-sm">Job Title (optional)</label>
          <input value={jobTitle} onChange={(e)=>setJobTitle(e.target.value)} className="input input-bordered w-full" />
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={handleGenerate} className="btn btn-primary" disabled={loading}>
          {loading ? "Generating..." : "Generate Cover Letter"}
        </button>
        <button onClick={copyToClipboard} className="btn" disabled={!letter}>Copy</button>
        <button onClick={downloadTxt} className="btn" disabled={!letter}>Download (.txt)</button>
      </div>

      {letter && (
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <div className="mb-2">
            <strong>Subject:</strong> {letter.subject}
          </div>
          <div className="prose whitespace-pre-wrap">
            {letter.coverLetter}
          </div>
          {letter.shortPitch && (
            <div className="mt-3">
              <strong>Short pitch:</strong> {letter.shortPitch}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CoverLetter;

