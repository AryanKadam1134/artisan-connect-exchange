import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Box, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const { user, profile: authProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Initialize form data with current values
    if (authProfile) {
      setProfile(authProfile);
      setFormData({
        name: authProfile.name,
        email: user.email || "",
      });
    }
  }, [user, authProfile, navigate]);

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
        })
        .eq('id', user?.id);

      if (error) throw error;

      // Update email if changed
      if (formData.email !== user?.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email,
        });
        if (emailError) throw emailError;
      }

      setIsEditing(false);
      setProfile({ ...profile, name: formData.name });

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <Card className="p-6">
            <div className="text-center">Loading profile...</div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Profile</h1>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        <Card className="p-6 space-y-6">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-primary-600" />
            </div>
            <div>
              {isEditing ? (
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="max-w-xs"
                  placeholder="Your name"
                />
              ) : (
                <>
                  <h2 className="text-2xl font-semibold text-gray-900">{profile.name}</h2>
                  <p className="text-gray-500 capitalize">{profile.role}</p>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-gray-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Email</p>
                {isEditing ? (
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    type="email"
                    className="max-w-xs"
                    placeholder="Your email"
                  />
                ) : (
                  <p className="text-gray-900">{user.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Box className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="text-gray-900 capitalize">{profile.role}</p>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="pt-4 border-t flex gap-4">
              <Button onClick={handleUpdate}>Save Changes</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          )}

          <div className="pt-4 border-t">
            <Button
              variant="destructive"
              onClick={() => {
                supabase.auth.signOut();
                navigate("/login");
              }}
              className="w-full sm:w-auto"
            >
              Sign Out
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
