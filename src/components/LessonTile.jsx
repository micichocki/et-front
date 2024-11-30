import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import {useLocation, useNavigate} from 'react-router-dom';
import LessonUpdateModal from './LessonUpdateModal';

const timeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
    } else if (minutes < 60) {
        return `${minutes} minutes ago`;
    } else if (hours < 24) {
        return `${hours} hours ago`;
    } else if (days < 7) {
        return `${days} days ago`;
    } else {
        return `${Math.floor(days / 7)} weeks ago`;
    }
};

const timeLeft = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((new Date(date) - now) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (diffInSeconds < 0) {
        return "The lesson has already passed.";
    } else if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds left`;
    } else if (minutes < 60) {
        return `${minutes} minutes left`;
    } else if (hours < 24) {
        return `${hours} hours left`;
    } else {
        return `${days} days left`;
    }
};

const LessonTile = ({ user, lesson, currentUserRole, onAccept, onReload }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const navigate = useNavigate();

    const {
        id,
        tutor,
        student,
        subject,
        start_time,
        end_time,
        google_meet_url,
        price_per_hour,
        is_remote,
        is_accepted,
        description,
        accepted_by,
    } = lesson;

    const isFutureLesson = new Date(start_time) > new Date();
    const isArchivedLesson = new Date(end_time) < new Date();

    const handleSendProposition = () => {
        setSelectedLesson(lesson);
        setIsModalOpen(true);
    };

    const handleUpdateLesson = (updatedLesson) => {
        setSelectedLesson(updatedLesson);
        setIsModalOpen(false);
        onReload();
    };

    const handleCreateMeeting = async () => {
        try {
            await axios.post(`/api/tutoring/lessons/${id}/create-google-meet/`);
            onReload();
        } catch (error) {
            console.error('There was an error authorizing the Google Calendar API!', error);
        }
    };

    const goToDetails = () => {
        navigate(`/lessons/${id}`);
    };

    return (
        <div className="p-6 border border-gray-300 rounded-lg shadow-sm bg-white">
            <h3 className="text-lg font-semibold text-indigo-700 mb-2">
                Lesson #{id} - {subject.name}
            </h3>
            <p className="mb-1">
                <span className="font-bold">Tutor:</span> {tutor.user_full_name}
            </p>
            <p className="mb-1">
                <span className="font-bold">Student:</span> {student.user_full_name}
            </p>
            <p className="mb-1">
                <span className="font-bold">Start Time:</span> {new Date(start_time).toLocaleString()}
            </p>
            <p className="mb-1">
                <span className="font-bold">End Time:</span> {new Date(end_time).toLocaleString()}
            </p>
            <p className="mb-1">
                <span className="font-bold">Price per hour:</span> {price_per_hour} PLN
            </p>
            <p className="mb-1">
                <span className="font-bold">Remote:</span> {is_remote ? "Yes" : "No"}
            </p>
            <p className="mb-1">
                {description && <p className="mb-1">Description: {description}</p>}
            </p>

            <p className="mb-3 text-sm text-gray-500">
                {isArchivedLesson ? timeAgo(start_time) : timeLeft(start_time)}
            </p>

            {google_meet_url &&  user.google_credentials.length !==0 && (
                <a
                    href={google_meet_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" mt-3 bg-blue-500 text-white text-center py-2 px-4 rounded hover:bg-blue-600"
                >
                    Join Google Meet
                </a>
            )}

            {isFutureLesson && !is_accepted && accepted_by === currentUserRole && (
                <button
                    onClick={() => onAccept(id)}
                    className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    Accept Lesson
                </button>
            )}

            {isFutureLesson && !is_accepted && accepted_by === currentUserRole && (
                <button
                    onClick={handleSendProposition}
                    className="mt-3 ml-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-yellow-600"
                >
                    Send Proposition to Tutor
                </button>
            )}

            {isFutureLesson && !is_accepted && accepted_by !== currentUserRole && (
                <p className="mt-3 text-yellow-600">
                    Lesson is pending to be accepted by {accepted_by === 'Tutor' ? 'tutor' : 'student'}.
                </p>
            )}

            {is_accepted && !google_meet_url && user.google_credentials.length !==0 && (
                <button
                    onClick={handleCreateMeeting}
                    rel="noopener noreferrer"
                    className="mt-3 bg-blue-500 text-white text-center py-2 px-4 rounded hover:bg-blue-600"
                >
                    Create Meeting
                </button>
            )}

            <button
                onClick={goToDetails}
                className="mt-3 ml-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
                Go to Details
            </button>

            {selectedLesson && (
                <LessonUpdateModal
                    user={user}
                    tutor={tutor}
                    lesson={selectedLesson}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onUpdate={handleUpdateLesson}
                    subjects={tutor.subjects}
                />
            )}
        </div>
    );
};

export default LessonTile;