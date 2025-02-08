import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";

interface Profile {
  id: string;
  name: string;
  role: "customer" | "artisan" | "farmer";
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, role: "customer" | "artisan" | "farmer", name: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Update the fetchProfile function
  const fetchProfile = async (userId: string) => {
    try {
      // First verify if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id, name, role')
        .eq('id', userId)
        .maybeSingle();

      if (checkError) {
        console.error('Profile check error:', checkError.message);
        return null;
      }

      // If profile doesn't exist, create one from user metadata
      if (!existingProfile) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return null;

        const newProfile = {
          id: userId,
          name: userData.user.user_metadata.name || '',
          role: userData.user.user_metadata.role || 'customer'
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (createError) {
          console.error('Profile creation error:', createError.message);
          return null;
        }

        const profile: Profile = {
          id: createdProfile.id,
          name: createdProfile.name,
          role: createdProfile.role as "customer" | "artisan" | "farmer"
        };

        setProfile(profile);
        return profile;
      }

      // Return existing profile
      const profile: Profile = {
        id: existingProfile.id,
        name: existingProfile.name,
        role: existingProfile.role as "customer" | "artisan" | "farmer"
      };

      setProfile(profile);
      return profile;
    } catch (error) {
      console.error('Profile fetch error:', error);
      return null;
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
    }
  }, [user]);

  // Update the signIn function
  const signIn = async (email: string, password: string) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user data returned');

      // Set the user immediately
      setUser(authData.user);

      // Fetch profile with retries
      let profileData = null;
      let retries = 3;

      while (retries > 0 && !profileData) {
        profileData = await fetchProfile(authData.user.id);
        if (!profileData) {
          retries--;
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }

      if (!profileData) {
        // Try one last time to create profile
        profileData = await fetchProfile(authData.user.id);
        if (!profileData) {
          throw new Error('Failed to fetch or create user profile');
        }
      }

      // Update user metadata
      authData.user.user_metadata = {
        ...authData.user.user_metadata,
        role: profileData.role,
        name: profileData.name
      };
      
      setUser(authData.user);
      return { ...authData.user, role: profileData.role };
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    role: "customer" | "artisan" | "farmer",
    name: string
  ) => {
    try {
      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('No user data returned');

      // Wait for trigger to execute
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create profile manually if trigger fails
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (!profile || profileError) {
        // Manual profile creation
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              name,
              role
            }
          ])
          .single();

        if (insertError) {
          console.error('Profile creation error:', insertError);
          throw new Error('Failed to create user profile');
        }
      }

      return authData;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (data: Partial<Profile>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user?.id);

      if (error) throw error;

      setProfile((prev) => prev ? { ...prev, ...data } : null);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      signIn, 
      signUp, 
      signOut,
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
