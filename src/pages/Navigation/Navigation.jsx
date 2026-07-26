"use client";

import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const MenuIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const XIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const navLinks = [
  {
    href: "/",
    label: "Home",
  },
  {
    label: "Focus",
    dropdown: [
      { href: "/focus/education",   label: "Education and Digital Learning" },
      { href: "/focus/youth",       label: "Youth and Skill Development" },
      { href: "/focus/women",       label: "Empowerment" },
      { href: "/focus/health",      label: "Health and Well-being" },
      { href: "/focus/emergency",   label: "Emergency Response" },
      { href: "/focus/climate",     label: "Climate Action" },
      { href: "/focus/research",    label: "Research, Innovation and Entrepreneurship" },
      { href: "/focus/peace",       label: "Peace, Justice and Democracy" },
    ],
  },
  {
    label: "Programs",
    dropdown: [
      { href: "/programs/current",   label: "Current Programs" },
      { href: "/programs/completed", label: "Completed Programs" },
      { href: "/programs/global",    label: "Global Giving Programs" },
    ],
  },
  {
    label: "Updates",
    dropdown: [
      { href: "/news",   label: "News" },
      { href: "/blogs",  label: "Blogs" },
      { href: "/events", label: "Events" },
    ],
  },
  {
    label: "About Us",
    dropdown: [
      { href: "/mission", label: "Mission & Vision" },
      { href: "/values",  label: "Core Values" },
      { href: "/impact",    label: "Impact" },
      { href: "/team",    label: "Meet the Team" },
      { href: "/contact", label: "Contact" },
      { href: "/team",    label: "Award and Recognitions" },
      { href: "/faq",    label: "FAQs" },

    ],
  },
  {
    label: "Get Involved Us",
    dropdown: [
      { href: "/volunteer", label: "Volunteer" },
      { href: "/partner",  label: "Partner with us" },
      { href: "/team",    label: "Career" },
    ]
  },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen]                 = useState(false);
  const [openDropdown, setOpenDropdown]             = useState(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const dropdownRefs = useRef({});
  const timeoutRef   = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.entries(dropdownRefs.current).forEach(([label, ref]) => {
        if (ref && !ref.contains(event.target)) {
          setOpenDropdown((cur) => (cur === label ? null : cur));
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = (label) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 200);
  };

  const toggleMobileDropdown = (label) => {
    setOpenMobileDropdown(openMobileDropdown === label ? null : label);
  };

  return (
    <header className="bg-stone-50/95 backdrop-blur-sm sticky top-0 z-50 w-full border-b border-stone-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src="/magic_logo.png"
              alt="MAGIC Initiative Logo"
              className="h-10 w-auto object-contain"
            />
          </a>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-6">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div
                  key={link.label}
                  className="relative"
                  ref={(el) => (dropdownRefs.current[link.label] = el)}
                  onMouseEnter={() => handleMouseEnter(link.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="flex items-center gap-1 text-sm font-medium text-[#5a1a1a] hover:text-[#800000] transition-colors duration-300 focus:outline-none">
                    {link.label}
                    <ChevronDownIcon
                      className={`h-4 w-4 transition-transform duration-300 ${
                        openDropdown === link.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 transition-all duration-300 ${
                      openDropdown === link.label
                        ? "opacity-100 visible pointer-events-auto"
                        : "opacity-0 invisible pointer-events-none"
                    }`}
                  >
                    <div className="bg-white border border-stone-200 rounded-lg shadow-xl overflow-hidden min-w-[220px]">
                      {link.dropdown.map((item, idx) => (
                        <Link
                          key={item.label}
                          to={item.href}
                          className={`block px-5 py-3 text-sm text-[#5a1a1a] hover:bg-[#fdf0f0] hover:text-[#800000] transition-colors duration-150 ${
                            idx !== link.dropdown.length - 1
                              ? "border-b border-stone-100"
                              : ""
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm font-medium text-[#5a1a1a] hover:text-[#800000] transition-colors duration-300"
                >
                  {link.label}
                </Link>
              )
            )}

            {/* SPONSOR A CHILD */}
            <Link
              to="/sponsor"
              className="ml-2 inline-flex items-center justify-center rounded-full bg-[#800000] hover:bg-[#5a0000] text-[#fde8e8] font-semibold px-5 py-2 text-sm transition-all duration-300 shadow-sm whitespace-nowrap"
            >
              Sponsor a Child
            </Link>
          </nav>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#5a1a1a] hover:text-[#800000] hover:bg-[#fdf0f0] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#800000]"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-stone-50 shadow-inner max-h-[80vh] overflow-y-auto">
          <div className="px-4 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div key={link.label}>
                  <button
                    onClick={() => toggleMobileDropdown(link.label)}
                    className="w-full flex justify-between items-center text-[#5a1a1a] hover:text-[#800000] hover:bg-[#fdf0f0] px-3 py-2.5 rounded-md text-base font-medium transition-colors duration-150"
                  >
                    {link.label}
                    <ChevronDownIcon
                      className={`h-5 w-5 transition-transform duration-300 ${
                        openMobileDropdown === link.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openMobileDropdown === link.label && (
                    <div className="pl-3 pt-1 pb-1 space-y-0.5 border-l-2 border-[#e8c8c8] ml-3">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.label}
                          to={item.href}
                          className="block text-[#6b1515] hover:bg-[#fdf0f0] hover:text-[#800000] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block text-[#5a1a1a] hover:bg-[#fdf0f0] hover:text-[#800000] px-3 py-2.5 rounded-md text-base font-medium transition-colors duration-150"
                >
                  {link.label}
                </Link>
              )
            )}

            <div className="pt-2">
              <Link
                to="/sponsor"
                className="block text-center bg-[#800000] hover:bg-[#5a0000] text-[#ffffff] font-semibold px-4 py-2.5 rounded-full shadow-sm transition-all duration-300"
              >
                Sponsor a Child
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;