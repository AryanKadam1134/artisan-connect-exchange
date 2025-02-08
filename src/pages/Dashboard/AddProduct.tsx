import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface NewProduct {
  name: string;
  price: string; // Changed from number to string
  description: string;
  image: string | null;
  artisan: string;
}

const AddProduct = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [product, setProduct] = useState<NewProduct>({
    name: "",
    price: "", // Initialize as empty string
    description: "",
    image: null,
    artisan: profile?.name || "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate price
      const priceValue = parseFloat(product.price);
      if (isNaN(priceValue) || priceValue < 0) {
        throw new Error('Invalid price value');
      }

      let imageUrl = "";

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user?.id}/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const { error } = await supabase
        .from('products')
        .insert([
          {
            name: product.name,
            price: priceValue, // Use validated price value
            description: product.description,
            image: imageUrl,
            artisan_id: user?.id,
            artisan: product.artisan,
          },
        ]);

      if (error) throw error;

      // Show success message
      toast({
        title: "Product added successfully",
        description: "Your product has been listed",
      });

      navigate('/dashboard/business');
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard/business')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-semibold mb-6">Add New Product</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Name
              </label>
              <Input
                required
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Price
              </label>
              <Input
                required
                type="number"
                step="0.01"
                min="0"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                placeholder="Enter price"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <Textarea
                required
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                placeholder="Enter product description"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Product Image
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Adding Product..." : "Add Product"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;