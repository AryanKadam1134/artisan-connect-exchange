import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";

// Import your components
import Index from "@/pages/Index";
import Login from "@/pages/Auth/Login";
import Signup from "@/pages/Auth/Signup";
import CustomerDashboard from "@/pages/Dashboard/CustomerDashboard";
import BusinessDashboard from "@/pages/Dashboard/BusinessDashboard";
import Products from "@/pages/Products";
import About from "@/pages/About";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Profile from "@/pages/Profile";
import Orders from "@/pages/Orders";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import AddProduct from "@/pages/Dashboard/AddProduct";
import Customers from "@/pages/Dashboard/Customers";
import OrdersManagement from "@/pages/Dashboard/OrdersManagement";

// Example usage in a component
import { uploadProductImage } from "@/utils/storage";

const handleImageUpload = async (file: File) => {
  try {
    const imageUrl = await uploadProductImage(user.id, file);
    console.log('Uploaded image URL:', imageUrl);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard/customer"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/business"
              element={
                <ProtectedRoute allowedRoles={["artisan", "farmer"]}>
                  <BusinessDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={["customer", "artisan", "farmer"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/new"
              element={
                <ProtectedRoute allowedRoles={["artisan", "farmer"]}>
                  <AddProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute allowedRoles={["artisan", "farmer"]}>
                  <Customers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/manage"
              element={
                <ProtectedRoute allowedRoles={["artisan", "farmer"]}>
                  <OrdersManagement />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
