import ScoreCircle from './ScoreCircle';

interface ATSProps {
  score: number;
  suggestions: Array<{
    type: 'good' | 'improve';
    tip: string;
  }>;
}

const ATS = ({ score, suggestions }: ATSProps) => {
  const goodSuggestions = suggestions.filter((s) => s.type === 'good');
  const improveSuggestions = suggestions.filter((s) => s.type === 'improve');

  return (
    <div className="feedback-card">
      <div className="feedback-card-header">
        <h3 className="text-2xl font-bold text-black">ATS Compatibility</h3>
        <ScoreCircle score={score} />
      </div>

      <div className="space-y-6">
        {goodSuggestions.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-green-600 mb-3">
              ✓ What's Good
            </h4>
            <ul className="space-y-2">
              {goodSuggestions.map((suggestion, index) => (
                <li key={index} className="text-gray-700 flex gap-2">
                  <span className="text-green-500 font-bold flex-shrink-0">
                    •
                  </span>
                  <span>{suggestion.tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {improveSuggestions.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-orange-600 mb-3">
              → Areas to Improve
            </h4>
            <ul className="space-y-2">
              {improveSuggestions.map((suggestion, index) => (
                <li key={index} className="text-gray-700 flex gap-2">
                  <span className="text-orange-500 font-bold flex-shrink-0">
                    !
                  </span>
                  <span>{suggestion.tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ATS;
