import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import LessonTile from './LessonTile';
import {useLocation} from "react-router-dom";

const PendingLessons = () => {
    const [lessons, setLessons] = useState([]);
    const [currentTab, setCurrentTab] = useState('pending');
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState('');
    const location = useLocation();
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/tutoring/user/me/');
                setUser(response.data);
                setUserRole(response.data.roles[0].id === 1 ? 'Student' : response.data.roles[0].id === 2 ? 'Tutor' : 'Parent');
            } catch (error) {
                console.error('There was an error fetching the user data!', error);
            }
        };


        const params = new URLSearchParams(location.search);
        const state = params.get('state');
        const code = params.get('code');
        if (state && code) {
            handleGoogleCalendarCallback();
        }


        if (!user) {
            fetchUserData();
        } else {
            let endpoint = '';
            if (user.roles && user.roles[0].id === 1) {
                endpoint = '/api/tutoring/student/lessons/';
            } else if (user.roles && user.roles[0].id === 2) {
                endpoint = '/api/tutoring/tutor/lessons/';
            } else if (user.roles && user.roles[0].id === 3) {
                endpoint = '/api/tutoring/parent/lessons/';
            }

            axios.get(endpoint)
                .then(response => {
                    setLessons(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching the lessons!', error);
                });
        }
    }, [user]);

    const handleAccept = (lessonId) => {
        axios.post(`/api/tutoring/lessons/${lessonId}/accept`)
            .then(() => {
                setLessons(lessons.map(lesson =>
                    lesson.id === lessonId ? { ...lesson, is_accepted: true } : lesson
                ));
            })
            .catch(error => {
                console.error('There was an error accepting the lesson!', error);
            });
    };

    const handleAuthorizeGoogleCalendar = async () => {
        try {
            const response = await axios.post(`/api/tutoring/lessons/authorize-google-calendar/`);
            const authUrl = `${response.data.auth_url}&redirect_uri=http://localhost:3000/pending-lessons/`;
            window.location.href = authUrl;
        } catch (error) {
            console.error('There was an error authorizing the Google Calendar API!', error);
        }
    };

    const handleGoogleCalendarCallback = async () => {
        const params = new URLSearchParams(window.location.search);
        const state = params.get('state');
        const code = params.get('code');
        const redirectUri = 'http://localhost:3000/pending-lessons/';

        if (state && code) {
            try {
                const response = await axios.get('/api/tutoring/lessons/create_google_credential/', {
                    params: { state, code, redirectUri }
                });
                setUser({ ...user, google_credentials: true });
            } catch (error) {
                console.error('There was an error handling the Google Calendar callback!', error);
            }
        }
    };

    const currentDate = new Date();

    const filteredLessons = lessons.filter(lesson => {
        const lessonStart = new Date(lesson.start_time);
        const lessonEnd = new Date(lesson.end_time);

        if (currentTab === 'pending') {
            return !lesson.is_accepted && (lessonStart > currentDate || (currentDate > lessonStart && currentDate < lessonEnd));
        } else if (currentTab === 'upcoming') {
            return lesson.is_accepted && (lessonStart > currentDate || (currentDate > lessonStart && currentDate < lessonEnd));
        } else if (currentTab === 'archive') {
            return currentDate > lessonEnd;
        }
        return false;
    });

    const sortedLessons = filteredLessons.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            {(!user?.google_credentials || user.google_credentials.length === 0) && (
                <button
                    onClick={handleAuthorizeGoogleCalendar}
                    className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                    Authorize Google Calendar
                </button>
            )}
            <div className="flex justify-center gap-4 mb-6">
                <button
                    className={`px-4 py-2 rounded-lg ${
                        currentTab === 'upcoming' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'
                    }`}
                    onClick={() => setCurrentTab('upcoming')}
                >
                    Upcoming
                </button>
                <button
                    className={`px-4 py-2 rounded-lg ${
                        currentTab === 'pending' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'
                    }`}
                    onClick={() => setCurrentTab('pending')}
                >
                    Pending
                </button>
                <button
                    className={`px-4 py-2 rounded-lg ${
                        currentTab === 'archive' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'
                    }`}
                    onClick={() => setCurrentTab('archive')}
                >
                    Archive
                </button>
            </div>
            <div className="space-y-4">
                {sortedLessons.length > 0 ? (
                    sortedLessons.map(lesson => (
                        <LessonTile
                            user={user}
                            key={lesson.id}
                            lesson={lesson}
                            currentUserRole={userRole}
                            onAccept={handleAccept}
                            onReload={() => {
                                let endpoint = '';

                                if (user.roles && user.roles[0].id === 3) {
                                    endpoint = '/api/tutoring/parent/lessons/';
                                }

                                axios.get(endpoint)
                                    .then(response => {
                                        setLessons(response.data);
                                    })
                                    .catch(error => {
                                        console.error('There was an error fetching the lessons!', error);
                                    });
                            }}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500">No lessons to display.</p>
                )}
            </div>
        </div>
    );
};

export default PendingLessons;