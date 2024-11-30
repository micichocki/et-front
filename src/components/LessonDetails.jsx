import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axiosConfig';

const LessonDetails = () => {
    const { id } = useParams();
    const [lesson, setLesson] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

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
            console.error('Error uploading document:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadDocument = (url) => {
        window.open(url, '_blank');
    };

    if (!lesson) return <p className="text-center text-indigo-600">Loading...</p>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl border-2 border-indigo-500 mt-10">
            <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center border-b-4 border-indigo-500 pb-2">
                Lesson Details
            </h1>

            <div className="mb-8 p-4 border border-indigo-300 rounded-lg">
                <h2 className="text-xl font-semibold text-indigo-600 mb-4 border-b border-indigo-400 pb-2">
                    General Information
                </h2>
                <p><strong>Subject:</strong> {lesson.subject.name}</p>
                <p><strong>Start Time:</strong> {new Date(lesson.start_time).toLocaleString()}</p>
                <p><strong>End Time:</strong> {new Date(lesson.end_time).toLocaleString()}</p>
                <p><strong>Price Per Hour:</strong> {lesson.price_per_hour} PLN </p>
                <p>
                    <strong>Google Meet URL:</strong>{' '}
                    {lesson.google_meet_url ? (
                        <a
                            href={lesson.google_meet_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-500 hover:underline"
                        >
                            Join Meeting
                        </a>
                    ) : (
                        'Not provided'
                    )}
                </p>
                <p><strong>Feedback:</strong> {lesson.feedback || 'No feedback provided'}</p>
            </div>

            {/* Tutor Information */}
            <div className="mb-8 p-4 border border-indigo-300 rounded-lg">
                <h2 className="text-xl font-semibold text-indigo-600 mb-4 border-b border-indigo-400 pb-2">
                    Tutor Information
                </h2>
                <p><strong>Name:</strong> {lesson.tutor.user_full_name}</p>
                <p><strong>Bio:</strong> {lesson.tutor.bio}</p>
            </div>

            {/* Student Information */}
            {lesson.student && (
                <div className="mb-8 p-4 border border-indigo-300 rounded-lg">
                    <h2 className="text-xl font-semibold text-indigo-600 mb-4 border-b border-indigo-400 pb-2">
                        Student Information
                    </h2>
                    <p><strong>Name:</strong> {lesson.student.user_full_name}</p>
                    <p><strong>Bio:</strong> {lesson.student.bio}</p>
                </div>
            )}

            {/* Lesson Documents */}
            <div className="mb-8 p-4 border border-indigo-300 rounded-lg">
                <h2 className="text-xl font-semibold text-indigo-600 mb-4 border-b border-indigo-400 pb-2">
                    Lesson Documents
                </h2>
                {documents.length > 0 ? (
                    <ul className="list-disc list-inside">
                        {documents.map((doc) => (
                            <li key={doc.id} className="my-2">
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

            {/* Upload Document */}
            <div className="p-4 border border-indigo-300 rounded-lg">
                <h2 className="text-xl font-semibold text-indigo-600 mb-4 border-b border-indigo-400 pb-2">
                    Upload Document
                </h2>
                <div className="flex items-center space-x-4">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-indigo-100 file:text-indigo-700
                            hover:file:bg-indigo-200"
                    />
                    <button
                        onClick={uploadDocument}
                        disabled={loading}
                        className={`px-4 py-2 rounded-md text-white font-semibold ${
                            loading
                                ? 'bg-indigo-300 cursor-not-allowed'
                                : 'bg-indigo-500 hover:bg-indigo-600'
                        }`}
                    >
                        {loading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LessonDetails;
