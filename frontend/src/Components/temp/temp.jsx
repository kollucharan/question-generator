
import React from 'react';
import { useLocation,  useNavigate,Navigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import './temp.css';
import logo from '../../assets/images/Talviewlogo.png.png'
export default function Temp() {
  const location = useLocation();
  const navigate = useNavigate();
  let { questions } = location.state || {};

  
  if (typeof questions === 'string') {
    try { questions = JSON.parse(questions); } catch { questions = {}; }
  }


  if (!questions || typeof questions !== 'object' || Array.isArray(questions) || Object.keys(questions).length === 0) {
    return <Navigate to="/" replace />;
  }
  const goto =()=>{
    window.open("https://www.talview.com/en/", "_blank");
 }


  const handleCopy = () => {
    const text = Object.entries(questions)
      .map(([h, list]) => `${h}:\n- ` + list.join('\n- '))
      .join('\n\n');
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
  };
  

   const handleEdit =()=>{
    
    window.open("https://www.talview.com/en/", "_blank");
   }

   const handlePDF = () => {
    const doc = new jsPDF();
    let y = 10;
    doc.setFontSize(16);
    doc.text('Generated Interview Questions', 10, y);
    y += 10;
  
    Object.entries(questions).forEach(([h, list]) => {
      doc.setFontSize(14);
      doc.text(h, 10, y);
      y += 8;
  
      doc.setFontSize(12);
      list.forEach(q => {
        const lines = doc.splitTextToSize(`• ${q}`, 180); // max width for text wrapping
        lines.forEach(line => {
          doc.text(line, 12, y);
          y += 7;
          if (y > 280) {
            doc.addPage();
            y = 10;
          }
        });
        y += 4; // small gap between questions
      });
  
      y += 6; // gap between sections
    });
  
    doc.save('interview_questions.pdf');
  };
  

  return (
  <>

            <header className="header">
                <div className="logo-container">
                    <img src={logo} alt="Company Logo" className="logo" onClick={goto}/>
                </div>
                   
            </header>
    <div className="temp-container">
      <div className="temp-header">
        <h3 className="temp-title">Generated Questions</h3>
        <div className="temp-toolbar">
          <button onClick={() => navigate('/')} className="btn">Home</button>
          <button onClick={handleEdit} className="btn">Edit</button>
          <button onClick={handleCopy} className="btn">Copy</button>
          <button onClick={handlePDF} className="btn">Download PDF</button>
        </div>
      </div>

      {Object.entries(questions).map(([heading, list]) => (
        <section key={heading} className="temp-section">
          <h2 className="section-heading">{heading}</h2>
          <ul>
            {Array.isArray(list) && list.length > 0 ? (
              list.map((q, i) => <li key={i}>{q}</li>)
            ) : (
              <li><em>No questions for this section.</em></li>
            )}
          </ul>
        </section>
      ))}
    </div>

    </>
  );
}


