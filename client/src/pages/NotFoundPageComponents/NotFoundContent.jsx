import { Search } from "lucide-react";

function NotFoundContent() {
  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-6">
        <div className="text-8xl sm:text-9xl font-bold text-blue-50">404</div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Search size={80} className="text-blue-300" />
        </div>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 text-center">
        Page Not Found
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
    </div>
  );
}

export default NotFoundContent;
