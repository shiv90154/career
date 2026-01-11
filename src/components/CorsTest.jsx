import React, { useState } from 'react';
import api from '../services/api';

const CorsTest = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const addResult = (test, result) => {
        setResults(prev => [...prev, { test, result, timestamp: new Date().toLocaleTimeString() }]);
    };

    const testBasicCors = async () => {
        try {
            const response = await api.get('/comprehensive-cors-test.php?test=basic');
            addResult('Basic CORS', { success: true, data: response.data });
        } catch (error) {
            addResult('Basic CORS', { success: false, error: error.message });
        }
    };

    const testPreflightCors = async () => {
        try {
            const response = await api.post('/comprehensive-cors-test.php?test=preflight', {
                test_data: 'preflight test'
            });
            addResult('Preflight CORS', { success: true, data: response.data });
        } catch (error) {
            addResult('Preflight CORS', { success: false, error: error.message });
        }
    };

    const testCredentialsCors = async () => {
        try {
            const response = await api.get('/comprehensive-cors-test.php?test=credentials');
            addResult('Credentials CORS', { success: true, data: response.data });
        } catch (error) {
            addResult('Credentials CORS', { success: false, error: error.message });
        }
    };

    const testCustomHeaders = async () => {
        try {
            const response = await api.get('/comprehensive-cors-test.php?test=headers', {
                headers: {
                    'X-Custom-Header': 'test-value',
                    'X-Test-Header': 'another-test'
                }
            });
            addResult('Custom Headers', { success: true, data: response.data });
        } catch (error) {
            addResult('Custom Headers', { success: false, error: error.message });
        }
    };

    const testDirectFetch = async () => {
        try {
            const response = await fetch('http://localhost/career-path-api/api/comprehensive-cors-test.php?test=basic', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            const data = await response.json();
            addResult('Direct Fetch', { success: true, data });
        } catch (error) {
            addResult('Direct Fetch', { success: false, error: error.message });
        }
    };

    const runAllTests = async () => {
        setLoading(true);
        setResults([]);

        await testBasicCors();
        await new Promise(resolve => setTimeout(resolve, 500));

        await testDirectFetch();
        await new Promise(resolve => setTimeout(resolve, 500));

        await testPreflightCors();
        await new Promise(resolve => setTimeout(resolve, 500));

        await testCredentialsCors();
        await new Promise(resolve => setTimeout(resolve, 500));

        await testCustomHeaders();

        setLoading(false);
    };

    const clearResults = () => {
        setResults([]);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">CORS Test Suite</h2>

            <div className="mb-6 space-x-2">
                <button
                    onClick={runAllTests}
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? 'Running Tests...' : 'Run All Tests'}
                </button>

                <button
                    onClick={testBasicCors}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Basic CORS
                </button>

                <button
                    onClick={testDirectFetch}
                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                >
                    Direct Fetch
                </button>

                <button
                    onClick={clearResults}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Clear Results
                </button>
            </div>

            <div className="space-y-4">
                {results.map((result, index) => (
                    <div key={index} className={`p-4 rounded border ${result.result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">{result.test}</h3>
                            <span className="text-sm text-gray-500">{result.timestamp}</span>
                        </div>

                        <div className={`text-sm ${result.result.success ? 'text-green-700' : 'text-red-700'}`}>
                            Status: {result.result.success ? 'SUCCESS' : 'FAILED'}
                        </div>

                        {result.result.error && (
                            <div className="text-red-600 text-sm mt-1">
                                Error: {result.result.error}
                            </div>
                        )}

                        {result.result.data && (
                            <details className="mt-2">
                                <summary className="cursor-pointer text-sm font-medium">Response Data</summary>
                                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                                    {JSON.stringify(result.result.data, null, 2)}
                                </pre>
                            </details>
                        )}
                    </div>
                ))}
            </div>

            {results.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                    No test results yet. Click "Run All Tests" to start testing CORS configuration.
                </div>
            )}
        </div>
    );
};

export default CorsTest;