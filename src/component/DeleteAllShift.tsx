
import React, { useEffect, useState } from "react";
import { useShift } from "../context/ShiftContext";

interface DeleteShiftProps {
  setDeleteAllShift : React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteAllShift: React.FC<DeleteShiftProps> = ({setDeleteAllShift }) => {
    const {handledeleteallshift  } = useShift();
  
    const [seconds, setSeconds] = useState(5);
  const [canConfirm, setCanConfirm] = useState(false);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanConfirm(true);
    }
  }, [seconds]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-pulse">
        <h2 className="text-2xl font-bold text-white mb-4">Delete All Shift?</h2>
        <p className="text-gray-300 mb-6">
          {canConfirm
            ? "You can now confirm deletion."
            : `Please wait ${seconds} second${seconds !== 1 ? "s" : ""}...`}
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={()=>setDeleteAllShift(false)}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold transition"
          >
            Cancel
          </button>

          <button
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            onClick={()=>{handledeleteallshift(), setDeleteAllShift(false)}}
            disabled={!canConfirm}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              canConfirm
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-red-900 text-gray-400 cursor-not-allowed"
            }`}
          >
            {canConfirm ? "OK, Delete" : "Wait..."}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAllShift;
