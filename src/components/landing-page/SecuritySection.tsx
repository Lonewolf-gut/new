import React from 'react';
import { Shield, FileText, Lock, Layout, FileSearch, Server } from 'lucide-react';

export const SecuritySection: React.FC = () => {
  const items = [
    {
      icon: <Shield className="text-[#127c93]" size={20} />,
      title: "Data protection compliance",
      text: "Patient data handled according to Ghana Data Protection Act and international healthcare data standards."
    },
    {
      icon: <FileText className="text-[#127c93]" size={20} />,
      title: "Consent-driven workflows",
      text: "Explicit patient consent obtained and documented for all telemedicine consultations."
    },
    {
      icon: <Lock className="text-[#127c93]" size={20} />,
      title: "End-to-end encryption",
      text: "All consultations and health data encrypted in transit and at rest."
    },
    {
      icon: <Layout className="text-[#127c93]" size={20} />,
      title: "Clear role separation",
      text: "BawaHealth provides technology infrastructure. Medical services delivered by licensed providers."
    },
    {
      icon: <FileSearch className="text-[#127c93]" size={20} />,
      title: "Audit readiness",
      text: "Complete consultation logs and compliance documentation maintained for regulatory review."
    },
    {
      icon: <Server className="text-[#127c93]" size={20} />,
      title: "Reliable infrastructure",
      text: "Secure, scalable platform designed for healthcare-grade reliability and uptime."
    }
  ];

  return (
    <section className="py-12 sm:py-24 px-4 sm:px-8 md:px-16 bg-[#fbfdfe]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-[#43A047] font-bold text-sm mb-4 block">Compliance & Trust</span>
          <h2 className="text-4xl font-bold text-[#0f2d34] mb-4">Security and compliance you can trust</h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-medium">
            Our platform meets the standards expected by healthcare regulators, partner institutions, and the patients we serve.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {items.map((item, i) => (
            <div key={i} className="bg-white p-6 md:p-10 rounded-[15px] shadow-sm border border-gray-50">
              <div className="w-10 h-10 rounded-lg bg-[#f0fbfe] flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-[#0f2d34] mb-3">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};