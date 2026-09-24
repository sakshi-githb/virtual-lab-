import React from 'react';
import { Package } from 'lucide-react';

export default function ApparatusSection({ apparatus }) {
  return (
    <div className="animate-in fade-in duration-300">
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#1E3A5F]">Apparatus Required</h2>
        </div>
        <div className="p-6">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {apparatus.map((item, index) => (
              <li key={index} className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded flex items-center justify-center mr-4 flex-shrink-0">
                  <Package size={20} />
                </div>
                <span className="text-gray-800 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
