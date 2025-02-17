import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4">About Us</h2>
            <p className="text-gray-400">
              We are committed to providing you with the best eco-friendly fashion. Discover our latest collections and enjoy our sustainable products.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-emerald-400 transition">Home</a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-emerald-400 transition">About Us</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Contact Us</h2>
            <p className="text-gray-400">
              Email: support@ecommerce.com<br />
              Phone: +1 123 456-7890
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Follow Us</h2>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-400 hover:text-emerald-400 transition">
                <Facebook size={24} />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-emerald-400 transition">
                <Twitter size={24} />
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-emerald-400 transition">
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p className="text-gray-400">&copy; 2024 E-Commerce Website. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
