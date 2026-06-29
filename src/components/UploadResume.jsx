import { useState } from "react";
import axios from "axios";
import "./UploadResume.css";

function UploadResume() {
  const [file, setFile] = useState(null);

  const [result, setResult] = useState("");
  const [skills, setSkills] = useState([]);
  const [missingSkills, setmissingSkills] = useState([]);

  const [score, setScore] = useState(0);

  const analyzeResume = async () => {
    console.log("Analayze clicked");

    const formData = new FormData();

    formData.append("resume", file);

    const response = await axios.post("http://localhost:5000/upload", formData);
    console.log(response.data);

    setResult(response.data.text);

    setSkills(response.data.skills);

    setmissingSkills(response.data.missingSkills);

    setScore(response.data.score);
  };

  return (
    <div className="page">
        <h1>AI Resume Analyzer</h1>
        <div className="card">
      <h2>Upload Resume</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button onClick={analyzeResume}>Analyze</button>
      </div>
      <div className="result card">

      <h2>Resume Score: {score}%</h2>
      <h2>Skills Found:</h2>
      <div className="skills">
      <ul>
        {skills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
      </div> 
     <h2>Missing Skills:</h2>
     <div className="missing">
<ul>

{
missingSkills.map((skill,index)=>(

<li key={index}>
{skill}
</li>

))
}
</ul>
</div>



      <h2>Resume Content:</h2>

      <p className="resume-text">

{result}

</p>
    </div>
    </div>
  );
}

export default UploadResume;
