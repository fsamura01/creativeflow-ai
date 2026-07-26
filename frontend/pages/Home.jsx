import { useState } from 'react';
import InputForm from '../components/InputForm';
import CreativeBriefCard from '../components/CreativeBriefCard';
import ScriptCard from '../components/ScriptCard';
import StoryboardCard from '../components/StoryboardCard';
import VisualPromptsCard from '../components/VisualPromptsCard';
import MentorCard from '../components/MentorCard';
import {
  generateCreativeBrief,
  generateScript,
  generateStoryboard,
  generateVisualPrompts,
  reviewWithMentor,
  refineSection,
} from '../services/api';

const pageStyle = {
  maxWidth: '760px',
  margin: '0 auto',
  padding: '40px 24px',
  fontFamily: 'var(--sans)',
};

const heroStyle = {
  textAlign: 'center',
  marginBottom: '40px',
};

const titleStyle = {
  fontSize: '32px',
  fontWeight: '700',
  color: 'var(--text-h)',
  fontFamily: 'var(--heading)',
  margin: '0 0 10px',
};

const subtitleStyle = {
  fontSize: '16px',
  color: 'var(--text)',
  margin: 0,
  lineHeight: '1.6',
};

const errorStyle = {
  marginTop: '24px',
  padding: '14px 18px',
  background: '#fff0f0',
  border: '1px solid #ffb3b3',
  borderRadius: '8px',
  color: '#c0392b',
  fontSize: '14px',
};

const progressWrapStyle = {
  marginTop: '28px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const progressStepStyle = (active, done) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 14px',
  borderRadius: '8px',
  background: done ? 'var(--accent-bg)' : active ? 'var(--code-bg)' : 'transparent',
  border: `1px solid ${done ? 'var(--accent-border)' : active ? 'var(--border)' : 'transparent'}`,
  fontSize: '14px',
  color: done ? 'var(--accent)' : active ? 'var(--text-h)' : 'var(--text)',
  fontWeight: active || done ? '600' : '400',
  transition: 'all 0.2s',
});

const spinnerStyle = {
  width: '14px',
  height: '14px',
  border: '2px solid var(--border)',
  borderTop: '2px solid var(--accent)',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
  flexShrink: 0,
};

const sectionStyle = {
  marginTop: '28px',
};

const STEPS = [
  { key: 'brief',         label: 'Generating creative brief…',   done: 'Creative brief ready' },
  { key: 'script',        label: 'Writing script…',              done: 'Script written' },
  { key: 'storyboard',    label: 'Building storyboard…',         done: 'Storyboard built' },
  { key: 'visualPrompts', label: 'Generating visual prompts…',   done: 'Visual prompts ready' },
  { key: 'feedback',      label: 'Getting mentor feedback…',     done: 'Mentor review complete' },
];

export default function Home() {
  const [brief, setBrief] = useState(null);
  const [script, setScript] = useState(null);
  const [storyboard, setStoryboard] = useState(null);
  const [visualPrompts, setVisualPrompts] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(null);
  const [error, setError] = useState(null);

  // Per-section refine loading flags
  const [refining, setRefining] = useState({ brief: false, script: false, storyboard: false, visualPrompts: false, feedback: false });

  function setRefiningSection(section, value) {
    setRefining((prev) => ({ ...prev, [section]: value }));
  }

  async function handleRefine(section, current, instruction, context) {
    setRefiningSection(section, true);
    setError(null);
    try {
      const refined = await refineSection({ section, current, instruction, context });
      if (section === 'brief') setBrief(refined);
      else if (section === 'script') setScript(refined);
      else if (section === 'storyboard') setStoryboard(refined);
      else if (section === 'visualPrompts') setVisualPrompts(refined);
      else if (section === 'feedback') setFeedback(refined);
    } catch (err) {
      setError(err.message);
    } finally {
      setRefiningSection(section, false);
    }
  }

  async function handleSubmit(data) {
    setIsLoading(true);
    setActiveStep('brief');
    setError(null);
    setBrief(null);
    setScript(null);
    setStoryboard(null);
    setVisualPrompts(null);
    setFeedback(null);
    setPlatform(data.platform);

    try {
      const briefResult = await generateCreativeBrief(data);
      setBrief(briefResult);
      setActiveStep('script');

      const scriptResult = await generateScript({ creativeBrief: briefResult });
      setScript(scriptResult);
      setActiveStep('storyboard');

      const storyboardResult = await generateStoryboard({ script: scriptResult, creativeBrief: briefResult });
      setStoryboard(storyboardResult);
      setActiveStep('visualPrompts');

      const visualPromptsResult = await generateVisualPrompts({
        scenes: storyboardResult.scenes,
        platform: data.platform,
        brief: briefResult,
      });
      setVisualPrompts(visualPromptsResult);
      setActiveStep('feedback');

      const mentorResult = await reviewWithMentor({ creativeBrief: briefResult, script: scriptResult, storyboard: storyboardResult });
      setFeedback(mentorResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setActiveStep(null);
    }
  }

  return (
    <div style={pageStyle}>
      <div style={heroStyle}>
        <h1 style={titleStyle}>CreativeFlow AI</h1>
        <p style={subtitleStyle}>
          Transform your idea into a complete content package with AI-powered creative guidance.
        </p>
      </div>

      <InputForm onSubmit={handleSubmit} isLoading={isLoading} />

      {error && <div style={errorStyle}>{error}</div>}

      {isLoading && (
        <div style={progressWrapStyle}>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          {STEPS.map((step) => {
            const stepKeys = STEPS.map((s) => s.key);
            const activeIdx = stepKeys.indexOf(activeStep);
            const thisIdx = stepKeys.indexOf(step.key);
            const isDone = activeStep === null ? false : thisIdx < activeIdx;
            const isActive = step.key === activeStep;
            return (
              <div key={step.key} style={progressStepStyle(isActive, isDone)}>
                {isDone && <span style={{ flexShrink: 0 }}>✓</span>}
                {isActive && <span style={spinnerStyle} />}
                {!isDone && !isActive && <span style={{ width: '14px', flexShrink: 0 }} />}
                {isDone ? step.done : step.label}
              </div>
            );
          })}
        </div>
      )}

      <div style={sectionStyle}>
        <CreativeBriefCard
          brief={brief}
          onRefine={brief ? (instruction) => handleRefine('brief', brief, instruction) : null}
          isRefining={refining.brief}
        />
      </div>

      <div style={sectionStyle}>
        <ScriptCard
          script={script}
          onRefine={script ? (instruction) => handleRefine('script', script, instruction, { brief }) : null}
          isRefining={refining.script}
        />
      </div>

      <div style={sectionStyle}>
        <StoryboardCard
          storyboard={storyboard}
          platform={platform}
          onRefine={storyboard ? (instruction) => handleRefine('storyboard', storyboard, instruction, { brief, script }) : null}
          isRefining={refining.storyboard}
        />
      </div>

      <div style={sectionStyle}>
        <VisualPromptsCard
          visualPrompts={visualPrompts}
          platform={platform}
          onRefine={visualPrompts ? (instruction) => handleRefine('visualPrompts', visualPrompts, instruction, { brief, storyboard }) : null}
          isRefining={refining.visualPrompts}
        />
      </div>

      <div style={sectionStyle}>
        <MentorCard
          feedback={feedback}
          onRefine={feedback ? (instruction) => handleRefine('feedback', feedback, instruction, { brief, script, storyboard }) : null}
          isRefining={refining.feedback}
        />
      </div>
    </div>
  );
}
