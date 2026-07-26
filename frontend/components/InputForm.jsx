import { useState } from 'react';

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '28px 32px',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    textAlign: 'left',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-h)',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
  },
  input: {
    padding: '10px 12px',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    fontSize: '15px',
    fontFamily: 'var(--sans)',
    color: 'var(--text-h)',
    background: 'var(--code-bg)',
    outline: 'none',
  },
  button: {
    marginTop: '8px',
    padding: '12px 24px',
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
    fontFamily: 'var(--sans)',
    cursor: 'pointer',
    opacity: 1,
    transition: 'opacity 0.2s',
  },
  buttonDisabled: {
    opacity: 0.55,
    cursor: 'not-allowed',
  },
};

export default function InputForm({ onSubmit, isLoading }) {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('Beginner');
  const [platform, setPlatform] = useState('TikTok');
  const [goal, setGoal] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ topic, audience, platform, goal });
  }

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <div style={styles.fieldGroup}>
        <label style={styles.label} htmlFor="cf-topic">Topic</label>
        <input
          id="cf-topic"
          style={styles.input}
          type="text"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="e.g. How to start a podcast"
          required
        />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label} htmlFor="cf-audience">Audience</label>
        <select id="cf-audience" style={styles.input} value={audience} onChange={e => setAudience(e.target.value)}>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label} htmlFor="cf-platform">Platform</label>
        <select id="cf-platform" style={styles.input} value={platform} onChange={e => setPlatform(e.target.value)}>
          <option>TikTok</option>
          <option>YouTube</option>
          <option>LinkedIn</option>
        </select>
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label} htmlFor="cf-goal">Goal</label>
        <input
          id="cf-goal"
          style={styles.input}
          type="text"
          value={goal}
          onChange={e => setGoal(e.target.value)}
          placeholder="e.g. Educate, Inspire, Entertain"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        style={{ ...styles.button, ...(isLoading ? styles.buttonDisabled : {}) }}
      >
        {isLoading ? 'Generating…' : 'Generate Content'}
      </button>
    </form>
  );
}
