import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import avatarImage from '../assets/images/avatar.png';

const TutorSearch = ({ user, onSendMessage }) => {
    const [city, setCity] = useState(user?.city || '');
    const [subject, setSubject] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [tutors, setTutors] = useState([]);
    const [remoteOnly, setRemoteOnly] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showTel, setShowTel] = useState({});

    useEffect(() => {
        handleSearch();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/tutoring/tutors', {
                params: {
                    city: remoteOnly ? '' : city,
                    subject,
                    min_price: minPrice,
                    max_price: maxPrice,
                    remote_only: remoteOnly,
                },
            });

            const sortedTutors = response.data.sort((a, b) => {
                if (b.tutor_profile.average_rating !== a.tutor_profile.average_rating) {
                    return b.tutor_profile.average_rating - a.tutor_profile.average_rating;
                }
                if (user.city && a.city === user.city && b.city !== user.city) {
                    return -1;
                }
                if (user.city && b.city === user.city && a.city !== user.city) {
                    return 1;
                }
                return 0;
            });

            setTutors(sortedTutors);
        } catch (error) {
            console.error('Error fetching tutors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = (tutor) => {
        if (onSendMessage) {
            onSendMessage(tutor); // Call the parent-provided method
        }
    };
    const handleShowTel = (tutorId) => {
        setShowTel((prev) => ({ ...prev, [tutorId]: true }));
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span key={i} className={i < rating ? 'text-yellow-500' : 'text-gray-300'}>
                    &#9733;
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded-lg shadow-md border border-indigo-300">
                    <h2 className="text-xl font-semibold text-indigo-600 mb-4">Find a Tutor</h2>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            disabled={remoteOnly}
                            className="border border-indigo-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
                        />
                        <input
                            type="text"
                            placeholder="Subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="border border-indigo-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
                        />
                        <input
                            type="number"
                            placeholder="Min Price"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="border border-indigo-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
                        />
                        <input
                            type="number"
                            placeholder="Max Price"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="border border-indigo-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
                        />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={handleSearch}
                            className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <label className="text-sm text-gray-600 mr-2">Remote Only:</label>
                                <input
                                    type="checkbox"
                                    checked={remoteOnly}
                                    onChange={(e) => setRemoteOnly(e.target.checked)}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="text-sm text-gray-600 mr-2">Sort by Rating:</label>
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="border border-indigo-300 rounded px-6 py-1 focus:outline-none focus:ring focus:ring-indigo-300"
                                >
                                    <option value="asc">Ascending</option>
                                    <option value="desc">Descending</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    {tutors.length > 0 ? (
                        <div className="space-y-6">
                            {tutors.map((tutor) => (
                                <div
                                    key={tutor.id}
                                    className="bg-white p-6 rounded-lg shadow-md border border-indigo-300 flex items-start space-x-4 relative"
                                >
                                    <img
                                        src={tutor.avatar || avatarImage}
                                        alt={`${tutor.first_name} ${tutor.last_name}`}
                                        className="h-20 w-20 rounded-full border border-indigo-300"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-indigo-600">
                                            {tutor.first_name} {tutor.last_name}
                                        </h3>
                                        <p className="text-gray-600">{tutor.city}</p>
                                        <p className="text-indigo-600">
                                            {tutor.tutor_profile.is_remote ? 'Remote lessons available' : 'In-person lessons only'}
                                        </p>
                                        <div>{renderStars(tutor.tutor_profile.average_rating)}</div>
                                        <p className="mt-2 text-gray-800 font-semibold">
                                            Subjects:
                                            {tutor.tutor_profile.subject_prices.map((price) => (
                                                <span
                                                    key={price.subject.id}
                                                    className="block text-sm text-gray-600"
                                                >
                                                    {price.subject.name}: {price.price_min} - {price.price_max} PLN/h
                                                </span>
                                            ))}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center space-y-2">
                                        <button
                                            onClick={() => handleSendMessage(tutor)}
                                            className="bg-indigo-500 text-white px-4 py-2 rounded"
                                        >
                                            Send Message
                                        </button>
                                            {tutor.phone_number && !showTel[tutor.id] && (
                                                <button
                                                    onClick={() => handleShowTel(tutor.id)}
                                                    className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition"
                                                >
                                                    Show Phone
                                                </button>
                                            )}
                                            {showTel[tutor.id] && (
                                                <p className="text-gray-800">Tel: {tutor.phone_number}</p>
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center">
                            {loading ? 'Loading tutors...' : 'No tutors found. Try adjusting the filters.'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TutorSearch;
