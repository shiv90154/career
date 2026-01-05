import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { api } from '../../services/api';

const VideoPlayer = ({ videoId, enrollmentId, videoData }) => {
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const playerRef = useRef(null);
    const intervalRef = useRef(null);

    const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 0,
            controls: 1,
            rel: 0,
            showinfo: 0,
            modestbranding: 1,
            iv_load_policy: 3
        },
    };

    const handleReady = (event) => {
        playerRef.current = event.target;
        setDuration(event.target.getDuration());
        
        // Load existing progress
        loadProgress();
    };

    const loadProgress = async () => {
        try {
            const response = await api.get(`/student/videos/progress/${videoId}/${enrollmentId}`);
            const data = response.data;
            
            if (data.progress) {
                setProgress(data.progress.watch_duration);
                setIsCompleted(data.progress.completed);
                
                if (playerRef.current && data.progress.last_watched_at) {
                    // Seek to last watched position
                    const seekTime = Math.min(data.progress.watch_duration, duration - 10);
                    playerRef.current.seekTo(seekTime);
                }
            }
        } catch (error) {
            console.error('Error loading progress:', error);
        }
    };

    const saveProgress = async (watchDuration, completed = false) => {
        try {
            await api.post('/student/videos/progress', {
                video_id: videoId,
                enrollment_id: enrollmentId,
                watch_duration: watchDuration,
                completed: completed
            });
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    };

    const handleStateChange = (event) => {
        if (event.data === YouTube.PlayerState.PLAYING) {
            // Start tracking progress
            intervalRef.current = setInterval(() => {
                if (playerRef.current) {
                    const currentTime = playerRef.current.getCurrentTime();
                    setProgress(currentTime);
                    
                    // Save progress every 10 seconds
                    if (Math.floor(currentTime) % 10 === 0) {
                        saveProgress(currentTime);
                    }
                    
                    // Mark as completed if watched 95% of video
                    if (currentTime >= duration * 0.95 && !isCompleted) {
                        setIsCompleted(true);
                        saveProgress(currentTime, true);
                    }
                }
            }, 1000);
        } else if (event.data === YouTube.PlayerState.PAUSED || 
                   event.data === YouTube.PlayerState.ENDED) {
            // Clear interval on pause/end
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            
            if (event.data === YouTube.PlayerState.ENDED && !isCompleted) {
                setIsCompleted(true);
                saveProgress(duration, true);
            }
        }
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <div className="video-player-container">
            <div className="video-wrapper">
                <YouTube
                    videoId={videoData.youtube_id}
                    opts={opts}
                    onReady={handleReady}
                    onStateChange={handleStateChange}
                />
            </div>
            
            <div className="video-info">
                <h2>{videoData.title}</h2>
                <p>{videoData.description}</p>
                
                <div className="progress-info">
                    <div className="progress-bar">
                        <div 
                            className="progress-fill" 
                            style={{ width: `${(progress / duration) * 100}%` }}
                        ></div>
                    </div>
                    <span>
                        {isCompleted ? 'Completed' : `${Math.floor(progress)} / ${Math.floor(duration)} seconds`}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;