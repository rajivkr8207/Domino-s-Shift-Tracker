// src/components/AddShift.tsx
import { useState, useEffect } from "react";
import { useShift } from "../context/ShiftContext";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-toastify";

function calculateRealHours(startTime: string, endTime: string): number {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const start: number = startHour * 60 + startMinute;
  let end = endHour * 60 + endMinute;

  if (end < start) end += 24 * 60; // Handle overnight shift

  const diffMinutes = end - start;
  return parseFloat((diffMinutes / 60).toFixed(2)); // in hours
}

const shiftsdetail = [
  { label: "9:00 AM to 3:30 PM", startTime: "09:00", endTime: "15:30" },
  { label: "9:00 AM to 6:00 PM", startTime: "09:00", endTime: "18:00" },
  { label: "11:00 AM to 5:30 PM", startTime: "11:00", endTime: "17:30" },
  { label: "11:00 AM to 8:00 PM", startTime: "11:00", endTime: "20:00" },
  { label: "12:00 PM to 9:00 PM", startTime: "12:00", endTime: "21:00" },
  { label: "12:00 PM to 6:30 PM", startTime: "12:00", endTime: "18:30" },
  { label: "1:00 PM to 10:00 PM", startTime: "13:00", endTime: "22:00" },
  { label: "2:00 PM to 8:30 PM", startTime: "14:00", endTime: "20:30" },
  { label: "Weekly Off", startTime: "00:00", endTime: "00:00" },
];

const AddShift = ({ setToggleaddsift }: { setToggleaddsift: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { addShift, shifts } = useShift();
  const [formData, setFormData] = useState({
    id: uuidv4(),
    date: "",
    startTime: "",
    endTime: "",
  });
  const [selectedShiftLabel, setSelectedShiftLabel] = useState("");

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, date: e.target.value });
  };

  const handleSelectShift = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedShift = shiftsdetail.find(shift => shift.label === e.target.value);
    if (selectedShift) {
      setFormData({
        ...formData,
        startTime: selectedShift.startTime,
        endTime: selectedShift.endTime,
      });
      setSelectedShiftLabel(selectedShift.label);
    }
  };

  const handleAdd = () => {
    const { id, date, startTime, endTime } = formData;

    if (!date) {
      toast.error("Please select a date");
      return;
    }

    if (!selectedShiftLabel) {
      toast.error("Please select a shift time");
      return;
    }

    // Check if shift already exists for this date
    const shiftExists = shifts.some((shift) => shift.date === date);
    if (shiftExists) {
      toast.error(`A shift for ${date} already exists!`);
      return;
    }

    const realHours = calculateRealHours(startTime, endTime);
    
    addShift({ id, date, startTime, endTime, realHours });
    
    setToggleaddsift(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
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
            onClick={() => setToggleaddsift(false)}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200"
          >
            <IoClose className="text-2xl" />
          </button>

          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Add New Shift
            </h2>
            <p className="text-center text-gray-400 mt-1">
              Fill in your shift details
            </p>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6">
            {/* Date Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChangeDate}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Shift Time Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Shift Time
              </label>
              <div className="relative">
                <select
                  value={selectedShiftLabel}
                  onChange={handleSelectShift}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all"
                  required
                >
                  <option value="">Select a shift...</option>
                  {shiftsdetail.map((shift, index) => (
                    <option key={index} value={shift.label}>
                      {shift.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Selected Shift Preview */}
            {selectedShiftLabel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
              >
                <div className="flex justify-between">
                  <span className="text-gray-400">Selected Shift:</span>
                  <span className="font-medium text-white">
                    {selectedShiftLabel === "Weekly Off" ? (
                      <span className="text-blue-400">Weekly Off</span>
                    ) : (
                      selectedShiftLabel
                    )}
                  </span>
                </div>
                {selectedShiftLabel !== "Weekly Off" && (
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-400">Total Hours:</span>
                    <span className="font-medium text-green-400">
                      {calculateRealHours(formData.startTime, formData.endTime)} hours
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Footer with Submit Button */}
          <div className="p-6 border-t border-gray-800 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAdd}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-900/30 transition-all duration-300 w-full"
            >
              Add Shift
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddShift;
