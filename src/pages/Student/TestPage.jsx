import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  Clock, AlertCircle, CheckCircle, 
  XCircle, ChevronLeft, ChevronRight,
  Flag, Save, Send, BarChart
} from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const TestPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchTest();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testId]);

  const fetchTest = async () => {
    try {
      const response = await api.get(`/student/tests/${testId}`);
      setTest(response.data.test);
      setQuestions(response.data.questions);
      setTimeLeft(response.data.test.duration_minutes * 60);
    } catch (error) {
      console.error('Error fetching test:', error);
      navigate('/student/courses');
    } finally {
      setLoading(false);
    }
  };

  const startTest = async () => {
    try {
      const response = await api.post(`/student/tests/${testId}/start`);
      setTestStarted(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      alert('Error starting test: ' + error.response?.data?.message);
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const toggleFlag = (questionId) => {
    const newFlagged = new Set(flagged);
    if (newFlagged.has(questionId)) {
      newFlagged.delete(questionId);
    } else {
      newFlagged.add(questionId);
    }
    setFlagged(newFlagged);
  };

  const handleQuestionNav = (index) => {
    setCurrentQuestion(index);
  };

  const handleSubmit = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (!window.confirm('Are you sure you want to submit the test?')) {
      return;
    }

    setSubmitting(true);
    
    try {
      const response = await api.post(`/student/tests/${testId}/submit`, {
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          question_id: parseInt(questionId),
          selected_answer: answer
        }))
      });
      
      navigate(`/student/tests/${testId}/result`, {
        state: { result: response.data }
      });
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('Error submitting test. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center border-b pb-4">
            {test.title}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
                Instructions
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Total Questions: <span className="font-semibold">{test.total_questions}</span></span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Duration: <span className="font-semibold">{test.duration_minutes} minutes</span></span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Passing Score: <span className="font-semibold">{test.passing_score}%</span></span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Each question carries equal marks</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">There is no negative marking</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">You cannot go back after submitting</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Test will auto-submit when time ends</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
                Important Notes
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-gray-700">Do not refresh the page during the test</p>
                </div>
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-gray-700">Ensure stable internet connection</p>
                </div>
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-gray-700">Use the flag feature to mark questions for review</p>
                </div>
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-gray-700">You can navigate between questions anytime</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-6 border-t">
            <button 
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
            <button 
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
              onClick={startTest}
            >
              Start Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Test Header */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-900">{test.title}</h2>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          
          <div className="flex items-center space-x-3 bg-red-50 px-4 py-2 rounded-lg">
            <Clock className="w-5 h-5 text-red-600" />
            <span className={`text-2xl font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-gray-900'}`}>
              {formatTime(timeLeft)}
            </span>
            {timeLeft < 300 && (
              <AlertCircle className="w-5 h-5 text-red-600 animate-pulse" />
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Question Navigator */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Questions</h4>
            <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-4 gap-2 mb-6">
              {questions.map((question, index) => (
                <button
                  key={question.id}
                  className={`relative h-10 rounded-lg flex items-center justify-center font-medium transition-all
                    ${index === currentQuestion 
                      ? 'bg-blue-600 text-white ring-2 ring-blue-300' 
                      : answers[question.id] 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                    ${flagged.has(question.id) ? 'ring-2 ring-amber-300 ring-offset-1' : ''}
                  `}
                  onClick={() => handleQuestionNav(index)}
                >
                  {index + 1}
                  {flagged.has(question.id) && (
                    <Flag className="absolute -top-1 -right-1 w-3 h-3 text-amber-500" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Answered</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-amber-300 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Flagged</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Current</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Question Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-900">Question {currentQuestion + 1}</h3>
              <button 
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                  ${flagged.has(currentQuestionData.id) 
                    ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                onClick={() => toggleFlag(currentQuestionData.id)}
              >
                <Flag className="w-4 h-4" />
                <span>{flagged.has(currentQuestionData.id) ? 'Flagged' : 'Flag for Review'}</span>
              </button>
            </div>
            
            <div className="mb-8">
              <p className="text-lg text-gray-800 leading-relaxed">
                {currentQuestionData.question_text}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {['a', 'b', 'c', 'd'].map((option) => (
                <div 
                  key={option}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-sm
                    ${answers[currentQuestionData.id] === option 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                  onClick={() => handleAnswerSelect(currentQuestionData.id, option)}
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-lg mr-4 font-bold
                      ${answers[currentQuestionData.id] === option 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {option.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">
                        {currentQuestionData[`option_${option}`]}
                      </p>
                    </div>
                    {answers[currentQuestionData.id] === option && (
                      <CheckCircle className="w-5 h-5 text-green-500 ml-3" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm font-medium">
                Marks: {currentQuestionData.marks}
              </span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button 
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleQuestionNav(currentQuestion - 1)}
              disabled={currentQuestion === 0}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button 
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => handleAnswerSelect(currentQuestionData.id, null)}
              >
                Clear Response
              </button>
              
              {currentQuestion < questions.length - 1 ? (
                <button 
                  className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => handleQuestionNav(currentQuestion + 1)}
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  className="flex items-center space-x-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  <span>{submitting ? 'Submitting...' : 'Submit Test'}</span>
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-3 lg:col-start-1 lg:row-start-2 xl:col-span-1 xl:col-start-3 xl:row-start-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Test Summary</h4>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Answered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.keys(answers).length}/{questions.length}
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Flagged</p>
                <p className="text-2xl font-bold text-gray-900">{flagged.size}</p>
              </div>
              <div className={`p-4 rounded-lg ${timeLeft < 300 ? 'bg-red-50' : 'bg-blue-50'}`}>
                <p className="text-sm text-gray-600 mb-1">Time Left</p>
                <p className={`text-2xl font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatTime(timeLeft)}
                </p>
              </div>
            </div>

            {timeLeft < 300 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 animate-pulse" />
                  <span className="text-red-700 font-medium">Less than 5 minutes remaining!</span>
                </div>
              </div>
            )}

            <button 
              className="w-full flex items-center justify-center space-x-2 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <LoadingSpinner small />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Test</span>
                </>
              )}
            </button>

            <button className="w-full flex items-center justify-center space-x-2 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Save className="w-4 h-4" />
              <span>Save Progress</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;