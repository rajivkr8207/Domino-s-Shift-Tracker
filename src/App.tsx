import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ShiftTracker from './Pages/ShiftTracker'
import DeliveryTracker from './Pages/DeliveryTracker'
import { ToastContainer } from 'react-toastify'
import { useMediaQuery } from 'react-responsive'
import PaymentCheckout from './Pages/PaymentCheckout'
import Navbar from './component/Navbar'
import Main from './Pages/Main'

const App = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  
  return (
    <>
     <BrowserRouter>
     <Navbar />
     <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/delivery" element={<DeliveryTracker />} />
      <Route path="/checkout" element={<PaymentCheckout />} />
      <Route path="/shift" element={<ShiftTracker />} />
     
     </Routes>
     </BrowserRouter>
     <ToastContainer
          position={isMobile ? "top-center" : "bottom-right"}
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastStyle={{
            background: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "0.5rem",
            margin: isMobile ? "1rem" : "0",
            width: isMobile ? "calc(100% - 2rem)" : "auto",
          }}
        /> 
    </>
  )
}

export default App
