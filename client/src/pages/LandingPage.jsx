import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import Navbar from "../components/Navbar";

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

// Validation helpers
const isValidName = (name) => /^[a-zA-Z\s]{2,50}$/.test(name?.trim());
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.trim());
const isValidPhone = (phone) => phone?.replace(/\D/g, "").length >= 10 && /^[\d\s\-+()]{10,20}$/.test(phone?.trim() || "");
const isValidRemarks = (remarks) => remarks?.trim().length >= 10;

const buildCallingCode = (idd) => {
  if (!idd?.root) return "";
  const suffix = idd.suffixes?.[0];


  if (!suffix || suffix.length > 2) return idd.root.replace(/\s/g, "");
  return `${idd.root.replace(/\s/g, "")}${suffix}`;
};

const LandingPage = () => {
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [countries, setCountries] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const countryInputRef = useRef(null);
  const countryListRef = useRef(null);

  const filteredCountries = countrySearch.trim()
    ? countries.filter(
      (c) =>
        c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
        c.code.toLowerCase().includes(countrySearch.toLowerCase()) ||
        c.code.replace(/\D/g, "").includes(countrySearch.replace(/\D/g, ""))
    )
    : countries;

  const [formData, setFormData] = useState({
    name: "",
    mail: "",
    phoneNumber: "",
    remarks: "",
    countryCode: "",
    countryName: "",
  });

  useEffect(() => {
    if (showContactForm && countries.length === 0) {
      // setCountriesLoading(true);
      fetch("https://restcountries.com/v3.1/all?fields=name,idd")
        .then((res) => res.json())
        .then((data) => {
          const list = data
            .filter((c) => c.idd?.root)
            .map((c) => ({
              name: c.name.common,
              code: buildCallingCode(c.idd),
            }))
            .filter((c) => c.code)
            .sort((a, b) => a.name.localeCompare(b.name));
          setCountries(list);
        })
        .catch(() => setCountries([{ name: "India", code: "+91" }, { name: "United States", code: "+1" }, { name: "United Kingdom", code: "+44" }]))
        .finally(() => setCountriesLoading(false));
    }
  }, [showContactForm, countries.length]);

  const isFormValid =
    isValidName(formData.name) &&
    isValidEmail(formData.mail) &&
    formData.countryCode &&
    isValidPhone(formData.phoneNumber) &&
    isValidRemarks(formData.remarks);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactMessage, setContactMessage] = useState("");

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setContactSubmitting(true);
    setContactMessage("");
    const fullPhone = `${formData.countryCode} ${formData.phoneNumber}`.trim();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            mail: formData.mail,
            phoneNumber: fullPhone,
            remarks: formData.remarks,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setContactMessage("Thank you! We will get back to you soon.");
        setFormData({ name: "", mail: "", phoneNumber: "", remarks: "", countryCode: "", countryName: "" });
        setCountrySearch("");
        setTimeout(() => {
          setShowContactForm(false);
          setContactMessage("");
        }, 1500);
      } else {
        setContactMessage(data.message || "Failed to send. Please try again.");
      }
    } catch {
      setContactMessage("Failed to send. Please try again.");
    } finally {
      setContactSubmitting(false);
    }
  };

  const resetContactForm = () => {
    setShowContactForm(false);
    setFormData({ name: "", mail: "", phoneNumber: "", remarks: "", countryCode: "", countryName: "" });
    setCountrySearch("");
    setShowCountrySuggestions(false);
  };

  const selectCountry = (c) => {
    setFormData((prev) => ({ ...prev, countryCode: c.code, countryName: c.name }));
    setCountrySearch(`${c.code} ${c.name}`);
    setShowCountrySuggestions(false);
  };

  const handleCountrySearchChange = (e) => {
    const value = e.target.value;
    setCountrySearch(value);
    setShowCountrySuggestions(true);
    if (!value) {
      setFormData((prev) => ({ ...prev, countryCode: "", countryName: "" }));
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        countryInputRef.current &&
        !countryInputRef.current.contains(e.target) &&
        countryListRef.current &&
        !countryListRef.current.contains(e.target)
      ) {
        setShowCountrySuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>


      <main className="font-sans text-gray-800 dark:text-slate-100">

        {/* ================= HERO ================= */}
        <section
          className="min-h-screen flex flex-col justify-center items-center text-center text-white px-6 bg-cover bg-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 35%, #2563eb 70%, #7c3aed 100%)",
            boxShadow: "inset 0 0 100px rgba(0,0,0,0.2)",
          }}
        >

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Learn to Code. <br /> Build Your Future.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="max-w-2xl text-lg md:text-xl mb-8"
          >
            Interactive coding lessons, real-world projects, and certifications —
            all designed to help you become a professional developer.
          </motion.p>


          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-8 py-3 rounded-xl font-semibold text-white shadow-lg"
              style={{ background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)" }}
            >
              Start Learning
            </motion.button>
          </Link>


        </section>

        {/* ================= FEATURES ================= */}
        <section
          className="py-24 px-6 text-center bg-slate-50 dark:bg-slate-900"
          style={undefined}
        >
          <h2 className="text-3xl font-bold mb-12 text-slate-800 dark:text-slate-100">
            Why Choose StudyRox?
          </h2>

          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {[
              {
                title: "Interactive Lessons",
                desc: "Practice coding directly in your browser with guided challenges."
              },
              {
                title: "Real Projects",
                desc: "Build portfolio-ready applications with real-world use cases."
              },
              {
                title: "Certification",
                desc: "Earn industry-recognized certificates after completing tracks."
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)" }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="p-8 shadow-xl rounded-2xl border border-slate-200/60 dark:border-slate-700 backdrop-blur-sm bg-white dark:bg-slate-800"
              >
                <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>



      </main>

      {/* ================= FOOTER ================= */}
      <footer
        className="text-gray-300 pt-16 pb-8 px-6"
        style={{ background: "linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">

          {/* Brand Info */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">LearnWave</h2>
            <p className="text-sm leading-6">
              Empowering students worldwide with high-quality tech education.
              Learn, build, and grow with us.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white cursor-pointer block">Home</Link></li>
              <li><Link to="/courses" className="hover:text-white cursor-pointer block">Courses</Link></li>
              <li
                className="hover:text-white cursor-pointer transition"
                onClick={() => setShowAboutUs(true)}
              >
                About Us
              </li>
              <li
                className="hover:text-white cursor-pointer transition"
                onClick={() => setShowContactForm(true)}
              >
                Contact Us
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Connect With Us
            </h3>

            <p className="text-sm mb-4">
              📧 support@studyrox.com
            </p>

            <div className="flex space-x-4 text-xl">
              <FaFacebook className="hover:text-white cursor-pointer transition" />
              <FaInstagram className="hover:text-white cursor-pointer transition" />
              <FaTwitter className="hover:text-white cursor-pointer transition" />
              <FaLinkedin className="hover:text-white cursor-pointer transition" />
              <FaGithub className="hover:text-white cursor-pointer transition" />
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm">
          © {new Date().getFullYear()} LearnWave. All Rights Reserved.
        </div>
      </footer>

      {/* Contact Us Form Popup */}
      <AnimatePresence>
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={resetContactForm}
          >
            <motion.form
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleContactSubmit}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Contact Us</h2>
                  <button
                    type="button"
                    onClick={resetContactForm}
                    className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 text-2xl leading-none transition"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Enter your name"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                    />
                    {formData.name && !isValidName(formData.name) && (
                      <p className="text-xs text-red-500 mt-1">2–50 letters and spaces only</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="mail" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="mail"
                      name="mail"
                      value={formData.mail}
                      onChange={handleFormChange}
                      placeholder=""
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                    />
                    {formData.mail && !isValidEmail(formData.mail) && (
                      <p className="text-xs text-red-500 mt-1">Enter a valid email address</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative w-[180px] shrink-0" ref={countryInputRef}>
                        <input
                          type="text"
                          value={countrySearch}
                          onChange={handleCountrySearchChange}
                          onFocus={() => setShowCountrySuggestions(true)}
                          placeholder="+91"
                          className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          autoComplete="off"
                        />
                        {showCountrySuggestions && (
                          <ul
                            ref={countryListRef}
                            className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-lg py-1"
                          >
                            {countriesLoading ? (
                              <li className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">Loading...</li>
                            ) : filteredCountries.length === 0 ? (
                              <li className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">No matches</li>
                            ) : (
                              filteredCountries.slice(0, 50).map((c) => (
                                <li
                                  key={`${c.name}-${c.code}`}
                                  onClick={() => selectCountry(c)}
                                  className="px-3 py-2 text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 flex justify-between text-slate-800 dark:text-slate-200"
                                >
                                  <span>{c.name}</span>
                                  <span className="text-slate-500 dark:text-slate-400 font-medium">{c.code}</span>
                                </li>
                              ))
                            )}
                          </ul>
                        )}
                      </div>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleFormChange}
                        placeholder="XXXXXXXXXX"
                        className="flex-1 min-w-0 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                      />
                    </div>
                    {!formData.countryCode && (formData.phoneNumber || formData.remarks || countrySearch) && (
                      <p className="text-xs text-red-500 mt-1">Search and select your country</p>
                    )}
                    {formData.countryCode && formData.phoneNumber && !isValidPhone(formData.phoneNumber) && (
                      <p className="text-xs text-red-500 mt-1">At least 10 digits required</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="remarks" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Remarks <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="remarks"
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleFormChange}
                      placeholder="Your message"
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                      required
                    />
                    {formData.remarks && !isValidRemarks(formData.remarks) && (
                      <p className="text-xs text-red-500 mt-1">At least 10 characters required</p>
                    )}
                  </div>

                  {contactMessage && (
                    <p className={`text-sm ${contactMessage.includes("Thank") ? "text-green-600" : "text-red-500"}`}>
                      {contactMessage}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={!isFormValid || contactSubmitting}
                    className="w-full py-3 rounded-xl font-semibold text-white shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-[1.02]"
                    style={{ background: isFormValid && !contactSubmitting ? "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)" : "#94a3b8" }}
                  >
                    {contactSubmitting ? "Sending..." : "Submit"}
                  </button>
                </div>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* About Us Popup */}
      <AnimatePresence>
        {showAboutUs && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAboutUs(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">About Us – EduRox</h2>
                  <button
                    onClick={() => setShowAboutUs(false)}
                    className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 text-2xl leading-none transition"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                <p className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">
                  Empowering the Next Generation of Learners 🚀
                </p>

                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  EduRox is a modern Learning Management System designed to make education accessible, engaging, and future-ready. Built with powerful MERN stack technology, our platform connects students, educators, and administrators in one seamless digital ecosystem.
                </p>

                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  We believe learning should not be limited by geography, time, or traditional boundaries. EduRox enables students to access structured courses, interactive content, and real-time progress tracking — all from a single intuitive dashboard.
                </p>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">🎯 Our Mission</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      To simplify digital education and empower learners with tools that enhance knowledge, skill development, and career growth.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">🌍 Our Vision</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      To build a technology-driven learning environment where education is flexible, inclusive, and impactful.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
};

export default LandingPage;
