// src/components/PaymentCheckout.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaMoneyBillWave, FaCreditCard, FaQrcode } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
interface Payment {
  id: string;
  amount: number;
  method: "cash" | "online" | "qr";
  timestamp: string;
}

const PaymentCheckout = () => {
  const [totalAmount, setTotalAmount] = useState<number>(0); // Example total
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online" | "qr">("cash");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [remainingAmount, setRemainingAmount] = useState<number>(totalAmount);

useEffect(() => {
  const delivers = localStorage.getItem("deliveries");
  let totalmoney = 0;

  if (delivers) {
    const deliveries = JSON.parse(delivers);
    totalmoney = deliveries.reduce((sum: number, delivery: { price: number }) => sum + delivery.price, 0);
  }

  // Update total amount
  setTotalAmount(totalmoney);

  const storedPayments = localStorage.getItem("payments");
  let parsedPayments = [];

  if (storedPayments) {
    parsedPayments = JSON.parse(storedPayments);
  } else {
    localStorage.setItem("payments", JSON.stringify([]));
  }

  setPayments(parsedPayments);

  const paidAmount = parsedPayments.reduce((sum: number, payment: { amount: number }) => sum + payment.amount, 0);

  setRemainingAmount(totalmoney - paidAmount);
  if (totalmoney - paidAmount < 0) {
    setRemainingAmount(0);
    localStorage.setItem("payments", JSON.stringify([])); // Reset payments if overpaid
  }
}, []);


  const handlePaymentSubmit = () => {
    if (paymentAmount <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }
    if (paymentAmount > remainingAmount) {
      toast.error("Payment amount exceeds remaining balance");
      return;
    }

    const newPayment: Payment = {
      id: Date.now().toString(),
      amount: paymentAmount,
      method: paymentMethod,
      timestamp: new Date().toISOString(),
    };

    setPayments([...payments, newPayment]);
    localStorage.setItem('payments', JSON.stringify([...payments, newPayment]));

    setPaymentAmount(0);
    toast.success(`Payment of ₹${paymentAmount} recorded!`);
    setRemainingAmount((prev) => prev - paymentAmount);
  };
   // Calculate prices
 
  const handledelete = (id: string) => () => {
    const updatedPayments = payments.filter((payment) => payment.id !== id);
    setPayments(updatedPayments);
    localStorage.setItem("payments", JSON.stringify(updatedPayments));

    const deletedPayment = payments.find((payment) => payment.id === id);
    if (deletedPayment) {
      setRemainingAmount((prev) => prev + deletedPayment.amount);
      toast.success(`Payment of ₹${deletedPayment.amount} deleted!`);
    }
    if (updatedPayments.length === 0) {
      setRemainingAmount(totalAmount); // Reset remaining amount if no payments left
    }

  }
 
const handlemax = ()=>{
  if (remainingAmount > 0) {
    setPaymentAmount(remainingAmount);
  } else {
    toast.error("No remaining amount to pay");
  }
}
  return (
    <div className="min-h-screen bg-gray-900 p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-green-400 mb-6">
            Payment Checkout
          </h2>

         

          {/* Payment Summary */}
          <div className="bg-gray-900/50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Total:</span>
              <span className="text-xl font-bold text-green-400">₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Paid:</span>
              <span className="text-green-400">
                ₹{(totalAmount - remainingAmount).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Remaining:</span>
              <span className={`text-xl font-bold ${
                remainingAmount > 0 ? "text-red-400" : "text-green-400"
              }`}>
                ₹{remainingAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Payment Amount (₹)
              </label>
              <input
                type="number"
                value={paymentAmount || ""}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                placeholder="Enter amount"
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button onClick={handlemax} className="text-xl bg-green-900/30 text-green-400 px-2 py-1 my-2">
                     Max
                    </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                <PaymentMethodButton
                  icon={<FaMoneyBillWave />}
                  label="Cash"
                  active={paymentMethod === "cash"}
                  onClick={() => setPaymentMethod("cash")}
                />
                <PaymentMethodButton
                  icon={<FaCreditCard />}
                  label="Online"
                  active={paymentMethod === "online"}
                  onClick={() => setPaymentMethod("online")}
                />
               
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePaymentSubmit}
              disabled={remainingAmount <= 0}
              className={`w-full py-3 text-white font-bold rounded-lg shadow-lg transition-all ${
                remainingAmount <= 0
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-green-800 hover:shadow-green-900/30"
              }`}
            >
              {remainingAmount <= 0 ? "Fully Paid" : "Add Payment"}
            </motion.button>
          </div>

          {/* Payment History */}
          {payments.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-300 mb-3">
                Payment History
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {payments.map((payment) => (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-700/50 p-3 rounded-lg flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <PaymentIcon method={payment.method} />
                      <div>
                        <div className="text-green-400 font-medium">
                          ₹{payment.amount.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(payment.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded-full">
                      {payment.method}
                    </div>
                    <div onClick={handledelete(payment.id)} className="text-xl text-red-400 px-2 py-1 rounded-full ">
                     <FaTrash />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Helper Components
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
    className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-colors ${
      active
        ? "bg-green-900/30 border-green-600 text-green-400"
        : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
    }`}
  >
    {icon}
    <span className="text-xs">{label}</span>
  </motion.button>
);

const PaymentIcon = ({ method }: { method: "cash" | "online" | "qr" }) => {
  const icons = {
    cash: <FaMoneyBillWave className="text-yellow-400" />,
    online: <FaCreditCard className="text-blue-400" />,
    qr: <FaQrcode className="text-teal-400" />,
  };
  return icons[method];
};

export default PaymentCheckout;
