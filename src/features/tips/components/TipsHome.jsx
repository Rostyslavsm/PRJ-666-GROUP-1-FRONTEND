import React, { useState } from 'react';
import { useTips } from '../hooks/useTips';
import Lottie from 'lottie-react';
import ReactMarkdown from 'react-markdown';
import loadingAnimation from '../../../assets/animations/loading.json';

const TipsHome = () => {
  const { generatePersonalizedTips, isLoading, error } = useTips();
  const [studySummary, setStudySummary] = useState(null);
  const [animateOut, setAnimateOut] = useState(false);

  const handleGenerateSummary = async () => {
    try {
      // Start animations
      setAnimateOut(true);

      // Wait for API response
      const data = await generatePersonalizedTips();
      setStudySummary(data);
    } catch (err) {
      console.error('Failed to generate summary:', err);
    }
  };

  // Function to parse tips string into array of paragraphs
  const parseTipsContent = (tipsString) => {
    if (!tipsString) return [];

    // Split by numbered items or paragraphs
    return tipsString
      .split(/\d+\.|\n\n/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  // Reset animations and summary
  const handleRegenerateSummary = () => {
    setAnimateOut(false);
    setStudySummary(null);
    // Small delay to allow animations to reset
    setTimeout(() => {
      handleGenerateSummary();
    }, 300);
  };

  return (
    <div className="tips-container">
      {/* Welcome Message / Hero Section */}
      <section className={`tips-hero ${animateOut ? 'slide-out-left' : ''}`}>
        <h2>Study smarter, not harder — powered by AI.</h2>
        <p>
          At StudyPro, we use AI to help you stay ahead. From organizing your schedule to generating
          smart, personalized study summaries, we make sure you get the most out of your study time.
        </p>
      </section>

      {/* AI Feature Explanation */}
      <section className={`tips-feature ${animateOut ? 'slide-out-right' : ''}`}>
        <h3>Your Personal Study Assistant</h3>
        <p>
          Our AI takes into account your current classes, upcoming events, and due assignments to
          generate tailored study tips, summaries, and learning goals. It's like having a tutor that
          understands your schedule and learning style.
        </p>
      </section>

      {/* Call to Action */}
      <section className={`tips-cta ${animateOut ? 'slide-up-fixed' : ''}`}>
        <button
          onClick={studySummary ? handleRegenerateSummary : handleGenerateSummary}
          disabled={isLoading}
          className="tips-button"
        >
          <span>🎯</span>
          <span>
            {isLoading
              ? 'Generating...'
              : studySummary
                ? 'Generate New Study Summary'
                : 'Generate My Personalized Study Summary'}
          </span>
        </button>

        {isLoading && (
          <div className="tips-loading">
            <Lottie
              animationData={loadingAnimation}
              loop={true}
              style={{ height: 100, width: 100 }}
            />
            <p>Creating your personalized study plan...</p>
          </div>
        )}

        {error && (
          <div className="tips-error">
            <p>Error generating study summary</p>
            <p>{error}</p>
          </div>
        )}

        {studySummary && !isLoading && (
          <div className="tips-summary slide-up-appear">
            <h3>Your Personalized Study Summary</h3>

            <div className="tips-summary-content">
              <div className="tips-summary-section">
                <div className="tips-summary-text">
                  {studySummary.tips ? (
                    <div className="markdown-content">
                      <ReactMarkdown>{studySummary.tips}</ReactMarkdown>
                    </div>
                  ) : (
                    <p>No tips available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default TipsHome;
