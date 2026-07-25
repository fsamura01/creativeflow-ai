import { useState } from "react";

function App() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("Beginner");
  const [platform, setPlatform] = useState("TikTok");

  const [result, setResult] = useState(null);

  const generateContent = async () => {
    const response = await fetch("http://localhost:3001/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic,
        audience,
        platform,
      }),
    });

    const data = await response.json();
    console.log("🚀 ~ generateContent ~ data:", data)
    setResult(data);
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

