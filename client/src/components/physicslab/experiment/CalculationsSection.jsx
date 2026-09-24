import React, { useState } from 'react';
import { Calculator, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';

export default function CalculationsSection({ observations }) {
  // Take values from latest observation if available, or default
  const latestObs = observations && observations.length > 0 ? observations[observations.length - 1] : null;

  const [inputU, setInputU] = useState(latestObs ? `-${latestObs.u}` : '-30');
  const [inputF, setInputF] = useState(latestObs ? `${latestObs.f}` : '20');
  const [userV, setUserV] = useState('');
  const [userM, setUserM] = useState('');

  const [verificationResult, setVerificationResult] = useState(null); // 'correct' | 'incorrect' | null
  const [hint, setHint] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();
    const uVal = parseFloat(inputU);
    const fVal = parseFloat(inputF);
    const vVal = parseFloat(userV);

    if (isNaN(uVal) || isNaN(fVal) || isNaN(vVal)) {
      setVerificationResult('incorrect');
      setHint('Please enter valid numeric values for u, f, and v.');
      return;
    }

    // Correct lens formula: 1/f = 1/v - 1/u  => 1/v = 1/f + 1/u
    // uVal is negative in standard sign convention (e.g. -30)
    // 1/v = 1/20 + 1/(-30) = (3 - 2)/60 = 1/60 => v = +60
    let expectedV = 0;
    if (uVal + fVal !== 0) {
      expectedV = (uVal * fVal) / (uVal + fVal);
    }

    const tolerance = 0.5; // Allow small rounding differences
    const isVCorrect = Math.abs(vVal - expectedV) <= tolerance;

    let isMCorrect = true;
    if (userM !== '') {
      const mVal = parseFloat(userM);
      const expectedM = expectedV / uVal;
      isMCorrect = Math.abs(mVal - expectedM) <= 0.1;
    }

    if (isVCorrect && isMCorrect) {
      setVerificationResult('correct');
      setHint('Excellent! Your calculation correctly satisfies the lens formula 1/f = 1/v - 1/u and sign convention.');
    } else {
      setVerificationResult('incorrect');
      setHint('Check the lens formula and sign convention.');
    }
  };

  return (
    <div className="animate-in fade-in duration-300 max-w-4xl mx-auto w-full">
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-[#1E3A5F]" />
          <h2 className="text-xl font-bold text-[#1E3A5F]">Lens Formula Calculations</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Formula Display Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 text-center">
            <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-2">Lens Formula</h3>
            <div className="text-2xl md:text-3xl font-mono font-bold text-[#1E3A5F] py-2">
              \(\frac{1}{f} = \frac{1}{v} - \frac{1}{u}\)
            </div>
            <p className="text-xs text-blue-800 mt-2">
              Where <strong>f</strong> = focal length, <strong>v</strong> = image distance, <strong>u</strong> = object distance (using Cartesian Sign Convention)
            </p>
          </div>

          {/* Interactive Calculator Form */}
          <form onSubmit={handleVerify} className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-5">
            <h3 className="text-base font-bold text-gray-800 border-b pb-2">Verify Your Calculation</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Object Distance (u) <span className="text-xs text-gray-500">(with sign in cm)</span>
                </label>
                <input
                  type="text"
                  value={inputU}
                  onChange={(e) => setInputU(e.target.value)}
                  placeholder="-30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Focal Length (f) <span className="text-xs text-gray-500">(with sign in cm)</span>
                </label>
                <input
                  type="text"
                  value={inputF}
                  onChange={(e) => setInputF(e.target.value)}
                  placeholder="20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calculated Image Distance (v) <span className="text-xs text-gray-500">(in cm)</span>
                </label>
                <input
                  type="text"
                  value={userV}
                  onChange={(e) => setUserV(e.target.value)}
                  placeholder="e.g. 60"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calculated Magnification (m = v/u) <span className="text-xs text-gray-500">(optional)</span>
                </label>
                <input
                  type="text"
                  value={userM}
                  onChange={(e) => setUserM(e.target.value)}
                  placeholder="e.g. -2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#1E3A5F] hover:bg-opacity-90 text-white font-bold rounded-lg transition-colors shadow-sm"
              >
                Verify Calculation
              </button>
            </div>
          </form>

          {/* Feedback & Hint Banner */}
          {verificationResult && (
            <div
              className={`p-4 rounded-lg border flex items-start gap-3 ${
                verificationResult === 'correct'
                  ? 'bg-green-50 border-green-200 text-green-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}
            >
              {verificationResult === 'correct' ? (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-bold text-sm">
                  {verificationResult === 'correct' ? 'Calculation Verified Correct' : 'Calculation Hint'}
                </h4>
                <p className="text-sm mt-1">{hint}</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
