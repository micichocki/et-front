import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from '../axiosConfig';
import LessonSlider from "./LessonSlider";

const TutorDashboard = ({ user, lessons = [] }) => {
    const [redirect, setRedirect] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showPopup, setShowPopup] = useState(false);
    const [popupLessons, setPopupLessons] = useState([]);
    const [tutorLessons, setTutorLessons] = useState(lessons);

    const navigate = useNavigate();

    useEffect(() => {
        if (user?.tutor_profile?.bio) {
            setRedirect(false);
        }
    }, [user]);

    useEffect(() => {
        const fetchData = async () => {
            if (tutorLessons.length === 0) {
                try {
                    let lessonsResponse;
                    lessonsResponse = await axios.get('/api/tutoring/tutor/lessons/');

                    setTutorLessons(lessonsResponse.data);
                } catch (err) {
                    console.error(err);
                }
            }
        };
        fetchData();
    }, [tutorLessons]);

    if (redirect) {
        return <Navigate to="/tutor-profile" user={user} />;
    }

    const navigateToLessonDetails = (lessonId) => {
        navigate(`/lessons/${lessonId}`);
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        return firstDay.getDay();
    };

    const prevMonth = () => {
        setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
    };

    const goToCurrentMonth = () => {
        setCurrentDate(new Date());
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const currentDay = new Date().getDate();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return (
        <div>
            <LessonSlider lessons={tutorLessons} isTutor={true}></LessonSlider>
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-4">
                    <button
                        onClick={goToCurrentMonth}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700"
                    >
                        Go to Current Month
                    </button>
                </div>
                <div className="relative mb-4 flex justify-between items-center">
                    <button
                        onClick={prevMonth}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700"
                    >
                        &lt;
                    </button>
                    <div className="text-xl font-semibold text-indigo-600 mx-4">
                        {currentDate.toLocaleString("en-US", { month: "long", year: "numeric" })}
                    </div>
                    <button
                        onClick={nextMonth}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700"
                    >
                        &gt;
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-4 border border-gray-300 rounded-xl shadow-lg p-6 bg-white">
                    <div className="text-center font-semibold text-gray-600">Sun</div>
                    <div className="text-center font-semibold text-gray-600">Mon</div>
                    <div className="text-center font-semibold text-gray-600">Tue</div>
                    <div className="text-center font-semibold text-gray-600">Wed</div>
                    <div className="text-center font-semibold text-gray-600">Thu</div>
                    <div className="text-center font-semibold text-gray-600">Fri</div>
                    <div className="text-center font-semibold text-gray-600">Sat</div>

                    {Array.from({ length: firstDayOfMonth }, (_, i) => (
                        <div key={`empty-${i}`} className="h-32"></div>
                    ))}
                    {days.map((day) => {
                        const lessonsForDay = tutorLessons.filter((lesson) => {
                            const lessonStart = new Date(lesson.start_time);
                            const lessonEnd = new Date(lesson.end_time);
                            return (
                                lessonStart.getDate() === day &&
                                lessonStart.getMonth() === currentDate.getMonth() &&
                                lessonStart.getFullYear() === currentDate.getFullYear() &&
                                lessonEnd.getDate() === day &&
                                lessonEnd.getMonth() === currentDate.getMonth() &&
                                lessonEnd.getFullYear() === currentDate.getFullYear()
                            );
                        });

                        const isToday =
                            day === currentDay &&
                            currentMonth === currentDate.getMonth() &&
                            currentYear === currentDate.getFullYear();
                        return (
                            <div
                                key={day}
                                className={`flex flex-col items-center justify-start h-48 border rounded-lg shadow-sm p-3 ${
                                    lessonsForDay.length
                                        ? "bg-indigo-100 text-indigo-900 border-indigo-300"
                                        : "bg-gray-100 text-gray-500 border-gray-200"
                                } ${isToday ? "bg-indigo-500 text-white" : ""} relative`}
                            >
                            <span
                                className={`absolute top-2 left-2 text-lg font-semibold ${isToday ? "text-white" : ""}`}
                            >
                                {day}
                            </span>
                                {lessonsForDay.length > 0 ? (
                                    <ul className="text-sm mt-6 space-y-1 w-full">
                                        {lessonsForDay.slice(0, 2).map((lesson, index) => (
                                            <li
                                                key={index}
                                                className="cursor-pointer hover:bg-indigo-200 hover:text-indigo-800 transition-colors p-1 rounded"
                                                onClick={() => navigateToLessonDetails(lesson.id)}
                                            >
                                                <span className="font-medium">{lesson.subject.name}</span>
                                                <span className="block text-xs text-white-600">
                                                {new Date(lesson.start_time).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })} -
                                                    {new Date(lesson.end_time).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                            </span>
                                            </li>
                                        ))}

                                        {lessonsForDay.length > 2 && (
                                            <li
                                                className="cursor-pointer text-white-600hover:text-white-600 transition-colors p-1 rounded"
                                                onClick={() => {
                                                    setPopupLessons(lessonsForDay);
                                                    setShowPopup(true);
                                                }}
                                            >
                                                ... more
                                            </li>
                                        )}
                                        {showPopup && (
                                            <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
                                                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
                                                    <h2 className="text-xl font-bold mb-4 text-indigo-600">
                                                        Lessons for {currentDate.toLocaleDateString()}
                                                    </h2>
                                                    <ul className="space-y-2">
                                                        {popupLessons
                                                            .filter((lesson) => new Date(lesson.start_time).getDate() === currentDate.getDate())
                                                            .map((lesson, index) => (
                                                                <li
                                                                    key={index}
                                                                    className="cursor-pointer hover:border-indigo-200 hover:text-indigo-800 transition-colors p-2 rounded border border-gray-200"
                                                                    onClick={() => {
                                                                        setShowPopup(false);
                                                                        navigateToLessonDetails(lesson.id);
                                                                    }}
                                                                >
                                                                <span className="font-medium text-gray-600">
                                                                    {lesson.subject.name}
                                                                </span>
                                                                    <span className="block text-xs text-gray-600">
                                                                    {new Date(lesson.start_time).toLocaleTimeString([], {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                    })} -
                                                                        {new Date(lesson.end_time).toLocaleTimeString([], {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                        })}
                                                                </span>
                                                                    <span className="block text-xs text-gray-600">
                                                                    {lesson.student.user_full_name}
                                                                </span>
                                                                </li>
                                                            ))}
                                                    </ul>
                                                    <button
                                                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700"
                                                        onClick={() => setShowPopup(false)}
                                                    >
                                                        Close
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </ul>
                                ) : (
                                    <span className="mt-6 text-sm">No lessons</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TutorDashboard;