import React from 'react';

export const DisclaimerSection: React.FC = () => {
  return (
    <section className="py-12 px-8 md:px-16 max-w-[1400px] mx-auto">
      <div className="bg-[#f9fafb] rounded-[24px] p-10 text-center">
        <h4 className="text-[#0f2d34] font-bold mb-4">Platform role clarity</h4>
        <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-4xl mx-auto">
          BawaHealth is a technology platform that enables telemedicine. We do not diagnose, treat, or provide medical advice. All healthcare services are delivered by licensed hospitals and clinicians who are responsible for patient care decisions.
        </p>
      </div>
    </section>
  );
};