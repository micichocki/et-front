import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';

const LessonSlider = ({ lessons, isStudent, isTutor }) => {
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const navigate = useNavigate();
    const now = new Date();

    const sortedLessons = [...lessons].sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

    useEffect(() => {
        const upcomingOrOngoingLessonIndex = sortedLessons.findIndex((lesson) => {
            const startTime = new Date(lesson.start_time);
            const endTime = new Date(lesson.end_time);
            return now >= startTime && now <= endTime || now < startTime;
        });

        setCurrentLessonIndex(upcomingOrOngoingLessonIndex !== -1 ? upcomingOrOngoingLessonIndex : 0);
    }, [lessons]);

    const getLessonStatus = (startTime, endTime) => {
        const lessonTime = new Date(startTime);
        const isOngoing = now >= lessonTime && now <= new Date(endTime);
        const isUpcoming = now < new Date(startTime);
        const isPast = now > new Date(endTime);

        if (isOngoing) return 'ongoing';
        if (isUpcoming) return 'upcoming';
        if (isPast) return 'past';
        return 'default';
    };

    const getTimeDifference = (startTime) => {
        const lessonTime = new Date(startTime);
        const diffMs = Math.abs(lessonTime - now);
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (diffDays > 0) {
            return `${diffDays} day(s)`;
        } else if (diffHours > 0) {
            return `${diffHours} hour(s) and ${diffMinutes} minute(s)`;
        } else {
            return `${diffMinutes} minute(s)`;
        }
    };

    const getLessonDuration = (startTime, endTime) => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const diffMs = end - start;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        return `${diffHours} hour(s) and ${diffMinutes} minute(s)`;
    };

    const getButtonClass = () => 'bg-indigo-600 hover:bg-indigo-700'; // Always indigo

    const getBorderClass = (status) => {
        switch (status) {
            case 'ongoing':
                return 'border-red-300 text-red-500'; // Ongoing -> Lighter red border and red text
            case 'upcoming':
                return 'border-yellow-300 text-yellow-500'; // Upcoming -> Lighter yellow border and yellow text
            case 'past':
                return 'border-gray-300 text-gray-500'; // Past -> Lighter gray border and gray text
            default:
                return 'border-indigo-100 text-indigo-200'; // Default -> Lighter blue border and light blue text
        }
    };

    const NextArrow = ({ onClick }) => (
        <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-3 py-2 rounded-full shadow hover:bg-indigo-700 focus:outline-none z-10"
            onClick={onClick}
        >
            &rarr;
        </button>
    );

    const PrevArrow = ({ onClick }) => (
        <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-3 py-2 rounded-full shadow hover:bg-indigo-700 focus:outline-none z-10"
            onClick={onClick}
        >
            &larr;
        </button>
    );

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: currentLessonIndex,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        afterChange: (index) => setCurrentLessonIndex(index),
    };

    const navigateToDetails = (lessonId) => {
        navigate(`/api/tutoring/lessons/${lessonId}`);
    };

    const openMeeting = (url) => {
        window.open(url, '_blank');
    };

    return (
        <div className="lesson-slider my-8 px-4">
            <Slider {...settings}>
                {sortedLessons.map((lesson, index) => {
                    const startTime = new Date(lesson.start_time);
                    const endTime = new Date(lesson.end_time);
                    const lessonStatus = getLessonStatus(lesson.start_time, lesson.end_time);
                    const borderClass = getBorderClass(lessonStatus); // Get dynamic border color
                    const timeDifference = getTimeDifference(lesson.start_time);
                    const lessonDuration = getLessonDuration(lesson.start_time, lesson.end_time);

                    return (
                        <div
                            key={index}
                            className={`lesson-slide p-6 border-2 ${borderClass} rounded-lg shadow-sm bg-white max-w-md mx-auto relative`}
                        >
                            <span className="absolute top-4 left-4 px-2 py-1 text-sm font-medium bg-white rounded-full border-2 border-indigo-300 text-indigo-500">
                                {lesson.subject.name}
                            </span>

                            {lessonStatus === 'ongoing' && (
                                <span className="absolute top-4 right-4 px-2 py-1 text-sm font-medium bg-white rounded-full border-2 border-red-300 text-red-500">
                                    Ongoing
                                </span>
                            )}
                            {lessonStatus === 'upcoming' && (
                                <span className="absolute top-4 right-4 px-2 py-1 text-sm font-medium bg-white rounded-full border-2 border-yellow-300 text-yellow-500">
                                    Upcoming in {timeDifference}
                                </span>
                            )}
                            {lessonStatus === 'past' && (
                                <span className="absolute top-4 right-4 px-2 py-1 text-sm font-medium bg-white rounded-full border-2 border-gray-300 text-gray-500">
                                    {timeDifference} ago
                                </span>
                            )}

                            <div className="mt-8 p-4 bg-gray-50 border-l-4 border-indigo-500 rounded-lg">
                                <p className="text-lg text-indigo-600 mb-2">
                                    <span className="font-medium text-xl text-indigo-700">Start:</span> <span className="text-gray-600">{startTime.toLocaleString()}</span>
                                </p>
                                <p className="text-lg text-indigo-600 mb-2">
                                    <span className="font-medium text-xl text-indigo-700">End:</span> <span className="text-gray-600">{endTime.toLocaleString()}</span>
                                </p>
                                <p className="text-lg text-indigo-600 mb-2">
                                    <span className="font-medium text-xl text-indigo-700">Duration:</span> <span className="text-gray-600">{lessonDuration}</span>
                                </p>
                                <p className="text-lg text-indigo-600 mb-4">
                                    {isStudent && `Tutor: ${lesson.tutor.user_full_name}`}
                                    {isTutor && `Student: ${lesson.student.user_full_name}`}
                                </p>
                            </div>

                            <div className="flex justify-between mt-6">
                                <button
                                    onClick={() => openMeeting(lesson.google_meet_url)}
                                    className={`text-white px-4 py-2 rounded-md shadow transition-colors ${getButtonClass()}`}
                                >
                                    Join Google Meet
                                </button>
                                <button
                                    onClick={() => navigateToDetails(lesson.id)}
                                    className={`text-white px-4 py-2 rounded-md shadow transition-colors ${getButtonClass()}`}
                                >
                                    Go to Details
                                </button>
                            </div>
                        </div>
                    );
                })}
            </Slider>
        </div>
    );
};

export default LessonSlider;