import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaTag, 
  FaShareAlt, 
  FaCopy, 
  FaWhatsapp, 
  FaTwitter, 
  FaFacebookF, 
  FaLinkedinIn, 
  FaSpinner,
  FaCheck
} from "react-icons/fa";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5006";
      const res = await fetch(`${API_URL}/api/v1/project/${id}`);
      const result = await res.json();

      if (res.ok && (result.status || result.data)) {
        setProject(result.data);
      } else {
        setError(result.message || "Project not found");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch project details");
    } finally {
      setLoading(false);
    }
  };

  const currentUrl = window.location.href;
  const shareTitle = project ? project.title : "Project Details";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: project?.body?.slice(0, 100),
        url: currentUrl,
      }).catch((err) => console.log("Error sharing", err));
    }
  };

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle} - ${currentUrl}`)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(currentUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f5f3] flex flex-col items-center justify-center pt-24 pb-12">
        <FaSpinner className="animate-spin text-4xl text-[#7b1e1e] mb-3" />
        <p className="text-stone-500 text-xs font-medium">Loading details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#f8f5f3] pt-24 pb-12 px-4 flex flex-col items-center justify-center text-center">
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-stone-200 max-w-md w-full">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Project Not Found</h2>
          <p className="text-gray-500 text-xs mb-6">{error || "The requested project could not be found."}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7b1e1e] text-white font-semibold text-xs rounded-xl hover:bg-[#5a1414] transition"
          >
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f5f3] min-h-screen text-[#4a0e0e] pt-12 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#7b1e1e] transition-colors"
          >
            <FaArrowLeft className="text-[10px]" /> Back to Projects
          </button>
        </motion.div>

        {/* Minimal Project Details Article */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-6 sm:p-12 border border-stone-200 shadow-xs"
        >
          {/* Header Meta */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-stone-100 pb-5">
            <span className="px-3 py-1 rounded-full bg-[#7b1e1e]/10 text-[#7b1e1e] text-xs font-semibold uppercase tracking-wider">
              {project.status} Project
            </span>

            {project.publishedDate && (
              <span className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                <FaCalendarAlt className="text-stone-400" />
                {new Date(project.publishedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
            {project.title}
          </h1>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-8">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-700 rounded-md text-xs font-medium"
                >
                  <FaTag className="text-stone-400 text-[9px]" />
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Body Content */}
          <div className="bg-stone-50/60 p-6 sm:p-8 rounded-2xl border border-stone-200/80 text-stone-800 leading-relaxed whitespace-pre-wrap text-sm sm:text-base font-normal mb-10">
            {project.body}
          </div>

          {/* Minimal Share Section */}
          <div className="border-t border-stone-200 pt-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <FaShareAlt className="text-[#7b1e1e] text-xs" /> Share Initiative
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">Spread awareness across social platforms.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Copy Link Button */}
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-xl border border-stone-200 transition"
                >
                  {copied ? <FaCheck className="text-emerald-600" /> : <FaCopy className="text-stone-500" />}
                  <span>{copied ? "Copied" : "Copy Link"}</span>
                </button>

                {/* Social Share Icons */}
                <a
                  href={shareLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-stone-100 hover:bg-[#7b1e1e] hover:text-white text-stone-700 rounded-xl transition text-xs"
                  title="Share on WhatsApp"
                >
                  <FaWhatsapp />
                </a>

                <a
                  href={shareLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-stone-100 hover:bg-[#7b1e1e] hover:text-white text-stone-700 rounded-xl transition text-xs"
                  title="Share on X"
                >
                  <FaTwitter />
                </a>

                <a
                  href={shareLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-stone-100 hover:bg-[#7b1e1e] hover:text-white text-stone-700 rounded-xl transition text-xs"
                  title="Share on Facebook"
                >
                  <FaFacebookF />
                </a>

                <a
                  href={shareLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-stone-100 hover:bg-[#7b1e1e] hover:text-white text-stone-700 rounded-xl transition text-xs"
                  title="Share on LinkedIn"
                >
                  <FaLinkedinIn />
                </a>

                {navigator.share && (
                  <button
                    onClick={handleNativeShare}
                    className="p-2.5 bg-[#7b1e1e] text-white rounded-xl transition text-xs"
                    title="Share"
                  >
                    <FaShareAlt />
                  </button>
                )}
              </div>
            </div>
          </div>

        </motion.article>

      </div>
    </div>
  );
}
