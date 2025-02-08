import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
}

const Customers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    if (!user || (user.user_metadata.role !== "artisan" && user.user_metadata.role !== "farmer")) {
      navigate("/dashboard/business");
    }
    // TODO: Fetch customers data
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard/business')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <h1 className="text-2xl font-semibold mb-6">Customer Management</h1>
        
        <div className="bg-white shadow rounded-lg">
          {customers.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No customers found
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.orders}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;