
import { useLocation, Link } from "react-router-dom";
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-apple-gray6 p-6">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-6 text-apple-blue">404</h1>
        <p className="text-xl text-gray-700 mb-8">
          Oops! We couldn't find the page you were looking for.
        </p>
        <Link to="/">
          <Button className="gap-2">
            Return to Calendar
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
