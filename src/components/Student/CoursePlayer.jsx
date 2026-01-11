import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, CheckCircle, Clock, FileText, HelpCircle, Lock } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const CoursePlayer = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    
    const [course, setCourse] = useState(null);
    const [sections, setSections] = useState([]);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [videoProgress, setVideoProgress] = useState(0);

    useEffect(() => {
        fetchCourseData();
        fetchProgress();
    }, [courseId]);

    const fetchCourseData = async () => {
        try {
            const response = await api.get(`/courses/detail.php?id=${courseId}`);
            setCourse(response.data.course);
            setSections(response.data.sections);
            
            // Set first lesson as current if no lesson is selected
            if (response.data.sections.length > 0 && response.data.sections[0].lessons.length > 0) {
                setCurrentLesson(response.data.sections[0].lessons[0]);
            }
        } catch (error) {
            toast.error('Failed to load course');
            navigate('/student/my-courses');
        }
    };

    const fetchProgress = async () => {
        try {
            const response = await api.get(`/student/progress.php?course_id=${courseId}`);
            setProgress(response.data.progress);
        } catch (error) {
            console.error('Failed to fetch progress');
        } finally {
            setLoading(false);
        }
    };

    const updateProgress = async (lessonId, isCompleted = false, watchTime = 0, lastPosition = 0) => {
        try {
            await api.post('/student/progress.php', {
                course_id: courseId,
                lesson_id: lessonId,
                is_completed: isCompleted ? 1 : 0,
                watch_time: watchTime,
                last_position: lastPosition
            });
            
            // Update local progress
            setProgress(prev => prev.map(p => 
                p.lesson_id === lessonId 
                    ? { ...p, is_completed: isCompleted, watch_time: watchTime, last_position: lastPosition }
                    : p
            ));
            
            if (isCompleted) {
                toast.success('Lesson completed!');
            }
        } catch (error) {
            console.error('Failed to update progress');
        }
    };

    const markLessonComplete = (lessonId) => {
        updateProgress(lessonId, true);
    };

    const handleVideoProgress = (currentTime, duration) => {
        setVideoProgress((currentTime / duration) * 100);
        
        // Auto-save progress every 30 seconds
        if (Math.floor(currentTime) % 30 === 0) {
            updateProgress(currentLesson.id, false, Math.floor(currentTime), Math.floor(currentTime));
        }
        
        // Mark as complete if watched 90%
        if (currentTime / duration >= 0.9) {
            const lessonProgress = progress.find(p => p.lesson_id === currentLesson.id);
            if (!lessonProgress?.is_completed) {
                markLessonComplete(currentLesson.id);
            }
        }
    };

    const selectLesson = (lesson) => {
        setCurrentLesson(lesson);
        setVideoProgress(0);
    };

    const getLessonProgress = (lessonId) => {
        return progress.find(p => p.lesson_id === lessonId);
    };

    const isLessonCompleted = (lessonId) => {
        const lessonProgress = getLessonProgress(lessonId);
        return lessonProgress?.is_completed || false;
    };

    const renderLessonContent = () => {
        if (!currentLesson) return null;

        const lessonProgress = getLessonProgress(currentLesson.id);

        switch (currentLesson.lesson_type) {
            case 'video':
                return (
                    <div className="space-y-4">
                        <div className="aspect-video bg-black rounded-lg overflow-hidden">
                            {currentLesson.video_url ? (
                                <video
                                    controls
                                    className="w-full h-full"
                                    onTimeUpdate={(e) => handleVideoProgress(e.target.currentTime, e.target.duration)}
                                    onLoadedMetadata={(e) => {
                                        if (lessonProgress?.last_position) {
                                            e.target.currentTime = lessonProgress.last_position;
                                        }
                                    }}
                                >
                                    <source src={currentLesson.video_url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <div className="flex items-center justify-center h-full text-white">
                                    <p>Video not available</p>
                                </div>
                            )}
                        </div>
                        
                        {videoProgress > 0 && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${videoProgress}%` }}
                                ></div>
                            </div>
                        )}
                    </div>
                );

            case 'text':
                return (
                    <div className="prose max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                        <div className="mt-6">
                            <button
                                onClick={() => markLessonComplete(currentLesson.id)}
                                disabled={isLessonCompleted(currentLesson.id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                            >
                                {isLessonCompleted(currentLesson.id) ? 'Completed' : 'Mark as Complete'}
                            </button>
                        </div>
                    </div>
                );

            case 'quiz':
                return (
                    <div className="text-center py-8">
                        <HelpCircle className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                        <h3 className="text-xl font-semibold mb-4">Quiz Available</h3>
                        <p className="text-gray-600 mb-6">Test your knowledge with this lesson quiz.</p>
                        <button
                            onClick={() => navigate(`/student/quiz/${currentLesson.id}`)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Take Quiz
                        </button>
                    </div>
                );

            case 'file':
                return (
                    <div className="text-center py-8">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-green-600" />
                        <h3 className="text-xl font-semibold mb-4">Download Material</h3>
                        <p className="text-gray-600 mb-6">{currentLesson.content}</p>
                        {currentLesson.file_path && (
                            <a
                                href={currentLesson.file_path}
                                download
                                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 inline-block"
                            >
                                Download File
                            </a>
                        )}
                        <div className="mt-6">
                            <button
                                onClick={() => markLessonComplete(currentLesson.id)}
                                disabled={isLessonCompleted(currentLesson.id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                            >
                                {isLessonCompleted(currentLesson.id) ? 'Completed' : 'Mark as Complete'}
                            </button>
                        </div>
                    </div>
                );

            default:
                return <div>Unsupported lesson type</div>;
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar - Course Content */}
            <div className="w-1/3 bg-white shadow-lg overflow-y-auto">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">{course?.title}</h2>
                    <p className="text-sm text-gray-600">Course Content</p>
                </div>

                <div className="p-4">
                    {sections.map((section) => (
                        <div key={section.id} className="mb-4">
                            <h3 className="font-medium text-gray-800 mb-2">{section.title}</h3>
                            <div className="space-y-1">
                                {section.lessons.map((lesson) => {
                                    const completed = isLessonCompleted(lesson.id);
                                    const isActive = currentLesson?.id === lesson.id;
                                    
                                    return (
                                        <div
                                            key={lesson.id}
                                            onClick={() => selectLesson(lesson)}
                                            className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${
                                                isActive 
                                                    ? 'bg-blue-100 border-l-4 border-blue-600' 
                                                    : 'hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex-shrink-0 mr-3">
                                                {completed ? (
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                ) : lesson.lesson_type === 'video' ? (
                                                    <Play className="w-5 h-5 text-gray-400" />
                                                ) : lesson.lesson_type === 'quiz' ? (
                                                    <HelpCircle className="w-5 h-5 text-blue-600" />
                                                ) : (
                                                    <FileText className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-medium truncate ${
                                                    isActive ? 'text-blue-600' : 'text-gray-800'
                                                }`}>
                                                    {lesson.title}
                                                </p>
                                                {lesson.video_duration && (
                                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {Math.floor(lesson.video_duration / 60)}:{(lesson.video_duration % 60).toString().padStart(2, '0')}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {lesson.is_preview && (
                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                    Preview
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="bg-white shadow-sm p-4 border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-semibold">{currentLesson?.title}</h1>
                            <p className="text-sm text-gray-600 capitalize">{currentLesson?.lesson_type} Lesson</p>
                        </div>
                        
                        {currentLesson && (
                            <div className="flex items-center space-x-2">
                                {isLessonCompleted(currentLesson.id) && (
                                    <span className="flex items-center text-green-600 text-sm">
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        Completed
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Lesson Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                    {renderLessonContent()}
                </div>
            </div>
        </div>
    );
};

export default CoursePlayer;