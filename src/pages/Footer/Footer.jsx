import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { FiHome, FiMail, FiPhone } from "react-icons/fi";
import { Link } from "react-router-dom";

const usefulLinks = [
  { label: "Sponsor a Child",  href: "#" },
  { label: "General Donation", href: "#" },
  { label: "Programs",         href: "#" },
  { label: "News & Updates",   href: "#" },
  { label: "Contact Us",       href: "#" },
  { label: "Privacy Policy",   href: "#" },
];

const contactInfo = [
  {
    Icon: FiHome,
    text: "Ground floor of Khadiza Bhaban, Rumairchora, Cox's Bazar — opposite Cox's Bazar Hashemia Kamil Master's Madrasa.",
  },
  { Icon: FiMail,  text: "magic.initiativebd@gmail.com" },
  { Icon: FiPhone, text: "+880 1643-196126, +880 1878-554154" },
];

const socials = [
  { Icon: FaFacebookF,  label: "Facebook",  href: "http://www.facebook.com/MAGICInitiative" },
  { Icon: FaLinkedinIn, label: "LinkedIn",  href: "http://www.linkedin.com/company/magic-initiative" },
  { Icon: FaInstagram,  label: "Instagram", href: "http://www.instagram.com/magicinitiative" },
];

export default function Footer() {
  return (
    <footer className="w-full">

      {/* ── Main footer body ── */}
      <div className="bg-[#fdf5f5] border-t-4 border-[#800000] px-6 py-14 sm:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-5">
            <a href="/" className="inline-block">
              <img
                src="/magic_logo.png"
                alt="MAGIC Initiative"
                className="h-16 w-auto object-contain"
              />
            </a>
            <p className="text-[#5a1a1a] text-sm leading-relaxed max-w-xs">
              MAGIC Initiative is a non-profit organization that empowers underprivileged children and communities
              in Bangladesh through education, innovation, sustainability, and social cohesion.
            </p>
          </div>

          {/* Col 2 — Useful Links */}
          <div className="flex flex-col gap-5">
            <h3 className="text-[#800000] font-bold text-lg">Useful Links</h3>
            <div className="w-10 h-0.5 bg-[#800000] -mt-2" />
            <ul className="flex flex-col gap-2.5 list-none">
              {usefulLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-[#6b1515] text-sm hover:text-[#800000] hover:underline transition-colors duration-200"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Get In Touch */}
          <div className="flex flex-col gap-5">
            <h3 className="text-[#800000] font-bold text-lg">Get In Touch</h3>
            <div className="w-10 h-0.5 bg-[#800000] -mt-2" />

            <ul className="flex flex-col gap-4 list-none">
              {contactInfo.map(({ Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon className="text-[#800000] shrink-0 mt-0.5 text-[17px]" aria-hidden="true" />
                  <span className="text-[#5a1a1a] text-sm leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>

            {/* Social icons */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-[#e8c8c8] bg-white text-[#800000] transition-all duration-200 hover:bg-[#800000] hover:text-white hover:border-[#800000] hover:scale-110 active:scale-95"
                >
                  <Icon className="text-[15px]" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Copyright bar ── */}
      <div className="bg-[#800000] px-6 py-4 text-center flex flex-col sm:flex-row items-center justify-center gap-2">
        <p className="text-[#fde8e8] text-sm">
          © {new Date().getFullYear()} — MAGIC Initiative | All Rights Reserved
        </p>
        <Link to="/admin/login" className="text-[#fde8e8] text-xs opacity-50 hover:opacity-100 hover:underline transition-opacity ml-2">
          Admin Login
        </Link>
      </div>

    </footer>
  );
}