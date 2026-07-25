import { useState } from "react";

function App() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("Beginner");
  const [platform, setPlatform] = useState("TikTok");

  const [result, setResult] = useState(null);

  const generateContent = async () => {
    // Fake data for now (we will connect IBM later)
    setResult({
      script: "Hook: Ever wondered how computers detect anagrams?",
      storyboard: [
        "Scene 1: Hook animation",
        "Scene 2: Sorting letters",
        "Scene 3: Code explanation",
      ],
      mentor: {
        clarity: 8,
        engagement: 7,
        suggestions: "Improve hook and add real-world example",
      },
    });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>CreativeFlow AI</h1>

      {/* INPUT SECTION */}
      <div>
        <input
          placeholder="Enter topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <select value={audience} onChange={(e) => setAudience(e.target.value)}>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
          <option>TikTok</option>
          <option>YouTube</option>
          <option>LinkedIn</option>
        </select>

        <button onClick={generateContent}>Generate Content</button>
      </div>

      {/* OUTPUT SECTION */}
      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>Script</h2>
          <p>{result.script}</p>

          <h2>Storyboard</h2>
          <ul>
            {result.storyboard.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          <h2>Mentor Feedback</h2>
          <p>Clarity: {result.mentor.clarity}/10</p>
          <p>Engagement: {result.mentor.engagement}/10</p>
          <p>{result.mentor.suggestions}</p>
        </div>
      )}
    </div>
  );
}

export default App;
