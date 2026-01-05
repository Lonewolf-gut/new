import React from 'react';
import { Hospital,Stethoscope, User } from 'lucide-react';
import hero from "../../assets/hero.png";

export const Hero: React.FC = () => {
  return (
    <section className="pt-12 sm:pt-16 pb-12 sm:pb-24 px-4 sm:px-8 md:px-16 max-w-[1400px] mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0fbfe] text-[#127c93] text-[10px] font-bold uppercase tracking-wider mb-6 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#127c93]"></span>
            Telemedicine for Africa
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[52px] font-bold text-[#0f2d34] leading-[1.15] mb-6 tracking-tight">
            Digital infrastructure enabling <span className="text-[#127c93]">licensed healthcare providers</span> to deliver telemedicine
          </h1>
          <p className="text-gray-500 text-lg mb-10 max-w-lg font-medium leading-relaxed">
            Connecting patients with licensed hospitals and clinicians across Ghana. Access quality healthcare from trusted institutions, wherever you are.
          </p>
          
          <div className="flex gap-2 mb-8 flex-nowrap sm:flex-wrap items-center">
            {/* horizontal row on xs without scroll; buttons shrink to fit */}
            <button className="flex-1 min-w-0 flex items-center justify-center gap-1 border border-gray-200 px-2 py-2 sm:px-4 sm:py-3 rounded-md hover:bg-gray-50 transition-all font-semibold text-[#0f2d34] text-xs sm:text-sm">
              <Hospital size={14} className="text-gray-400" />
              For Hospitals
            </button>
            <button className="flex-1 min-w-0 flex items-center justify-center gap-1 border border-gray-200 px-2 py-2 sm:px-4 sm:py-3 rounded-md hover:bg-gray-50 transition-all font-semibold text-[#0f2d34] text-xs sm:text-sm">
              <Stethoscope size={14} className="text-gray-400" />
              For Doctors
            </button>
            <button className="flex-1 min-w-0 flex items-center justify-center gap-1 border border-gray-200 px-2 py-2 sm:px-4 sm:py-3 rounded-md hover:bg-gray-50 transition-all font-semibold text-[#0f2d34] text-xs sm:text-sm">
              <User size={14} className="text-gray-400" />
              For Patients
            </button>
          </div>
          <p className="text-gray-900 text-xs font-medium leading-relaxed">
            Serving healthcare providers across Ghana, expanding across Africa.
          </p>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[500px] aspect-square rounded-[25px] overflow-hidden shadow-2xl">
            <img 
              src={hero}
              alt="Telemedicine Session" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};