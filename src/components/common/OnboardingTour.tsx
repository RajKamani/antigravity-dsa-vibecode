import React from 'react';
import { Joyride, STATUS, Step, EventData } from 'react-joyride';
import { useTheme } from '../../context/ThemeContext';

interface OnboardingTourProps {
  run: boolean;
  onFinish: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ run, onFinish }) => {
  const { theme } = useTheme();

  const steps: Step[] = [
    {
      target: '#tour-dashboard',
      title: 'Dashboard',
      content: 'Overview of your progress, active streaks, and your plan for today.',
      placement: 'right',
    },
    {
      target: '#tour-problems',
      title: 'Problems Database',
      content: 'Your complete, searchable list of tracked DSA questions across all platforms.',
      placement: 'right',
    },
    {
      target: '#tour-add',
      title: 'Add a Problem & Auto-Sync',
      content: 'Log new questions manually, or use our Chrome Extension to auto-sync "Accepted" LeetCode submissions directly to your clipboard for instant import!',
      placement: 'right',
    },
    {
      target: '#tour-daily-plan',
      title: 'Spaced Repetition Queue',
      content: 'The heart of O(1) Knot. Problems due for review appear here based on our spaced-repetition algorithm.',
      placement: 'right',
    },
    {
      target: '#tour-patterns',
      title: 'Topic Mastery Heatmap',
      content: 'Visually track your mastery across different algorithmic patterns. Click any cell to drill down into weak areas.',
      placement: 'right',
    },
    {
      target: '#tour-readiness',
      title: 'Interview Readiness',
      content: 'Get a confidence score based on your history, success rate, and pattern coverage.',
      placement: 'right',
    },
    {
      target: '#tour-mock',
      title: 'Mock Interview Mode',
      content: 'Simulate a real, timed technical interview with randomly selected questions from your pool.',
      placement: 'right',
    },
    {
      target: '#tour-system-design',
      title: 'System Design',
      content: 'Don\'t forget high-level design! Track architecture concepts and system design questions here.',
      placement: 'right',
    }
  ];

  const handleJoyrideEvent = (data: EventData) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    
    if (finishedStatuses.includes(status)) {
      onFinish();
    }
  };

  const isDark = theme === 'dark';

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      onEvent={handleJoyrideEvent}
      options={{
        showProgress: true,
        skipBeacon: true,
        zIndex: 10000,
        primaryColor: '#8b5cf6',
        backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
        arrowColor: isDark ? '#1e1e1e' : '#ffffff',
        textColor: isDark ? '#e5e5e5' : '#171717',
        overlayColor: isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.4)',
      }}
      styles={{
        tooltipContainer: { textAlign: 'left' },
        buttonPrimary: { backgroundColor: '#8b5cf6', borderRadius: '6px' },
        buttonBack: { color: isDark ? '#a3a3a3' : '#525252' },
        buttonSkip: { color: isDark ? '#a3a3a3' : '#525252' }
      }}
    />
  );
};
