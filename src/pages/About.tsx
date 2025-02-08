
import { Navbar } from "@/components/Navbar";
import { HandshakeIcon, Users, GlobeIcon } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Artisan Connect
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Bridging the gap between rural artisans and global markets through
            sustainable e-commerce.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <HandshakeIcon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Fair Trade</h3>
            <p className="text-gray-600">
              We ensure fair compensation and sustainable practices for all our
              artisans and farmers.
            </p>
          </div>
          <div className="text-center p-6">
            <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community Support</h3>
            <p className="text-gray-600">
              Supporting rural communities by providing a platform for economic
              growth.
            </p>
          </div>
          <div className="text-center p-6">
            <GlobeIcon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
            <p className="text-gray-600">
              Connecting local artisans with customers worldwide through our
              platform.
            </p>
          </div>
        </div>

        <div className="prose max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            Artisan Connect is dedicated to preserving traditional craftsmanship
            while providing sustainable livelihoods for rural artisans and farmers.
            We believe in creating a marketplace that values authenticity,
            tradition, and fair trade practices.
          </p>
          <p className="text-gray-600 mb-6">
            Our platform serves as a bridge between skilled craftspeople and
            conscious consumers, ensuring that traditional arts and crafts continue
            to thrive in the modern world. By choosing Artisan Connect, you're not
            just making a purchase – you're supporting families, preserving
            cultural heritage, and contributing to sustainable rural development.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
