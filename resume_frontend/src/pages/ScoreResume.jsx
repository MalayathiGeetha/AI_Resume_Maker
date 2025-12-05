import React, { useState } from "react";
import { scoreResume } from "../api/ResumeService";

const ScoreResume = ({ resumeData }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [jobRole, setJobRole] = useState("Software Developer");

  const handleScore = async () => {
    setLoading(true);
    try {
      const res = await scoreResume(resumeData, jobRole);
      setResult(res);
    } catch (err) {
      console.error(err);
      alert("Error scoring resume. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-base-200 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Smart Resume Scoring</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Job Role</label>
        <select value={jobRole} onChange={(e)=>setJobRole(e.target.value)} className="select select-bordered w-full max-w-xs">
          <option>Software Developer</option>
          <option>Data Analyst</option>
          <option>ML Engineer</option>
          <option>Cloud DevOps</option>
          <option>Product Manager</option>
          <option>UI/UX Designer</option>
          <option>AI</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button onClick={handleScore} className="btn btn-primary" disabled={loading}>
          {loading ? "Scoring..." : "Score Resume"}
        </button>
      </div>

      {result && (
        <div className="mt-6">
          <div className="flex items-center gap-6">
            <div className="w-40 h-40 rounded-full bg-white shadow flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold">{result.overallScore}</div>
                <div className="text-sm text-gray-600">/ 100</div>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold">Category breakdown</h3>
              <ul className="mt-2 space-y-1">
                {Object.entries(result.categoryScores).map(([k,v]) => (
                  <li key={k} className="flex justify-between">
                    <span>{k}</span>
                    <span className="font-semibold">{v}/100</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold">Strengths</h4>
            <ul className="list-disc ml-5">
              {result.strengths && result.strengths.length>0 ? result.strengths.map((s,i)=><li key={i}>{s}</li>) : <li>None detected</li>}
            </ul>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold">Areas to improve</h4>
            <ul className="list-disc ml-5 text-red-600">
              {result.suggestions && result.suggestions.length>0 ? result.suggestions.map((s,i)=><li key={i}>{s}</li>) : <li>Looks good</li>}
            </ul>
          </div>

          <div className="mt-4">
            <details className="p-3 bg-base-100 rounded">
              <summary className="cursor-pointer">Detailed diagnostic</summary>
              <pre className="whitespace-pre-wrap text-sm mt-2">{JSON.stringify(result.details, null, 2)}</pre>
            </details>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreResume;

