import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../interview/style/interview.scss';

// Dummy data from your exact provided JSON
const dummyData = {
  "_id": {
    "$oid": "69deb66040ff7586cea1e790"
  },
  "matchScore": 68,
  "technicalQuestionSchema": [
    {
      "question": "Can you explain the difference between client-side rendering in React and server-side rendering in Next.js, and when would you choose one over the other for a MERN application?",
      "intention": "To assess the candidate's understanding of different rendering strategies and their proficiency in the frameworks they listed.",
      "answer": "The candidate should explain that CSR (React) happens in the browser, providing a snappy UI but slower initial load, while SSR (Next.js) happens on the server, improving SEO and initial load speed. They should mention using Next.js for content-heavy sites and React for complex internal dashboards."
    },
    {
      "question": "How do you implement secure authentication in a Node.js/Express environment using JWT?",
      "intention": "To verify the candidate's knowledge of security and backend authentication, as requested in the JD.",
      "answer": "The candidate should describe the flow: User submits credentials, server verifies and issues a signed JWT, the client stores it (preferably in an HTTP-only cookie), and then sends it in the header for protected routes where middleware verifies the signature."
    },
    {
      "question": "In MongoDB, what are indexes and why are they important for building scalable applications?",
      "intention": "To evaluate the candidate's understanding of NoSQL database performance and scalability.",
      "answer": "They should explain that indexes are data structures that store a small portion of the data set in an easy-to-traverse form. Without indexes, MongoDB must perform a collection scan (searching every document), which is inefficient for large datasets."
    },
    {
      "question": "What is 'Middleware' in the context of Express.js, and can you give an example of a custom middleware you might write?",
      "intention": "To test foundational knowledge of the Express framework.",
      "answer": "Middleware are functions that have access to the request, response, and the next middleware function. An example would be a logging middleware that records request methods and URLs, or an authentication checker."
    },
    {
      "question": "How does the Node.js event loop handle asynchronous operations, and why is it beneficial for a web server?",
      "intention": "To check deep technical understanding of the Node.js runtime environment.",
      "answer": "The candidate should explain that Node.js uses a single-threaded non-blocking I/O model. It offloads tasks like file system operations or network requests to the system kernel or a worker pool, allowing the main thread to handle multiple concurrent connections efficiently."
    }
  ],
  "behavioralQuestionSchema": [
    {
      "question": "Describe a time during the Smart India Hackathon where your team faced a technical deadlock. How did you resolve it?",
      "intention": "To evaluate problem-solving skills and teamwork under pressure.",
      "answer": "The candidate should use the STAR method, focusing on how they analyzed the problem, facilitated communication, and reached a compromise or technical solution to meet the deadline."
    },
    {
      "question": "As a GDG Campus Organizer, how did you handle a situation where a core team member failed to deliver on their responsibilities?",
      "intention": "To assess leadership and conflict management capabilities.",
      "answer": "The candidate should highlight their ability to have professional conversations, re-allocate resources if necessary, and ensure the event's success while maintaining team morale."
    },
    {
      "question": "The JD requires 1-3 years of experience, but you are a graduating student. Why should we consider your project experience equivalent to professional tenure?",
      "intention": "To see the candidate's confidence and how they quantify their self-taught and hackathon experience.",
      "answer": "The candidate should focus on the complexity of the Event Management Website they built, their leadership in Google communities, and their ability to learn and deploy new stacks (like Next.js) rapidly."
    },
    {
      "question": "Can you share an example of a time you had to learn a completely new technology under a tight deadline?",
      "intention": "To gauge adaptability and rapid learning capability in fast-paced startup environments.",
      "answer": "Explain the situation where they had to pick up a new library or tool (like MongoDB or Redis). Mention how they skimmed documentation, built POCs, and effectively integrated it before the deadline."
    },
    {
      "question": "Tell me about a time you disagreed with an architectural decision made by a senior team member or a peer.",
      "intention": "To test communication skills, humility, and the ability to handle technical disagreements professionally.",
      "answer": "Focus on active listening, presenting data-backed arguments or alternatives (e.g., choosing NoSQL vs SQL), and ultimately committing to the team's final decision without resentment."
    }
  ],
  "skillGapSchema": [
    { "skill": "1-3 years of Professional Experience", "severity": "high" },
    { "skill": "Message Queues (Kafka/RabbitMQ)", "severity": "high" },
    { "skill": "Advanced Docker & CI/CD Pipelines", "severity": "medium" },
    { "skill": "Distributed Systems Design", "severity": "medium" },
    { "skill": "Production-level Redis management", "severity": "low" }
  ],
  "preparationPlanSchema": [
    {
      "day": 1,
      "focus": "Node.js Internals & Streams",
      "tasks": [
        "Deep dive into the Event Loop phases and process.nextTick vs setImmediate.",
        "Practice implementing Node.js Streams for handling large data sets."
      ]
    },
    {
      "day": 2,
      "focus": "Advanced MongoDB & Indexing",
      "tasks": [
        "Study Compound Indexes, TTL Indexes, and Text Indexes.",
        "Practice writing complex Aggregation pipelines and using the .explain('executionStats') method."
      ]
    },
    {
      "day": 3,
      "focus": "Caching & Redis Strategies",
      "tasks": [
        "Read about Redis data types beyond strings (Sets, Hashes, Sorted Sets).",
        "Implement a Redis-based rate limiter or a caching layer for a sample API."
      ]
    },
    {
      "day": 4,
      "focus": "System Design & Microservices",
      "tasks": [
        "Study Microservices communication patterns (Synchronous vs Asynchronous).",
        "Learn about the API Gateway pattern and Circuit Breakers."
      ]
    },
    {
      "day": 5,
      "focus": "Message Queues & DevOps Basics",
      "tasks": [
        "Watch introductory tutorials on RabbitMQ or Kafka.",
        "Understand publisher/subscriber models and durable message queues."
      ]
    },
    {
      "day": 6,
      "focus": "CI/CD & Containerization",
      "tasks": [
        "Create a multi-stage Dockerfile for a Node.js application.",
        "Write a basic GitHub Actions workflow to run tests on push."
      ]
    },
    {
      "day": 7,
      "focus": "Mock Interviews & Review",
      "tasks": [
        "Conduct a technical mock interview focused on system design.",
        "Review behavioral STAR stories and finalize resume talking points."
      ]
    }
  ]
};

const InterviewReport = () => {
    const location = useLocation();
    // Use the fetched data passed from Home component via state, fallback to dummyData
    const data = location.state?.reportData || dummyData;
    const [activeTab, setActiveTab] = useState("Technical questions");

    return (
        <div className="interview-layout">
            {/* Left Sidebar - Navigation */}
            <aside className="left-sidebar">
                <div className="sidebar-section-title">SECTIONS</div>
                <nav className="nav-menu">
                    <button 
                        className={`nav-btn ${activeTab === 'Technical questions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Technical questions')}
                    >
                        <span className="btn-icon">&lt;&gt;</span> Technical questions
                    </button>
                    <button 
                        className={`nav-btn ${activeTab === 'Behavioral questions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Behavioral questions')}
                    >
                        <span className="btn-icon">💬</span> Behavioral questions
                    </button>
                    <button 
                        className={`nav-btn ${activeTab === 'Road Map' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Road Map')}
                    >
                        <span className="btn-icon">🚀</span> Road Map
                    </button>
                </nav>
            </aside>

            {/* Middle Pane - Main Content */}
            <main className="main-content">
                <div className="content-header">
                    <h2>{activeTab === 'Road Map' ? 'Preparation Road Map' : activeTab}</h2>
                    {activeTab === 'Road Map' && <span className="title-badge">7-day plan</span>}
                    {activeTab !== 'Road Map' && <span className="title-badge">{data[activeTab === 'Technical questions' ? 'technicalQuestionSchema' : 'behavioralQuestionSchema'].length} questions</span>}
                </div>
                <div className="content-container">
                    {activeTab === 'Technical questions' && (
                        <div className="qa-list">
                            {data.technicalQuestionSchema.map((item, index) => (
                                <div key={index} className="qa-card">
                                    <div className="qa-header">
                                        <span className="q-badge">Q{index + 1}</span>
                                        <h3 className="question-text">{item.question}</h3>
                                        <span className="expand-icon">^</span>
                                    </div>
                                    <div className="qa-body">
                                        <div className="badge intention-badge">INTENTION</div>
                                        <p className="intention-text">{item.intention}</p>
                                        
                                        <div className="badge model-answer-badge">MODEL ANSWER</div>
                                        <p className="answer-text">{item.answer}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'Behavioral questions' && (
                        <div className="qa-list">
                            {data.behavioralQuestionSchema.map((item, index) => (
                                <div key={index} className="qa-card">
                                    <div className="qa-header">
                                        <span className="q-badge">Q{index + 1}</span>
                                        <h3 className="question-text">{item.question}</h3>
                                        <span className="expand-icon">^</span>
                                    </div>
                                    <div className="qa-body">
                                        <div className="badge intention-badge">INTENTION</div>
                                        <p className="intention-text">{item.intention}</p>
                                        
                                        <div className="badge model-answer-badge">MODEL ANSWER</div>
                                        <p className="answer-text">{item.answer}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'Road Map' && (
                        <div className="roadmap-timeline">
                            {data.preparationPlanSchema.map((item, index) => (
                                <div key={index} className="timeline-item">
                                    <div className="timeline-marker"></div>
                                    <div className="timeline-content">
                                        <div className="timeline-header">
                                            <span className="day-badge">Day {item.day}</span>
                                            <h3 className="focus-text">{item.focus}</h3>
                                        </div>
                                        <ul className="task-list">
                                            {item.tasks.map((task, tIndex) => (
                                                <li key={tIndex} className="task-item">{task}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Right Sidebar - Match Score & Skill Gaps */}
            <aside className="right-sidebar">
                <div className="right-section match-score-section">
                    <div className="section-title">MATCH SCORE</div>
                    <div className="circular-progress-container">
                        <svg className="circular-progress" viewBox="0 0 100 100">
                            <circle className="progress-bg" cx="50" cy="50" r="40"></circle>
                            <circle 
                                className="progress-value" 
                                cx="50" cy="50" r="40" 
                                style={{ strokeDasharray: `${data.matchScore * 2.51} 251` }}
                            ></circle>
                        </svg>
                        <div className="progress-text">
                            <span className="score">{data.matchScore}</span>
                            <span className="percent">%</span>
                        </div>
                    </div>
                    <div className="match-status">
                        {data.matchScore >= 80 ? "Strong match for this role" : data.matchScore >= 60 ? "Moderate match for this role" : "Low match for this role"}
                    </div>
                </div>

                <div className="right-section skill-gaps-section">
                    <div className="section-title">SKILL GAPS</div>
                    <div className="skill-pills">
                        {data.skillGapSchema.map((item, index) => (
                            <div 
                                key={index} 
                                className={`pill ${item.severity === 'high' ? 'high-severity' : item.severity === 'medium' ? 'medium-severity' : 'low-severity'}`}
                            >
                                {item.skill}
                            </div>
                        ))}
                    </div>
                </div>
            </aside>
        </div>
    )
}

export default InterviewReport;