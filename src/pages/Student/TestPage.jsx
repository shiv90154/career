import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TestPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchTestData();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchTestData = async () => {
    try {
      const response = await axios.get(`/api/student/test/${attemptId}`);
      setTest(response.data.test);
      setQuestions(response.data.questions);
      setTimeLeft(response.data.test.duration * 60);
      startTimer();
    } catch (err) {
      showNotification('Failed to load test', 'error');
      navigate('/student/my-tests');
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitTest = async () => {
    try {
      const answerData = Object.keys(answers).map(questionId => ({
        question_id: parseInt(questionId),
        selected: answers[questionId]
      }));

      await axios.post(`/api/student/test/${attemptId}/submit`, {
        attempt_id: parseInt(attemptId),
        answers: answerData
      });

      showNotification('Test submitted successfully!', 'success');
      setShowSubmitModal(false);
      navigate(`/student/test-result/${attemptId}`);
    } catch (err) {
      showNotification('Failed to submit test', 'error');
    }
  };

  const handleAutoSubmit = () => {
    showNotification('Time is up! Submitting test...', 'info');
    handleSubmitTest();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          notification.type === 'error' 
            ? 'bg-red-100 border-red-400 text-red-700' 
            : notification.type === 'success'
            ? 'bg-green-100 border-green-400 text-green-700'
            : 'bg-blue-100 border-blue-400 text-blue-700'
        } border`}>
          {notification.message}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">{test?.test_name}</h2>
        <div className="bg-red-600 text-white px-6 py-3 rounded-lg">
          <div className="text-2xl font-bold">{formatTime(timeLeft)}</div>
          <div className="text-sm">Time Remaining</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="font-semibold text-blue-600">
            {questions[currentQuestion]?.marks} marks
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <div className="text-center text-sm text-gray-500 mt-1">
            {currentQuestion + 1}/{questions.length} questions
          </div>
        </div>

        {/* Question Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {questions[currentQuestion]?.question_text}
          </h3>
          
          {questions[currentQuestion]?.options && (
            <div className="space-y-3">
              {JSON.parse(questions[currentQuestion].options).map((option, index) => {
                const letter = String.fromCharCode(65 + index);
                const isSelected = answers[questions[currentQuestion].id] === letter;
                
                return (
                  <div 
                    key={index}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleAnswerSelect(questions[currentQuestion].id, letter)}
                  >
                    <div className="flex items-center">
                      <div className={`h-5 w-5 rounded-full border flex items-center justify-center mr-3 ${
                        isSelected ? 'border-blue-500' : 'border-gray-400'
                      }`}>
                        {isSelected && (
                          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-gray-700">
                          {letter}. 
                        </span> 
                        <span className="ml-1">{option}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-t pt-6 gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`px-6 py-2 rounded-md ${
              currentQuestion === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            Previous
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
            >
              Submit Test
            </button>
            
            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Finish Test
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Submit Test
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
                Are you sure you want to submit the test? This action cannot be undone.
              </div>
              <div className="bg-gray-50 p-4 rounded mb-6">
                <p className="text-gray-600">
                  Questions answered: <span className="font-bold">{Object.keys(answers).length}</span> / <span className="font-bold">{questions.length}</span>
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitTest}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Submit Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPage;