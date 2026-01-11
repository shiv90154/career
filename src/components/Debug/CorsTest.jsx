import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const CorsTest = () => {
    const [testResults, setTestResults] = useState({});
    const [loading, setLoading] = useState(false);

    const runCorsTest = async () => {
        setLoading(true);
        const results = {};

        try {
            // Test 1: Basic CORS test
            console.log('Testing CORS endpoint...');
            const corsResponse = await api.get('/test-cors.php');
            results.corsTest = {
                success: true,
                data: corsResponse.data,
                status: corsResponse.status
            };
        } catch (error) {
            console.error('CORS test failed:', error);
            results.corsTest = {
                success: false,
                error: error.message,
                details: error
            };
        }

        try {
            // Test 2: Courses endpoint
            console.log('Testing courses endpoint...');
            const coursesResponse = await api.get('/courses/index.php');
            results.coursesTest = {
                success: true,
                data: coursesResponse.data,
                status: coursesResponse.status
            };
        } catch (error) {
            console.error('Courses test failed:', error);
            results.coursesTest = {
                success: false,
                error: error.message,
                details: error
            };
        }

        try {
            // Test 3: Blogs endpoint
            console.log('Testing blogs endpoint...');
            const blogsResponse = await api.get('/blogs/index.php');
            results.blogsTest = {
                success: true,
                data: blogsResponse.data,
                status: blogsResponse.status
            };
        } catch (error) {
            console.error('Blogs test failed:', error);
            results.blogsTest = {
                success: false,
                error: error.message,
                details: error
            };
        }

        setTestResults(results);
        setLoading(false);
    };

    useEffect(() => {
        runCorsTest();
    }, []);

    const TestResult = ({ title, result }) => (
        <div className="mb-4 p-4 border rounded-lg">
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            {result ? (
                <div>
                    <div className={`p-2 rounded ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        Status: {result.success ? '✅ SUCCESS' : '❌ FAILED'}
                    </div>
                    {result.success ? (
                        <div className="mt-2">
                            <p><strong>HTTP Status:</strong> {result.status}</p>
                            <details className="mt-2">
                                <summary className="cursor-pointer font-medium">Response Data</summary>
                                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                                    {JSON.stringify(result.data, null, 2)}
                                </pre>
                            </details>
                        </div>
                    ) : (
                        <div className="mt-2">
                            <p><strong>Error:</strong> {result.error}</p>
                            <details className="mt-2">
                                <summary className="cursor-pointer font-medium">Error Details</summary>
                                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                                    {JSON.stringify(result.details, null, 2)}
                                </pre>
                            </details>
                        </div>
                    )}
                </div>
            ) : (
                <div className="p-2 bg-gray-100 rounded">Loading...</div>
            )}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">🔍 CORS & API Connection Test</h1>
                <p className="text-gray-600">Testing API connectivity and CORS configuration</p>
                <button 
                    onClick={runCorsTest}
                    disabled={loading}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Testing...' : 'Run Tests Again'}
                </button>
            </div>

            <div className="space-y-4">
                <TestResult title="1. CORS Configuration Test" result={testResults.corsTest} />
                <TestResult title="2. Courses API Test" result={testResults.coursesTest} />
                <TestResult title="3. Blogs API Test" result={testResults.blogsTest} />
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-bold text-lg mb-2">🛠️ Troubleshooting Tips</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Make sure XAMPP is running and Apache/MySQL services are started</li>
                    <li>Verify that the API files are in the correct location: <code>C:\xampp\htdocs\career-path-api\</code></li>
                    <li>Check that the database is created and populated</li>
                    <li>Ensure no firewall is blocking localhost connections</li>
                    <li>Try accessing the API directly: <a href="http://localhost/career-path-api/api/test-cors.php" target="_blank" className="text-blue-600 underline">http://localhost/career-path-api/api/test-cors.php</a></li>
                </ul>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-bold text-lg mb-2">📋 Current Configuration</h3>
                <ul className="text-sm space-y-1">
                    <li><strong>Frontend URL:</strong> {window.location.origin}</li>
                    <li><strong>API Base URL:</strong> http://localhost/career-path-api/api</li>
                    <li><strong>With Credentials:</strong> true</li>
                    <li><strong>Timeout:</strong> 30 seconds</li>
                </ul>
            </div>
        </div>
    );
};

export default CorsTest;