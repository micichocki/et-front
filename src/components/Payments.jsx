import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';

const Payments = () => {
    const [data, setData] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [paidLessons, setPaidLessons] = useState([]);
    const [notPaidSaldo, setNotPaidSaldo] = useState(0);
    const [paidSaldo, setPaidSaldo] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/tutoring/user/me/');
                const userData = response.data;
                setData(userData);

                let lessonsResponse;
                if (userData.roles[0].id === 3) {
                    lessonsResponse = await axios.get('/api/tutoring/parent/lessons/');
                } else if (userData.roles[0].id === 2) {
                    lessonsResponse = await axios.get('/api/tutoring/tutor/lessons/');
                } else if (userData.roles[0].id === 1) {
                    lessonsResponse = await axios.get('/api/tutoring/student/lessons/');
                }
                const allLessons = lessonsResponse.data;

                const paymentsResponse = await axios.get('/api/tutoring/lesson-payments/');
                const payments = paymentsResponse.data;

                const paidLessons = allLessons.filter(lesson =>
                    payments.some(payment => payment.lesson === lesson.id && payment.payment_status === 'paid')
                );
                const unpaidLessons = allLessons.filter(lesson =>
                    !payments.some(payment => payment.lesson === lesson.id && payment.payment_status === 'paid')
                );

                setLessons(unpaidLessons);
                setPaidLessons(paidLessons);

                if (userData.roles[0].id === 2) {
                    let unpaidSaldo = 0;
                    let paidTotal = 0;

                    unpaidLessons.forEach(lesson => {
                        const startTime = new Date(lesson.start_time);
                        const endTime = new Date(lesson.end_time);
                        const hours = (endTime - startTime) / 36e5;
                        const amount = Math.max(lesson.price_per_hour * hours, 0);
                        if (new Date() > endTime && !lesson.paid) {
                            unpaidSaldo += amount;
                        }
                    });

                    paidLessons.forEach(lesson => {
                        const startTime = new Date(lesson.start_time);
                        const endTime = new Date(lesson.end_time);
                        const hours = (endTime - startTime) / 36e5;
                        const amount = Math.max(lesson.price_per_hour * hours, 0);
                        paidTotal += amount;
                    });

                    setNotPaidSaldo(unpaidSaldo);
                    setPaidSaldo(paidTotal);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const handleWithdraw = () => {
        alert('Withdraw initiated');
    };

    const handlePay = async (lesson) => {
        try {
            const amount = lesson.price_per_hour * ((new Date(lesson.end_time) - new Date(lesson.start_time)) / 36e5);
            await axios.post('/api/tutoring/lesson-payments/', {
                lesson: lesson.id,
                payment_status: 'paid',
                amount: amount,
                payment_date: new Date().toISOString()
            });

            // Update the lessons state by moving the paid lesson to the "paid" section
            setLessons(prevLessons => prevLessons.filter(l => l.id !== lesson.id));
            setPaidLessons(prevPaidLessons => [...prevPaidLessons, lesson]);

            alert(`Payment initiated for lesson ${lesson.id}`);
        } catch (err) {
            console.error(err);
            alert('Payment failed');
        }
    };

    if (!data) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg text-indigo-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <div className="flex items-center mb-6">
                    <img
                        src={data.avatar || 'https://via.placeholder.com/50'}
                        alt="Avatar"
                        className="w-16 h-16 rounded-full border-2 border-indigo-500 mr-4"
                    />
                    <div>
                        <h1 className="text-xl font-semibold text-indigo-700">{data.name}</h1>
                        <p className="text-gray-600">{data.email}</p>
                    </div>
                </div>

                {data.roles[0].id === 2 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-indigo-600">
                            Unpaid Balance: <span className="text-indigo-800">{notPaidSaldo > 0 ? notPaidSaldo : 0} PLN</span>
                        </h2>
                        {notPaidSaldo > 0 && (
                            <button
                                onClick={handleWithdraw}
                                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
                            >
                                Withdraw
                            </button>
                        )}
                        <h3 className="mt-4 text-lg font-semibold text-indigo-600">
                            Paid Balance: <span className="text-indigo-800">{paidSaldo > 0 ? paidSaldo : 0} PLN</span>
                        </h3>
                    </div>
                )}

                <div>
                    <h2 className="text-lg font-semibold text-indigo-600 mb-4">
                        {data.roles[0].id === 1 ? "Lessons to Be Paid" : "Your Lessons"}
                    </h2>
                    <div className="space-y-4">
                        {lessons.map(lesson => {
                            const lessonAmount = Math.max(lesson.price_per_hour * ((new Date(lesson.end_time) - new Date(lesson.start_time)) / 36e5), 0);
                            return (
                                <div key={lesson.id} className="p-4 bg-gray-50 rounded-lg shadow-sm border">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-md font-semibold text-gray-700">Lesson #{lesson.id}</h3>
                                            <p className="text-sm text-gray-500">
                                                {new Date(lesson.start_time).toLocaleString()} - {new Date(lesson.end_time).toLocaleString()}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Amount: <span className="font-semibold">{lessonAmount > 0 ? lessonAmount : 0} PLN</span>
                                            </p>
                                        </div>
                                        {!lesson.paid && data.roles[0].id === 1 && (
                                            <button
                                                onClick={() => handlePay(lesson)}
                                                className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600"
                                            >
                                                Pay
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-indigo-600 mb-4">Paid Lessons</h2>
                    <div className="space-y-4">
                        {paidLessons.map(lesson => {
                            const lessonAmount = Math.max(lesson.price_per_hour * ((new Date(lesson.end_time) - new Date(lesson.start_time)) / 36e5), 0);
                            return (
                                <div key={lesson.id} className="p-4 bg-gray-50 rounded-lg shadow-sm border">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-md font-semibold text-gray-700">Lesson #{lesson.id}</h3>
                                            <p className="text-sm text-gray-500">
                                                {new Date(lesson.start_time).toLocaleString()} - {new Date(lesson.end_time).toLocaleString()}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Amount: <span className="font-semibold">{lessonAmount > 0 ? lessonAmount : 0} PLN</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payments;
