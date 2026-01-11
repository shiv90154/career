import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { testApiConnection, testAxiosConnection } from '../../utils/apiTest';

const ApiDebug = () => {
    const [results, setResults] = useState({});
    const [connectionTest, setConnectionTest] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        runAllTests();
    }, []);

    const runAllTests = async () => {
        setLoading(true);
        
        // Test basic connection first
        console.log('Testing basic API connection...');
        const directTest = await testApiConnection();
        const axiosTest = await testAxiosConnection();
        
        setConnectionTest({
            direct: directTest,
            axios: axiosTest
        });
        
        // Test all endpoints
        await testAllApis();
    };

    const testAllApis = async () => {
        const endpoints = [
            { name: 'Courses', url: '/courses/index.php' },
            { name: 'Categories', url: '/categories/index.php' },
            { name: 'Tests', url: '/tests/index.php' },
            { name: 'Current Affairs', url: '/current-affairs/index.php' },
            { name: 'Blogs', url: '/blogs/index.php' }
        ];

        const testResults = {};

        for (const endpoint of endpoints) {
            try {
                console.log(`Testing ${endpoint.name}...`);
                const response = await api.get(endpoint.url);
                console.log(`${endpoint.name} response:`, response.data);
                
                testResults[endpoint.name] = {
                    status: 'success',
                    data: response.data,
                    count: response.data.courses?.length || 
                           response.data.categories?.length || 
                           response.data.tests?.length || 
                           response.data.current_affairs?.length || 
                           response.data.blogs?.length || 0
                };
            } catch (error) {
                console.error(`${endpoint.name} error:`, error);
                testResults[endpoint.name] = {
                    status: 'error',
                    error: error.message,
                    details: error.response?.data,
                    status_code: error.response?.status
                };
            }
        }

        setResults(testResults);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">API Debug - Testing...</h2>
                <div className="animate-pulse">Loading...</div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">API Debug Results</h2>
            
            {/* Connection Test Results */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3">Connection Tests</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-3 rounded border ${
                        connectionTest.direct?.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                        <h4 className="font-medium">Direct Fetch</h4>
                        <div className="text-sm">
                            {connectionTest.direct?.success ? '✅ Success' : '❌ Failed'}
                            {connectionTest.direct?.error && (
                                <div className="text-red-600 mt-1">{connectionTest.direct.error}</div>
                            )}
                        </div>
                    </div>
                    <div className={`p-3 rounded border ${
                        connectionTest.axios?.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                        <h4 className="font-medium">Axios</h4>
                        <div className="text-sm">
                            {connectionTest.axios?.success ? '✅ Success' : '❌ Failed'}
                            {connectionTest.axios?.error && (
                                <div className="text-red-600 mt-1">{connectionTest.axios.error}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="space-y-4">
                {Object.entries(results).map(([name, result]) => (
                    <div key={name} className={`p-4 rounded-lg border ${
                        result.status === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{name}</h3>
                            <span className={`px-2 py-1 rounded text-sm ${
                                result.status === 'success' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {result.status === 'success' ? `✅ ${result.count} items` : `❌ Error (${result.status_code || 'Unknown'})`}
                            </span>
                        </div>
                        
                        {result.status === 'error' && (
                            <div className="text-red-600 text-sm">
                                <div>Error: {result.error}</div>
                                {result.details && (
                                    <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-x-auto">
                                        {JSON.stringify(result.details, null, 2)}
                                    </pre>
                                )}
                            </div>
                        )}
                        
                        {result.status === 'success' && result.data && (
                            <details className="mt-2">
                                <summary className="cursor-pointer text-sm text-gray-600">
                                    View Response Data
                                </summary>
                                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto max-h-40">
                                    {JSON.stringify(result.data, null, 2)}
                                </pre>
                            </details>
                        )}
                    </div>
                ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Environment Info</h4>
                <div className="text-sm text-blue-700">
                    <div>API Base URL: {import.meta.env.VITE_API_BASE_URL}</div>
                    <div>Current URL: {window.location.href}</div>
                    <div>User Agent: {navigator.userAgent}</div>
                </div>
            </div>
            
            <button 
                onClick={runAllTests}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Retest APIs
            </button>
        </div>
    );
};

export default ApiDebug;