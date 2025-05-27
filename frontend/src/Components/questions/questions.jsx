import React, { useState } from 'react';
import Select from 'react-select';
import './questions.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useNavigate } from 'react-router-dom'
import Card from '../Card/Card';
import image3 from '../../image/selection-process.svg'
import image4 from '../../image/ai.svg'
import image5 from '../../image/writingfinal.svg'
import Header from '../Header/Header.jsx'
import Footer from '../footer/footer.jsx';
import finalGif from '../../assets/images/loader-Qton.gif'

export default function InterviewForm() {
    const [roleTitle, setRoleTitle] = useState('');
    const [experience, setExperience] = useState('');
    const [round, setRound] = useState('');
    const navigate = useNavigate();
    // const [assessments, setAssessments] = useState({
    //     communication: false,
    //     problemSolving: false,
    //     domainKnowledge: false,
    //     toolsProcesses: false,
    //     cultureFit: false,
    //     research: false,
    //     writing: false,
    //     objectionHandling: false,
    // });
    const [scenario, setScenario] = useState('');
    const [count, setCount] = useState(5);
    const [loading, setLoading] = useState(false);

   const [showLoaderPopup,setShowLoaderPopup]=useState(false);

    const [selectedOptions, setSelectedOptions] = useState([]);
    
 const experienceOptions = [
    { value: 'Fresher / Entry-Level', label: 'Fresher / Entry-Level' },
    { value: '1–3 Years', label: '1–3 Years' },
    { value: '3–6 Years', label: '3–6 Years' },
    { value: '6+ Years', label: '6+ Years' }
  ];

  const roundOptions = [
    { value: 'Pre-screening (video/self-recorded)', label: 'Pre-screening (video/self-recorded)' },
    { value: 'Assignment round', label: 'Assignment round' },
    { value: 'Live technical/functional', label: 'Live technical/functional' },
    { value: 'Final cultural fit / leadership round', label: 'Final cultural fit / leadership round' }
  ];



    const options = [
        { value: 'communication', label: 'Communication Skills' },
        { value: 'problemSolving', label: 'Problem Solving / Logical Thinking' },
        { value: 'domainKnowledge', label: 'Domain Knowledge' },
        { value: 'toolsProcesses', label: 'Tools & Processes' },
        { value: 'cultureFit', label: 'Culture Fit' },
        { value: 'research', label: 'Research & Preparation' },
        { value: 'writing', label: 'Writing or Presentation Skills' },
        { value: 'objectionHandling', label: 'Objection Handling / Sales Pitching' },
    ];
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!roleTitle || !experience || !round||selectedOptions.length===0) {
            return toast.error('Please fill in all required fields');
        }

        setLoading(true);
        setShowLoaderPopup(true);
        try {
            const res = await axios.post(
                'https://question-generator-b5n0.onrender.com/generate',

                {
                    role: roleTitle,
                    experience,
                    round,
                    assessments: selectedOptions.map((t)=>t.value),
                    scenario,
                    count,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

        //    setShowLoaderPopup(false);
            if (res.data.error) {
                toast.error(res.data.error);
                return;
            }
            
            navigate('/temp', {
                state: {
                    questions: res.data.questions
                }
            });

        } catch (error) {
            const errMsg = error.response?.data?.error || 'An unexpected error occurred';
            toast.error(errMsg); 
        }

        finally {
            setLoading(false);
             setShowLoaderPopup(false);
        }
    };
    return (

        <>
            <Header />

            <div >
                <h1 className='red'>Create Tailored Interview Questions in Seconds with Our Interview Question Generator</h1>
                <p className='zed'>Say goodbye to endless searches for the right interview questions. Our AI-powered generator instantly delivers structured, role-specific questions, helping you hire smarter and faster.</p>
            </div>
            <div className="container">
                <div className="card">
                   
                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-group">
                            <label>Role Title</label>
                            <input
                                type="text"
                                name="roleTitle"
                                value={roleTitle}
                                onChange={(e) => setRoleTitle(e.target.value)}
                                placeholder="e.g., Backend Developer"
                                className="input"
                                disabled={loading}
                            />
                        </div>
   <div className="form-group">
              <label>Candidate Experience Level</label>
              <Select
                name="experience"
                options={experienceOptions}
                value={experienceOptions.find(o => o.value === experience) || null}
                onChange={opt => setExperience(opt.value)}
                isDisabled={loading}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select experience level"

              />
            </div>

            <div className="form-group">
              <label>Interview Round</label>
              <Select
                name="round"
                options={roundOptions}
                value={roundOptions.find(o => o.value === round) || null}
                onChange={opt => setRound(opt.value)}
                isDisabled={loading}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select interview round"
              />
            </div>
                        <div className="form-group">
                             <label htmlFor="assess">What do you want to assess?</label>
                          <Select
                                id="assess"
                                name="assess"
                                isMulti
                                options={options}
                                value={selectedOptions}
                                onChange={setSelectedOptions}
                                closeMenuOnSelect={false}
                                placeholder="Select what you want to assess"
                                disabled={loading}
                                className="react-select-container"
                                classNamePrefix="react-select"
                               
                            />
                        </div>

                        <div className="form-group">
                            <label>Scenario or Responsibility(optional)</label>
                            <textarea
                                name="scenario"
                                rows={3}
                                placeholder="e.g., Lead a backend team building a real-time chat app."
                                value={scenario}
                                disabled={loading}
                                onChange={(e) => setScenario(e.target.value)}
                                className="textarea"
                            />
                        </div>

                        <button type="submit" className={`btn2 ${loading ? 'btn-loading' : ''}`} disabled={loading}>
                            {/* {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Generating Questions...
                                </>
                            ) : (
                                "Generate Questions"
                            )} */}
                                Generate Questions
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

            
        <Popup
          open={showLoaderPopup}
          modal
          closeOnDocumentClick={false}
            lockScroll={false}    
          contentStyle={{ width: '175px', height: '175px', padding: '1rem', background: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          overlayStyle={{ background: 'rgba(0,0,0,0.2)' }}
        >
          <img src={finalGif} alt="Loading..." style={{ width: '200px', height: '200px' }} />
        </Popup>

            <h2 className='red1'>  Why Choose Our AI Interview Question Generator ? </h2>

            <div className='card-div'>
                <Card image={image5} header='Generate Interview Questions Instantly' description='Forget manual research, our AI interview question generator delivers structured, job-specific questions in seconds.' />
                <Card image={image4} header='Empower Your Hiring Process with AI' description='Leverage cutting-edge AI in recruitment to automate prep work, accelerate decision-making, and reduce time-to-hire.' />
                <Card image={image3} header='Tailored for Any Role & Industry' description='Whether you’re hiring a software developer, sales leader, or marketing pro, our tool crafts perfectly matched interview questions every time.' />
            </div>

            <div className='footer'>
                <Footer />
            </div> 
        </>
    );
} 
