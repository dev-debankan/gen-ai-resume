import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import "../style/home.scss"

const Home = () => {
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const [resumeFile, setResumeFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setResumeFile(e.target.files[0]);
        }
    };

    const handleGenerate = async () => {
        if (!jobDescription) {
            setError("Job description is required.");
            return;
        }

        if (!resumeFile && !selfDescription) {
            setError("Either a Resume or a Self Description is required.");
            return;
        }

        setError("");
        setIsLoading(true);

        const formData = new FormData();
        formData.append("jobDescription", jobDescription);
        if (selfDescription) {
            formData.append("selfDescription", selfDescription);
        }
        if (resumeFile) {
            formData.append("resume", resumeFile);
        }

        try {
            const response = await axios.post("http://localhost:3000/api/interview", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            });

            if (response.data && response.data.interviewReport) {
                const report = response.data.interviewReport;
                navigate(`/interview/${report._id}`, { state: { reportData: report } });
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to generate report. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Create Your Custom <span className="highlight-text">Interview Plan</span></h1>
                <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
            </header>

            <main className="interview-panel-container">
                {/* Left Side */}
                <div className="panel left-panel">
                    <div className="panel-header">
                        <div className="header-title">
                            <span className="icon">💼</span> Target Job Description
                        </div>
                        <span className="tag required">Required</span>
                    </div>
                    
                    <div className="textarea-container">
                        <textarea 
                            name="jobDescription" 
                            id="jobDescription" 
                            placeholder='Paste the full job description here...&#10;e.g. "Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design..."'
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        ></textarea>
                        <div className="char-count">{jobDescription.length} / 5000 chars</div>
                    </div>
                </div>

                {/* Vertical Divider */}
                <div className="panel-divider"></div>

                {/* Right Side */}
                <div className="panel right-panel">
                    <div className="panel-header">
                        <div className="header-title">
                            <span className="icon">👤</span> Your Profile
                        </div>
                    </div>

                    <div className="upload-section">
                        <div className="section-label">
                            Upload Resume <span className="highlight-text recommended">(Recommended)</span>
                        </div>
                        <label className="file-drop-zone" htmlFor="resume">
                            <div className="upload-icon">☁️</div>
                            <div className="upload-text"><strong>{resumeFile ? resumeFile.name : "Click to upload or drag & drop"}</strong></div>
                            <div className="upload-subtext">PDF or DOCX (Max 5MB)</div>
                        </label>
                        <input hidden type="file" name='resume' id='resume' accept='.pdf,.docx' onChange={handleFileChange} />
                    </div>

                    <div className="separator">
                        <span>OR</span>
                    </div>

                    <div className="self-desc-section">
                        <div className="section-label">Quick Self-Description</div>
                        <textarea 
                            name="selfDescription" 
                            id="selfDescription" 
                            placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                            value={selfDescription}
                            onChange={(e) => setSelfDescription(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="info-box">
                        <span className="info-icon">ℹ️</span>
                        <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
                    </div>
                </div>
 
                {/* Footer of the panel */}
                <div className="panel-footer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {error && <div style={{ color: '#ff2a6d', marginBottom: '1rem' }}>{error}</div>}
                    <div className="processing-time">
                        <span className="sparkle"></span> AI-Powered Strategy Generation • Approx 30s
                    </div>
                    <button className="generate-btn primary-button" onClick={handleGenerate} disabled={isLoading}>
                        <span className="btn-icon"></span> {isLoading ? "Generating Strategy..." : "Generate My Interview Strategy"}
                    </button>
                </div>
            </main>

            <footer className="page-footer">
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
                <a href="#help">Help Center</a>
            </footer>
        </div>
    )
}

export default Home;