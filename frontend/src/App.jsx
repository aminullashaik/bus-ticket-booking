import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BusSearch from './pages/BusSearch';
import BusDetails from './pages/BusDetails';
import BookingSuccess from './pages/BookingSuccess';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from './components/AdminLayout';
import Support from './pages/Support';
import LoadingBar from './components/LoadingBar';
import PageTransition from './components/PageTransition';

import PaymentPage from './pages/PaymentPage';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

function App() {
  const location = useLocation();

  return (
    <div style={styles.appWrapper}>
      <LoadingBar />
      <div style={styles.contentView}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* USER ROUTES */}
            <Route path="/" element={<PageTransition><Navbar /><Home /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/buses" element={<PageTransition><Navbar /><BusSearch /></PageTransition>} />
            
            <Route path="/book/:scheduleId" element={
              <ProtectedRoute><PageTransition><Navbar /><BusDetails /></PageTransition></ProtectedRoute>
            } />
            <Route path="/payment" element={
              <ProtectedRoute><PageTransition><Navbar /><PaymentPage /></PageTransition></ProtectedRoute>
            } />
            <Route path="/success" element={
              <ProtectedRoute><PageTransition><Navbar /><BookingSuccess /></PageTransition></ProtectedRoute>
            } />
            <Route path="/my-bookings" element={
              <ProtectedRoute><PageTransition><Navbar /><MyBookings /></PageTransition></ProtectedRoute>
            } />

            {/* ADMIN PORTAL LINES - SEPARATE LAYOUT */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}><AdminLayout /></ProtectedRoute>
            }>
                <Route index element={<PageTransition><AdminDashboard initialTab="overview" /></PageTransition>} />
                <Route path="bookings" element={<PageTransition><AdminDashboard initialTab="bookings" /></PageTransition>} />
                <Route path="buses" element={<PageTransition><AdminDashboard initialTab="buses" /></PageTransition>} />
                <Route path="routes" element={<PageTransition><AdminDashboard initialTab="routes" /></PageTransition>} />
                <Route path="schedules" element={<PageTransition><AdminDashboard initialTab="schedules" /></PageTransition>} />
                <Route path="support" element={<PageTransition><AdminDashboard initialTab="support" /></PageTransition>} />
            </Route>

            <Route path="/support" element={<PageTransition><Navbar /><Support /></PageTransition>} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}

const styles = {
  appWrapper: {
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#05070a", // Matches your dashboard onyx
  },
  contentView: {
    flex: 1, // Takes all remaining space below Navbar
    width: "100%",
    position: "relative",
    overflowY: "auto", // Allow vertical scrolling
  }
};

export default App;