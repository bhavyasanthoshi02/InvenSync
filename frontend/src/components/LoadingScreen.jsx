import React, { useEffect, useState } from 'react';
import './LoadingScreen.css';

const LOADING_MESSAGES = [
  'Syncing inventory data...',
  'Connecting to warehouse...',
  'Loading analytics...',
  'Preparing your dashboard...',
];

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Ease the progress — fast then slow then fast
        const increment = prev < 70 ? 2.5 : prev < 90 ? 1 : 2;
        return Math.min(prev + increment, 100);
      });
    }, 50);

    // Cycle loading messages
    const msgInterval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 900);

    // Trigger fade-out after loading
    const finishTimer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        onFinish && onFinish();
      }, 700);
    }, 3200);

    return () => {
      clearInterval(progressInterval);
      clearInterval(msgInterval);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={`ls-wrapper${fadeOut ? ' ls-fadeout' : ''}`}>
      {/* Ambient orbs */}
      <div className="ls-orb ls-orb-1" />
      <div className="ls-orb ls-orb-2" />
      <div className="ls-orb ls-orb-3" />

      {/* Animated grid */}
      <div className="ls-grid" />

      {/* Center content */}
      <div className="ls-center">
        {/* Logo mark */}
        <div className="ls-logo-wrap">
          <div className="ls-logo-ring ls-ring-outer" />
          <div className="ls-logo-ring ls-ring-middle" />
          <div className="ls-logo-core">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                stroke="#ffd60a"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 22V12h6v10"
                stroke="#ffd60a"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="9" r="1.5" fill="#ffd60a" />
            </svg>
          </div>
        </div>

        {/* Brand name */}
        <h1 className="ls-brand">
          Stock<span className="ls-brand-accent">Flow</span>
        </h1>
        <p className="ls-tagline">Smart Inventory Intelligence</p>

        {/* Scanning bars animation */}
        <div className="ls-scan-bars">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="ls-scan-bar" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>

        {/* Progress section */}
        <div className="ls-progress-wrap">
          <div className="ls-progress-track">
            <div className="ls-progress-fill" style={{ width: `${progress}%` }}>
              <div className="ls-progress-glow" />
            </div>
          </div>
          <div className="ls-progress-meta">
            <span className="ls-loading-msg">{LOADING_MESSAGES[msgIndex]}</span>
            <span className="ls-percent">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Floating data chips */}
        <div className="ls-chips">
          <div className="ls-chip ls-chip-1">
            <span className="ls-chip-dot" />
            Inventory
          </div>
          <div className="ls-chip ls-chip-2">
            <span className="ls-chip-dot" />
            Analytics
          </div>
          <div className="ls-chip ls-chip-3">
            <span className="ls-chip-dot" />
            Orders
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="ls-footer">
        <div className="ls-footer-dots">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="ls-footer-dot"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
        <p className="ls-footer-text">v2.0 · Enterprise Edition</p>
      </div>
    </div>
  );
}
