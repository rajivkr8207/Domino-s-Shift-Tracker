// src/components/DeliveryTracker.tsx
import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaMotorcycle, FaMoneyBillWave, FaQrcode, FaCreditCard, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Delivery {
  id: string;
  orderNo: number;
  paymentMethod: "cash" | "online" | "both" | "qr";
  date: string;
  status: "pending" | "delivered" | "cancelled";
}

const DeliveryTracker = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>(() => {
    const saved = localStorage.getItem("deliveries");
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState<{
    orderNo: number;
    paymentMethod: "cash" | "online" | "both" | "qr";
  }>({
    orderNo: 0,
    paymentMethod: "cash",
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("deliveries", JSON.stringify(deliveries));
  }, [deliveries]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, orderNo: Number(e.target.value) });
  };

  const handlePaymentMethodChange = (method: "cash" | "online" | "both" | "qr") => {
    setFormData({ ...formData, paymentMethod: method });
  };

  const handleAddDelivery = () => {
    if (!formData.orderNo) {
      toast.error("Please enter an order number");
      return;
    }

    const newDelivery: Delivery = {
      id: Date.now().toString(),
      orderNo: formData.orderNo,
      paymentMethod: formData.paymentMethod,
      date: new Date().toISOString().split('T')[0],
      status: "delivered",
    };

    setDeliveries([...deliveries, newDelivery]);
    toast.success("Delivery added successfully!");
    setFormData({ orderNo: 0, paymentMethod: "cash" });
  };

  const handleDeleteDelivery = (id: string) => {
    setDeliveries(deliveries.filter(delivery => delivery.id !== id));
    toast.success("Delivery deleted successfully!");
  };

  const handleNavigate = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700 relative">
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            Delivery Tracker
          </h2>
          <p className="text-center text-gray-400 mt-1">
            Track your pizza deliveries
          </p>
          <button
            onClick={handleNavigate}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Order Number
            </label>
            <input
              type="number"
              value={formData.orderNo}
              onChange={handleInputChange}
              placeholder="Enter order number"
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <PaymentMethodButton
                icon={<FaMoneyBillWave />}
                label="Cash"
                active={formData.paymentMethod === "cash"}
                onClick={() => handlePaymentMethodChange("cash")}
              />
              <PaymentMethodButton
                icon={<FaCreditCard />}
                label="Online"
                active={formData.paymentMethod === "online"}
                onClick={() => handlePaymentMethodChange("online")}
              />
              <PaymentMethodButton
                icon={<><FaMoneyBillWave className="mr-1" /><FaCreditCard /></>}
                label="Both"
                active={formData.paymentMethod === "both"}
                onClick={() => handlePaymentMethodChange("both")}
              />
              <PaymentMethodButton
                icon={<FaQrcode />}
                label="QR Code"
                active={formData.paymentMethod === "qr"}
                onClick={() => handlePaymentMethodChange("qr")}
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddDelivery}
            className="w-full py-3 bg-gradient-to-r from-green-600 to-green-800 text-white font-bold rounded-lg shadow-lg hover:shadow-green-900/30 transition-all"
          >
            Add Delivery
          </motion.button>
        </div>

        {/* Deliveries List */}
        <div className="border-t border-gray-700 max-h-[60vh] overflow-y-auto">
          {deliveries.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No deliveries recorded yet
            </div>
          ) : (
            <ul className="divide-y divide-gray-700">
              {[...deliveries].reverse().map((delivery) => (
                <motion.li
                  key={delivery.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        <FaMotorcycle className="text-green-500" />
                        <span className="text-white">#{delivery.orderNo}</span>
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {new Date(delivery.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <PaymentBadge method={delivery.paymentMethod} />
                      <StatusBadge status={delivery.status} />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteDelivery(delivery.id)}
                        className="text-red-400 hover:text-red-500 transition-colors p-1"
                      >
                        <FaTrash className="text-lg" />
                      </motion.button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Helper Components
const PaymentMethodButton = ({ icon, label, active, onClick }: { 
  icon: React.ReactNode, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`p-3 rounded-lg border flex items-center justify-center gap-2 transition-colors ${
      active 
        ? 'bg-green-900/30 border-green-600 text-green-400' 
        : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
    }`}
  >
    {icon}
    {label}
  </motion.button>
);

const PaymentBadge = ({ method }: { method: "cash" | "online" | "both" | "qr" }) => {
  const config = {
    cash: { icon: <FaMoneyBillWave />, color: "bg-yellow-900/30 text-yellow-400" },
    online: { icon: <FaCreditCard />, color: "bg-blue-900/30 text-blue-400" },
    both: { icon: <><FaMoneyBillWave /><FaCreditCard /></>, color: "bg-purple-900/30 text-purple-400" },
    qr: { icon: <FaQrcode />, color: "bg-teal-900/30 text-teal-400" }
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${config[method].color}`}>
      {config[method].icon}
      {method}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  return (
    <span
      className={`text-xs px-2 py-1 rounded-full font-medium ${
        status === "pending"
          ? "bg-yellow-900/30 text-yellow-400"
          : status === "delivered"
          ? "bg-green-900/30 text-green-400"
          : "bg-red-900/30 text-red-400"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default DeliveryTracker;
