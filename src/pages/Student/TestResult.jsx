import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TestResult = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResult();
  }, [attemptId]);

  const fetchResult = async () => {
    try {
      const response = await axios.get(`/api/student/test-result/${attemptId}`);
      setResult(response.data.result);
      setAnswers(response.data.answers);
    } catch (err) {
      setError('Failed to load test result');
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = () => {
    navigate('/student/my-tests');
  };

  const calculatePercentage = () => {
    if (!result) return 0;
    return ((result.score / result.total_marks) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Result not found'}
        </div>
      </div>
    );
  }

  const percentage = calculatePercentage();
  const correctAnswers = answers.filter(a => a.is_correct).length;
  const incorrectAnswers = answers.length - correctAnswers;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Test Result</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Test Details Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Test Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Test Name:</span>
              <span className="font-medium">{result.test_name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Subject:</span>
              <span className="font-medium">{result.subject}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Date Taken:</span>
              <span className="font-medium">
                {new Date(result.end_time).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{result.duration} minutes</span>
            </div>
          </div>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Score Summary</h3>
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-6">
              {/* Circular Progress */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-800">
                    {result.score}/{result.total_marks}
                  </div>
                  <div className="text-xl font-semibold text-blue-600">
                    {percentage}%
                  </div>
                </div>
              </div>
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${percentage * 2.83} 283`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>
            <div className={`px-4 py-2 rounded-full text-white font-semibold ${
              result.score >= result.passing_marks 
                ? 'bg-green-500' 
                : 'bg-red-500'
            }`}>
              {result.score >= result.passing_marks ? 'Passed' : 'Failed'}
            </div>
            <div className="mt-4 text-gray-600">
              Passing Marks: {result.passing_marks}
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Score Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-700">{correctAnswers}</div>
            <div className="text-green-600">Correct Answers</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-700">{incorrectAnswers}</div>
            <div className="text-red-600">Incorrect Answers</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-700">{result.score}</div>
            <div className="text-blue-600">Total Score</div>
          </div>
        </div>
      </div>

      {/* Detailed Answers */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Detailed Answers</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Question
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Your Answer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Correct Answer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marks
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {answers.map((answer, index) => (
                <tr key={answer.question_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 max-w-xs truncate">{answer.question_text}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`font-medium ${
                      answer.is_correct ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {answer.selected_answer}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-green-600 font-medium">{answer.correct_answer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      answer.is_correct 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {answer.is_correct ? 'Correct' : 'Incorrect'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold">
                      {answer.marks_obtained}/{answer.marks}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={handleRetake}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
        >
          Back to My Tests
        </button>
        <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-md">
          Download Result
        </button>
      </div>
    </div>
  );
};

export default TestResult;