// src/App.tsx
import { useState, useEffect } from "react";
import AddShift from "../component/Addshift";
import DeleteShift from "../component/DeleteShift";
import { useShift } from "../context/ShiftContext";
import {
  FaTrash,
  FaPlus,
  FaCalculator,
  FaHistory,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import DeleteAllShift from "../component/DeleteAllShift";
import CalculateShift from "../component/CalculateShift";
import "react-toastify/dist/ReactToastify.css";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";

const ShiftTracker = () => {
  const { shifts, deleteShift } = useShift();
  const [toggleaddsift, setToggleaddsift] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<string | null>(null);
  const [deleteAllShift, setDeleteAllShift] = useState(false);
  const [closeclaculate, setCloseclaculate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      deleteShift(deleteIndex.toString());
      setDeleteIndex(null);
    }
  };

  const cancelDelete = () => {
    setDeleteIndex(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
        ></motion.div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {toggleaddsift && <AddShift setToggleaddsift={setToggleaddsift} />}
        {deleteAllShift && (
          <DeleteAllShift setDeleteAllShift={setDeleteAllShift} />
        )}
        {closeclaculate && (
          <CalculateShift setCloseclaculate={setCloseclaculate} />
        )}
        {deleteIndex !== null && (
          <DeleteShift onConfirm={confirmDelete} onCancel={cancelDelete} />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-gray-950 text-white p-4">
        <div className="max-w-6xl mx-auto">
          {/* Mobile Header */}
          {isMobile && (
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Shift Tracker
              </h1>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-400"
              >
                {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          )}

          {/* Mobile Menu */}
          {isMobile && mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-800 rounded-lg p-4 mb-6 shadow-lg"
            >
              <Link
                to="/delivery"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-3 rounded-lg font-bold uppercase tracking-wide mb-3"
              >
                Delivery{" "}
              </Link>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setToggleaddsift(!toggleaddsift);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg font-bold uppercase tracking-wide mb-3"
              >
                <FaPlus />
                {toggleaddsift ? "Close" : "Add Shift"}
              </motion.button>

              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setDeleteAllShift(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg font-bold uppercase tracking-wide text-sm"
                >
                  <FaTrash size={14} />
                  Clear All
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setCloseclaculate(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg font-bold uppercase tracking-wide text-sm"
                >
                  <FaCalculator size={14} />
                  Calculate
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Desktop Header */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-between items-center mb-8"
            >
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-wide bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Domino's Shift Tracker
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Track your shifts with precision
                </p>
              </div>
              <Link
                to="/delivery"
                className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-600 text-white px-5 py-3 rounded-xl font-bold uppercase tracking-wide shadow-lg transition-all duration-300"
              >
                Delivery{" "}
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setToggleaddsift(!toggleaddsift)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wide shadow-lg transition-all duration-300"
              >
                <FaPlus />
                {toggleaddsift ? "Close" : "Add Shift"}
              </motion.button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-gray-900/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-800"
          >
            {!isMobile && (
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <FaHistory className="text-blue-500 text-2xl" />
                  <h2 className="text-2xl font-semibold">
                    Shift Records
                    <span className="text-sm text-gray-400 ml-2">
                      {` (${shifts.length} shift${
                        shifts.length !== 1 ? "s" : ""
                      })`}
                    </span>
                  </h2>
                </div>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setDeleteAllShift(true)}
                    className="relative overflow-hidden bg-gradient-to-r from-red-600/90 to-red-800/90 text-white text-sm px-5 py-3 rounded-xl font-bold uppercase tracking-wide shadow-lg hover:shadow-red-900/30 transition-all duration-300 group flex items-center gap-2"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <FaTrash size={14} />
                      Clear All
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setCloseclaculate(true)}
                    className="relative overflow-hidden bg-gradient-to-r from-blue-600/90 to-blue-800/90 text-white text-sm px-5 py-3 rounded-xl font-bold uppercase tracking-wide shadow-lg hover:shadow-blue-900/30 transition-all duration-300 group flex items-center gap-2"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <FaCalculator size={14} />
                      Calculate
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></span>
                  </motion.button>
                </div>
              </div>
            )}

            {shifts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 sm:py-12"
              >
                <div className="max-w-md mx-auto">
                  <div className="text-gray-500 mb-4 text-6xl">📅</div>
                  <h3 className="text-xl font-medium text-gray-300 mb-2">
                    No shifts recorded yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Add your first shift to get started tracking your work hours
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setToggleaddsift(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300"
                  >
                    Add Your First Shift
                  </motion.button>
                </div>
              </motion.div>
            ) : isMobile ? (
              // Mobile Shift List
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FaHistory className="text-blue-500" />
                    Shifts ({shifts.length})
                  </h3>
                </div>
                <AnimatePresence>
                  {[...shifts].reverse().map((shift) => (
                    <motion.div
                      key={shift.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-lg">{shift.date}</div>
                          <div className="text-sm text-gray-400 mt-1">
                            {shift.startTime == "00:00" ? (
                              <span className="bg-gray-700 text-blue-400 px-2 py-1 rounded-full text-xs">
                                Weekly Off
                              </span>
                            ) : (
                              `${shift.startTime} - ${shift.endTime}`
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => setDeleteIndex(String(shift.id))}
                          className="text-red-400 p-1"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                      <div className="flex justify-between mt-3">
                        <div>
                          <div className="text-xs text-gray-500">
                            Attendance
                          </div>
                          <div>
                            {shift.realHours == 9
                              ? 8
                              : Math.floor(shift.realHours)}{" "}
                            Hr
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">
                            Real Hours
                          </div>
                          <div
                            className={`px-2 py-1 rounded-full text-xs ${
                              shift.realHours >= 8
                                ? "bg-green-900/30 text-green-400"
                                : "bg-amber-900/30 text-amber-400"
                            }`}
                          >
                            {shift.realHours} Hr
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              // Desktop Table View
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="overflow-hidden rounded-xl border border-gray-800"
              >
                <table className="w-full text-left">
                  <thead className="bg-gray-800/50">
                    <tr className="text-gray-400 text-sm uppercase">
                      <th className="p-4 font-medium">Date</th>
                      <th className="p-4 font-medium">Shift Time</th>
                      <th className="p-4 font-medium">Attendance Hr</th>
                      <th className="p-4 font-medium">Real Worked Hr</th>
                      <th className="p-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {[...shifts].reverse().map((shift) => (
                        <motion.tr
                          key={shift.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-800 hover:bg-gray-800/30 transition-colors duration-200"
                        >
                          <td className="p-4 font-medium">{shift.date}</td>
                          <td className="p-4">
                            {shift.startTime == "00:00" ? (
                              <span className="bg-gray-800 text-blue-400 px-3 py-1 rounded-full text-xs">
                                Weekly Off
                              </span>
                            ) : (
                              `${shift.startTime} - ${shift.endTime}`
                            )}
                          </td>
                          <td className="p-4">
                            {shift.realHours == 9
                              ? 8
                              : Math.floor(shift.realHours)}{" "}
                            Hr
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                shift.realHours >= 8
                                  ? "bg-green-900/30 text-green-400"
                                  : "bg-amber-900/30 text-amber-400"
                              }`}
                            >
                              {shift.realHours} Hr
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setDeleteIndex(String(shift.id))}
                              className="text-red-400 hover:text-red-600 transition-colors duration-200 p-2"
                            >
                              <FaTrash size={16} />
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ShiftTracker;
