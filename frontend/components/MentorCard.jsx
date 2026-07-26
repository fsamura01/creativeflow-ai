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

const scoreStyle = {
  display: 'inline-block',
  fontSize: '28px',
  fontWeight: '700',
  color: 'var(--accent)',
  fontFamily: 'var(--mono)',
  background: 'var(--accent-bg)',
  border: '1px solid var(--accent-border)',
  borderRadius: '8px',
  padding: '8px 20px',
  marginBottom: '24px',
};

const sectionStyle = {
  marginBottom: '20px',
};

const sectionHeadingStyle = {
  fontSize: '13px',
  fontWeight: '700',
  color: 'var(--text-h)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '8px',
  display: 'block',
};

const listStyle = {
  margin: '0',
  paddingLeft: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
};

const listItemStyle = {
  fontSize: '15px',
  color: 'var(--text-h)',
  lineHeight: '1.6',
};

function BulletList({ items }) {
  if (!items || items.length === 0) return null;
  return (
    <ul style={listStyle}>
      {items.map((item, i) => (
        <li key={i} style={listItemStyle}>{item}</li>
      ))}
    </ul>
  );
}

export default function MentorCard({ feedback, onRefine, isRefining }) {
  if (!feedback) return null;

  const { overallScore, strengths, improvements, nextSteps } = feedback;

  return (
    <div style={cardStyle}>
      <div style={headingRowStyle}>
        <h2 style={headingStyle}>Mentor Feedback</h2>
        <span style={stepBadgeStyle}>Step 5 of 5</span>
      </div>

      <div style={scoreStyle}>Score: {overallScore}/10</div>

      <div style={sectionStyle}>
        <span style={sectionHeadingStyle}>Strengths</span>
        <BulletList items={strengths} />
      </div>

      <div style={sectionStyle}>
        <span style={sectionHeadingStyle}>Improvements</span>
        <BulletList items={improvements} />
      </div>

      <div style={{ ...sectionStyle, marginBottom: 0 }}>
        <span style={sectionHeadingStyle}>Next Steps</span>
        <BulletList items={nextSteps} />
      </div>

      {onRefine && <RefineBar onRefine={onRefine} isLoading={isRefining} />}
    </div>
  );
}
