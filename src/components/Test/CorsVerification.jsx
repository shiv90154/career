import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const CorsVerification = () => {
    const [testResults, setTestResults] = useState({
        corsTest: null,
        coursesTest: null,
        loading: true,
        error: null
    });

    useEffect(() => {
        runTests();
    }, []);

    const runTests = async () => {
        setTestResults(prev => ({ ...prev, loading: true, error: null }));
        
        try {
            // Test 1: Basic CORS test
            console.log('Testing CORS...');
            const corsResponse = await api.get('/test-cors-final.php');
            console.log('CORS test response:', corsResponse.data);
            
            // Test 2: Courses API test
            console.log('Testing Courses API...');
            const coursesResponse = await api.get('/courses/index.php?limit=5');
            console.log('Courses API response:', coursesResponse.data);
            
            setTestResults({
                corsTest: corsResponse.data,
                coursesTest: coursesResponse.data,
                loading: false,
                error: null
            });
            
        } catch (error) {
            console.error('Test failed:', error);
            setTestResults(prev => ({
                ...prev,
                loading: false,
                error: error.message || 'Test failed'
            }));
        }
    };

    if (testResults.loading) {
        return (
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    🧪 Running CORS Tests...
                </h3>
                <div className="animate-pulse">Testing API connectivity...</div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                🧪 CORS Verification Results
            </h3>
            
            {testResults.error ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800">❌ Test Failed</h4>
                    <p className="text-red-700 mt-1">{testResults.error}</p>
                    <button 
                        onClick={runTests}
                        className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Retry Tests
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* CORS Test Result */}
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-semibold text-green-800">✅ CORS Test</h4>
                        <p className="text-green-700 mt-1">
                            Status: {testResults.corsTest?.success ? 'Success' : 'Failed'}
                        </p>
                        <p className="text-sm text-green-600 mt-1">
                            Message: {testResults.corsTest?.message}
                        </p>
                    </div>
                    
                    {/* Courses API Test Result */}
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-semibold text-green-800">✅ Courses API Test</h4>
                        <p className="text-green-700 mt-1">
                            Status: {testResults.coursesTest?.success ? 'Success' : 'Failed'}
                        </p>
                        <p className="text-sm text-green-600 mt-1">
                            Courses loaded: {testResults.coursesTest?.courses?.length || 0}
                        </p>
                    </div>
                    
                    <button 
                        onClick={runTests}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Run Tests Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default CorsVerification;