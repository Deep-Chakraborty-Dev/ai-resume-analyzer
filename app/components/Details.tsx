import ScoreCircle from './ScoreCircle';

interface DetailSection {
  title: string;
  key: keyof Omit<Feedback, 'overallScore' | 'ATS'>;
}

interface DetailsProps {
  feedback: Feedback;
}

const Details = ({ feedback }: DetailsProps) => {
  const detailSections: DetailSection[] = [
    { title: 'Tone & Style', key: 'toneAndStyle' },
    { title: 'Content', key: 'content' },
    { title: 'Structure', key: 'structure' },
    { title: 'Skills', key: 'skills' },
  ];

  return (
    <div className="feedback-card">
      <h3 className="text-2xl font-bold text-black mb-6">Detailed Feedback</h3>

      <div className="space-y-8">
        {detailSections.map((section) => {
          const data = feedback[section.key];
          const goodTips = data.tips.filter((t) => t.type === 'good');
          const improveTips = data.tips.filter((t) => t.type === 'improve');

          return (
            <div key={section.key} className="border-b border-gray-200 pb-8 last:border-b-0">
              <div className="flex items-center gap-4 mb-4">
                <h4 className="text-xl font-semibold text-black flex-1">
                  {section.title}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-600">
                    {data.score}/100
                  </span>
                  <div className="w-12 h-12">
                    <ScoreCircle score={data.score} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {goodTips.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-green-600 mb-3 flex items-center gap-2">
                      <span>✓</span> Strengths
                    </h5>
                    <ul className="space-y-2">
                      {goodTips.map((tip, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="text-green-500 font-bold flex-shrink-0 mt-0.5">
                            •
                          </span>
                          <div>
                            <p className="text-gray-800 font-medium">{tip.tip}</p>
                            {tip.explanation && (
                              <p className="text-gray-600 text-sm mt-1">
                                {tip.explanation}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {improveTips.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-orange-600 mb-3 flex items-center gap-2">
                      <span>!</span> Needs Improvement
                    </h5>
                    <ul className="space-y-2">
                      {improveTips.map((tip, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="text-orange-500 font-bold flex-shrink-0 mt-0.5">
                            !
                          </span>
                          <div>
                            <p className="text-gray-800 font-medium">{tip.tip}</p>
                            {tip.explanation && (
                              <p className="text-gray-600 text-sm mt-1">
                                {tip.explanation}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {data.tips.length === 0 && (
                  <p className="text-gray-500 text-sm italic">
                    No specific feedback for this category.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Details;
