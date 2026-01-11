import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-light-grey flex flex-col justify-center items-center px-4">
            <div className="text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-primary">404</h1>
                    <div className="text-6xl">🎓</div>
                </div>
                
                <h2 className="text-3xl font-bold text-heading mb-4">
                    Oops! Page Not Found
                </h2>
                
                <p className="text-lg text-body mb-8 max-w-md">
                    The page you're looking for doesn't exist. It might have been moved, 
                    deleted, or you entered the wrong URL.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="btn-primary inline-flex items-center"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Go Home
                    </Link>
                    
                    <button
                        onClick={() => window.history.back()}
                        className="btn-outline inline-flex items-center"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Go Back
                    </button>
                </div>
                
                <div className="mt-12">
                    <h3 className="text-lg font-semibold text-heading mb-4">
                        Popular Pages
                    </h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            to="/courses"
                            className="text-primary hover:text-primary-light underline"
                        >
                            Browse Courses
                        </Link>
                        <Link
                            to="/about"
                            className="text-primary hover:text-primary-light underline"
                        >
                            About Us
                        </Link>
                        <Link
                            to="/contact"
                            className="text-primary hover:text-primary-light underline"
                        >
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;