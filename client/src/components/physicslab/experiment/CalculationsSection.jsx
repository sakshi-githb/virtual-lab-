import React, { useState, useEffect } from 'react';
import { Calculator, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function CalculationsSection({ observations }) {
  const latestObs = observations && observations.length > 0 ? observations[observations.length - 1] : null;

  const [inputU, setInputU] = useState('-30');
  const [inputF, setInputF] = useState('20');
  const [userV, setUserV] = useState('');
  const [userM, setUserM] = useState('');

  const [verificationResult, setVerificationResult] = useState(null); // 'correct' | 'incorrect' | null
  const [hint, setHint] = useState('');
  const [stepByStep, setStepByStep] = useState(null);

  useEffect(() => {
    if (latestObs) {
      const uRaw = Number(latestObs.u) || 30;
      const fRaw = Number(latestObs.f) || 20;
      setInputU(`-${Math.abs(uRaw)}`);
      setInputF(`${fRaw}`);
    }
  }, [observations]);

  const handleAutoFill = () => {
    if (latestObs) {
      const uRaw = Number(latestObs.u) || 30;
      const fRaw = Number(latestObs.f) || 20;
      const vRaw = latestObs.v !== 'Infinity' ? latestObs.v : '';
      const mRaw = latestObs.m !== 'Infinity' ? latestObs.m : '';
      setInputU(`-${Math.abs(uRaw)}`);
      setInputF(`${fRaw}`);
      if (vRaw) setUserV(`${vRaw}`);
      if (mRaw) setUserM(`${mRaw}`);
    } else {
      setInputU('-30');
      setInputF('20');
      setUserV('60');
      setUserM('-2');
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();

    // Clean inputs (extract numbers, allowing negative sign)
    const parseNumber = (val) => {
      if (!val) return NaN;
      const cleaned = val.toString().replace(/[^0-9.-]/g, '');
      return parseFloat(cleaned);
    };

    let uVal = parseNumber(inputU);
    const fVal = parseNumber(inputF);
    const vVal = parseNumber(userV);

    if (isNaN(uVal) || isNaN(fVal) || isNaN(vVal)) {
      setVerificationResult('incorrect');
      setHint('Please enter valid numeric values for object distance u, focal length f, and image distance v.');
      setStepByStep(null);
      return;
    }

    // According to Cartesian sign convention, real object distance u is negative in front of lens
    if (uVal > 0) {
      uVal = -uVal; // auto-apply Cartesian sign convention for real object
    }

    // Lens formula: 1/f = 1/v - 1/u  => 1/v = 1/f + 1/u
    let expectedV = 0;
    if (uVal + fVal !== 0) {
      expectedV = (uVal * fVal) / (uVal + fVal);
    } else {
      expectedV = Infinity;
    }

    const expectedM = expectedV !== Infinity ? expectedV / uVal : Infinity;

    const tolerance = 1.0; // Allow small rounding margin
    const isVCorrect = Math.abs(vVal - expectedV) <= tolerance;

    let isMCorrect = true;
    if (userM.trim() !== '') {
      const mVal = parseNumber(userM);
      isMCorrect = !isNaN(mVal) && Math.abs(mVal - expectedM) <= 0.2;
    }

    // Generate step by step solution
    const solution = {
      uText: `${uVal} cm`,
      fText: `+${fVal} cm`,
      vCalcText: expectedV === Infinity ? 'Infinity' : `${expectedV > 0 ? '+' : ''}${expectedV.toFixed(2)} cm`,
      mCalcText: expectedM === Infinity ? 'Infinity' : `${expectedM.toFixed(2)}`,
      steps: [
        `1. Given: Object distance u = ${uVal} cm (by Cartesian Sign Convention)`,
        `2. Focal length f = +${fVal} cm (positive for convex lens)`,
        `3. Apply Lens Formula: 1/v = 1/f + 1/u`,
        `4. 1/v = (1/${fVal}) + (1/${uVal}) = (${uVal} + ${fVal}) / (${uVal * fVal})`,
        `5. Therefore, v = (${uVal} × ${fVal}) / (${uVal} + ${fVal}) = ${expectedV.toFixed(2)} cm`,
        `6. Magnification m = v / u = (${expectedV.toFixed(2)}) / (${uVal}) = ${expectedM.toFixed(2)}`
      ]
    };

    setStepByStep(solution);

    if (isVCorrect && isMCorrect) {
      setVerificationResult('correct');
      setHint(`Great job! Your calculated v = ${vVal} cm matches the lens formula prediction.`);
    } else {
      setVerificationResult('incorrect');
      setHint('Check the lens formula and sign convention. (Note: Object distance u is negative, f is positive for convex lens).');
    }
  };

  return (
    <div className="animate-in fade-in duration-300 max-w-4xl mx-auto w-full">
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#1E3A5F]" />
            <h2 className="text-xl font-bold text-[#1E3A5F]">Lens Formula Calculations</h2>
          </div>

          <button
            type="button"
            onClick={handleAutoFill}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1E3A5F] text-xs font-bold rounded-lg border border-blue-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Auto-fill from Lab Readings
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Formula Display Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 text-center">
            <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">Standard School Lens Formula</h3>
            <div className="text-2xl md:text-3xl font-mono font-bold text-[#1E3A5F] py-2">
              1/f = 1/v - 1/u &nbsp;&implies;&nbsp; 1/v = 1/f + 1/u
            </div>
            <p className="text-xs text-blue-800 mt-1">
              <strong>Sign Convention:</strong> Object distance <strong>u</strong> is negative (-), focal length <strong>f</strong> is positive (+) for convex lens.
            </p>
          </div>

          {/* Interactive Calculator Form */}
          <form onSubmit={handleVerify} className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-5">
            <h3 className="text-base font-bold text-gray-800 border-b pb-2">Verify Your Measurement & Calculation</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Object Distance (u) <span className="text-xs text-gray-500">(in cm, e.g. -30)</span>
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
                  Focal Length (f) <span className="text-xs text-gray-500">(in cm, e.g. 20)</span>
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
                className="px-6 py-2.5 bg-[#1E3A5F] hover:bg-opacity-90 text-white font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                Verify Calculation
              </button>
            </div>
          </form>

          {/* Feedback Banner */}
          {verificationResult && (
            <div className="space-y-4">
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
                    {verificationResult === 'correct' ? 'Calculation Verified Correct!' : 'Calculation Hint'}
                  </h4>
                  <p className="text-sm mt-1">{hint}</p>
                </div>
              </div>

              {/* Step by Step Breakdown */}
              {stepByStep && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 text-xs font-mono space-y-2 text-gray-800">
                  <h5 className="font-sans font-bold text-sm text-[#1E3A5F] border-b pb-1">Step-by-Step Derivation Solution:</h5>
                  {stepByStep.steps.map((st, sIdx) => (
                    <div key={sIdx} className="py-0.5">{st}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

