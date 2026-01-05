import React from 'react';
import { Icon } from "@iconify/react"
import { GetAppButton } from './ui/GetAppButton';
import logo from "../assets/f-logo.svg";
import { ROUTES } from "@/utils/constants";
import { Link } from "react-router"
export const Footer: React.FC = () => {
  return (
    <footer id="contact"className="bg-[#000000] text-white pt-20 pb-12">
      <div className="max-w-[1400px] mx-auto px-8 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-12">
          
          {/* Column 1: Brand & Socials */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center gap-2 text-[#127c93] font-bold text-xl mb-8 cursor-pointer w-fit">
               <div className="leading-none flex flex-col text-[#0f2d34]">
          <img
            src={logo}
            alt="Bawa Health Logo"
            className="h-10 w-auto"
          />
        </div>
            </div>
            
            <p className="text-gray-300 text-[13px] leading-relaxed font-medium mb-8 max-w-[340px]">
              Connecting patients with licensed healthcare providers through secure telemedicine, starting in Ghana and expanding across Africa.
            </p>
            
            {/* White App Button with Vertical Separator & Audience Selection */}
            <div className="mb-12 inline-block">
              <GetAppButton variant="white" />
            </div>

            <div className="flex flex-col gap-4">
              <h5 className="font-bold text-base">Visit Our Socials</h5>
              <div className="flex gap-5">
                <a href="#" className="flex items-center gap-3 text-gray-200 hover:text-white transition-colors">
                                <Icon icon="mdi:linkedin" className="w-7 h-7" />
                                
                            </a>
                            <a href="#" className="flex items-center gap-3 text-gray-200 hover:text-white transition-colors">
                                <Icon icon="ic:baseline-facebook" className="w-7 h-7" />
                                
                            </a>
                            <a href="#" className="flex items-center gap-3 text-gray-200 hover:text-white transition-colors">
                                <Icon icon="mingcute:instagram-fill" className="w-7 h-7" />
                                
                            </a>
                            <a href="#" className="flex items-center gap-3 text-gray-200 hover:text-white transition-colors">
                                <Icon icon="mdi:youtube" className="w-7 h-7" />
                                
                            </a>
              </div>
            </div>
          </div>

          {/* Right Section: Link Columns and Subscription directly below */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-16">
              <div>
                <h4 className="font-bold text-sm sm:text-base mb-6">Platform</h4>
                <ul className="space-y-4 text-gray-400 text-[13px] font-medium">
                  <li>
              <Link to={ROUTES.HOME} className="hover:text-white transition-colors">
                For Hospitals
              </Link>
            </li>
            <li>
              <Link to={ROUTES.HOME} className="hover:text-white transition-colors">
                For Doctors
              </Link>
            </li>
            <li>
              <Link to={ROUTES.HOME} className="hover:text-white transition-colors">
                For Patients
              </Link>
            </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-sm sm:text-base mb-6">Company</h4>
                <ul className="space-y-4 text-gray-400 text-[13px] font-medium">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <h4 className="font-bold text-sm sm:text-base mb-6">Legal</h4>
                <ul className="space-y-4 text-gray-400 text-[13px] font-medium">
                  <li>
              <Link to={ROUTES.HOME} className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to={ROUTES.HOME} className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to={ROUTES.HOME} className="hover:text-white transition-colors">
                Payment & Refunds
              </Link>
            </li>
                  <li><a href="#" className="hover:text-white transition-colors">All Legal Documents</a></li>
                </ul>
              </div>
            </div>

            {/* Subscription Section under the columns */}
            <div className="flex flex-col gap-4 mt-auto">
              <p className="text-gray-300 text-sm font-medium">Subscribe to our mailing list to get our community updates</p>
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <input
                    type="email"
                    placeholder="Your email"
                    className="bg-transparent border border-gray-700 rounded-lg px-4 py-3
                      text-sm text-white flex-1 min-w-0 w-full
                      focus:outline-none focus:border-[#127c93]"
                  />
                <button className="bg-[#127c93] text-white rounded-lg px-8 py-3 text-sm font-bold hover:bg-[#0e6375] transition-colors whitespace-nowrap flex-shrink-0">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};