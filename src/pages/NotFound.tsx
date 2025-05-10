
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <p className="text-gray-500 mb-6">
          We couldn't find the page you're looking for at: <br />
          <code className="bg-gray-100 px-2 py-1 rounded">{location.pathname}</code>
        </p>
        <Button asChild>
          <a href="/" className="inline-block">
            Return to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
