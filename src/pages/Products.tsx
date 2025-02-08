
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { ShoppingCart } from "lucide-react";

const dummyProducts = [
  {
    id: 1,
    name: "Handwoven Basket",
    price: 45.99,
    description: "Traditional handwoven basket made from locally sourced materials",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    artisan: "Maria Crafts",
  },
  {
    id: 2,
    name: "Organic Honey",
    price: 12.99,
    description: "Pure organic honey from local beekeepers",
    image: "https://images.unsplash.com/photo-1485833077593-4278bba3f11f",
    artisan: "Nature's Best",
  },
  {
    id: 3,
    name: "Handmade Pottery Set",
    price: 89.99,
    description: "Set of 4 handmade ceramic plates",
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
    artisan: "Clay Masters",
  },
];

const Products = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary-600">
                    ${product.price}
                  </span>
                  <Button className="bg-primary-500 hover:bg-primary-600">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">By {product.artisan}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
