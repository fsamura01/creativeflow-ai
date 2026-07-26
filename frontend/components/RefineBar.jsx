import { useState } from 'react';

const wrapStyle = {
  marginTop: '16px',
  paddingTop: '16px',
  borderTop: '1px solid var(--border)',
  display: 'flex',
  gap: '8px',
  alignItems: 'flex-start',
};

const inputStyle = {
  flex: 1,
  padding: '9px 12px',
  fontSize: '14px',
  fontFamily: 'var(--sans)',
  color: 'var(--text-h)',
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  outline: 'none',
  lineHeight: '1.5',
  resize: 'none',
};

const btnStyle = (disabled) => ({
  padding: '9px 16px',
  fontSize: '13px',
  fontWeight: '600',
  fontFamily: 'var(--sans)',
  color: disabled ? 'var(--text)' : '#fff',
  background: disabled ? 'var(--border)' : 'var(--accent)',
  border: 'none',
  borderRadius: '6px',
  cursor: disabled ? 'not-allowed' : 'pointer',
  whiteSpace: 'nowrap',
  flexShrink: 0,
});

/**
 * RefineBar — instruction input + Refine button attached to the bottom of any output card.
 *
 * Props:
 *   onRefine(instruction: string) — called when the user submits a refinement instruction
 *   isLoading: boolean             — disables the button while a request is in flight
 */
export default function RefineBar({ onRefine, isLoading }) {
  const [instruction, setInstruction] = useState('');

  function handleSubmit() {
    const trimmed = instruction.trim();
    if (!trimmed || isLoading) return;
    onRefine(trimmed);
    setInstruction('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div style={wrapStyle}>
      <textarea
        rows={1}
        style={inputStyle}
        placeholder="Refine this section… e.g. make the tone more energetic"
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      <button
        style={btnStyle(isLoading || !instruction.trim())}
        onClick={handleSubmit}
        disabled={isLoading || !instruction.trim()}
      >
        {isLoading ? 'Refining…' : 'Refine ✦'}
      </button>
    </div>
  );
}
