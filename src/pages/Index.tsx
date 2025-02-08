import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HandshakeIcon, Users, GlobeIcon, ArrowRight, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/utils/currency";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  artisan: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6); // Show only 6 latest products

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Artisan Connect Exchange
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Connecting artisans and farmers directly with customers worldwide
            </p>
            <Button 
              size="lg"
              variant="secondary"
              onClick={() => navigate("/signup")}
            >
              Join Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          <Button variant="outline" onClick={() => navigate("/products")}>
            View All Products
          </Button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">Loading products...</div>
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
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-3">
                    {product.description.length > 100
                      ? `${product.description.substring(0, 100)}...`
                      : product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-primary-600">
                      {formatPrice(product.price)}
                    </span>
                    <Button onClick={() => navigate(`/product/${product.id}`)}>
                      View Details
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">By {product.artisan}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* About Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Bridging the gap between rural artisans and global markets through
              sustainable e-commerce.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <HandshakeIcon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fair Trade</h3>
              <p className="text-gray-600">
                We ensure fair compensation and sustainable practices for all our
                artisans and farmers.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community Support</h3>
              <p className="text-gray-600">
                Supporting rural communities by providing a platform for economic
                growth.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <GlobeIcon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
              <p className="text-gray-600">
                Connecting local artisans with customers worldwide through our
                platform.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" onClick={() => navigate("/about")}>
              Learn More About Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
