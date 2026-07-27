import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  FaSearch, 
  FaCalendarAlt, 
  FaArrowRight, 
  FaSpinner
} from "react-icons/fa";

const TAG_OPTIONS = [
  "education",
  "youth",
  "empowerment",
  "health",
  "emergency",
  "climate",
  "research",
  "peace",
];

export default function CompletedProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProjects();
  }, [selectedTag, page]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5006";
      const params = new URLSearchParams({
        status: "completed",
        page: page.toString(),
        limit: "9"
      });
      if (selectedTag) params.append("tag", selectedTag);
      if (searchTerm) params.append("search", searchTerm);

      const res = await fetch(`${API_URL}/api/v1/project?${params.toString()}`);
      const result = await res.json();

      if (result.status || result.data) {
        const projectList = result.data?.data || (Array.isArray(result.data) ? result.data : []);
        const total = result.data?.meta?.totalPages || result.totalPages || 1;
        setProjects(projectList);
        setTotalPages(total);
      }
    } catch (err) {
      console.error("Error fetching completed projects", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProjects();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <div className="bg-[#f8f5f3] min-h-screen text-[#4a0e0e] pt-12 pb-24">
      {/* Minimal Header */}
      <section className="py-12 sm:py-16 text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-bold tracking-widest text-[#7b1e1e] uppercase">
            Archive
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#4a0e0e] mt-2 mb-3 tracking-tight">
            Completed Projects
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto font-normal">
            Past initiatives successfully delivered to empower local communities.
          </p>
        </motion.div>
      </section>

      {/* Minimal Filter & Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search completed projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#7b1e1e] transition shadow-2xs"
            />
            <FaSearch className="absolute left-3.5 top-3.5 text-stone-400 text-xs" />
          </form>

          {/* Tag Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => { setSelectedTag(""); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedTag === ""
                  ? "bg-[#7b1e1e] text-white"
                  : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
              }`}
            >
              All
            </button>
            {TAG_OPTIONS.map(tag => (
              <button
                key={tag}
                onClick={() => { setSelectedTag(tag); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedTag === tag
                    ? "bg-[#7b1e1e] text-white"
                    : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Minimal Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-500">
            <FaSpinner className="animate-spin text-3xl text-[#7b1e1e] mb-3" />
            <p className="text-xs font-medium">Loading completed projects...</p>
          </div>
        ) : projects.length > 0 ? (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projects.map((project) => (
                <motion.div
                  key={project._id}
                  variants={cardVariants}
                  whileHover={{ y: -4 }}
                  className="group bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 hover:border-[#7b1e1e]/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Tag & Date */}
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-4">
                      <span className="font-semibold px-2.5 py-1 rounded-full bg-[#7b1e1e]/10 text-[#7b1e1e]">
                        Completed
                      </span>
                      {project.publishedDate && (
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt className="text-stone-400 text-[11px]" />
                          {new Date(project.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#7b1e1e] transition-colors mb-3 line-clamp-2">
                      {project.title}
                    </h2>

                    {/* Body Snippet */}
                    <p className="text-stone-600 text-sm leading-relaxed line-clamp-3 mb-6 font-normal">
                      {project.body}
                    </p>
                  </div>

                  <div>
                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {project.tags.map(t => (
                          <span key={t} className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* View Details Link */}
                    <Link
                      to={`/projects/${project._id}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#7b1e1e] hover:text-[#5a1414] transition-colors"
                    >
                      <span>Read Project Details</span>
                      <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Minimal Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 disabled:opacity-40 font-medium text-xs text-stone-700"
                >
                  Previous
                </button>
                <span className="text-xs font-semibold text-stone-600">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 disabled:opacity-40 font-medium text-xs text-stone-700"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 max-w-md mx-auto">
            <p className="text-stone-500 text-sm font-medium">No completed projects found.</p>
          </div>
        )}
      </section>
    </div>
  );
}
