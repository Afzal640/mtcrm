import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl text-indigo-600 mb-4">404</h1>
        <h2 className="text-2xl text-gray-900 mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-6">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <div className="flex items-center justify-center space-x-3">
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button onClick={() => navigate('/dashboard')}>
            <Home className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
