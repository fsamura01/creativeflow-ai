import { useState } from 'react';
import RefineBar from './RefineBar';

const cardStyle = {
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: '10px',
  padding: '28px 32px',
  textAlign: 'left',
};

const headingRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '20px',
  paddingBottom: '12px',
  borderBottom: '1px solid var(--border)',
};

const headingStyle = {
  fontSize: '20px',
  fontWeight: '600',
  color: 'var(--text-h)',
  fontFamily: 'var(--heading)',
  margin: 0,
  flex: 1,
};

const stepBadgeStyle = {
  fontSize: '11px',
  fontWeight: '700',
  color: 'var(--accent)',
  background: 'var(--accent-bg)',
  border: '1px solid var(--accent-border)',
  borderRadius: '20px',
  padding: '2px 9px',
  letterSpacing: '0.04em',
  whiteSpace: 'nowrap',
};

const copyBtnStyle = (copied) => ({
  fontSize: '12px',
  fontWeight: '600',
  fontFamily: 'var(--sans)',
  color: copied ? 'var(--accent)' : 'var(--text)',
  background: 'transparent',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  padding: '3px 10px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  flexShrink: 0,
});

const sectionStyle = {
  marginBottom: '20px',
};

const labelStyle = {
  fontSize: '12px',
  fontWeight: '600',
  color: 'var(--accent)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  display: 'block',
  marginBottom: '6px',
};

const preStyle = {
  margin: 0,
  fontFamily: 'var(--sans)',
  fontSize: '15px',
  color: 'var(--text-h)',
  lineHeight: '1.7',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
};

const callToActionStyle = {
  background: 'var(--accent-bg)',
  border: '1px solid var(--accent-border)',
  borderRadius: '6px',
  padding: '12px 16px',
  fontSize: '15px',
  color: 'var(--text-h)',
  lineHeight: '1.6',
};

export default function ScriptCard({ script, onRefine, isRefining }) {
  const [copied, setCopied] = useState(false);

  if (!script) return null;

  const { hook, script: body, callToAction } = script;

  function handleCopy() {
    const text = `HOOK\n${hook}\n\nSCRIPT\n${body}\n\nCALL TO ACTION\n${callToAction}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={cardStyle}>
      <div style={headingRowStyle}>
        <h2 style={headingStyle}>Script</h2>
        <span style={stepBadgeStyle}>Step 2 of 4</span>
        <button style={copyBtnStyle(copied)} onClick={handleCopy}>
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>

      <div style={sectionStyle}>
        <span style={labelStyle}>Hook</span>
        <pre style={preStyle}>{hook}</pre>
      </div>

      <div style={sectionStyle}>
        <span style={labelStyle}>Script</span>
        <pre style={preStyle}>{body}</pre>
      </div>

      <div style={{ ...sectionStyle, marginBottom: 0 }}>
        <span style={labelStyle}>Call to Action</span>
        <div style={callToActionStyle}>{callToAction}</div>
      </div>

      {onRefine && <RefineBar onRefine={onRefine} isLoading={isRefining} />}
    </div>
  );
}
