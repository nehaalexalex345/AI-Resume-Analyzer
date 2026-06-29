const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfjs = require("pdfjs-dist/legacy/build/pdf");

const app = express();

app.use(cors());

// store uploaded file
const upload = multer({
  storage: multer.memoryStorage(),
});

// testing route

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    // 1. Get uploaded file

    let file = req.file;

    console.log("File received:");
    console.log(file.originalname);

    // 2. Convert PDF into readable format

    let pdfData = new Uint8Array(file.buffer);

    // 3. Open PDF

    let pdf = await pdfjs.getDocument(pdfData).promise;

    let resumeText = "";

    // 4. Read all pages

    for (let i = 1; i <= pdf.numPages; i++) {
      let page = await pdf.getPage(i);

      let content = await page.getTextContent();

      content.items.forEach((item) => {
        resumeText += item.str + " ";
      });
    }

    console.log("Resume text:");

    console.log(resumeText);

    // 5. Skills database

    let skills = [
      "React",
      "JavaScript",
      "Node.js",
      "Python",
      "Java",
      "SQL",
      "MongoDB",
      "Git",
    ];

    let foundSkills = [];
    let missingSkills = [];

    // 6. Check skills

    skills.forEach((skill) => {
      let pattern = new RegExp("\\b" + skill + "\\b", "i");

      if (pattern.test(resumeText)) {
        foundSkills.push(skill);
      }
    });
    //cheching the missing skill loop

    skills.forEach((skill) => {
      if (!foundSkills.includes(skill)) {
        missingSkills.push(skill);
      }
    });

    console.log("Found skills:");

    console.log(foundSkills);

    // 7. Calculate score

    let score = (foundSkills.length / skills.length) * 100;

    // 8. Send result to frontend

    res.json({
      text: resumeText,

      skills: foundSkills,

      missingSkills: missingSkills,

      score: Math.round(score),
    });
  } catch (error) {
    console.log("Error:", error);

    res.status(500).json({
      message: "Resume analysis failed",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
