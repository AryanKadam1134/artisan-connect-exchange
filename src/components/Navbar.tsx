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
            <Link 
              to="/" 
              className={`text-2xl font-bold transition-colors ${
                isScrolled ? "text-primary-700" : "text-white"
              }`}
            >
              Artisan Connect
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {user.user_metadata.role === 'customer' && (
                  <Button 
                    variant={isScrolled ? "ghost" : "secondary"} 
                    size="icon" 
                    onClick={() => navigate('/cart')}
                    className={!isScrolled && "text-white hover:text-primary-700"}
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                )}
                <Button 
                  variant={isScrolled ? "ghost" : "secondary"} 
                  size="icon" 
                  onClick={() => navigate('/profile')}
                  className={!isScrolled && "text-white hover:text-primary-700"}
                >
                  <User className="h-5 w-5" />
                </Button>
                <Button 
                  variant={isScrolled ? "outline" : "secondary"} 
                  onClick={handleSignOut}
                  className={!isScrolled && "border-white text-white hover:bg-white hover:text-primary-700"}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant={isScrolled ? "ghost" : "secondary"} 
                  onClick={() => navigate('/login')}
                  className={!isScrolled ? "bg-white text-primary-700 hover:bg-white/90" : ""}
                >
                  Sign In
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => navigate('/signup')}
                  className="bg-white text-primary-700 hover:bg-white/90 border-2 border-white"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant={isScrolled ? "ghost" : "secondary"}
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={!isScrolled && "text-white hover:bg-white hover:text-primary-700"}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md rounded-b-lg shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user ? (
                <>
                  {user.user_metadata.role === 'customer' && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        navigate('/cart');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Cart
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate('/profile');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <User className="h-5 w-5 mr-2" />
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-primary-50"
                    onClick={() => {
                      navigate('/login');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="default"
                    className="w-full justify-start bg-primary-600 text-white hover:bg-primary-700"
                    onClick={() => {
                      navigate('/signup');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};