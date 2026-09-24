import React, { useState, useEffect } from 'react';

const FALLBACK_QUESTIONS = [
  {
    id: 'q1',
    text: 'What type of image is formed by a convex lens when the object is placed between focus (F₁) and optical centre (O)?',
    questionType: 'mcq',
    options: ['Virtual, erect and magnified', 'Real, inverted and magnified', 'Real, inverted and diminished', 'Virtual, erect and diminished'],
    correctAnswer: 'Virtual, erect and magnified',
    explanation: 'When an object is placed between the optical centre O and principal focus F₁ of a convex lens, the refracted rays diverge and appear to meet on the same side, forming a virtual, erect, and magnified image.'
  },
  {
    id: 'q2',
    text: 'Where is the image formed when an object is placed at 2F₁ of a convex lens?',
    questionType: 'mcq',
    options: ['At 2F₂, real, inverted and same size', 'At F₂, real and diminished', 'Beyond 2F₂, real and magnified', 'At infinity'],
    correctAnswer: 'At 2F₂, real, inverted and same size',
    explanation: 'When an object is at 2F₁, light rays converge on the opposite side at 2F₂ to form a real, inverted image of the exact same size as the object (magnification m = -1).'
  },
  {
    id: 'q3',
    text: 'According to Cartesian sign convention, the focal length of a convex lens is always taken as positive.',
    questionType: 'truefalse',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'Since the principal focus of a convex lens lies on the right side of the optical centre (in the direction of incident light), its focal length f is always positive.'
  },
  {
    id: 'q4',
    text: 'What is the correct lens formula relating focal length (f), object distance (u), and image distance (v)?',
    questionType: 'mcq',
    options: ['1/f = 1/v - 1/u', '1/f = 1/v + 1/u', '1/f = 1/u - 1/v', 'f = v - u'],
    correctAnswer: '1/f = 1/v - 1/u',
    explanation: 'The lens formula is 1/f = 1/v - 1/u. Note that it differs from the mirror formula (1/f = 1/v + 1/u).'
  },
  {
    id: 'q5',
    text: 'A ray of light passing through the optical centre (O) of a convex lens will:',
    questionType: 'mcq',
    options: ['Pass undeviated without any refraction', 'Pass through focus F₂', 'Reflect back along the same path', 'Become parallel to the principal axis'],
    correctAnswer: 'Pass undeviated without any refraction',
    explanation: 'The optical centre O is the central point on the principal axis such that rays passing through it emerge without suffering any net deviation.'
  },
  {
    id: 'q6',
    text: 'If the magnification (m) produced by a lens is -2, what is the nature and relative size of the image?',
    questionType: 'mcq',
    options: ['Real, inverted and magnified', 'Virtual, erect and magnified', 'Real, inverted and diminished', 'Virtual, erect and diminished'],
    correctAnswer: 'Real, inverted and magnified',
    explanation: 'A negative sign in magnification indicates a real and inverted image. |m| = 2 > 1 means the image is magnified to twice the object height.'
  },
  {
    id: 'q7',
    text: 'A convex lens is also known as a converging lens because it converges parallel rays of light to a single point called the principal focus.',
    questionType: 'truefalse',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'Convex lenses cause parallel incident light rays to bend inwards and converge at a single focus point F₂.'
  },
  {
    id: 'q8',
    text: 'An object is placed at u = -30 cm in front of a convex lens of focal length f = +20 cm. What is the calculated image distance (v)?',
    questionType: 'mcq',
    options: ['+60 cm', '-60 cm', '+30 cm', '+12 cm'],
    correctAnswer: '+60 cm',
    explanation: 'Using 1/f = 1/v - 1/u: 1/20 = 1/v - (1/-30) => 1/20 = 1/v + 1/30 => 1/v = 1/20 - 1/30 = (3-2)/60 = 1/60 => v = +60 cm.'
  }
];

export default function VivaSection({ experimentId }) {
  const [questions, setQuestions] = useState(FALLBACK_QUESTIONS);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!experimentId) return;
    const API_URL = import.meta.env.VITE_API_URL || '';
    fetch(`${API_URL}/api/physicslab/experiments/${experimentId}/viva`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // normalize format if returned from backend
          const formatted = data.map((q, idx) => ({
            id: q._id || `q_${idx}`,
            text: q.question,
            questionType: q.questionType,
            options: q.options && q.options.length ? q.options : ['True', 'False'],
            correctAnswer: q.correctAnswer || (q.options ? q.options[0] : 'True'),
            explanation: q.explanation || 'Refer to lens formula and optics principles.'
          }));
          setQuestions(formatted);
        }
      })
      .catch(() => {
        // Fallback already set
      });
  }, [experimentId]);

  const handleSelect = (qId, optionText) => {
    if (submitted) return;
    setAnswers({ ...answers, [qId]: optionText });
  };

  const handleSubmit = () => {
    let currentScore = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setSubmitted(true);
  };

  return (
    <div className="animate-in fade-in duration-300 max-w-4xl mx-auto w-full">
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-[#1E3A5F]">Viva Voce Examination</h2>
            <p className="text-xs text-gray-500">Test your theoretical understanding of convex lenses</p>
          </div>
          {submitted && (
            <span className="bg-[#F59E0B] text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
              Score: {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
            </span>
          )}
        </div>

        <div className="p-6">
          <div className="space-y-8">
            {questions.map((q, index) => {
              const selectedOpt = answers[q.id];
              const isUserCorrect = selectedOpt === q.correctAnswer;

              return (
                <div key={q.id || index} className="p-4 rounded-lg border border-gray-100 bg-gray-50/50 space-y-3">
                  <div className="flex items-start justify-between">
                    <p className="font-semibold text-gray-900 text-base leading-snug">
                      <span className="text-[#1E3A5F] font-bold mr-2">Q{index + 1}.</span>
                      {q.text}
                    </p>
                    {submitted && (
                      <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${isUserCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {isUserCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 pl-4 pt-1">
                    {q.options.map((opt, oIdx) => {
                      let btnClass = "w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all flex items-center justify-between ";

                      if (submitted) {
                        if (opt === q.correctAnswer) {
                          btnClass += "bg-green-50 border-green-500 text-green-900 font-bold";
                        } else if (selectedOpt === opt && opt !== q.correctAnswer) {
                          btnClass += "bg-red-50 border-red-500 text-red-900 font-medium";
                        } else {
                          btnClass += "bg-white border-gray-200 text-gray-500 opacity-60";
                        }
                      } else {
                        if (selectedOpt === opt) {
                          btnClass += "bg-blue-50 border-[#1E3A5F] text-[#1E3A5F] font-bold shadow-xs";
                        } else {
                          btnClass += "bg-white border-gray-200 hover:border-gray-300 text-gray-700";
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelect(q.id, opt)}
                          disabled={submitted}
                          className={btnClass}
                        >
                          <span>{opt}</span>
                          {submitted && opt === q.correctAnswer && (
                            <span className="text-xs text-green-700 font-bold">Correct Answer</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {submitted && q.explanation && (
                    <div className="mt-3 p-3 bg-blue-50/80 border border-blue-100 rounded-md text-xs text-blue-900">
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!submitted ? (
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== questions.length}
                className="px-8 py-3 bg-[#1E3A5F] text-white rounded-lg font-bold text-base hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
              >
                Submit Answers
              </button>
            </div>
          ) : (
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
              <p className="text-sm font-medium text-gray-600">
                You have completed the viva voce for this experiment!
              </p>
              <button
                onClick={() => { setSubmitted(false); setAnswers({}); setScore(0); }}
                className="px-6 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-bold text-sm transition-colors"
              >
                Retake Quiz
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

