import React from "react";
import { useShift } from "../context/ShiftContext";
import { RxCross2 } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";
import { FaCoins, FaClock, FaCalendarAlt } from "react-icons/fa";

interface CalculateShiftProps {
  setCloseclaculate: (value: boolean) => void;
}

const CalculateShift: React.FC<CalculateShiftProps> = ({ setCloseclaculate }) => {
  const { shifts } = useShift();

  const totalRealHours = shifts.reduce(
    (sum, shift) => sum + (shift.realHours === 9 ? 8 : Math.floor(shift.realHours)),
    0
  );
  
  const totalIncome = totalRealHours * 50;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 h-auto z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={() => setCloseclaculate(false)}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200"
          >
            <RxCross2 className="text-xl" />
          </button>

          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Earnings Summary
            </h2>
            <p className="text-center text-gray-400 mt-1">
              Your shift calculations at a glance
            </p>
          </div>

          {/* Stats */}
          <div className="p-6 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-900/20 rounded-lg text-amber-400">
                  <FaCalendarAlt size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-300">Total Shifts</h3>
                  <p className="text-sm text-gray-500">All recorded shifts</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-center py-2 text-white">
                {shifts.length}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-900/20 rounded-lg text-blue-400">
                  <FaClock size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-300">Total Hours</h3>
                  <p className="text-sm text-gray-500">Attendance hours worked</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-center text-white py-2">
                {totalRealHours.toFixed(0)} <span className="text-sm font-normal text-gray-400">hours</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 rounded-xl p-4 border border-emerald-900/50"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-emerald-900/20 rounded-lg text-emerald-400">
                  <FaCoins size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-300">Estimated Earnings</h3>
                  <p className="text-sm text-gray-500">At ₹50/hour rate</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-center py-2 text-emerald-400">
                ₹{totalIncome.toFixed(2)}
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800 bg-gray-900/50">
            <p className="text-center text-sm text-gray-400">
              {new Date().toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CalculateShift;
