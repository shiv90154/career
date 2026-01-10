import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
  }, []);

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchTests = async () => {
  try {
    setLoading(true);

    const response = await axios.get('/api/student/tests');

    console.log("TESTS API RESPONSE:", response.data);

    // ✅ Normalize response safely
    const data =
      Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.tests)
        ? response.data.tests
        : Array.isArray(response.data.data)
        ? response.data.data
        : [];

    setTests(data);
  } catch (err) {
    console.error(err);
    setError('Failed to load tests');
    showNotification('Failed to load tests', 'error');
    setTests([]); // 🛡️ never allow non-array
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="container mx-auto px-4 py-8">
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          notification.type === 'error' ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'
        } border`}>
          {notification.message}
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Tests</h2>
      
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Marks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
  {tests.length > 0 ? (
    tests.map((test) => (
      <tr key={test.id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">
            {test.test_name}
          </div>
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {test.subject}
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {test.duration} minutes
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {test.total_marks}
        </td>

        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              test.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : test.status === 'in_progress'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {test.status?.replace('_', ' ')}
          </span>
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {test.score ?? '-'}
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          {test.status === 'not_started' && (
            <button
              onClick={() => startTest(test.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Start Test
            </button>
          )}

          {test.status === 'in_progress' && (
            <button
              onClick={() => startTest(test.id)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md"
            >
              Continue
            </button>
          )}

          {test.status === 'completed' && (
            <button
              onClick={() => viewResult(test.attempt_id)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              View Result
            </button>
          )}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" className="text-center py-6 text-gray-500">
        No tests available
      </td>
    </tr>
  )}
</tbody>

            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTests;