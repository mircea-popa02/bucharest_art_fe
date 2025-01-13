import React from 'react';
import AuthService from '../auth/AuthService';

const Profile: React.FC = () => {
    return <>
        <h3>Profile</h3>
        <p>
            Welcome to your profile page, <strong>{AuthService.getUsername()}</strong>
        </p>
    </>
};

export default Profile;
