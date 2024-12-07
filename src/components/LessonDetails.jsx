import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axiosConfig';

const LessonDetails = () => {
    const { id } = useParams();
    const [lesson, setLesson] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(0);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchLessonDetails = async () => {
            try {
                const response = await axios.get(`/api/tutoring/lessons/${id}/`);
                setLesson(response.data);
                setDocuments(response.data.documents || []);
            } catch (error) {
                console.error('Error fetching lesson details:', error);
            }
        };
        fetchLessonDetails();
    }, [id]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const uploadDocument = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append('document', file);

        setLoading(true);
        try {
            const response = await axios.post(`/api/tutoring/lessons/${id}/documents/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setDocuments((prevDocs) => [...prevDocs, response.data]);
            setFile(null);
        } catch (error) {
            setError(error.response.data.error);
        } finally {
            setLoading(false);
        }
    };

    const downloadDocument = (url) => {
        window.open(url, '_blank');
    };


    const submitFeedback = async () => {
        try {
            await axios.post(`/api/tutoring/lessons/${id}/feedback/`, { feedback, rating });
            setLesson({ ...lesson, feedback, rating });
            setFeedbackSubmitted(true);
            setSuccessMessage('Feedback submitted successfully!');
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    if (!lesson) return <p className="text-center text-indigo-600">Loading...</p>;

    const currentDate = new Date();
    const lessonEndTime = new Date(lesson.end_time);

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-indigo-300 mt-10">
            <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
                Lesson Details
            </h1>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-indigo-600 mb-4">General Information</h2>
                <div className="p-4 bg-indigo-50 rounded-md space-y-2">
                    <p><strong>Subject:</strong> {lesson.subject.name}</p>
                    <p><strong>Start Time:</strong> {new Date(lesson.start_time).toLocaleString()}</p>
                    <p><strong>End Time:</strong> {lessonEndTime.toLocaleString()}</p>
                    <p><strong>Price Per Hour:</strong> {lesson.price_per_hour} PLN</p>
                    <p>
                        <strong>Google Meet URL:</strong>{' '}
                        {lesson.google_meet_url ? (
                            <button
                                onClick={() => window.open(lesson.google_meet_url, '_blank')}
                                className="text-indigo-500 hover:underline"
                            >
                                Join Meeting
                            </button>
                        ) : (
                            'Not provided'
                        )}
                    </p>
                    <p><strong>Feedback:</strong> {lesson.feedback || 'No feedback provided'}</p>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Tutor Information</h2>
                <div className="p-4 bg-indigo-50 rounded-md space-y-2">
                    <p><strong>Name:</strong> {lesson.tutor.user_full_name}</p>
                    <p><strong>Bio:</strong> {lesson.tutor.bio}</p>
                </div>
            </div>

            {lesson.student && (
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Student Information</h2>
                    <div className="p-4 bg-indigo-50 rounded-md space-y-2">
                        <p><strong>Name:</strong> {lesson.student.user_full_name}</p>
                        <p><strong>Bio:</strong> {lesson.student.bio}</p>
                    </div>
                </div>
            )}

            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Lesson Documents</h2>
                <div className="p-4 bg-indigo-50 rounded-md">
                    {documents.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-2">
                            {documents.map((doc) => (
                                <li key={doc.id}>
                                    <a
                                        onClick={() => downloadDocument(doc.document)}
                                        className="text-indigo-500 hover:underline cursor-pointer"
                                    >
                                        {doc.document.split('/').pop()}
                                    </a>{' '}
                                    - Uploaded on {new Date(doc.uploaded_at).toLocaleString()}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No documents uploaded yet.</p>
                    )}
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Upload Document</h2>
                <div className="flex items-center space-x-4">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
                    />
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    <button
                        onClick={uploadDocument}
                        disabled={loading}
                        className={`px-4 py-2 rounded-md text-white font-semibold ${
                            loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'
                        }`}
                    >
                        {loading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            </div>

            {currentDate < lessonEndTime && (
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Provide Feedback</h2>
                    {lesson.feedback ? (
                        <div className="p-4 bg-green-50 rounded-md text-green-700">
                            Feedback already submitted.
                        </div>
                    ) : feedbackSubmitted ? (
                        <div className="p-4 bg-green-50 rounded-md text-green-700">
                            {successMessage}
                        </div>
                    ) : (
                        <div className="p-4 bg-indigo-50 rounded-md space-y-4">
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter your feedback"
                    className="w-full p-2 border border-indigo-300 rounded-md"
                />
                            <div className="flex items-center space-x-2">
                                <label className="text-indigo-600">Rating:</label>
                                <select
                                    value={rating}
                                    onChange={(e) => setRating(Number(e.target.value))}
                                    className="p-2 border border-indigo-300 rounded-md w-32"
                                >
                                    {[0, 1, 2, 3, 4, 5].map((star) => (
                                        <option key={star} value={star}>
                                            {star} Star{star !== 1 && 's'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={submitFeedback}
                                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                            >
                                Submit Feedback
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LessonDetails;