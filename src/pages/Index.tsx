
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-600 mb-8 animate-fadeIn">
            <Star className="w-4 h-4 mr-2" /> Supporting Rural Artisans
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-slideUp">
            Connecting Artisans with
            <span className="text-primary-600"> Global Markets</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 animate-slideUp">
            Discover unique handcrafted products from rural artisans and farmers.
            Support local communities while shopping for authentic, high-quality goods.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slideUp">
            <Button
              size="lg"
              className="bg-primary-500 hover:bg-primary-600 text-white px-8"
              onClick={() => navigate("/products")}
            >
              Explore Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary-200 text-primary-600 hover:bg-primary-50"
              onClick={() => navigate("/signup")}
            >
              Join as Artisan
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Authentic Products",
                description: "Directly sourced from rural artisans and farmers",
              },
              {
                title: "Fair Trade",
                description: "Supporting sustainable livelihoods and communities",
              },
              {
                title: "Quality Assured",
                description: "Every product meets our quality standards",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-lg bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow animate-fadeIn"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
