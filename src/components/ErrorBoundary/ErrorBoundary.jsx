import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null, 
            errorInfo: null,
            retryCount: 0
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error,
            errorInfo
        });

        // Log error to console in development
        if (import.meta.env.DEV) {
            console.error('Error Boundary caught an error:', error, errorInfo);
        }

        // In production, you would send this to an error reporting service
        // Example: Sentry, LogRocket, etc.
        this.logErrorToService(error, errorInfo);
    }

    logErrorToService = (error, errorInfo) => {
        // This would typically send to an error monitoring service
        const errorData = {
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            retryCount: this.state.retryCount
        };

        // Example: Send to your logging endpoint
        // fetch('/api/log-error', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(errorData)
        // }).catch(console.error);

        console.error('Error logged:', errorData);
    };

    handleRetry = () => {
        this.setState(prevState => ({
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: prevState.retryCount + 1
        }));
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
                        <div className="mb-4">
                            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Oops! Something went wrong
                            </h1>
                            <p className="text-gray-600 mb-6">
                                We're sorry, but something unexpected happened. 
                                Our team has been notified and is working on a fix.
                            </p>
                        </div>

                        {import.meta.env.DEV && this.state.error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                                <h3 className="text-sm font-semibold text-red-800 mb-2">
                                    Error Details (Development Mode):
                                </h3>
                                <pre className="text-xs text-red-700 overflow-auto max-h-32">
                                    {this.state.error.message}
                                </pre>
                                {this.state.errorInfo && (
                                    <details className="mt-2">
                                        <summary className="text-xs text-red-600 cursor-pointer">
                                            Component Stack
                                        </summary>
                                        <pre className="text-xs text-red-600 mt-1 overflow-auto max-h-24">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        )}

                        <div className="space-y-3">
                            <button
                                onClick={this.handleRetry}
                                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                disabled={this.state.retryCount >= 3}
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                {this.state.retryCount >= 3 ? 'Max Retries Reached' : 'Try Again'}
                            </button>

                            <button
                                onClick={this.handleGoHome}
                                className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <Home className="h-4 w-4 mr-2" />
                                Go to Homepage
                            </button>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-500">
                                If this problem persists, please contact our support team.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Higher-order component for functional components
export const withErrorBoundary = (Component, fallback) => {
    return function WithErrorBoundaryComponent(props) {
        return (
            <ErrorBoundary fallback={fallback}>
                <Component {...props} />
            </ErrorBoundary>
        );
    };
};

// Hook for error handling in functional components
export const useErrorHandler = () => {
    return (error, errorInfo) => {
        // This would trigger the error boundary
        throw error;
    };
};

export default ErrorBoundary;