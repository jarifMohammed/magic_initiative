import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHandHoldingHeart,
  FaUsers,
  FaFolderOpen,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter,
  FaTimes,
  FaSignOutAlt,
  FaSpinner,
  FaCalendarAlt,
  FaTag,
  FaCheck
} from "react-icons/fa";

const TAG_OPTIONS = [
  'education',
  'youth',
  'empowerment',
  'health',
  'emergency',
  'climate',
  'research',
  'peace',
];

const STATUS_OPTIONS = ['ongoing', 'completed'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("donations");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Projects specific filters & search
  const [statusFilter, setStatusFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    body: "",
    status: "ongoing",
    tags: [],
    publishedDate: new Date().toISOString().substring(0, 16)
  });

  const [actionLoading, setActionLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState({ type: "", message: "" });

  useEffect(() => {
    // Check auth
    if (!localStorage.getItem("magic_admin_auth")) {
      navigate("/admin/login");
      return;
    }
    fetchData();
  }, [activeTab, page, statusFilter, tagFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5006";
      let endpoint = "";

      if (activeTab === "donations") {
        endpoint = `${API_URL}/api/v1/donation?page=${page}&limit=10`;
      } else if (activeTab === "sponsorships") {
        endpoint = `${API_URL}/api/v1/sponsorship?page=${page}&limit=10`;
      } else if (activeTab === "projects") {
        const query = new URLSearchParams({
          page: page.toString(),
          limit: "10"
        });
        if (statusFilter) query.append("status", statusFilter);
        if (tagFilter) query.append("tag", tagFilter);
        if (searchTerm) query.append("search", searchTerm);
        endpoint = `${API_URL}/api/v1/project?${query.toString()}`;
      }

      const token = localStorage.getItem("magic_admin_auth");
      const res = await fetch(endpoint, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.status === 401 || res.status === 403) {
        handleLogout();
        return;
      }

      const result = await res.json();

      if (activeTab === "donations") {
        setData(result.donations || []);
        setTotalPages(result.totalPages || 1);
      } else if (activeTab === "sponsorships") {
        setData(result.sponsorships || []);
        setTotalPages(result.totalPages || 1);
      } else if (activeTab === "projects") {
        const projectList = result.data?.data || (Array.isArray(result.data) ? result.data : []);
        const pages = result.data?.meta?.totalPages || result.totalPages || 1;
        setData(projectList);
        setTotalPages(pages);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const handleLogout = () => {
    localStorage.removeItem("magic_admin_auth");
    navigate("/admin/login");
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => {
      const exists = prev.tags.includes(tag);
      if (exists) {
        return { ...prev, tags: prev.tags.filter(t => t !== tag) };
      } else {
        return { ...prev, tags: [...prev.tags, tag] };
      }
    });
  };

  const openCreateModal = () => {
    setFormData({
      title: "",
      body: "",
      status: "ongoing",
      tags: [],
      publishedDate: new Date().toISOString().substring(0, 16)
    });
    setIsCreateOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || "",
      body: project.body || "",
      status: project.status || "ongoing",
      tags: project.tags || [],
      publishedDate: project.publishedDate
        ? new Date(project.publishedDate).toISOString().substring(0, 16)
        : new Date().toISOString().substring(0, 16)
    });
  };

  const openViewModal = async (project) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5006";
      const res = await fetch(`${API_URL}/api/v1/project/${project._id}`);
      const result = await res.json();
      if (result.status && result.data) {
        setViewingProject(result.data);
      } else {
        setViewingProject(project);
      }
    } catch (err) {
      setViewingProject(project);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5006";
      const token = localStorage.getItem("magic_admin_auth");
      const res = await fetch(`${API_URL}/api/v1/project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          publishedDate: new Date(formData.publishedDate).toISOString()
        })
      });
      const result = await res.json();

      if (res.ok && (result.status || result.data)) {
        setAlertMsg({ type: "success", message: "Project created successfully!" });
        setIsCreateOpen(false);
        fetchData();
      } else {
        setAlertMsg({ type: "error", message: result.message || "Failed to create project" });
      }
    } catch (err) {
      console.error(err);
      setAlertMsg({ type: "error", message: "Network error creating project" });
    } finally {
      setActionLoading(false);
      setTimeout(() => setAlertMsg({ type: "", message: "" }), 4000);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingProject) return;
    setActionLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5006";
      const token = localStorage.getItem("magic_admin_auth");
      const res = await fetch(`${API_URL}/api/v1/project/${editingProject._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          publishedDate: new Date(formData.publishedDate).toISOString()
        })
      });
      const result = await res.json();

      if (res.ok && (result.status || result.data)) {
        setAlertMsg({ type: "success", message: "Project updated successfully!" });
        setEditingProject(null);
        fetchData();
      } else {
        setAlertMsg({ type: "error", message: result.message || "Failed to update project" });
      }
    } catch (err) {
      console.error(err);
      setAlertMsg({ type: "error", message: "Network error updating project" });
    } finally {
      setActionLoading(false);
      setTimeout(() => setAlertMsg({ type: "", message: "" }), 4000);
    }
  };

  const handleDelete = async () => {
    if (!deletingProject) return;
    setActionLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5006";
      const token = localStorage.getItem("magic_admin_auth");
      const res = await fetch(`${API_URL}/api/v1/project/${deletingProject._id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const result = await res.json();

      if (res.ok && result.status) {
        setAlertMsg({ type: "success", message: "Project deleted successfully!" });
        setDeletingProject(null);
        fetchData();
      } else {
        setAlertMsg({ type: "error", message: result.message || "Failed to delete project" });
      }
    } catch (err) {
      console.error(err);
      setAlertMsg({ type: "error", message: "Network error deleting project" });
    } finally {
      setActionLoading(false);
      setTimeout(() => setAlertMsg({ type: "", message: "" }), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f3] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-gradient-to-br from-[#7b1e1e] to-[#4a0e0e] rounded-3xl p-7 sm:p-8 shadow-xl shadow-[#7b1e1e]/20">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
            <p className="text-white/70 text-sm mt-1">Manage donations, sponsorships, and organization projects</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white hover:bg-white/20 font-semibold rounded-full border border-white/20 backdrop-blur-sm transition"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>

        {/* Global Toast Alert */}
        {alertMsg.message && (
          <div className={`mb-6 p-4 rounded-2xl font-semibold flex justify-between items-center shadow-sm ${
            alertMsg.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"
          }`}>
            <span>{alertMsg.message}</span>
            <button onClick={() => setAlertMsg({ type: "", message: "" })} className="opacity-60 hover:opacity-100 transition"><FaTimes /></button>
          </div>
        )}

        {/* Tabs Header */}
        <div className="inline-flex flex-wrap gap-1.5 p-1.5 mb-6 bg-white rounded-2xl border border-[#7b1e1e]/10 shadow-sm">
          <button
            onClick={() => { setActiveTab("donations"); setPage(1); }}
            className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition-colors ${
              activeTab === "donations"
                ? "bg-gradient-to-br from-[#7b1e1e] to-[#4a0e0e] text-white shadow"
                : "text-gray-500 hover:text-[#7b1e1e]"
            }`}
          >
            <FaHandHoldingHeart />
            One-Time Donations
          </button>
          <button
            onClick={() => { setActiveTab("sponsorships"); setPage(1); }}
            className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition-colors ${
              activeTab === "sponsorships"
                ? "bg-gradient-to-br from-[#7b1e1e] to-[#4a0e0e] text-white shadow"
                : "text-gray-500 hover:text-[#7b1e1e]"
            }`}
          >
            <FaUsers />
            Monthly Sponsorships
          </button>
          <button
            onClick={() => { setActiveTab("projects"); setPage(1); }}
            className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition-colors ${
              activeTab === "projects"
                ? "bg-gradient-to-br from-[#7b1e1e] to-[#4a0e0e] text-white shadow"
                : "text-gray-500 hover:text-[#7b1e1e]"
            }`}
          >
            <FaFolderOpen />
            Projects
          </button>
        </div>

        {/* Projects Filter & Search Toolbar */}
        {activeTab === "projects" && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#7b1e1e]/10 mb-6 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search project title or body..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-[#7b1e1e] focus:ring-2 focus:ring-[#7b1e1e]/15 transition"
                />
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#4a0e0e] text-white text-sm font-semibold rounded-xl hover:bg-[#310909] transition"
              >
                Search
              </button>
            </form>

            {/* Filters & Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <FaFilter className="text-[#7b1e1e]/50 text-xs" />
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  className="px-3 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-[#7b1e1e] bg-white"
                >
                  <option value="">All Statuses</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Tag Filter */}
              <div className="flex items-center gap-1.5">
                <FaTag className="text-[#7b1e1e]/50 text-xs" />
                <select
                  value={tagFilter}
                  onChange={(e) => { setTagFilter(e.target.value); setPage(1); }}
                  className="px-3 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-[#7b1e1e] bg-white"
                >
                  <option value="">All Tags</option>
                  {TAG_OPTIONS.map(tag => (
                    <option key={tag} value={tag}>{tag.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              {(statusFilter || tagFilter || searchTerm) && (
                <button
                  onClick={() => { setStatusFilter(""); setTagFilter(""); setSearchTerm(""); setPage(1); }}
                  className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-red-600 transition"
                >
                  Clear Filters
                </button>
              )}

              {/* Create Project Button */}
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#7b1e1e] hover:bg-[#611515] text-white text-sm font-bold rounded-xl transition shadow-md shadow-[#7b1e1e]/20"
              >
                <FaPlus />
                Create Project
              </button>
            </div>
          </div>
        )}

        {/* Data Table Container */}
        <div className="bg-white shadow-sm border border-[#7b1e1e]/10 overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#7b1e1e]/5 text-[#7b1e1e] uppercase text-xs font-bold border-b border-[#7b1e1e]/10">
                  {activeTab === "donations" ? (
                    <>
                      <th className="p-4">Date</th>
                      <th className="p-4">Donor</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Message</th>
                    </>
                  ) : activeTab === "sponsorships" ? (
                    <>
                      <th className="p-4">Created</th>
                      <th className="p-4">Sponsor</th>
                      <th className="p-4">Child Details</th>
                      <th className="p-4">Amount/mo</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Next Billing</th>
                    </>
                  ) : (
                    <>
                      <th className="p-4">Title & Description</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Tags</th>
                      <th className="p-4">Published Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-gray-500 font-semibold">
                      <div className="flex items-center justify-center gap-2">
                        <FaSpinner className="animate-spin text-xl text-[#7b1e1e]" />
                        Loading data...
                      </div>
                    </td>
                  </tr>
                ) : data && data.length > 0 ? (
                  data.map((item) => (
                    <tr key={item._id} className="hover:bg-[#7b1e1e]/[0.03] transition-colors">
                      {activeTab === "donations" ? (
                        <>
                          <td className="p-4 text-sm text-gray-600">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-gray-900">{item.donorName || "Anonymous"}</div>
                            <div className="text-sm text-gray-500">{item.donorEmail || "No email"}</div>
                          </td>
                          <td className="p-4 font-bold text-[#7b1e1e]">
                            ${item.amount} {item.currency?.toUpperCase()}
                          </td>
                          <td className="p-4">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#7b1e1e]/8 text-[#7b1e1e] border border-[#7b1e1e]/15">
                              {item.status?.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-600 italic">
                            {item.message || "-"}
                          </td>
                        </>
                      ) : activeTab === "sponsorships" ? (
                        <>
                          <td className="p-4 text-sm text-gray-600">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-gray-900">{item.sponsorName || "Anonymous"}</div>
                            <div className="text-sm text-gray-500">{item.sponsorEmail}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-gray-900">{item.childName || "Unknown Child"}</div>
                            <div className="text-xs text-gray-500">ID: {item.childId || "N/A"}</div>
                          </td>
                          <td className="p-4 font-bold text-[#7b1e1e]">
                            ${item.amount}
                          </td>
                          <td className="p-4">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#7b1e1e]/8 text-[#7b1e1e] border border-[#7b1e1e]/15">
                              {item.status?.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4 text-sm font-semibold text-gray-700">
                            {item.nextBillingDate ? new Date(item.nextBillingDate).toLocaleDateString() : "Not Set"}
                          </td>
                        </>
                      ) : (
                        // PROJECTS ROW
                        <>
                          <td className="p-4 max-w-xs md:max-w-md">
                            <div className="font-bold text-gray-900 text-base">{item.title}</div>
                            <div className="text-xs text-gray-500 line-clamp-2 mt-1">{item.body}</div>
                          </td>
                          <td className="p-4">
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#7b1e1e]/8 text-[#7b1e1e] border border-[#7b1e1e]/15">
                              {item.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {item.tags && item.tags.length > 0 ? (
                                item.tags.map((tag) => (
                                  <span key={tag} className="px-2 py-0.5 bg-[#7b1e1e]/8 text-[#7b1e1e] rounded text-xs font-medium border border-[#7b1e1e]/15">
                                    #{tag}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-gray-400">No tags</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-xs font-medium text-gray-600 whitespace-nowrap">
                            {item.publishedDate ? new Date(item.publishedDate).toLocaleDateString() : "-"}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openViewModal(item)}
                                className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                                title="View Details"
                              >
                                <FaEye />
                              </button>
                              <button
                                onClick={() => openEditModal(item)}
                                className="p-2.5 text-sky-600 hover:text-sky-900 hover:bg-sky-50 rounded-lg transition"
                                title="Edit Project"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => setDeletingProject(item)}
                                className="p-2.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition"
                                title="Delete Project"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-gray-400 font-semibold">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-stone-100 bg-[#f8f5f3]/60">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-stone-300 rounded-xl hover:border-[#7b1e1e] hover:text-[#7b1e1e] disabled:opacity-40 font-semibold text-sm transition"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 font-semibold">
                Page <span className="text-[#7b1e1e]">{page}</span> of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white border border-stone-300 rounded-xl hover:border-[#7b1e1e] hover:text-[#7b1e1e] disabled:opacity-40 font-semibold text-sm transition"
              >
                Next
              </button>
            </div>
          )}
        </div>

      </div>

      {/* CREATE PROJECT MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4a0e0e]/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex justify-between items-center border-b border-stone-200 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-[#4a0e0e] flex items-center gap-2">
                <FaPlus className="text-lg" /> Create New Project
              </h2>
              <button onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Project Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Clean Water & Health Initiative"
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-[#7b1e1e] focus:ring-2 focus:ring-[#7b1e1e]/15 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Description / Body *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Detailed description of the project..."
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-[#7b1e1e] focus:ring-2 focus:ring-[#7b1e1e]/15 transition resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-[#7b1e1e] focus:ring-2 focus:ring-[#7b1e1e]/15 transition bg-white"
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status} value={status}>{status.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <FaCalendarAlt className="text-[#7b1e1e]/60" /> Published Date
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.publishedDate}
                    onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-[#7b1e1e] focus:ring-2 focus:ring-[#7b1e1e]/15 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Project Tags</label>
                <div className="flex flex-wrap gap-2">
                  {TAG_OPTIONS.map(tag => {
                    const isSelected = formData.tags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                          isSelected
                            ? "bg-[#7b1e1e] text-white border-[#7b1e1e]"
                            : "bg-stone-100 text-gray-700 border-stone-300 hover:border-[#7b1e1e]"
                        }`}
                      >
                        {isSelected && <FaCheck className="text-xs" />}
                        #{tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-5 py-2.5 bg-stone-200 text-gray-700 font-semibold rounded-xl hover:bg-stone-300 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#7b1e1e] hover:bg-[#611515] text-white font-bold rounded-xl transition text-sm disabled:opacity-50 shadow-md shadow-[#7b1e1e]/20"
                >
                  {actionLoading ? <FaSpinner className="animate-spin" /> : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PROJECT MODAL */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4a0e0e]/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex justify-between items-center border-b border-stone-200 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-[#4a0e0e] flex items-center gap-2">
                <FaEdit className="text-lg" /> Edit Project
              </h2>
              <button onClick={() => setEditingProject(null)} className="text-gray-400 hover:text-gray-600 text-xl">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Project Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-[#7b1e1e] focus:ring-2 focus:ring-[#7b1e1e]/15 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Description / Body *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-[#7b1e1e] focus:ring-2 focus:ring-[#7b1e1e]/15 transition resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-[#7b1e1e] focus:ring-2 focus:ring-[#7b1e1e]/15 transition bg-white"
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status} value={status}>{status.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <FaCalendarAlt className="text-[#7b1e1e]/60" /> Published Date
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.publishedDate}
                    onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-[#7b1e1e] focus:ring-2 focus:ring-[#7b1e1e]/15 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Project Tags</label>
                <div className="flex flex-wrap gap-2">
                  {TAG_OPTIONS.map(tag => {
                    const isSelected = formData.tags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                          isSelected
                            ? "bg-[#7b1e1e] text-white border-[#7b1e1e]"
                            : "bg-stone-100 text-gray-700 border-stone-300 hover:border-[#7b1e1e]"
                        }`}
                      >
                        {isSelected && <FaCheck className="text-xs" />}
                        #{tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-5 py-2.5 bg-stone-200 text-gray-700 font-semibold rounded-xl hover:bg-stone-300 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#7b1e1e] hover:bg-[#611515] text-white font-bold rounded-xl transition text-sm disabled:opacity-50 shadow-md shadow-[#7b1e1e]/20"
                >
                  {actionLoading ? <FaSpinner className="animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW PROJECT DETAILS MODAL */}
      {viewingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4a0e0e]/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex justify-between items-start border-b border-stone-200 pb-4 mb-4">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 bg-[#7b1e1e]/8 text-[#7b1e1e] border border-[#7b1e1e]/15">
                  {viewingProject.status}
                </span>
                <h2 className="text-2xl font-bold text-gray-900">{viewingProject.title}</h2>
              </div>
              <button onClick={() => setViewingProject(null)} className="text-gray-400 hover:text-gray-600 text-xl">
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 text-xs text-gray-500 border-b border-stone-100 pb-3">
                <div>
                  <span className="font-semibold">Project ID:</span> {viewingProject._id}
                </div>
                <div>
                  <span className="font-semibold">Published:</span> {viewingProject.publishedDate ? new Date(viewingProject.publishedDate).toLocaleString() : "N/A"}
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-1.5">Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {viewingProject.tags && viewingProject.tags.length > 0 ? (
                    viewingProject.tags.map(t => (
                      <span key={t} className="px-2.5 py-1 bg-[#7b1e1e]/8 text-[#7b1e1e] rounded-md text-xs font-semibold border border-[#7b1e1e]/15">
                        #{t}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">No tags specified</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-2">Description / Body</h4>
                <div className="bg-[#f8f5f3] p-4 rounded-xl text-gray-700 whitespace-pre-wrap leading-relaxed text-sm border border-stone-200">
                  {viewingProject.body}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-stone-200 mt-6">
              <button
                onClick={() => setViewingProject(null)}
                className="px-6 py-2.5 bg-[#4a0e0e] text-white font-bold rounded-xl hover:bg-[#310909] transition text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4a0e0e]/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-7 text-center">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
              <FaTrash />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Project</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-bold text-gray-800">"{deletingProject.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeletingProject(null)}
                className="px-5 py-2.5 bg-stone-200 text-gray-700 font-semibold rounded-xl hover:bg-stone-300 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition text-sm disabled:opacity-50"
              >
                {actionLoading ? <FaSpinner className="animate-spin" /> : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}