import React, { useState } from 'react';
import './questions.css';
import axios from 'axios'
import logo from '../../assets/images/Talviewlogo.png.png'
import { useNavigate } from "react-router"
export default function InterviewForm() {
    const [roleTitle, setRoleTitle] = useState('');
    const [experience, setExperience] = useState('');
    const [round, setRound] = useState('');
    const navigate = useNavigate();
    const [assessments, setAssessments] = useState({
        communication: false,
        problemSolving: false,
        domainKnowledge: false,
        toolsProcesses: false,
        cultureFit: false,
        research: false,
        writing: false,
        objectionHandling: false,
    });
    const [scenario, setScenario] = useState('');
    const [count, setCount] = useState(5);

    const handleCheckboxChange = (key) => {
        setAssessments(prev => ({ ...prev, [key]: !prev[key] }));
    };
  const goto =()=>{
     window.open("https://www.talview.com/en/", "_blank");
  }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                'http://localhost:5000/generate',
                {
                    role: roleTitle,
                    experience,
                    round,
                    assessments: Object.keys(assessments).filter(key => assessments[key]),
                    scenario,
                    count,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Response:', res.data.questions);


            navigate('/temp', {
                state: {
                    questions: res.data.questions
                }
            });

        } catch (error) {
            console.error('Error generating questions:', error);
        }
    };
    return (

        <>

            <header className="header">
                <div className="logo-container">
                    <img src={logo} alt="Company Logo" className="logo" onClick={goto}/>
                 
                </div>
            </header>


            <div className="container">
                <div className="card">
                    <h2 className="title">Universal Interview Question Generator</h2>
                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-group">
                            <label>Role Title</label>
                            <input
                                type="text"
                                name="roleTitle"
                                value={roleTitle}
                                onChange={(e) => setRoleTitle(e.target.value)}
                                placeholder="Sales Development Representative"
                                className="input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Candidate Experience Level</label>
                            <select
                                name="experience"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                className="select"
                                required
                            >
                                <option value="" disabled>Select experience level</option>
                                <option value="Fresher / Entry-Level">Fresher / Entry-Level</option>
                                <option value="1–3 Years">1–3 Years</option>
                                <option value="3–6 Years">3–6 Years</option>
                                <option value="6+ Years">6+ Years</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Interview Round</label>
                            <select
                                name="round"
                                value={round}
                                onChange={(e) => setRound(e.target.value)}
                                className="select"
                                required
                            >
                                <option value="" disabled>Select interview round</option>
                                <option value="Pre-screening (video/self-recorded)">Pre-screening (video/self-recorded)</option>
                                <option value="Assignment round">Assignment round</option>
                                <option value="Live technical/functional">Live technical/functional</option>
                                <option value="Final cultural fit / leadership round">Final cultural fit / leadership round</option>
                            </select>
                        </div>

                        <div className="form-group checkbox-group">
                            <label>What do you want to assess?</label>
                            <div>
                                {Object.entries(assessments).map(([key, checked]) => {
                                    const labelMap = {
                                        communication: 'Communication Skills',
                                        problemSolving: 'Problem Solving / Logical Thinking',
                                        domainKnowledge: 'Domain Knowledge',
                                        toolsProcesses: 'Tools & Processes',
                                        cultureFit: 'Culture Fit',
                                        research: 'Research & Preparation',
                                        writing: 'Writing or Presentation Skills',
                                        objectionHandling: 'Objection Handling / Sales Pitching',
                                    };
                                    return (
                                        <label key={key} className="checkbox-label">
                                            <input
                                                name="assessments"
                                                value={key}
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => handleCheckboxChange(key)}
                                            />
                                            {labelMap[key]}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Scenario or Task (Optional)</label>
                            <textarea
                                name="scenario"
                                rows={3}
                                placeholder="Add a brief scenario or task..."
                                value={scenario}
                                onChange={(e) => setScenario(e.target.value)}
                                className="textarea"
                            />
                        </div>
                     
                        <button type="submit" className="btn2">
                            Generate Questions
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
