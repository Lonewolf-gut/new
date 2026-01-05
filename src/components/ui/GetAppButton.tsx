import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, User, Stethoscope, Hospital } from "lucide-react";

import appStoreLogo from "../../assets/app.png";
import playStoreLogo from "../../assets/play.png";

interface GetAppButtonProps {
  variant?: "white" | "teal";
  iconTheme?: "auto" | "white" | "black";
}

export const GetAppButton: React.FC<GetAppButtonProps> = ({
  variant = "white",
  iconTheme = "auto",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isWhiteVariant = variant === "white";

  // ICON COLOR LOGIC
  const forceWhite = iconTheme === "white";
  const forceBlack = iconTheme === "black";

  const playStoreClass = forceWhite
    ? "brightness-0 invert"
    : forceBlack
    ? "brightness-0"
    : "brightness-0";

  const appStoreClass = forceWhite
    ? "brightness-0 invert"
    : forceBlack
    ? "brightness-0"
    : isWhiteVariant
    ? "brightness-0"
    : "brightness-0 invert";

  const handleSelect = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-lg text-[10px] sm:text-sm shadow-sm hover:shadow-md active:scale-95 transition-all duration-150 ${
          isWhiteVariant
            ? "bg-white text-black hover:bg-gray-100"
            : "bg-[#127c93] text-white hover:bg-[#0e6375]"
        }`}
      >
        {/* Store Icons */}
        <div className="flex items-center gap-1.5 pointer-events-none">
          <img
            src={playStoreLogo}
            alt="Play Store"
            className={`h-3 sm:h-4 w-auto object-contain ${playStoreClass}`}
          />

          <span
            className={`h-3 w-px ${
              isWhiteVariant ? "bg-black/30" : "bg-white/40"
            }`}
          />

          <img
            src={appStoreLogo}
            alt="App Store"
            className={`h-3 sm:h-4 w-auto object-contain ${appStoreClass}`}
          />
        </div>

        <span className="whitespace-nowrap pointer-events-none">
          Get App
        </span>

        <ChevronDown
          size={12}
          className={`transition-transform duration-200 pointer-events-none sm:w-3.5 sm:h-3.5 ${
            isOpen ? "rotate-180" : ""
          } ${isWhiteVariant ? "text-black" : "text-white"}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 sm:w-56 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-gray-100 py-2 z-[9999] animate-in fade-in zoom-in-95 duration-150">
          <button
            onClick={handleSelect}
            className="w-full flex items-center gap-3 px-4 py-3 text-xs sm:text-sm text-[#0f2d34] hover:bg-[#f0fbfe] hover:text-[#127c93] transition-colors text-left"
          >
            <User size={16} />
            For Patients
          </button>

          <button
            onClick={handleSelect}
            className="w-full flex items-center gap-3 px-4 py-3 text-xs sm:text-sm text-[#0f2d34] hover:bg-[#f0fbfe] hover:text-[#127c93] transition-colors text-left"
          >
            <Stethoscope size={16} />
            For Doctors
          </button>

          <button
            onClick={handleSelect}
            className="w-full flex items-center gap-3 px-4 py-3 text-xs sm:text-sm text-[#0f2d34] hover:bg-[#f0fbfe] hover:text-[#127c93] transition-colors text-left"
          >
            <Hospital size={16} />
            For Admin
          </button>
        </div>
      )}
    </div>
  );
};
