import React, { useState } from 'react';
import './questions.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../assets/images/Talviewlogo.png.png'
import { useNavigate } from 'react-router-dom'
import Card from '../Card/Card';
import image1 from '../../image/hired.svg'
import image2 from '../../image/writing.svg'
import image3 from '../../image/selection-process.svg'
import image4 from '../../image/ai.svg'
import image5 from '../../image/writingfinal.svg'

import Header from '../Header/Header.jsx'
import Footer from '../footer/footer.jsx';

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
    const [loading, setLoading] = useState(false);
  
    const handleCheckboxChange = (key) => {
        setAssessments(prev => ({ ...prev, [key]: !prev[key] }));
    };
    const goto = () => {
        window.open("https://www.talview.com/en/", "_blank");
    }

    const handleSubmit = async (e) => {

     
        e.preventDefault();

        if (!roleTitle || !experience || !round) {
            return toast.error('Please fill in all required fields');
        }

        if (Object.values(assessments).every((v) => v === false)) {
            return toast.error('Select at least one assessment');
        }
        setLoading(true);


        try {
            const res = await axios.post(
                'https://question-generator-b5n0.onrender.com/generate',
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
            return toast.error('Error generating questions:', error);
        }
        finally {
            setLoading(false);
        }
    };
    return (

        <>

            {/* <header className="header">
                <div className="logo-container">
                    <img src={logo} alt="Company Logo" className="logo" onClick={goto} />

                </div>
            </header> */}
           
    <Header/>
      
            <div >
                <h1 className='red'>Create Tailored Interview Questions in Seconds with Our Interview Question Generator</h1>
                <p className='zed'>Say goodbye to endless searches for the right interview questions. Our AI-powered generator instantly delivers structured, role-specific questions—helping you hire smarter, faster.</p>
            </div>

            <div className="container">


                <div className="card">
                    {/* <h2 className="title">Universal Interview Question Generator</h2> */}
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

                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label>Candidate Experience Level</label>
                            <select
                                name="experience"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                className="select"

                                disabled={loading}
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
                                disabled={loading}

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
                                                disabled={loading}
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
                                disabled={loading}
                                onChange={(e) => setScenario(e.target.value)}
                                className="textarea"
                            />
                        </div>

                    

                        <button type="submit" className="btn2" disabled={loading}>
                            {!loading ? "Generate Questions" : "Generating Questions"}

                        </button>

                    </form>

                    <ToastContainer
                        position="top-right"
                        autoClose={1000}
                        hideProgressBar={false}
                        closeOnClick
                        pauseOnHover
                    />
                </div>
            </div>
  
            <h2 className='red1'>  Why Choose Our AI Interview Question Generator ? </h2>

         <div className='card-div'>     
       <Card image={image5}  header='Generate Interview Questions Instantly' description='Forget manual research, our AI interview question generator delivers structured, job-specific questions in seconds.'/>
       <Card image={image4}  header='Empower Your Hiring Process with AI' description='Leverage cutting-edge AI in recruitment to automate prep work, accelerate decision-making, and reduce time-to-hire.'/>
       <Card image={image3}  header='Tailored for Any Role & Industry' description='Whether you’re hiring a software developer, sales leader, or marketing pro, our tool crafts perfectly matched interview questions every time.'/>
         </div>
       
   <div className='footer'>
      <Footer/>
      </div>
        </>
    );
}
