import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ApiTest = () => {
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        testAllApis();
    }, []);

    const testAllApis = async () => {
        const endpoints = [
            { name: 'Courses', url: '/courses/index.php', key: 'courses' },
            { name: 'Tests', url: '/tests/index.php', key: 'tests' },
            { name: 'Current Affairs', url: '/current-affairs/index.php', key: 'current_affairs' },
            { name: 'Blogs', url: '/blogs/index.php', key: 'blogs' }
        ];

        const testResults = {};

        for (const endpoint of endpoints) {
            try {
                console.log(`Testing ${endpoint.name}...`);
                const response = await api.get(endpoint.url);
                console.log(`${endpoint.name} response:`, response.data);
                
                if (response.data.success && response.data[endpoint.key]) {
                    testResults[endpoint.name] = {
                        status: 'success',
                        count: response.data[endpoint.key].length,
                        data: response.data[endpoint.key]
                    };
                } else {
                    testResults[endpoint.name] = {
                        status: 'error',
                        message: 'Unexpected response structure',
                        data: response.data
                    };
                }
            } catch (error) {
                console.error(`${endpoint.name} error:`, error);
                testResults[endpoint.name] = {
                    status: 'error',
                    message: error.message,
                    error: error
                };
            }
        }

        setResults(testResults);
        setLoading(false);
    };

    if (loading) {
        return <div className="p-4">Testing APIs...</div>;
    }

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">API Test Results</h1>
            
            {Object.entries(results).map(([name, result]) => (
                <div key={name} className="mb-4 p-4 border rounded">
                    <h3 className="text-lg font-semibold mb-2">{name}</h3>
                    
                    {result.status === 'success' ? (
                        <div className="text-green-600">
                            ✅ Success: {result.count} items loaded
                            <details className="mt-2">
                                <summary className="cursor-pointer">View Data</summary>
                                <pre className="mt-2 p-2 bg-gray-100 text-xs overflow-auto">
                                    {JSON.stringify(result.data, null, 2)}
                                </pre>
                            </details>
                        </div>
                    ) : (
                        <div className="text-red-600">
                            ❌ Error: {result.message}
                            <details className="mt-2">
                                <summary className="cursor-pointer">View Details</summary>
                                <pre className="mt-2 p-2 bg-gray-100 text-xs overflow-auto">
                                    {JSON.stringify(result.error || result.data, null, 2)}
                                </pre>
                            </details>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ApiTest;