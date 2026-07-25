const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/generate", (req, res) => {
    res.json({
        script: "Mock script from backend",
        storyboard: [
            "Scene 1",
            "Scene 2",
            "Scene 3"
        ],
        mentor: {
            clarity: 8,
            engagement: 7,
            suggestions: "Improve hook and add real-world example"
        }
    });
});

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});