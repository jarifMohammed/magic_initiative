"use client";

import { motion } from "framer-motion";
import {
  FaBolt,
  FaDove, FaLeaf, FaGraduationCap, FaBriefcase, FaIndustry, FaFemale, FaHeartbeat } from "react-icons/fa";
import { Link } from "react-router-dom";
import TestimonialsCarousel from "../../components/testomonialsCarousel/TestimonialsCarousel";
const focuses = [
  {
    icon: <FaGraduationCap />,
    title: "Education and Digital Learning",
    desc: "Empowering communities through quality education and digital access.",
  },
  {
    icon: <FaBriefcase />,
    title: "Youth and Skill Development",
    desc: "Building practical skills and economic opportunities for young people.",
  },
  {
    icon: <FaFemale />,
    title: "Empowerment",
    desc: "Fostering equality, leadership, and social inclusion for all.",
  },
  {
    icon: <FaHeartbeat />,
    title: "Health and Well-being",
    desc: "Promoting sustainable community health and well-being.",
  },
  {
    icon: <FaBolt />,
    title: "Emergency Response",
    desc: "Rapid and compassionate support for communities in crisis.",
  },
  {
    icon: <FaLeaf />,
    title: "Climate Action",
    desc: "Raising awareness and building community climate resilience.",
  },
  {
    icon: <FaIndustry />,
    title: "Research, Innovation and Entrepreneurship",
    desc: "Driving youth-led innovation and sustainable solutions.",
  },
  {
    icon: <FaDove />,
    title: "Peace, Justice and Democracy",
    desc: "Building peaceful, just, and cohesive communities.",
  },
];


const HomePage = () => {
  return (
    // 🚀 Add overflow-x-hidden to prevent horizontal scroll
    <div className="bg-stone-50 text-gray-800 overflow-x-hidden">

      {/* 🌟 HERO SECTION */}
      <section className="relative w-full min-h-screen flex items-center overflow-hidden bg-stone-100">
        {/* Background Image with slow cinematic zoom */}
        <div className="absolute inset-0">
          <motion.img
            src="/DSC07903.jpg"
            alt="Children learning at Magic Board School"
            className="w-full h-full object-cover"
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: 12, ease: "easeOut" }}
          />
          {/* Light left-scrim keeps the dark text crisp, lets the photo breathe on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#f8f5f3] via-[#f8f5f3]/75 to-transparent"></div>
          {/* Subtle top + bottom fades for a framed, editorial feel */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#f8f5f3]/40 via-transparent to-[#7b1e1e]/20"></div>
        </div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 md:py-32"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          {/* Eyebrow */}
          <motion.div
            className="flex items-center gap-3 mb-5 sm:mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="h-px w-10 bg-[#7b1e1e]"></span>
            <span className="text-[#7b1e1e] font-semibold text-xs sm:text-sm uppercase tracking-[0.22em]">
              MAGIC Initiative
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#4a0e0e] leading-[1.05] tracking-tight"
          >
            Educate. <span className="text-[#7b1e1e]">Empower.</span>
            <br className="hidden sm:block" />
            Sustain. <span className="text-[#7b1e1e]">Unite.</span>
          </motion.h1>

          {/* Accent underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
            className="mt-6 h-1 w-24 bg-[#7b1e1e] rounded-full origin-left"
          ></motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.9 }}
            className="mt-6 text-lg sm:text-xl text-gray-700 max-w-2xl leading-relaxed"
          >
            We are shaping a future where education, sustainability, empowerment, and social cohesion work hand in hand.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.9 }}
            className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4"
          >
            <Link
            to="/donate"
            className="bg-[#7b1e1e] hover:bg-[#611515] text-white font-bold px-8 sm:px-10 py-3 sm:py-4 rounded-full shadow-lg shadow-[#7b1e1e]/25 transition-colors duration-300 text-center">
              Donate Now
              
            </Link>
              
            
            <motion.a
              href="#about"
              className="border-2 border-[#7b1e1e] text-[#7b1e1e] hover:bg-[#7b1e1e] hover:text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold bg-white/50 backdrop-blur-sm transition-colors duration-300 text-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.a>
          </motion.div>

          {/* Animated Stats */}
          <motion.div
            className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 1 }}
          >

          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.a
          href="#about"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-[#7b1e1e]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          aria-label="Scroll down"
        >
          <motion.svg
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            width="26" height="26" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </motion.svg>
        </motion.a>
      </section>


      {/* 🌿 ABOUT SECTION */}
      <section id="about" className="py-20 bg-stone-50">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-[#7b1e1e] mb-4">About the Initiative</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Founded in 2023, <strong>MAGIC</strong> (Mission for Advancing Academic Growth,
              Innovation & Climate-Resilient Communities) empowers underprivileged children and
              communities through education, innovation, and sustainability.
            </p>
            <Link
              to="/mission"
              className="inline-block bg-[#7b1e1e] hover:bg-[#611515] text-white font-medium px-6 py-3 rounded-full transition-all duration-300"
            >
              Read Our Story
            </Link>
          </motion.div>
          <motion.div
            className="rounded-2xl overflow-hidden shadow-lg"
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="/childrenTeacherRaisingHand.jpg"
              alt="MAGIC Initiative in action"
              className="w-full h-[320px] object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* 🎓 CORE PROGRAMS */}
      
    <section id="focus" className="py-20 bg-[#fdf5f5]">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <motion.h2
          className="text-3xl font-bold text-[#800000] mb-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our Focus Areas
        </motion.h2>

        <motion.p
          className="text-[#9b5050] text-base max-w-xl mx-auto mb-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Eight pillars driving our mission to educate, empower, and sustain communities across Bangladesh.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {focuses.map((focus, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-md p-7 flex flex-col items-center text-center gap-4 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#800000]/20 group"
              whileHover={{ scale: 1.04 }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              {/* Icon circle */}
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#fdf0f0] group-hover:bg-[#800000] transition-colors duration-300">
                <span className="text-2xl text-[#800000] group-hover:text-[#fde8e8] transition-colors duration-300">
                  {focus.icon}
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#5a1a1a] leading-snug">
                {focus.title}
              </h3>

              <p className="text-xs text-[#9b5050] leading-relaxed">
                {focus.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>

      {/* 💫 IMPACT SECTION */}
      <section className="py-20 bg-stone-50 text-center">
        <TestimonialsCarousel/>
      </section>

      {/* 🤝 PARTNERS SECTION */}
      <section className="py-20 bg-white light:bg-gray-950 text-center">
        <h3 className="text-3xl font-bold text-[#7b1e1e] mb-10">
          Our Partners
        </h3>

        <div className="flex flex-wrap justify-center items-center gap-10 opacity-90">
          <img
            src="/partner1.jpeg"
            alt="Partner 1"
            className="h-20 sm:h-24 object-contain grayscale hover:grayscale-0 transition-all duration-300"
          />
          <img
            src="/partner3.jpg"
            alt="Partner 2"
            className="h-20 sm:h-24 object-contain grayscale hover:grayscale-0 transition-all duration-300"
          />
          <img
            src="/partner4.png"
            alt="Partner 3"
            className="h-20 sm:h-24 object-contain grayscale hover:grayscale-0 transition-all duration-300"
          />
          <img
            src="/partner2.png"
            alt="Partner 4"
            className="h-20 sm:h-24 object-contain grayscale hover:grayscale-0 transition-all duration-300"
          />
        </div>
      </section>


      


    </div>
  );
};

export default HomePage;
