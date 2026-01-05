import React from 'react';
import { ArrowRight } from 'lucide-react';
import logo from "../../assets/dpc.png";
import { ROUTES } from "@/utils/constants";
import { Link } from "react-router";
export const DPCSection: React.FC = () => {
  return (
    <section className="py-24 px-8 md:px-16 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-12 border border-gray-100 rounded-[32px] p-12 bg-white">
        <div className="w-full md:w-1/3 flex justify-center">
          <div className="flex items-center gap-3">
            <img
            src={logo}
            alt="Bawa Health Logo"
            className="w-24 sm:w-28 md:w-36 lg:w-44 max-w-full h-auto object-contain"
          />
          </div>
        </div>
        <div className="w-full md:w-2/3">
          <h4 className="text-lg font-bold text-[#0f2d34] mb-4">Regulated by Ghana's Data Protection Commission</h4>
          <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6">
            BawaHealth operates in compliance with the Data Protection Act, 2012 (Act 843). The Data Protection Commission (DPC) oversees the protection of personal data and ensures we maintain the highest standards of data privacy and security.
          </p>
          <Link to={ROUTES.AUTH} className="flex items-center">
          <button className="flex items-center gap-2 text-[#127c93] font-bold text-sm
            border border-[#127c93]/30 rounded-[15px] px-8 py-4
            hover:bg-[#127c93]/5 transition"
          >
            Learn more about DPC
            <ArrowRight size={16} />
          </button>
          </Link>
        </div>
      </div>
    </section>
  );
};