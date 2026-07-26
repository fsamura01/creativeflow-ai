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

const fieldStyle = {
  marginBottom: '16px',
};

const labelStyle = {
  fontSize: '12px',
  fontWeight: '600',
  color: 'var(--accent)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  display: 'block',
  marginBottom: '4px',
};

const valueStyle = {
  fontSize: '15px',
  color: 'var(--text-h)',
  lineHeight: '1.6',
};

export default function CreativeBriefCard({ brief, onRefine, isRefining }) {
  if (!brief) return null;

  const { title, coreMessage, hookIdea, tone, keyTakeaway } = brief;

  return (
    <div style={cardStyle}>
      <div style={headingRowStyle}>
        <h2 style={headingStyle}>Creative Brief</h2>
        <span style={stepBadgeStyle}>Step 1 of 4</span>
      </div>

      <div style={fieldStyle}>
        <span style={labelStyle}>Title</span>
        <span style={valueStyle}>{title}</span>
      </div>

      <div style={fieldStyle}>
        <span style={labelStyle}>Core Message</span>
        <p style={valueStyle}>{coreMessage}</p>
      </div>

      <div style={fieldStyle}>
        <span style={labelStyle}>Hook Idea</span>
        <p style={valueStyle}>{hookIdea}</p>
      </div>

      <div style={fieldStyle}>
        <span style={labelStyle}>Tone</span>
        <span style={valueStyle}>{tone}</span>
      </div>

      <div style={{ ...fieldStyle, marginBottom: 0 }}>
        <span style={labelStyle}>Key Takeaway</span>
        <p style={valueStyle}>{keyTakeaway}</p>
      </div>

      {onRefine && <RefineBar onRefine={onRefine} isLoading={isRefining} />}
    </div>
  );
}
