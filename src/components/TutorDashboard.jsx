import React from 'react';

import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';

const TutorDashboard = ({ user }) => {
    useEffect(() => {
        if (!user.tutor_profile.bio) {
            setRedirect(true);
        }
    }, [user]);
    const [redirect, setRedirect] = React.useState(false);
    if (redirect) {
        return <Navigate to="/tutor-profile" user={user} />;
    }


    return (
        <div className="tutor-profile">
            <h2>{user.name}</h2>
            <p>{user.subject}</p>
            <p>{user.email}</p>
            <p>{user.phone}</p>
            <div className="tutor-bio">
                <h3>Bio:</h3>
                <p>{user.bio}</p>
            </div>
        </div>
    );
};

export default TutorDashboard;