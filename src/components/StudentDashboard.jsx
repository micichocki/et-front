import React from 'react';

import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';

const StudentDashboard = ({ user }) => {

    useEffect(() => {
        if (!user.student_profile.education_level || user.student_profile.education_level) {
            setRedirect(true);
        }
    }, [user]);

    const [redirect, setRedirect] = React.useState(false);

    if (redirect) {
        return <Navigate to="/student-profile"  user={user} />;
    }

    return (
        <div className="student-profile">
            <h2>{user.name}</h2>
            <p>Age: {user.age}</p>
            <p>Major: {user.major}</p>
            <p>GPA: {user.gpa}</p>
        </div>
    );
};

export default StudentDashboard;