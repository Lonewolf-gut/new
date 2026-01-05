import React from 'react';
import { ArrowRight } from 'lucide-react';
import hospital from "../../assets/hospital.png";
import doctor from "../../assets/doctor.png";
import patient from "../../assets/patient.png";
import { ROUTES } from "@/utils/constants";
import { Link } from "react-router";

export const PlatformSection: React.FC = () => {
  const categories = [
    {
      badge: "For Hospitals",
      title: "Extend your care digitally",
      desc: "Enable your institution to reach patients beyond your physical walls. BawaHealth provides the secure infrastructure for your clinicians to deliver telemedicine consultations while maintaining your standards of care.",
      bullets: [
        "Expand patient reach without heavy",
        "Reduce facility congestion",
        "Maintain continuity of care",
        "Digital readiness for modern healthcare"
      ],
      button: "Partner With Us",
      image: hospital,
      link: ROUTES.AUTH // Change to the route you want for hospitals
    },
    {
      badge: "For Doctors",
      title: "Deliver telemedicine through trusted institutions",
      desc: "Practice telemedicine with the backing of established healthcare institutions. BawaHealth connects you with patients through hospital partnerships, ensuring professional credentialing and institutional support.",
      bullets: [
        "Hospital-affiliated practice",
        "Professional credentialing pathways",
        "Secure consultation platform",
        "Institutional liability coverage"
      ],
      button: "Express Interest",
      image: doctor,
      link: ROUTES.AUTH // Change to the route you want for doctors
    },
    {
      badge: "For Patients",
      title: "Access care through licensed providers",
      desc: "Connect with licensed doctors and hospitals from your phone. Access quality healthcare from trusted institutions, wherever you are.",
      bullets: [
        "Consult licensed doctors remotely",
        "Access hospital-affiliated care",
        "Simple, secure mobile app",
        "Your health data protected"
      ],
      button: "Get Started",
      image: patient,
      link: ROUTES.AUTH // Change to the route you want for patients
    }
  ];

  return (
    <section id="about" className="py-12 sm:py-24 px-4 sm:px-8 md:px-16 max-w-[1400px] mx-auto">
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-4xl font-bold text-[#0f2d34] mb-4 tracking-tight">A platform for everyone in healthcare</h2>
        <p className="text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Hospitals expand their reach. Doctors practice flexibly. Patients access care from anywhere. Together, we're improving healthcare access across Africa.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {categories.map((cat, i) => (
          <div key={i} className="flex flex-col rounded-[20px] overflow-hidden border border-gray-100 bg-white hover:shadow-xl transition-all duration-300">
            <div className="h-48 md:h-56 overflow-hidden">
              <img src={cat.image} alt={cat.title} className="w-full h-full object-cover object-[center_2%]" />
            </div>
            <div className="p-6 md:p-8 flex flex-col flex-grow">
              <span className="text-[#127c93] font-bold text-xs mb-3 block">{cat.badge}</span>
              <h3 className="text-xl font-bold text-[#0f2d34] mb-4 leading-snug">{cat.title}</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed flex-grow">{cat.desc}</p>
              
              <ul className="space-y-3 mb-8">
                {cat.bullets.map((bullet, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm font-semibold text-gray-500">
                    <span className="w-1 h-1 rounded-full bg-gray-400 mt-2 shrink-0"></span>
                    {bullet}
                  </li>
                ))}
              </ul>

              <Link to={cat.link} className="flex items-center">
                <button className="flex items-center justify-between w-full border border-gray-100 rounded-xl px-6 py-4 text-sm font-bold text-[#0f2d34] hover:bg-[#f0fbfe] transition-all group">
                  {cat.button}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
