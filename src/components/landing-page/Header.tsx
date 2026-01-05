import React, { useState } from "react";
import { GetAppButton } from "../ui/GetAppButton";
import logo from "../../assets/logo.svg";
import { ROUTES } from "@/utils/constants";
import { NavLink, Link } from "react-router";

export const Header: React.FC = () => {
  const navLinks = [
    { label: "Home", to: ROUTES.HOME },
    { label: "About", to: ROUTES.ABOUT },
    { label: "Contact", to: ROUTES.CONTACT },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-50 relative">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16 py-4 flex items-center justify-between">
        
        {/* Logo + mobile action */}
        <div className="flex items-center gap-3">
          <Link to={ROUTES.HOME} className="flex items-center">
            <img
              src={logo}
              alt="Bawa Health Logo"
              className="h-8 sm:h-9 md:h-10 w-auto"
            />
          </Link>

          {/* Partner button visible on mobile bar (xs only) */}
          <Link to={ROUTES.AUTH} onClick={() => setMobileOpen(false)} className="sm:hidden">
            <button className="border border-gray-200 text-[#0f2d34] px-3 py-2 rounded-md font-bold text-sm hover:bg-gray-50 transition-colors">
              Partner With Us
            </button>
          </Link>
        </div>

        {/* Navigation + Actions */}
        <div className="flex items-center gap-3 sm:gap-6 md:gap-8">
          
          {/* Navigation Links (hidden on xs) */}
          <div
            className="hidden sm:flex items-center gap-3 sm:gap-4 md:gap-6
            font-bold text-[10px] sm:text-[11px] md:text-sm
            py-1"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                end={link.to === ROUTES.HOME}
                className={({ isActive }) =>
                  isActive
                    ? "text-[#127c93]"
                    : "text-[#0f2d34] hover:text-[#127c93] transition-colors"
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile menu toggle (only render when menu is closed to avoid duplicate close buttons) */}
            {!mobileOpen && (
              <button
                className="sm:hidden p-2 rounded-md border border-gray-200"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}

            <Link to={ROUTES.AUTH}>
              <button className="hidden sm:block border border-gray-200 text-[#0f2d34]
                px-4 md:px-5 py-2 rounded-lg font-bold text-xs md:text-sm
                hover:bg-gray-50 transition-colors">
                Partner With Us
              </button>
            </Link>

            {/* Hide header Get App on xs (panel provides it) */}
            <div className="hidden sm:block">
              <GetAppButton variant="teal" iconTheme="white" />
            </div>
          </div>

          {/* Mobile menu (rendered as full-width panel) */}
          {mobileOpen && (
            <div className="sm:hidden absolute left-0 right-0 top-full bg-white border-t border-gray-100 shadow-md z-40">
              <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16 py-4">
                {/* Close button */}
                <div className="flex items-center justify-end mb-3">
                  <button
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                    className="p-2 rounded-md border border-gray-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.label}
                      to={link.to}
                      end={link.to === ROUTES.HOME}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        (isActive
                          ? "text-[#127c93]"
                          : "text-[#0f2d34] hover:text-[#127c93] transition-colors") +
                        " block text-base font-medium py-2 px-2 rounded-md"
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </nav>

                <div className="mt-4 flex flex-col gap-2 items-center">
                  <div className="w-full flex justify-center">
                    <div className="w-max">
                      <GetAppButton variant="teal" iconTheme="white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
