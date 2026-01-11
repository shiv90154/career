import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Video, ExternalLink, User } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const LiveClasses = () => {
    const [liveClasses, setLiveClasses] = useState([]);
    const [enrolledClasses, setEnrolledClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');

    useEffect(() => {
        fetchLiveClasses();
    }, []);

    const fetchLiveClasses = async () => {
        try {
            setLoading(true);
            const [classesResponse, enrollmentsResponse] = await Promise.all([
                api.get('/live-classes/index.php?upcoming=true'),
                api.get('/student/live-class-enrollments.php')
            ]);
            
            setLiveClasses(classesResponse.data.live_classes || []);
            setEnrolledClasses(enrollmentsResponse.data.enrollments || []);
        } catch (error) {
            toast.error('Failed to fetch live classes');
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (classId) => {
        try {
            await api.post(`/student/live-classes/${classId}/enroll.php`);
            toast.success('Successfully enrolled in live class!');
            fetchLiveClasses(); // Refresh data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to enroll in live class');
        }
    };

    const handleJoinClass = (meetingUrl) => {
        if (meetingUrl) {
            window.open(meetingUrl, '_blank');
        } else {
            toast.error('Meeting link not available');
        }
    };

    const isEnrolled = (classId) => {
        return enrolledClasses.some(enrollment => enrollment.live_class_id === classId);
    };

    const LiveClassCard = ({ liveClass, showEnrollButton = true }) => (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {liveClass.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                            {liveClass.description}
                        </p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                        {liveClass.is_live && (
                            <div className="flex items-center text-red-600">
                                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse mr-2"></div>
                                <span className="text-xs font-medium">LIVE</span>
                            </div>
                        )}
                        {liveClass.is_premium && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                Premium
                            </span>
                        )}
                    </div>
                </div>

                {/* Class Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{liveClass.scheduled_at_formatted}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{liveClass.duration_minutes} minutes</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <User className="w-4 h-4 mr-2" />
                        <span>{liveClass.instructor_name}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{liveClass.enrolled_count}/{liveClass.max_participants}</span>
                    </div>
                </div>

                {/* Course Info */}
                {liveClass.course_title && (
                    <div className="mb-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {liveClass.course_title}
                        </span>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        {liveClass.is_upcoming ? 'Upcoming' : 
                         liveClass.is_live ? 'Live Now' : 'Completed'}
                    </div>
                    <div className="flex space-x-2">
                        {liveClass.is_live && isEnrolled(liveClass.id) && (
                            <button
                                onClick={() => handleJoinClass(liveClass.meeting_url)}
                                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                <Video className="w-4 h-4 mr-2" />
                                Join Live
                            </button>
                        )}
                        {liveClass.can_join && !liveClass.is_live && isEnrolled(liveClass.id) && (
                            <button
                                onClick={() => handleJoinClass(liveClass.meeting_url)}
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                <Video className="w-4 h-4 mr-2" />
                                Join Class
                            </button>
                        )}
                        {showEnrollButton && !isEnrolled(liveClass.id) && liveClass.is_upcoming && (
                            <button
                                onClick={() => handleEnroll(liveClass.id)}
                                disabled={liveClass.enrolled_count >= liveClass.max_participants}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${
                                    liveClass.enrolled_count >= liveClass.max_participants
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {liveClass.enrolled_count >= liveClass.max_participants ? 'Full' : 'Enroll'}
                            </button>
                        )}
                        {liveClass.recording_url && (
                            <button
                                onClick={() => window.open(liveClass.recording_url, '_blank')}
                                className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Recording
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const upcomingClasses = liveClasses.filter(cls => cls.is_upcoming);
    const liveNowClasses = liveClasses.filter(cls => cls.is_live);
    const myEnrolledClasses = liveClasses.filter(cls => isEnrolled(cls.id));

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Live Classes</h1>
            </div>

            {/* Live Now Alert */}
            {liveNowClasses.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse mr-3"></div>
                        <div>
                            <h3 className="text-red-800 font-medium">
                                {liveNowClasses.length} class{liveNowClasses.length > 1 ? 'es' : ''} live now!
                            </h3>
                            <p className="text-red-600 text-sm">
                                Join your enrolled classes or browse available live sessions.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'upcoming'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Upcoming ({upcomingClasses.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('enrolled')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'enrolled'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        My Classes ({myEnrolledClasses.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('live')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'live'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Live Now ({liveNowClasses.length})
                    </button>
                </nav>
            </div>

            {/* Content */}
            <div className="space-y-6">
                {activeTab === 'upcoming' && (
                    <>
                        {upcomingClasses.map((liveClass) => (
                            <LiveClassCard key={liveClass.id} liveClass={liveClass} />
                        ))}
                        {upcomingClasses.length === 0 && (
                            <div className="text-center py-12">
                                <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <div className="text-gray-500">No upcoming live classes</div>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'enrolled' && (
                    <>
                        {myEnrolledClasses.map((liveClass) => (
                            <LiveClassCard key={liveClass.id} liveClass={liveClass} showEnrollButton={false} />
                        ))}
                        {myEnrolledClasses.length === 0 && (
                            <div className="text-center py-12">
                                <Video className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <div className="text-gray-500 mb-4">You haven't enrolled in any live classes yet</div>
                                <button
                                    onClick={() => setActiveTab('upcoming')}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Browse upcoming classes
                                </button>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'live' && (
                    <>
                        {liveNowClasses.map((liveClass) => (
                            <LiveClassCard key={liveClass.id} liveClass={liveClass} showEnrollButton={false} />
                        ))}
                        {liveNowClasses.length === 0 && (
                            <div className="text-center py-12">
                                <Video className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <div className="text-gray-500">No live classes at the moment</div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default LiveClasses;