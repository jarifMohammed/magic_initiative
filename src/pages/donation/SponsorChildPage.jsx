import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiGift, FiChevronLeft, FiChevronRight } from "react-icons/fi";

/* ---------- Config ---------- */
const CURRENCY = "$";
const MONTHLY = 27; // monthly sponsorship amount
const PER_PAGE = 12;

/* ---------- SAMPLE DATA ----------
   Replace with your real child records. Add an `image` URL to each
   (leave empty to show the placeholder). */
const children = [
  { id: 1, name: "Ayesha", gender: "Female", age: 13, waitingDays: 45, image: "" },
  { id: 2, name: "Rahim", gender: "Male", age: 13, waitingDays: 70, image: "" },
  { id: 3, name: "Fatima", gender: "Female", age: 12, waitingDays: 200, image: "" },
  { id: 4, name: "Karim", gender: "Male", age: 14, waitingDays: 30, image: "" },
  { id: 5, name: "Nadia", gender: "Female", age: 11, waitingDays: 400, image: "" },
  { id: 6, name: "Sohel", gender: "Male", age: 15, waitingDays: 90, image: "" },
  { id: 7, name: "Mim", gender: "Female", age: 9, waitingDays: 60, image: "" },
  { id: 8, name: "Rakib", gender: "Male", age: 13, waitingDays: 180, image: "" },
  { id: 9, name: "Sadia", gender: "Female", age: 14, waitingDays: 35, image: "" },
  { id: 10, name: "Jamal", gender: "Male", age: 12, waitingDays: 250, image: "" },
  { id: 11, name: "Ruma", gender: "Female", age: 10, waitingDays: 55, image: "" },
  { id: 12, name: "Tariq", gender: "Male", age: 16, waitingDays: 120, image: "" },
  { id: 13, name: "Nusrat", gender: "Female", age: 13, waitingDays: 500, image: "" },
  { id: 14, name: "Emon", gender: "Male", age: 8, waitingDays: 40, image: "" },
  { id: 15, name: "Lima", gender: "Female", age: 12, waitingDays: 75, image: "" },
  { id: 16, name: "Shakib", gender: "Male", age: 17, waitingDays: 190, image: "" },
  { id: 17, name: "Rina", gender: "Female", age: 11, waitingDays: 65, image: "" },
  { id: 18, name: "Hasan", gender: "Male", age: 14, waitingDays: 300, image: "" },
];

const ageGroups = [
  { key: "all", label: "All Age Group" },
  { key: "u10", label: "Under 10", test: (a) => a < 10 },
  { key: "10-13", label: "10 – 13 years", test: (a) => a >= 10 && a <= 13 },
  { key: "14+", label: "14+ years", test: (a) => a >= 14 },
];

const waitingOptions = [
  { key: "30", label: "30 days", test: (d) => d >= 30 && d < 60 },
  { key: "60", label: "60 days", test: (d) => d >= 60 && d < 180 },
  { key: "180", label: "180+ days", test: (d) => d >= 180 && d < 365 },
  { key: "365", label: "1 year+", test: (d) => d >= 365 },
];

function SponsorChildPage() {
  const [gender, setGender] = useState("all");
  const [ageGroup, setAgeGroup] = useState("all");
  const [waiting, setWaiting] = useState([]);
  const [page, setPage] = useState(1);
  
  // Modal state
  const [selectedChild, setSelectedChild] = useState(null);
  const [emailInput, setEmailInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetPage = () => setPage(1);

  const toggleGender = (g) => {
    setGender((prev) => (prev === g ? "all" : g));
    resetPage();
  };
  const toggleWaiting = (key) => {
    setWaiting((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
    resetPage();
  };

  const filtered = children.filter((c) => {
    if (gender !== "all" && c.gender !== gender) return false;
    const ag = ageGroups.find((g) => g.key === ageGroup);
    if (ag && ag.test && !ag.test(c.age)) return false;
    if (waiting.length) {
      const passes = waiting.some((key) =>
        waitingOptions.find((w) => w.key === key).test(c.waitingDays)
      );
      if (!passes) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const pageItems = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const handleSponsorClick = (child) => {
    setSelectedChild(child);
    setEmailInput("");
  };

  const confirmSponsorship = async (e) => {
    e.preventDefault();
    if (!emailInput || !selectedChild) return;
    
    setIsSubmitting(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5006";
      const res = await fetch(`${API_URL}/api/v1/sponsorship/setup-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sponsorEmail: emailInput,
          childId: selectedChild.id,
          childName: selectedChild.name,
          amount: MONTHLY,
          interval: 'month',
          successUrl: window.location.origin + "/sponsorship/success?session_id={CHECKOUT_SESSION_ID}",
          returnUrl: window.location.origin + "/sponsorship/cancel"
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to initialize sponsorship checkout.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error creating sponsorship session:", error);
      alert("Error connecting to the server.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f8f5f3] text-[#4a0e0e] min-h-screen">
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-[#4a0e0e]">
        {/* Replace /sponsor-hero.jpg with your own image (in /public) */}
        <div className="absolute inset-0">
          <img
            src="/studentRaisingHand.jpg"
            alt="Sponsor a child"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#4a0e0e] via-[#4a0e0e]/70 to-[#7b1e1e]/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="max-w-2xl ml-auto text-right"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
              Sponsor a Child with MAGIC Initiative
            </h1>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed">
              Sponsoring a child is a personal way to help them rise above
              hardship through education. For a monthly contribution of{" "}
              {CURRENCY}
              {MONTHLY}, you provide access to quality education, healthcare,
              and nutritional support, empowering children and families to build
              a brighter future.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ---------- Body ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-[#7b1e1e]/10 shadow-sm p-6 lg:sticky lg:top-6 space-y-7">
              {/* Gender */}
              <div>
                <h3 className="font-bold mb-3">Gender</h3>
                <div className="flex gap-2">
                  {["Male", "Female"].map((g) => (
                    <button
                      key={g}
                      onClick={() => toggleGender(g)}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                        gender === g
                          ? "bg-[#7b1e1e] text-white border-[#7b1e1e]"
                          : "bg-white text-[#4a0e0e] border-[#7b1e1e]/20 hover:border-[#7b1e1e]"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Group */}
              <div>
                <h3 className="font-bold mb-3">Age Group</h3>
                <select
                  value={ageGroup}
                  onChange={(e) => {
                    setAgeGroup(e.target.value);
                    resetPage();
                  }}
                  className="w-full px-3 py-2.5 rounded-lg bg-white border border-[#7b1e1e]/20 text-sm text-[#4a0e0e] focus:outline-none focus:border-[#7b1e1e] focus:ring-2 focus:ring-[#7b1e1e]/20"
                >
                  {ageGroups.map((g) => (
                    <option key={g.key} value={g.key}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Waiting Days */}
              <div>
                <h3 className="font-bold mb-3">Waiting Days</h3>
                <div className="space-y-2.5">
                  {waitingOptions.map((w) => (
                    <label
                      key={w.key}
                      className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={waiting.includes(w.key)}
                        onChange={() => toggleWaiting(w.key)}
                        className="w-4 h-4 rounded border-gray-300 accent-[#7b1e1e]"
                      />
                      {w.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-[#7b1e1e]/10 shadow-sm px-5 py-3 mb-6 text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-[#4a0e0e]">
                {filtered.length}
              </span>{" "}
              {filtered.length === 1 ? "child" : "children"}
            </div>

            {pageItems.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                No children match your filters.
              </div>
            ) : (
              <motion.div
                key={current + gender + ageGroup + waiting.join()}
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
              >
                {pageItems.map((c) => (
                  <motion.div
                    key={c.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ y: -6 }}
                    className="bg-white rounded-2xl overflow-hidden border border-[#7b1e1e]/10 shadow-sm hover:shadow-xl transition-shadow flex flex-col"
                  >
                    {/* Photo / placeholder */}
                    <div className="h-48 bg-stone-100 flex items-center justify-center overflow-hidden">
                      {c.image ? (
                        <img
                          src={c.image}
                          alt={c.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiUser className="text-5xl text-[#7b1e1e]/25" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-lg mb-1">{c.name}</h3>
                      <p className="text-sm text-gray-600">Gender: {c.gender}</p>
                      <p className="text-sm text-gray-600 mb-2">Age: {c.age}</p>
                      <p className="text-sm mb-4">
                        <span className="font-bold text-[#7b1e1e]">
                          {CURRENCY}
                          {MONTHLY.toFixed(2)}
                        </span>{" "}
                        <span className="text-gray-500">per month</span>
                      </p>

                      <motion.button
                        onClick={() => handleSponsorClick(c)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#7b1e1e] hover:bg-[#611515] text-white text-sm font-semibold transition-colors"
                      >
                        <FiGift /> Add Sponsorship
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={current === 1}
                  className="w-9 h-9 rounded-full flex items-center justify-center border border-[#7b1e1e]/20 text-[#7b1e1e] disabled:opacity-40 hover:bg-[#7b1e1e]/5 transition-colors"
                >
                  <FiChevronLeft />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-9 h-9 rounded-full text-sm font-semibold transition-colors ${
                      current === n
                        ? "bg-[#7b1e1e] text-white"
                        : "text-[#7b1e1e] hover:bg-[#7b1e1e]/5"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={current === totalPages}
                  className="w-9 h-9 rounded-full flex items-center justify-center border border-[#7b1e1e]/20 text-[#7b1e1e] disabled:opacity-40 hover:bg-[#7b1e1e]/5 transition-colors"
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------- Modal ---------- */}
      <AnimatePresence>
        {selectedChild && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setSelectedChild(null)}
              className="absolute inset-0 bg-[#4a0e0e]/40 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-[#4a0e0e] p-6 text-center text-white">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiGift className="text-3xl text-white" />
                </div>
                <h2 className="text-2xl font-bold">Sponsor {selectedChild.name}</h2>
                <p className="text-white/80 text-sm mt-2">
                  You are making a life-changing commitment.
                </p>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center bg-[#fdf5f5] border border-[#7b1e1e]/20 p-4 rounded-lg mb-6">
                  <span className="text-gray-600 font-semibold text-sm">Monthly Gift</span>
                  <span className="text-[#7b1e1e] font-bold text-xl">{CURRENCY}{MONTHLY.toFixed(2)}</span>
                </div>

                <form onSubmit={confirmSponsorship}>
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Email Address
                    </label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="Enter your email"
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#7b1e1e] focus:ring-2 focus:ring-[#7b1e1e]/20 transition-all disabled:opacity-50"
                    />
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      type="button"
                      onClick={() => setSelectedChild(null)}
                      disabled={isSubmitting}
                      className="flex-1 py-3 px-4 rounded-lg font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 px-4 rounded-lg font-bold text-white bg-[#7b1e1e] hover:bg-[#611515] transition-colors shadow-lg shadow-[#7b1e1e]/30 disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        "Proceed to Checkout"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SponsorChildPage;