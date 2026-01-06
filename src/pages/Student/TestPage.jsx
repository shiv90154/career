import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Clock, AlertCircle, CheckCircle, 
  XCircle, ChevronLeft, ChevronRight,
  Flag, Save, Send, BarChart,
  Shield, Trophy, Zap, Eye,
  Bookmark, HelpCircle, Timer,
  Target, Lock, Unlock,
  RotateCcw, SkipForward,
  Maximize2, Minimize2
} from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import Confetti from 'react-confetti';

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
  const [fullscreen, setFullscreen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [warningAcknowledged, setWarningAcknowledged] = useState(false);
  const timerRef = useRef(null);
  const containerRef = useRef(null);

  // Load test data
  useEffect(() => {
    fetchTest();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      document.exitFullscreen?.();
    };
  }, [testId]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!testStarted) return;

    const handleKeyDown = (e) => {
      // Prevent default for test navigation shortcuts
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      switch(e.key) {
        case '1':
        case '2':
        case '3':
        case '4':
          if (e.key >= '1' && e.key <= '4') {
            const optionIndex = parseInt(e.key) - 1;
            const options = ['a', 'b', 'c', 'd'];
            handleAnswerSelect(questions[currentQuestion]?.id, options[optionIndex]);
          }
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFlag(questions[currentQuestion]?.id);
          break;
        case 'ArrowLeft':
          if (currentQuestion > 0) {
            handleQuestionNav(currentQuestion - 1);
          }
          break;
        case 'ArrowRight':
          if (currentQuestion < questions.length - 1) {
            handleQuestionNav(currentQuestion + 1);
          }
          break;
        case ' ':
          e.preventDefault();
          if (currentQuestion < questions.length - 1) {
            handleQuestionNav(currentQuestion + 1);
          }
          break;
        case 'Escape':
          if (fullscreen) {
            setFullscreen(false);
            document.exitFullscreen?.();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [testStarted, currentQuestion, questions, fullscreen]);

  const fetchTest = async () => {
    try {
      const response = await api.get(`/student/tests/${testId}`);
      setTest(response.data.test);
      setQuestions(response.data.questions);
      setTimeLeft(response.data.test.duration_minutes * 60);
      
      // Load saved answers if any
      const saved = localStorage.getItem(`test_${testId}_answers`);
      if (saved) {
        setAnswers(JSON.parse(saved));
      }
      
      const savedFlagged = localStorage.getItem(`test_${testId}_flagged`);
      if (savedFlagged) {
        setFlagged(new Set(JSON.parse(savedFlagged)));
      }
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
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      // Auto-save every 30 seconds
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
        
        // Auto-save progress
        saveProgress();
      }, 1000);

      // Request fullscreen
      if (containerRef.current && !fullscreen) {
        try {
          await containerRef.current.requestFullscreen();
          setFullscreen(true);
        } catch (err) {
          console.log('Fullscreen not supported');
        }
      }
    } catch (error) {
      alert('Error starting test: ' + error.response?.data?.message);
    }
  };

  const handleAnswerSelect = useCallback((questionId, answer) => {
    setAnswers(prev => {
      const newAnswers = { ...prev, [questionId]: answer };
      localStorage.setItem(`test_${testId}_answers`, JSON.stringify(newAnswers));
      return newAnswers;
    });
  }, [testId]);

  const toggleFlag = useCallback((questionId) => {
    setFlagged(prev => {
      const newFlagged = new Set(prev);
      if (newFlagged.has(questionId)) {
        newFlagged.delete(questionId);
      } else {
        newFlagged.add(questionId);
      }
      localStorage.setItem(`test_${testId}_flagged`, JSON.stringify([...newFlagged]));
      return newFlagged;
    });
  }, [testId]);

  const handleQuestionNav = (index) => {
    setCurrentQuestion(index);
  };

  const saveProgress = () => {
    localStorage.setItem(`test_${testId}_answers`, JSON.stringify(answers));
    localStorage.setItem(`test_${testId}_flagged`, JSON.stringify([...flagged]));
    localStorage.setItem(`test_${testId}_time`, timeLeft.toString());
  };

  const clearAnswer = (questionId) => {
    setAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[questionId];
      localStorage.setItem(`test_${testId}_answers`, JSON.stringify(newAnswers));
      return newAnswers;
    });
  };

  const handleSubmit = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Show confirmation modal
    const confirmed = await showConfirmationModal();
    if (!confirmed) {
      // Restart timer if user cancels
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
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
      
      // Clear saved data
      localStorage.removeItem(`test_${testId}_answers`);
      localStorage.removeItem(`test_${testId}_flagged`);
      localStorage.removeItem(`test_${testId}_time`);
      
      navigate(`/student/tests/${testId}/result`, {
        state: { result: response.data }
      });
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('Error submitting test. Please try again.');
      setSubmitting(false);
    }
  };

  const showConfirmationModal = () => {
    return new Promise((resolve) => {
      const unanswered = questions.length - Object.keys(answers).length;
      const flaggedCount = flagged.size;
      
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
      modal.innerHTML = `
        <div class="bg-white rounded-2xl p-6 max-w-md w-full">
          <div class="text-center mb-6">
            <div class="w-16 h-16 mx-auto bg-yellow-50 rounded-full flex items-center justify-center mb-4">
              <AlertCircle class="w-8 h-8 text-yellow-600" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Submit Test?</h3>
            <p class="text-gray-600">Are you sure you want to submit the test?</p>
          </div>
          
          <div class="bg-gray-50 rounded-xl p-4 mb-6">
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900">${questions.length}</div>
                <div class="text-sm text-gray-600">Total Questions</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600">${Object.keys(answers).length}</div>
                <div class="text-sm text-gray-600">Answered</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-red-600">${unanswered}</div>
                <div class="text-sm text-gray-600">Unanswered</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">${flaggedCount}</div>
                <div class="text-sm text-gray-600">Flagged</div>
              </div>
            </div>
          </div>
          
          <div class="flex gap-3">
            <button id="cancelBtn" class="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium">
              Cancel
            </button>
            <button id="submitBtn" class="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium">
              Submit Test
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      document.getElementById('cancelBtn').onclick = () => {
        document.body.removeChild(modal);
        resolve(false);
      };
      
      document.getElementById('submitBtn').onclick = () => {
        document.body.removeChild(modal);
        resolve(true);
      };
      
      // Close on outside click
      modal.onclick = (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
          resolve(false);
        }
      };
    });
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft < 60) return 'text-red-600 bg-red-50 border-red-200';
    if (timeLeft < 300) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getQuestionStatus = (index) => {
    const questionId = questions[index]?.id;
    if (answers[questionId]) return 'answered';
    if (flagged.has(questionId)) return 'flagged';
    return 'unanswered';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {test?.title}
            </h1>
            <p className="text-gray-600">Get ready for your assessment</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Test Overview */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Test Overview</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-700 mb-1">Total Questions</p>
                  <p className="text-2xl font-bold text-gray-900">{test?.total_questions}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
                  <p className="text-sm text-green-700 mb-1">Duration</p>
                  <p className="text-2xl font-bold text-gray-900">{test?.duration_minutes} min</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
                  <p className="text-sm text-purple-700 mb-1">Passing Score</p>
                  <p className="text-2xl font-bold text-gray-900">{test?.passing_score}%</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600">Each question carries equal marks</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600">No negative marking for wrong answers</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600">You can navigate between questions anytime</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600">Use flag feature to mark questions for review</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600">Do not refresh or close the browser during test</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats & Actions */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Max Marks</span>
                    <span className="font-semibold text-gray-900">{test?.total_marks}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Difficulty</span>
                    <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full">
                      {test?.difficulty || 'Medium'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-semibold text-gray-900">{test?.category}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">Test Security</h3>
                </div>
                <p className="text-sm opacity-90 mb-6">
                  This test is monitored. Any suspicious activity may result in disqualification.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="w-4 h-4" />
                  <span>Secure Browser Recommended</span>
                </div>
              </div>
            </div>
          </div>

          {/* Important Warnings */}
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Important Warnings</h3>
                <div className="space-y-2 text-gray-700">
                  <p>• Test will auto-submit when time ends</p>
                  <p>• Ensure stable internet connection throughout</p>
                  <p>• Results are final once submitted</p>
                  <p>• You cannot revisit after submission</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              Go Back to Courses
            </button>
            <button
              onClick={startTest}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg font-medium"
            >
              <Zap className="w-5 h-5" />
              Start Test Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const totalAnswered = Object.keys(answers).length;
  const totalFlagged = flagged.size;
  const percentageComplete = Math.round((totalAnswered / questions.length) * 100);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
    >
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      {/* Test Header */}
      <div className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setFullscreen(!fullscreen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title={fullscreen ? 'Exit Fullscreen (ESC)' : 'Enter Fullscreen'}
              >
                {fullscreen ? (
                  <Minimize2 className="w-5 h-5 text-gray-600" />
                ) : (
                  <Maximize2 className="w-5 h-5 text-gray-600" />
                )}
              </button>
              
              <div>
                <h2 className="text-lg font-bold text-gray-900 truncate">{test?.title}</h2>
                <p className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600">Answered</div>
                  <div className="font-bold text-gray-900">
                    {totalAnswered}/{questions.length}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Flagged</div>
                  <div className="font-bold text-gray-900">{totalFlagged}</div>
                </div>
              </div>

              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${getTimeColor()} transition-all duration-300`}>
                <Clock className="w-5 h-5" />
                <span className="text-lg font-bold tabular-nums">{formatTime(timeLeft)}</span>
                {timeLeft < 300 && (
                  <AlertCircle className="w-4 h-4 animate-pulse" />
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">Test Progress</span>
              <span className="text-sm font-semibold text-gray-900">{percentageComplete}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${percentageComplete}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Test Container */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Question Navigator */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Question Navigator</h3>
                <span className="text-sm text-gray-500">
                  {totalAnswered}/{questions.length}
                </span>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-5 gap-2 mb-6">
                {questions.map((question, index) => {
                  const status = getQuestionStatus(index);
                  const isCurrent = index === currentQuestion;
                  
                  return (
                    <button
                      key={question.id}
                      onClick={() => handleQuestionNav(index)}
                      className={`
                        relative w-full aspect-square rounded-xl transition-all duration-200
                        ${isCurrent ? 'ring-2 ring-offset-2 ring-blue-500 transform scale-105' : ''}
                        ${status === 'answered' ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' :
                          status === 'flagged' ? 'bg-gradient-to-br from-yellow-500 to-amber-600 text-white' :
                          'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      <span className="font-medium">{index + 1}</span>
                      {status === 'flagged' && (
                        <Flag className="absolute -top-1 -right-1 w-3 h-3" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600"></div>
                    <span className="text-sm text-gray-600">Answered</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {totalAnswered}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600"></div>
                    <span className="text-sm text-gray-600">Flagged</span>
                  </div>
                  <span className="font-medium text-gray-900">{totalFlagged}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <span className="text-sm text-gray-600">Unanswered</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {questions.length - totalAnswered}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Keyboard Shortcuts</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-white rounded border">1-4</kbd>
                    <span className="text-gray-600">Select option</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-white rounded border">F</kbd>
                    <span className="text-gray-600">Flag question</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-white rounded border">← →</kbd>
                    <span className="text-gray-600">Navigate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-white rounded border">Space</kbd>
                    <span className="text-gray-600">Next question</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Question Area */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-medium">
                    Question {currentQuestion + 1}
                  </div>
                  <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {currentQuestionData?.marks || 1} Mark{currentQuestionData?.marks > 1 ? 's' : ''}
                  </div>
                </div>
                
                <button
                  onClick={() => toggleFlag(currentQuestionData?.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    flagged.has(currentQuestionData?.id)
                      ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Flag className="w-4 h-4" />
                  {flagged.has(currentQuestionData?.id) ? 'Flagged' : 'Flag'}
                </button>
              </div>

              {/* Question Text */}
              <div className="mb-8">
                <div className="prose max-w-none">
                  <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {currentQuestionData?.question_text}
                  </p>
                </div>
                
                {currentQuestionData?.question_image && (
                  <div className="mt-4">
                    <img 
                      src={currentQuestionData.question_image}
                      alt="Question"
                      className="max-w-full rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {['a', 'b', 'c', 'd'].map((option) => (
                  <div
                    key={option}
                    onClick={() => handleAnswerSelect(currentQuestionData?.id, option)}
                    className={`
                      relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                      ${answers[currentQuestionData?.id] === option
                        ? 'border-blue-500 bg-blue-50 transform scale-[1.02]'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center font-bold
                        ${answers[currentQuestionData?.id] === option
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                        }
                      `}>
                        {option.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 whitespace-pre-wrap">
                          {currentQuestionData?.[`option_${option}`]}
                        </p>
                      </div>
                      {answers[currentQuestionData?.id] === option && (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Question Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => clearAnswer(currentQuestionData?.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear Answer
                </button>
                <button
                  onClick={() => {
                    if (currentQuestion < questions.length - 1) {
                      handleQuestionNav(currentQuestion + 1);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  Skip
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => handleQuestionNav(currentQuestion - 1)}
                disabled={currentQuestion === 0}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous Question
              </button>
              
              {currentQuestion < questions.length - 1 ? (
                <button
                  onClick={() => handleQuestionNav(currentQuestion + 1)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:-translate-y-0.5 font-medium"
                >
                  Next Question
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg font-medium"
                >
                  {submitting ? (
                    <>
                      <LoadingSpinner small />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Test
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right: Test Summary */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Questions</span>
                    <span className="font-bold text-gray-900">{questions.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Time Remaining</span>
                    <span className={`font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-gray-900'}`}>
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Completion</span>
                    <span className="font-bold text-gray-900">{percentageComplete}%</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={saveProgress}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
                  >
                    <Save className="w-4 h-4" />
                    Save Progress
                  </button>
                </div>
              </div>

              {/* Time Warning */}
              {timeLeft < 300 && !warningAcknowledged && (
                <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Time Running Out!</h4>
                      <p className="text-sm text-gray-700 mb-4">
                        Only {formatTime(timeLeft)} remaining. Complete flagged questions first.
                      </p>
                      <button
                        onClick={() => setWarningAcknowledged(true)}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                <h4 className="font-semibold mb-4">Quick Actions</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      // Jump to first flagged question
                      const firstFlagged = questions.findIndex(q => flagged.has(q.id));
                      if (firstFlagged !== -1) handleQuestionNav(firstFlagged);
                    }}
                    className="w-full flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <span>Review Flagged</span>
                    <Flag className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      // Jump to first unanswered question
                      const firstUnanswered = questions.findIndex(q => !answers[q.id]);
                      if (firstUnanswered !== -1) handleQuestionNav(firstUnanswered);
                    }}
                    className="w-full flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <span>Go to Unanswered</span>
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg font-medium"
              >
                {submitting ? (
                  <>
                    <LoadingSpinner small white />
                    Submitting Test...
                  </>
                ) : (
                  <>
                    <Trophy className="w-5 h-5" />
                    Final Submit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;