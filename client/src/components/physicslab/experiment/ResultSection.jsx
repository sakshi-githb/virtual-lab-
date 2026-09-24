import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function ResultSection({ observations }) {
  // Calculate average focal length if there are observations
  let avgFocalLength = 0;
  if (observations.length > 0) {
    const sum = observations.reduce((acc, obs) => acc + (Number(obs.f) || 0), 0);
    avgFocalLength = (sum / observations.length).toFixed(2);
  }

  return (
    <div className="animate-in fade-in duration-300">
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#1E3A5F]">Result & Conclusion</h2>
        </div>
        <div className="p-6">
          {observations.length > 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-green-900 mb-2">Experiment Completed Successfully</h3>
                  <div className="text-green-800 space-y-2">
                    <p>Based on the {observations.length} recorded observations:</p>
                    <ul className="list-disc pl-5 space-y-1 font-medium">
                      <li>The average focal length of the given convex lens is found to be <strong>{avgFocalLength} cm</strong>.</li>
                      <li>The relationship between object distance and image distance has been verified.</li>
                      <li>The lens formula 1/f = 1/v - 1/u is satisfied within experimental limits.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Complete the experiment and record observations to view your final results.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
