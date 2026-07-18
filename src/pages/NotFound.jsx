import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4">
      <div className="text-center max-w-md animate-fade-in-up">
        <div className="w-16 h-16 bg-indigo-500/15 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-6xl font-extrabold text-white mb-2">404</h1>
        <p className="text-xl font-semibold text-slate-300 mb-4">Page Not Found</p>
        <p className="text-slate-500 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/admin" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
