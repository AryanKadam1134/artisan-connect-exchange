import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-700 hover:text-primary-600 transition-colors">
              Artisan Connect
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-gray-700 hover:text-primary-600 transition-colors">
              Products
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary-600 transition-colors">
              About
            </Link>
            
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-700 hover:text-primary-600"
                  onClick={() => navigate("/cart")}
                >
                  <ShoppingCart className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-700 hover:text-primary-600"
                  onClick={() => navigate("/profile")}
                >
                  <User className="h-5 w-5" />
                </Button>
                <Button
                  variant="default"
                  className="bg-primary-500 hover:bg-primary-600 text-white"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                className="bg-primary-500 hover:bg-primary-600 text-white"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/products" className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors">
              Products
            </Link>
            <Link to="/about" className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors">
              About
            </Link>
            {user ? (
              <>
                <Link to="/cart" className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors">
                  Cart
                </Link>
                <Link to="/profile" className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors">
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" className="block px-3 py-2 text-primary-600 hover:text-primary-700 transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
