import React, { useState } from "react";
import axios from '../axiosConfig';

const LessonBooking = ({ user, recipient, isBookingPopupOpen, setIsBookingPopupOpen }) => {
    const [priceError, setPriceError] = useState("");
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [allowSubmit, setAllowSubmit] = useState(false);
    const [isRemote, setIsRemote] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLessonSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        const lessonDetails = {
            student:  user.student_profile.id,
            tutor: recipient.tutor_profile.id,
            date: event.target.date.value,
            start_time: event.target.start_time.value,
            end_time: event.target.end_time.value,
            subject: event.target.subject.value,
            price_per_hour: Number(event.target.preferable_price_per_hour.value),
            is_remote: isRemote,
            accepted_by: user.roles[0].id === 1 ? 'Tutor' : 'Student',
            description: event.target.description.value,
        };
        if (
            selectedSubject &&
            (lessonDetails.price_per_hour < selectedSubject.price_min ||
                lessonDetails.price_per_hour > selectedSubject.price_max)
        ) {
            setPriceError(
                `The price per hour must be between ${selectedSubject.price_min} and ${selectedSubject.price_max}.
                If you want to proceed, submit again.`
            );

            if (!allowSubmit) {
                setAllowSubmit(true);
                setIsSubmitting(false);
                return;
            }
        }

        setPriceError("");
        setAllowSubmit(false);

        try {
            await axios.post('/api/tutoring/lessons-create/', lessonDetails);
            event.target.reset();
            setSuccessMessage("Lesson created successfully!");
            setIsSubmitting(false);
        } catch (error) {
            setError(error.response?.data?.error || error.error);
            setIsSubmitting(false);
        }
    };

    const handleSubjectChange = (event) => {
        const subjectId = event.target.value;
        const subject = recipient.tutor_profile.subject_prices.find(
            (sub) => sub.subject.id === parseInt(subjectId)
        );
        setSelectedSubject(subject);
        setPriceError("");
        setAllowSubmit(false);
    };

    return (
        isBookingPopupOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg relative w-1/2 border-2 border-indigo-500">
                    <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        onClick={() => setIsBookingPopupOpen(false)}
                    >
                        ✕
                    </button>
                    <h2 className="text-lg font-medium mb-4 text-indigo-700">Book a Lesson</h2>
                    {isSubmitting ? (
                        <div className="mb-4 text-indigo-500 text-sm">
                            Submitting your lesson...
                        </div>
                    ) : (
                        <>
                            {successMessage && (
                                <div className="mb-4 text-green-500 text-lg font-bold">
                                    {successMessage}
                                </div>
                            )}
                            {priceError && (
                                <div className="mb-4 text-red-500 text-sm">
                                    {priceError}
                                </div>
                            )}
                            <form onSubmit={handleLessonSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm mb-2">Date:</label>
                                    <input
                                        type="date"
                                        name="date"
                                        className="w-full p-2 border border-indigo-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm mb-2">Start Time:</label>
                                    <input
                                        type="time"
                                        name="start_time"
                                        className="w-full p-2 border border-indigo-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm mb-2">End Time:</label>
                                    <input
                                        type="time"
                                        name="end_time"
                                        className="w-full p-2 border border-indigo-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm mb-2">Subject:</label>
                                    <select
                                        name="subject"
                                        className="w-full p-2 border border-indigo-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                                        required
                                        onChange={handleSubjectChange}
                                    >
                                        <option value="">Select a subject</option>
                                        {recipient.tutor_profile.subject_prices.map((subject) => (
                                            <option key={subject.subject.id} value={subject.subject.id}>
                                                {subject.subject.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {selectedSubject && (
                                    <div className="mb-4 text-gray-700 text-sm">
                                        Price Range for <span
                                        className="font-semibold">{selectedSubject.subject.name}</span>:{" "}
                                        <span className="text-indigo-500">
                                            {selectedSubject.price_min} - {selectedSubject.price_max} per hour
                                        </span>
                                    </div>
                                )}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm mb-2">Preferable Price per
                                        Hour:</label>
                                    <input
                                        type="number"
                                        name="preferable_price_per_hour"
                                        className="w-full p-2 border border-indigo-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4 flex items-center justify-center">
                                    <label className="text-indigo-700 text-sm font-medium mr-2">Remote Lesson:</label>
                                    <input
                                        type="checkbox"
                                        name="is_remote"
                                        className="h-4 ml-2 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                        checked={isRemote}
                                        onChange={(e) => setIsRemote(e.target.checked)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm mb-2">Description:</label>
                                    <textarea
                                        name="description"
                                        className="w-full p-2 border border-indigo-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className={`px-4 py-2 rounded-lg text-white ${
                                            allowSubmit ? "bg-green-500 hover:bg-green-600" : "bg-indigo-500 hover:bg-indigo-600"
                                        }`}
                                    >
                                        {allowSubmit ? "Confirm and Book" : "Book"}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        )
    );
};

export default LessonBooking;