import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Package, BarChart, Users, PlusCircle, LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  artisan: string;
  created_at: string;
}

const BusinessDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (user?.user_metadata.role !== "artisan" && user?.user_metadata.role !== "farmer") {
      navigate("/dashboard/customer");
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('artisan_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
  
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
  
      if (error) throw error;
  
      // Refresh products list
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const dashboardItems = [
    {
      title: "Orders",
      icon: <BarChart className="w-6 h-6" />,
      description: "Track and fulfill orders",
      link: "/orders/manage",
      color: "text-blue-600",
      stats: "5 Pending",
    },
    {
      title: "Customers",
      icon: <Users className="w-6 h-6" />,
      description: "View customer interactions",
      link: "/customers",
      color: "text-green-600",
      stats: "89 Total",
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-between items-center px-6 py-4 bg-white border-b">
        <h1 className="text-xl font-semibold">Business Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/profile')}
          >
            <UserCircle className="h-5 w-5" />
          </Button>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            Welcome, {profile?.name}
          </h2>
          <p className="text-gray-600">
            Manage your {user?.user_metadata.role} account
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {dashboardItems.map((item) => (
            <Card
              key={item.title}
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(item.link)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`${item.color}`}>{item.icon}</div>
                {item.stats && (
                  <span className="text-sm font-medium text-gray-600">
                    {item.stats}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Your Products</h3>
            <Button onClick={() => navigate('/products/new')}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add New Product
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">Loading products...</div>
          ) : products.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-gray-600 mb-4">You haven't added any products yet</p>
              <Button onClick={() => navigate('/products/new')}>
                Add Your First Product
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  {product.image && (
                    <div className="aspect-video relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="text-lg font-semibold mb-2">{product.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {product.description.length > 100
                        ? `${product.description.substring(0, 100)}...`
                        : product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary-600">
                        ${product.price.toFixed(2)}
                      </span>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => deleteProduct(product.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
