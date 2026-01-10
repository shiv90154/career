import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
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
      <div className="test-instructions">
        <div className="instructions-card">
          <h2>{test.title}</h2>
          
          <div className="test-info">
            <div className="info-section">
              <h3>Instructions</h3>
              <ul className="instructions-list">
                <li>Total Questions: {test.total_questions}</li>
                <li>Duration: {test.duration_minutes} minutes</li>
                <li>Passing Score: {test.passing_score}%</li>
                <li>Each question carries equal marks</li>
                <li>There is no negative marking</li>
                <li>You cannot go back after submitting</li>
                <li>Test will auto-submit when time ends</li>
              </ul>
            </div>

            <div className="info-section">
              <h3>Important Notes</h3>
              <div className="notes">
                <p><AlertCircle size={16} /> Do not refresh the page during the test</p>
                <p><AlertCircle size={16} /> Ensure stable internet connection</p>
                <p><AlertCircle size={16} /> Use the flag feature to mark questions for review</p>
                <p><AlertCircle size={16} /> You can navigate between questions anytime</p>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button 
              className="btn btn-outline"
              onClick={() => navigate(-1)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              Go Back to Courses
            </button>
            <button 
              className="btn btn-primary"
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
    <div className="test-page">
      {/* Test Header */}
      <div className="test-header">
        <div className="test-title">
          <h2>{test.title}</h2>
          <span className="question-count">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        
        <div className="test-timer">
          <Clock size={20} />
          <span className="time">{formatTime(timeLeft)}</span>
          <div className="timer-warning">
            {timeLeft < 300 && <AlertCircle size={16} color="#D90000" />}
          </div>
        </div>
      </div>

      <div className="test-container">
        {/* Left: Question Navigator */}
        <div className="question-navigator">
          <h4>Questions</h4>
          <div className="question-grid">
            {questions.map((question, index) => (
              <button
                key={question.id}
                className={`question-btn 
                  ${index === currentQuestion ? 'active' : ''}
                  ${answers[question.id] ? 'answered' : ''}
                  ${flagged.has(question.id) ? 'flagged' : ''}
                `}
                onClick={() => handleQuestionNav(index)}
              >
                {index + 1}
                {flagged.has(question.id) && (
                  <Flag size={10} />
                )}
              </button>
            ))}
          </div>
          
          <div className="legend">
            <div className="legend-item">
              <div className="answered"></div>
              <span>Answered</span>
            </div>
            <div className="legend-item">
              <div className="flagged"></div>
              <span>Flagged</span>
            </div>
            <div className="legend-item">
              <div className="current"></div>
              <span>Current</span>
            </div>
          </div>
        </div>

        {/* Center: Question Area */}
        <div className="question-area">
          <div className="question-card">
            <div className="question-header">
              <h3>Question {currentQuestion + 1}</h3>
              <button 
                className={`flag-btn ${flagged.has(currentQuestionData.id) ? 'active' : ''}`}
                onClick={() => toggleFlag(currentQuestionData.id)}
              >
                <Flag size={16} />
                {flagged.has(currentQuestionData.id) ? 'Flagged' : 'Flag for Review'}
              </button>
            </div>
            
            <div className="question-text">
              <p>{currentQuestionData.question_text}</p>
            </div>

            <div className="options-list">
              {['a', 'b', 'c', 'd'].map((option) => (
                <div 
                  key={option}
                  className={`option-item ${answers[currentQuestionData.id] === option ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(currentQuestionData.id, option)}
                >
                  <div className="option-letter">
                    {option.toUpperCase()}
                  </div>
                  <div className="option-text">
                    {currentQuestionData[`option_${option}`]}
                  </div>
                  {answers[currentQuestionData.id] === option && (
                    <CheckCircle size={16} color="#10B981" />
                  )}
                </div>
              ))}
            </div>

            <div className="question-footer">
              <div className="marks-info">
                <span>Marks: {currentQuestionData.marks}</span>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="navigation-buttons">
            <button 
              className="btn btn-outline"
              onClick={() => handleQuestionNav(currentQuestion - 1)}
              disabled={currentQuestion === 0}
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            
            <div className="center-buttons">
              <button 
                className="btn btn-outline"
                onClick={() => handleAnswerSelect(currentQuestionData.id, null)}
              >
                Clear Response
              </button>
              
              {currentQuestion < questions.length - 1 ? (
                <button 
                  className="btn btn-primary"
                  onClick={() => handleQuestionNav(currentQuestion + 1)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:-translate-y-0.5 font-medium"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button 
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg font-medium"
                >
                  {submitting ? 'Submitting...' : 'Submit Test'}
                  <Send size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="test-summary">
          <h4>Test Summary</h4>
          
          <div className="summary-stats">
            <div className="stat">
              <span className="stat-label">Answered</span>
              <span className="stat-value">
                {Object.keys(answers).length}/{questions.length}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Flagged</span>
              <span className="stat-value">{flagged.size}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Time Left</span>
              <span className="stat-value">{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="time-warning">
            {timeLeft < 300 && (
              <div className="warning-message">
                <AlertCircle size={16} />
                <span>Less than 5 minutes remaining!</span>
              </div>
            )}
          </div>

          <button 
            className="btn btn-primary submit-btn"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <LoadingSpinner small />
            ) : (
              <>
                <Send size={16} />
                Submit Test
              </>
            )}
          </button>

          <div className="quick-actions">
            <button className="action-btn">
              <Save size={16} />
              Save Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;