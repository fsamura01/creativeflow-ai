import { useState } from 'react';
import RefineBar from './RefineBar';

// Platform → image generation aspect ratio and style hint
const PLATFORM_META = {
  TikTok:   { ratio: '9:16', style: 'vertical short-form video frame, mobile-first composition' },
  YouTube:  { ratio: '16:9', style: 'widescreen YouTube thumbnail or video frame' },
  LinkedIn: { ratio: '1:1',  style: 'square professional social media graphic' },
};

function buildImagePrompts(scenes, platform) {
  const meta = PLATFORM_META[platform] || { ratio: '16:9', style: 'social media graphic' };
  return scenes
    .map((s, i) =>
      `SCENE ${i + 1} — IMAGE PROMPT\n` +
      `${s.visual}\n` +
      `Style: modern, high-contrast, professional ${meta.style}. ` +
      `Aspect ratio: ${meta.ratio}. ` +
      `Cinematic lighting, clean typography if text is shown.`
    )
    .join('\n\n---\n\n');
}

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

const sceneWrapStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

const sceneStyle = {
  background: 'var(--code-bg)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '16px 20px',
};

const sceneTitleStyle = {
  fontSize: '13px',
  fontWeight: '700',
  color: 'var(--accent)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '12px',
};

const labelStyle = {
  fontSize: '12px',
  fontWeight: '600',
  color: 'var(--text)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  display: 'block',
  marginBottom: '4px',
  marginTop: '10px',
};

const valueStyle = {
  fontSize: '15px',
  color: 'var(--text-h)',
  lineHeight: '1.6',
  margin: 0,
};

const promptHintStyle = {
  marginTop: '16px',
  padding: '10px 14px',
  background: 'var(--accent-bg)',
  border: '1px solid var(--accent-border)',
  borderRadius: '6px',
  fontSize: '13px',
  color: 'var(--accent)',
  lineHeight: '1.5',
};

export default function StoryboardCard({ storyboard, platform, onRefine, isRefining }) {
  const [copied, setCopied] = useState(false);

  if (!storyboard || !storyboard.scenes) return null;

  function handleCopyPrompts() {
    const text = buildImagePrompts(storyboard.scenes, platform);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  const meta = PLATFORM_META[platform];

  return (
    <div style={cardStyle}>
      <div style={headingRowStyle}>
        <h2 style={headingStyle}>Storyboard</h2>
        <span style={stepBadgeStyle}>Step 3 of 5</span>
        <button style={copyBtnStyle(copied)} onClick={handleCopyPrompts}>
          {copied ? 'Copied ✓' : 'Copy Image Prompts'}
        </button>
      </div>

      <div style={sceneWrapStyle}>
        {storyboard.scenes.map((s, i) => (
          <div key={i} style={sceneStyle}>
            <div style={sceneTitleStyle}>Scene {i + 1}</div>

            <span style={{ ...labelStyle, marginTop: 0 }}>Visual</span>
            <p style={valueStyle}>{s.visual}</p>

            <span style={labelStyle}>Narration</span>
            <p style={valueStyle}>{s.narration}</p>
          </div>
        ))}
      </div>

      {meta && (
        <p style={promptHintStyle}>
          ✦ Image prompts formatted for <strong>{platform}</strong> — {meta.ratio} aspect ratio.
          Paste directly into ChatGPT, Midjourney, or DALL·E.
        </p>
      )}

      {onRefine && <RefineBar onRefine={onRefine} isLoading={isRefining} />}
    </div>
  );
}
