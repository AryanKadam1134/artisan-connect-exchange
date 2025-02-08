import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";

const BusinessDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    // Only allow artisan and farmer roles
    if (user?.user_metadata.role !== "artisan" && user?.user_metadata.role !== "farmer") {
      navigate("/dashboard/customer");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Business Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add your business dashboard content here */}
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
