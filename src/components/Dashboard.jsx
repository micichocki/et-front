import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import ParentDashboard from './ParentDashboard';
import TutorDashboard from './TutorDashboard';
import StudentDashboard from './StudentDashboard';

const Dashboard = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/tutoring/user/me/');
                console.log(response.data);
                setData(response.data);
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
            {data.roles[0].id === 3 && <ParentDashboard user={data} />}
            {data.roles[0].id === 2 && <TutorDashboard user={data} />}
            {data.roles[0].id === 1 && <StudentDashboard user={data} />}
        </div>
    );
};

export default Dashboard;