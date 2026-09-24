import React from 'react';

export default function ProcedureSection({ procedure }) {
  return (
    <div className="animate-in fade-in duration-300">
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#1E3A5F]">Procedure</h2>
        </div>
        <div className="p-6">
          <ol className="space-y-4">
            {procedure.map((step, index) => (
              <li key={index} className="flex">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-bold text-sm mr-4 mt-0.5 border border-blue-100">
                  {index + 1}
                </span>
                <p className="text-gray-700 pt-1 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
