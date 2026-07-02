import ScoreCircle from './ScoreCircle';

interface ScoreSection {
  score: number;
  label: string;
  color: string;
}

interface SummaryProps {
  feedback: Feedback;
}

const Summary = ({ feedback }: SummaryProps) => {
  const sections: ScoreSection[] = [
    { score: feedback.ATS.score, label: 'ATS', color: 'from-purple-400 to-blue-500' },
    { score: feedback.toneAndStyle.score, label: 'Tone & Style', color: 'from-blue-400 to-cyan-500' },
    { score: feedback.content.score, label: 'Content', color: 'from-cyan-400 to-teal-500' },
    { score: feedback.structure.score, label: 'Structure', color: 'from-teal-400 to-green-500' },
    { score: feedback.skills.score, label: 'Skills', color: 'from-green-400 to-emerald-500' },
  ];

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="feedback-card">
      <div className="feedback-card-header">
        <h3 className="text-2xl font-bold text-black">Overall Assessment</h3>
        <ScoreCircle score={feedback.overallScore} />
      </div>

      <div className="space-y-4">
        <p className="text-gray-600 text-base leading-relaxed">
          Your resume has been analyzed across multiple dimensions. Below is a breakdown of your
          performance in each category.
        </p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {sections.map((section) => (
            <div
              key={section.label}
              className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors bg-gray-50"
            >
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                {section.label}
              </p>
              <p className={`text-2xl font-bold ${getScoreColor(section.score)}`}>
                {section.score}
              </p>
              <p className="text-xs text-gray-500 mt-1">/100</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Summary;
