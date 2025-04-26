// src/context/ShiftContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "react-toastify"; // Make sure to install this package
import "react-toastify/dist/ReactToastify.css";

export interface Shift {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  realHours: number;
}

interface ShiftContextType {
  shifts: Shift[];
  addShift: (shift: Shift) => void;
  deleteShift: (id: string) => void;
  setShifts: React.Dispatch<React.SetStateAction<Shift[]>>;
  handledeleteallshift: () => void;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export const ShiftProvider = ({ children }: { children: ReactNode }) => {
  const [shifts, setShifts] = useState<Shift[]>(() => {
    // Load from LocalStorage initially (only once)
    const saved = localStorage.getItem("shifts");
    if (saved) {
      try {
        return JSON.parse(saved) as Shift[];
      } catch (error) {
        console.error("Failed to parse shifts from localStorage:", error);
      }
    }
    return [];
  });

  // Every time shifts change, save to localStorage
  useEffect(() => {
    localStorage.setItem("shifts", JSON.stringify(shifts));
  }, [shifts]);

  const addShift = (shift: Shift) => {
    // Check if a shift with the same date already exists
    const shiftExists = shifts.some((existingShift) => existingShift.date === shift.date);
    
    if (shiftExists) {
      toast.error(`A shift for ${shift.date} already exists!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    
    setShifts((prev) => [...prev, shift]);
    toast.success("Shift added successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const deleteShift = (id: string) => {
    setShifts((prev) => prev.filter((shift) => shift.id !== id));
    toast.success("Shift deleted successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handledeleteallshift = () => {
    localStorage.removeItem("shifts");
    setShifts([]);
    toast.success("All shifts cleared successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <ShiftContext.Provider value={{ shifts, handledeleteallshift, addShift, deleteShift, setShifts }}>
      {children}
    </ShiftContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useShift = () => {
  const context = useContext(ShiftContext);
  if (!context) {
    throw new Error("useShift must be used within a ShiftProvider");
  }
  return context;
};
