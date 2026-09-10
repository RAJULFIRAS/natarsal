import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { ErrorBoundary } from "./components/ui/error-boundary";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/home";
import MenuPage from "./pages/menupage";
import AboutPage from "./pages/aboutpage";
import ReservationPage from "./pages/reservationpage";
import ContactPage from "./pages/contactpage";

import AdminLogin from "./pages/admin/login";
import CheckStatus from "./pages/check-status";
import AdminTestimonials from "./pages/admin/testimonials";
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
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/reservation" element={<ReservationPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/check-status" element={<CheckStatus />} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ProtectedRoute requireAdmin={true} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="testimonials" element={<AdminTestimonials />} />
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
