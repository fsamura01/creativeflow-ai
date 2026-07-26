import { useState } from 'react';
import RefineBar from './RefineBar';

const PLATFORM_META = {
  TikTok:   { ratio: '9:16', icon: '📱' },
  YouTube:  { ratio: '16:9', icon: '🎬' },
  LinkedIn: { ratio: '1:1',  icon: '💼' },
};

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

const promptWrapStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const promptCardStyle = {
  background: 'var(--code-bg)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '16px 20px',
};

const promptHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '10px',
};

const sceneLabelStyle = {
  fontSize: '12px',
  fontWeight: '700',
  color: 'var(--accent)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

const promptTextStyle = {
  fontSize: '14px',
  color: 'var(--text-h)',
  lineHeight: '1.7',
  fontFamily: 'var(--mono)',
  margin: 0,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
};

const hintStyle = {
  marginTop: '16px',
  padding: '10px 14px',
  background: 'var(--accent-bg)',
  border: '1px solid var(--accent-border)',
  borderRadius: '6px',
  fontSize: '13px',
  color: 'var(--accent)',
  lineHeight: '1.5',
};

function SceneCopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button style={copyBtnStyle(copied)} onClick={handleCopy}>
      {copied ? 'Copied ✓' : 'Copy'}
    </button>
  );
}

export default function VisualPromptsCard({ visualPrompts, platform, onRefine, isRefining }) {
  const [allCopied, setAllCopied] = useState(false);

  if (!visualPrompts || !visualPrompts.prompts) return null;

  const meta = PLATFORM_META[platform] || { ratio: '16:9', icon: '🎬' };

  function handleCopyAll() {
    const text = visualPrompts.prompts
      .map((p) => `SCENE ${p.scene}:\n${p.prompt}`)
      .join('\n\n---\n\n');
    navigator.clipboard.writeText(text).then(() => {
      setAllCopied(true);
      setTimeout(() => setAllCopied(false), 2500);
    });
  }

  return (
    <div style={cardStyle}>
      <div style={headingRowStyle}>
        <h2 style={headingStyle}>Visual Prompts</h2>
        <span style={stepBadgeStyle}>Step 4 of 5</span>
        <button style={copyBtnStyle(allCopied)} onClick={handleCopyAll}>
          {allCopied ? 'All Copied ✓' : 'Copy All'}
        </button>
      </div>

      <div style={promptWrapStyle}>
        {visualPrompts.prompts.map((p, i) => (
          <div key={i} style={promptCardStyle}>
            <div style={promptHeaderStyle}>
              <span style={sceneLabelStyle}>Scene {p.scene}</span>
              <SceneCopyBtn text={p.prompt} />
            </div>
            <p style={promptTextStyle}>{p.prompt}</p>
          </div>
        ))}
      </div>

      <p style={hintStyle}>
        {meta.icon} Prompts formatted for <strong>{platform || 'your platform'}</strong> — {meta.ratio} aspect ratio.
        Paste any prompt directly into <strong>ChatGPT</strong>, <strong>Midjourney</strong>, or <strong>DALL·E</strong>.
      </p>

      {onRefine && <RefineBar onRefine={onRefine} isLoading={isRefining} />}
    </div>
  );
}
