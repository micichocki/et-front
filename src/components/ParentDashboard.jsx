import React from 'react';

import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';

const ParentDashboard = ({ user }) => {
    useEffect(() => {
        if (!user.parent_profile.children || user.parent_profile.children.length === 0) {
            setRedirect(true);
        }
    }, [user]);

    const [redirect, setRedirect] = React.useState(false);
    if (redirect) {
        return <Navigate to="/parent-profile" state={{ user }} />;
    }

    return (
        <div className="parent-profile">
            <h1>Parent Profile</h1>
            <div className="profile-details">
                <p>Name: [Parent's Name]</p>
                <p>Email: [Parent's Email]</p>
                <p>Phone: [Parent's Phone]</p>
            </div>
            <div className="children-list">
                <h2>Children</h2>
                <ul>
                    <li>[Child 1]</li>
                    <li>[Child 2]</li>
                    <li>[Child 3]</li>
                </ul>
            </div>
        </div>
    );
};

export default ParentDashboard;