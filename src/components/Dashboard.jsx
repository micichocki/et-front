import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import ParentDashboard from './ParentDashboard';
import TutorDashboard from './TutorDashboard';
import StudentDashboard from './StudentDashboard';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [lessons, setLessons] = useState([]);

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
                console.log(lessonsResponse.data);
                setLessons(lessonsResponse.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);




    if (!data) {
        return <div>Loading...</div>;
    }
    return (

        <div>
            {data.roles[0].id === 3 && <ParentDashboard user={data} lessons={lessons}/>}
            {data.roles[0].id === 2 && <TutorDashboard user={data} lessons={lessons} />}
            {data.roles[0].id === 1 && <StudentDashboard user={data} lessons={lessons} />}
        </div>
    );
};

export default Dashboard;