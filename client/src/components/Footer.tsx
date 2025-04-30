import { Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center justify-center md:justify-start">
              <Globe className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-xl font-heading font-bold">GeoOzge</h2>
            </div>
            <p className="text-gray-400 mt-2 text-center md:text-left">Exploring the world through interactive learning</p>
          </div>
          
          <div className="flex space-x-8">
            <div>
              <h3 className="font-heading font-semibold mb-2">Navigation</h3>
              <ul className="text-gray-400 space-y-1">
                <li><a href="#flashcards" className="hover:text-primary transition">Flashcards</a></li>
                <li><a href="#quiz" className="hover:text-primary transition">Quiz</a></li>
                <li><a href="#capitals-test" className="hover:text-primary transition">Capitals Test</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-heading font-semibold mb-2">Connect</h3>
              <ul className="text-gray-400 space-y-1">
                <li><a href="#" className="hover:text-primary transition">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} GeoOzge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
