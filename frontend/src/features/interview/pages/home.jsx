import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { getAllInterviewReports, deleteInterviewReport } from '../services/interview.api'
import { useAuth } from '../../auth/hooks/useAuth'
import "../style/home.scss"

const Home = () => {
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const [resumeFile, setResumeFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [recentPlans, setRecentPlans] = useState([]);
    const [fetchingPlans, setFetchingPlans] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const navigate = useNavigate();
    const { handleLogout } = useAuth();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await getAllInterviewReports();
                setRecentPlans(data.interviewReport || []);
            } catch (err) {
                console.error("Failed to fetch recent plans", err);
            } finally {
                setFetchingPlans(false);
            }
        };
        fetchPlans();
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setResumeFile(e.target.files[0]);
        }
    };

    const handleDeletePlan = async (e, planId) => {
        e.preventDefault(); 
        e.stopPropagation();

        if (!window.confirm("Are you sure you want to delete this report?")) {
            return;
        }
        
        try {
            await deleteInterviewReport(planId);
            setRecentPlans(prev => prev.filter(plan => plan._id !== planId));
        } catch (err) {
            console.error("Failed to delete plan", err);
            alert(err.response?.data?.message || "Failed to delete the report. Please try again.");
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
            {/* Sidebar */}
            <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
            <div className={`sidebar left-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>Past Reports</h2>
                    <button className="close-btn" onClick={() => setIsSidebarOpen(false)}>✕</button>
                </div>
                
                <div className="sidebar-content">
                    {fetchingPlans ? (
                        <p className="loading-text">Loading...</p>
                    ) : recentPlans.length > 0 ? (
                        <div className="sidebar-plans-list">
                            {recentPlans.map(plan => (
                                <Link to={`/interview/${plan._id}`} key={plan._id} className="sidebar-plan-card">
                                    <div className="plan-card-header">
                                        <h4>{plan.title || "Interview Plan"}</h4>
                                        <button className="delete-plan-btn" onClick={(e) => handleDeletePlan(e, plan._id)} title="Delete Report">
                                            <span className="icon">🗑️</span>
                                        </button>
                                    </div>
                                    <p className="sidebar-plan-date">Generated on {new Date(plan.createdAt).toLocaleDateString()}</p>
                                    <p className="sidebar-plan-score">Match Score: <span>{plan.matchScore || 0}%</span></p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="no-plans-text">No past reports found.</p>
                    )}
                </div>

                <div className="sidebar-footer">
                    <button className="logout-btn button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            <header className="home-header">
                <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>
                    ☰
                </button>
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
                        <span className="sparkle">✨</span> AI-Powered Strategy Generation • Approx 30s
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