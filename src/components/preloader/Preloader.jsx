"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";

export default function Preloader({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000); // Simulated 2s load
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-[#f8f5f3] z-[9999] text-center px-6"
    >
      {/* Logo */}
      <motion.img
        src="/magic_logo.png"
        alt="MAGIC Initiative"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.1, 1] }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-40 sm:w-56 md:w-64 lg:w-72 xl:w-80 h-auto mb-6"
      />

      {/* Animated Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#7b1e1e] font-semibold"
      >
        Empowering communities...
      </motion.p>
    </motion.div>
  );
}
