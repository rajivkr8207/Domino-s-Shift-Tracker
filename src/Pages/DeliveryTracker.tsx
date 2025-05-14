// src/components/DeliveryTracker.tsx
import { useState, useEffect } from "react";
import { IoClose, IoChevronDown, IoChevronUp } from "react-icons/io5";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  FaMotorcycle,
  FaMoneyBillWave,
  FaQrcode,
  FaCreditCard,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Delivery {
  id: string;
  orderNo: number;
  price: number;
  paymentMethod: "cash" | "online" | "both" | "qr" | "none";
  date: string;
  status: "pending" | "delivered" | "cancelled";
  isPaid: boolean;
}

const DeliveryTracker = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>(() => {
    const saved = localStorage.getItem("deliveries");
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState<{
    orderNo: number;
    price: number;
    paymentMethod: "cash" | "online" | "both" | "qr" | "none";
    isPaid: boolean;
  }>({
    orderNo: 0,
    price: 0,
    paymentMethod: "cash",
    isPaid: false,
  });

  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("deliveries", JSON.stringify(deliveries));
  }, [deliveries]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, orderNo: Number(e.target.value) });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, price: Number(e.target.value) });
  };

  const handlePaymentMethodChange = (
    method: "cash" | "online" | "both" | "qr"
  ) => {
    setFormData({ ...formData, paymentMethod: method });
  };

  const handlePaymentStatusChange = (isPaid: boolean) => {
    setFormData({
      ...formData,
      isPaid,
      paymentMethod: isPaid ? "none" : "cash", // Default to cash if unpaid
      price: isPaid ? 0 : formData.price // Reset price if paid
    });
  };

  const handleAddDelivery = () => {
    if (!formData.orderNo) {
      toast.error("Please enter an order number");
      return;
    }
    if (!formData.isPaid && (!formData.price || formData.price <= 0)) {
      toast.error("Please enter a valid price");
      return;
    }
    if (!formData.isPaid && formData.paymentMethod === "none") {
      toast.error("Please select a payment method");
      return;
    }

    const newDelivery: Delivery = {
      id: Date.now().toString(),
      orderNo: formData.orderNo,
      price: formData.isPaid ? 0 : formData.price,
      paymentMethod: formData.isPaid ? "none" : formData.paymentMethod,
      date: new Date().toISOString().split("T")[0],
      status: "delivered",
      isPaid: formData.isPaid,
    };

    setDeliveries([...deliveries, newDelivery]);
    toast.success("Delivery added successfully!");
    setFormData({ 
      orderNo: 0, 
      price: 0, 
      paymentMethod: "none",
      isPaid: false 
    });
  };

  const handleDeleteDelivery = (id: string) => {
    setDeliveries(deliveries.filter((delivery) => delivery.id !== id));
    toast.success("Delivery deleted successfully!");
  };

  const handleNavigate = () => {
    navigate("/");
  };

  // Calculate prices
  const totalPrice = deliveries.reduce(
    (sum, delivery) => sum + (delivery.isPaid ? 0 : delivery.price),
    0
  );
  const cashPrice = deliveries.reduce(
    (sum, delivery) =>
      !delivery.isPaid && delivery.paymentMethod === "cash" ? sum + delivery.price : sum,
    0
  );
  const onlinePrice = deliveries.reduce(
    (sum, delivery) =>
      !delivery.isPaid && delivery.paymentMethod === "online" ? sum + delivery.price : sum,
    0
  );
  const paidOrders = deliveries.filter(delivery => delivery.isPaid).length;
  const unpaidOrders = deliveries.filter(delivery => !delivery.isPaid).length;

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
              value={formData.orderNo || ""}
              onChange={handleInputChange}
              placeholder="Enter order number"
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            />
          </div>

          {/* Payment Status Toggle */}
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-300">
              Payment Status
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => handlePaymentStatusChange(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  formData.isPaid
                    ? "bg-green-900/30 text-green-400"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                <FaCheckCircle />
                Paid
              </button>
              <button
                onClick={() => handlePaymentStatusChange(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  !formData.isPaid
                    ? "bg-red-900/30 text-red-400"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                <FaTimesCircle />
                Unpaid
              </button>
            </div>
          </div>

          {/* Conditional fields for unpaid orders */}
          {!formData.isPaid && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.price || ""}
                  onChange={handlePriceChange}
                  placeholder="Enter price"
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
                    icon={
                      <>
                        <FaMoneyBillWave className="mr-1" />
                        <FaCreditCard />
                      </>
                    }
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
            </>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddDelivery}
            className="w-full py-3 bg-gradient-to-r from-green-600 to-green-800 text-white font-bold rounded-lg shadow-lg hover:shadow-green-900/30 transition-all"
          >
            Add Delivery
          </motion.button>
        </div>

        {/* Summary Section */}
        {deliveries.length > 0 && (
          <div className="border-t border-gray-700">
            <div className="p-4 bg-gray-900/50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-green-400">
                  {paidOrders} Paid • {unpaidOrders} Unpaid
                </span>
              </div>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
              >
                {showDetails ? (
                  <>
                    <span className="text-sm">Hide details</span>
                    <IoChevronUp />
                  </>
                ) : (
                  <>
                    <span className="text-sm">Show details</span>
                    <IoChevronDown />
                  </>
                )}
              </button>
            </div>

            {/* Detailed Breakdown */}
            {showDetails && (
              <div className="bg-gray-900/30 p-4 space-y-3 border-t border-gray-800">
                <PriceDetail
                  label="Total Unpaid Amount"
                  value={totalPrice}
                  icon={<FaMoneyBillWave className="text-yellow-400" />}
                />
                <PriceDetail
                  label="Cash Payments"
                  value={cashPrice}
                  icon={<FaMoneyBillWave className="text-yellow-400" />}
                />
                <PriceDetail
                  label="Online Payments"
                  value={onlinePrice}
                  icon={<FaCreditCard className="text-blue-400" />}
                />
                <div className="pt-2 border-t border-gray-700">
                  <PriceDetail
                    label="Paid Orders"
                    value={paidOrders}
                    icon={<FaCheckCircle className="text-green-400" />}
                    isCount={true}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Deliveries List */}
        <div
          className={`border-t border-gray-700 ${
            deliveries.length > 0 ? "max-h-[40vh]" : ""
          } overflow-y-auto`}
        >
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
                        {delivery.isPaid ? (
                          <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded-full">
                            Paid
                          </span>
                        ) : (
                          <span className="text-xs bg-red-900/30 text-red-400 px-2 py-1 rounded-full">
                            Unpaid
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {new Date(delivery.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {!delivery.isPaid && (
                        <div className="text-lg font-bold text-green-400">
                          ₹{delivery.price.toFixed(2)}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        {!delivery.isPaid && (
                          <PaymentBadge method={delivery.paymentMethod} />
                        )}
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

// Updated PriceDetail component
const PriceDetail = ({
  label,
  value,
  icon,
  isCount = false,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  isCount?: boolean;
}) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-2 text-gray-300">
      {icon}
      <span>{label}</span>
    </div>
    <span className={`font-medium ${isCount ? 'text-white' : 'text-green-500'}`}>
      {isCount ? value : `₹${value.toFixed(2)}`}
    </span>
  </div>
);

// Rest of the helper components remain the same...
const PaymentMethodButton = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`p-3 rounded-lg border flex items-center justify-center gap-2 transition-colors ${
      active
        ? "bg-green-900/30 border-green-600 text-green-400"
        : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
    }`}
  >
    {icon}
    {label}
  </motion.button>
);

const PaymentBadge = ({
  method,
}: {
  method: "cash" | "online" | "both" | "qr" | "none";
}) => {
  const config = {
    cash: {
      icon: <FaMoneyBillWave />,
      color: "bg-yellow-900/30 text-yellow-400",
    },
    online: { icon: <FaCreditCard />, color: "bg-blue-900/30 text-blue-400" },
    both: {
      icon: (
        <>
          <FaMoneyBillWave />
          <FaCreditCard />
        </>
      ),
      color: "bg-purple-900/30 text-purple-400",
    },
    qr: { icon: <FaQrcode />, color: "bg-teal-900/30 text-teal-400" },
    none: { icon: <FaCheckCircle />, color: "bg-green-900/30 text-green-400" },
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${config[method].color}`}
    >
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
