import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import LessonTile from './LessonTile';

const PendingLessons = () => {
    const [lessons, setLessons] = useState([]);
    const [currentTab, setCurrentTab] = useState('pending');
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState('');

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

        if (!user) {
            fetchUserData();
        } else {
            let endpoint = '';
            if (user.roles[0].id === 1) {
                endpoint = '/api/tutoring/student/lessons/';
            } else if (user.roles[0].id === 2) {
                endpoint = '/api/tutoring/tutor/lessons/';
            } else if (user.roles[0].id === 3) {
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

    const handleSendProposition = (lessonId) => {
        axios.post(`/api/tutoring/lessons/${lessonId}/proposition`)
            .then(() => {
                alert("Proposition sent to the tutor!");
            })
            .catch(error => {
                console.error('There was an error sending the proposition!', error);
            });
    };

    const currentDate = new Date();

    const filteredLessons = lessons.filter(lesson => {
        if (currentTab === 'pending') {
            return !lesson.is_accepted && new Date(lesson.start_time) > currentDate;
        } else if (currentTab === 'upcoming') {
            return lesson.is_accepted && new Date(lesson.start_time) > currentDate;
        } else {
            return new Date(lesson.start_time) < currentDate;
        }
    });

    const sortedLessons = filteredLessons.sort((a, b) => new Date(b.start_time) - new Date(a.start_time));

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
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
                            key={lesson.id}
                            lesson={lesson}
                            currentUserRole={userRole}
                            onAccept={handleAccept}
                            onSendProposition={handleSendProposition}
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