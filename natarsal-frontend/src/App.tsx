// D:/natarsal/natarsal-frontend/src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { ErrorBoundary } from "./components/ui/error-boundary";
import ScrollToTop from "./components/ScrollToTop";

// Public Pages
import Home from "./pages/home";
import MenuPage from "./pages/menupage";
import AboutPage from "./pages/aboutpage";
import ReservationPage from "./pages/reservationpage";
import ContactPage from "./pages/contactpage";

// Admin Pages
import AdminLogin from "./pages/admin/login";
import CheckStatus from "./pages/admin/check-status";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./pages/admin/dashboard";
import AdminOverview from "./pages/admin/overview";
import AdminReservations from "./pages/admin/reservations";
import AdminMenu from "./pages/admin/menu";

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/reservation" element={<ReservationPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/check-status" element={<CheckStatus />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ProtectedRoute requireAdmin={true} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminOverview />} />
                <Route path="reservations" element={<AdminReservations />} />
                <Route path="menu" element={<AdminMenu />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
