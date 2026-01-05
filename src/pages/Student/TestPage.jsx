import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
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
            >
              Go Back
            </button>
            <button 
              className="btn btn-primary"
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
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button 
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={submitting}
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