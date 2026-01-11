import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const QuizTaker = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    
    const [quiz, setQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(null);
    const [attemptId, setAttemptId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);

    useEffect(() => {
        fetchQuiz();
    }, [quizId]);

    useEffect(() => {
        let timer;
        if (quizStarted && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        handleSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [quizStarted, timeLeft]);

    const fetchQuiz = async () => {
        try {
            const response = await api.get(`/student/quizzes.php?quiz_id=${quizId}`);
            setQuiz(response.data.quiz);
            if (response.data.quiz.time_limit) {
                setTimeLeft(response.data.quiz.time_limit * 60); // Convert minutes to seconds
            }
        } catch (error) {
            toast.error('Failed to load quiz');
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    const startQuiz = async () => {
        try {
            const response = await api.post('/student/quizzes.php', {
                action: 'start',
                quiz_id: quizId
            });
            setAttemptId(response.data.attempt_id);
            setQuizStarted(true);
            toast.success('Quiz started!');
        } catch (error) {
            toast.error('Failed to start quiz');
        }
    };

    const handleAnswerChange = (questionId, optionId, answerText = '') => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: {
                question_id: questionId,
                option_id: optionId,
                answer_text: answerText
            }
        }));
    };

    const handleSubmit = async () => {
        if (submitting) return;
        
        setSubmitting(true);
        
        try {
            const answersArray = Object.values(answers);
            const response = await api.post('/student/quizzes.php', {
                attempt_id: attemptId,
                answers: answersArray
            });
            
            toast.success('Quiz submitted successfully!');
            navigate(`/student/quiz-result/${attemptId}`);
        } catch (error) {
            toast.error('Failed to submit quiz');
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getAnsweredCount = () => {
        return Object.keys(answers).length;
    };

    const isQuestionAnswered = (questionId) => {
        return answers.hasOwnProperty(questionId);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading quiz...</div>;
    }

    if (!quiz) {
        return <div className="text-center py-8">Quiz not found</div>;
    }

    // Quiz start screen
    if (!quizStarted) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
                    
                    {quiz.description && (
                        <p className="text-gray-600 mb-6">{quiz.description}</p>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-blue-800 mb-2">Quiz Information</h3>
                        <ul className="space-y-2 text-sm text-blue-700">
                            <li>• Questions: {quiz.questions.length}</li>
                            {quiz.time_limit && (
                                <li>• Time Limit: {quiz.time_limit} minutes</li>
                            )}
                            <li>• Passing Score: {quiz.passing_score}%</li>
                            <li>• Attempts Allowed: {quiz.max_attempts}</li>
                            <li>• Current Attempt: {quiz.attempt_number}</li>
                        </ul>
                    </div>

                    {quiz.instructions && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-yellow-800 mb-2">Instructions</h3>
                            <div className="text-sm text-yellow-700" dangerouslySetInnerHTML={{ __html: quiz.instructions }} />
                        </div>
                    )}

                    <div className="flex justify-center">
                        <button
                            onClick={startQuiz}
                            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                        >
                            Start Quiz
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQ = quiz.questions[currentQuestion];

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Quiz Header */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold">{quiz.title}</h1>
                        <p className="text-sm text-gray-600">
                            Question {currentQuestion + 1} of {quiz.questions.length}
                        </p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        {timeLeft !== null && (
                            <div className={`flex items-center ${timeLeft < 300 ? 'text-red-600' : 'text-gray-600'}`}>
                                <Clock className="w-4 h-4 mr-1" />
                                {formatTime(timeLeft)}
                            </div>
                        )}
                        
                        <div className="text-sm text-gray-600">
                            Answered: {getAnsweredCount()}/{quiz.questions.length}
                        </div>
                    </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                    <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Question Navigation */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex flex-wrap gap-2">
                    {quiz.questions.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentQuestion(index)}
                            className={`w-10 h-10 rounded-md text-sm font-medium ${
                                index === currentQuestion
                                    ? 'bg-blue-600 text-white'
                                    : isQuestionAnswered(quiz.questions[index].id)
                                    ? 'bg-green-100 text-green-800 border border-green-300'
                                    : 'bg-gray-100 text-gray-600 border border-gray-300'
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* Current Question */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-start mb-4">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded mr-3">
                        Q{currentQuestion + 1}
                    </span>
                    <div className="flex-1">
                        <h2 className="text-lg font-medium mb-2">{currentQ.question}</h2>
                        <p className="text-sm text-gray-600">Points: {currentQ.points}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {currentQ.question_type === 'multiple_choice' && (
                        <>
                            {currentQ.options.map((option) => (
                                <label key={option.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`question_${currentQ.id}`}
                                        value={option.id}
                                        checked={answers[currentQ.id]?.option_id === option.id}
                                        onChange={() => handleAnswerChange(currentQ.id, option.id)}
                                        className="mr-3"
                                    />
                                    <span>{option.option_text}</span>
                                </label>
                            ))}
                        </>
                    )}

                    {currentQ.question_type === 'true_false' && (
                        <>
                            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="radio"
                                    name={`question_${currentQ.id}`}
                                    value="true"
                                    checked={answers[currentQ.id]?.answer_text === 'true'}
                                    onChange={() => handleAnswerChange(currentQ.id, null, 'true')}
                                    className="mr-3"
                                />
                                <span>True</span>
                            </label>
                            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="radio"
                                    name={`question_${currentQ.id}`}
                                    value="false"
                                    checked={answers[currentQ.id]?.answer_text === 'false'}
                                    onChange={() => handleAnswerChange(currentQ.id, null, 'false')}
                                    className="mr-3"
                                />
                                <span>False</span>
                            </label>
                        </>
                    )}

                    {(currentQ.question_type === 'fill_blank' || currentQ.question_type === 'essay') && (
                        <textarea
                            value={answers[currentQ.id]?.answer_text || ''}
                            onChange={(e) => handleAnswerChange(currentQ.id, null, e.target.value)}
                            placeholder="Enter your answer..."
                            rows={currentQ.question_type === 'essay' ? 6 : 3}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    )}
                </div>
            </div>

            {/* Navigation and Submit */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestion === 0}
                        className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <div className="flex space-x-3">
                        {currentQuestion < quiz.questions.length - 1 ? (
                            <button
                                onClick={() => setCurrentQuestion(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : 'Submit Quiz'}
                            </button>
                        )}
                    </div>
                </div>

                {getAnsweredCount() < quiz.questions.length && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center">
                            <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                            <span className="text-sm text-yellow-700">
                                You have {quiz.questions.length - getAnsweredCount()} unanswered questions.
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizTaker;