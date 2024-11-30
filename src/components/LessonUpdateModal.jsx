import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';

const LessonUpdateModal = ({ user, tutor, lesson, isOpen, onClose, onUpdate, subjects }) => {
    const [updatedLesson, setUpdatedLesson] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [priceError, setPriceError] = useState("");

    useEffect(() => {
        if (lesson) {
            setUpdatedLesson({ ...lesson });
            if (lesson.subject) {
                const initialSubject = subjects.find(sub => sub.id === lesson.subject.id);
                setSelectedSubject(initialSubject);
            }
        }
    }, [lesson, subjects]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedLesson({ ...updatedLesson, [name]: value });
    };

    const handleSubjectChange = (e) => {
        const subjectId = e.target.value;
        const subject = tutor.subject_prices.find(
            (sub) => sub.subject.id === parseInt(subjectId)
        );
        setSelectedSubject(subject);
        setUpdatedLesson({ ...updatedLesson, subject: subject });
        setPriceError("");
    };

    const handlePriceChange = (e) => {
        const price = Number(e.target.value);
        if (selectedSubject && (price < selectedSubject.price_min || price > selectedSubject.price_max)) {
            setPriceError(`The price per hour must be between ${selectedSubject.price_min} and ${selectedSubject.price_max}.`);
        } else {
            setPriceError("");
        }
        setUpdatedLesson({ ...updatedLesson, price_per_hour: price });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!updatedLesson || !updatedLesson.id) {
            console.error('Lesson ID is missing');
            return;
        }

        if (user.roles[0].id === 1 || user.roles[0].id === 3) {
            updatedLesson.accepted_by = 'Tutor';
        } else if (user.roles[0].id === 2) {
            updatedLesson.accepted_by = 'Student';
        }

        const dataToSend = {
            description: updatedLesson.description,
            subject: selectedSubject.id,
            start_time: updatedLesson.start_time,
            end_time: updatedLesson.end_time,
            price_per_hour: updatedLesson.price_per_hour,
            is_remote: updatedLesson.is_remote,
            accepted_by: updatedLesson.accepted_by
        };

        if (priceError) {
            return;
        }

        try {
            const response = await axios.put(`/api/tutoring/lessons/${updatedLesson.id}/`, dataToSend, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                onUpdate(response.data);
                onClose();
                window.location.reload();
            } else {
                console.error('Failed to update lesson');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (!isOpen || !updatedLesson) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Update Lesson and send proposition</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Subject</label>
                        <select
                            name="subject"
                            value={updatedLesson.subject?.id || ""}
                            onChange={handleSubjectChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="" disabled>Select a subject</option>
                            {subjects.map(subject => (
                                <option key={subject.id} value={subject.id}>
                                    {subject.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {selectedSubject && (
                        <div className="mb-4 text-gray-700 text-sm">
                            Price Range for <span className="font-semibold">{selectedSubject.name}</span>:{" "}
                            <span className="text-indigo-500">
                               {selectedSubject.price_min} - {selectedSubject.price_max} per hour
                            </span>
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-gray-700">Start Time</label>
                        <input
                            type="datetime-local"
                            name="start_time"
                            value={new Date(updatedLesson.start_time).toISOString().slice(0, 16)}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">End Time</label>
                        <input
                            type="datetime-local"
                            name="end_time"
                            value={new Date(updatedLesson.end_time).toISOString().slice(0, 16)}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Price per hour</label>
                        <input
                            type="number"
                            name="price_per_hour"
                            value={updatedLesson.price_per_hour}
                            onChange={handlePriceChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        {priceError && (
                            <div className="text-red-500 text-sm mt-2">
                                {priceError}
                            </div>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Remote</label>
                        <select
                            name="is_remote"
                            value={updatedLesson.is_remote}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={updatedLesson.description}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="mr-4 px-4 py-2 bg-gray-500 text-white rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LessonUpdateModal;