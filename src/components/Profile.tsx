import React, { useState } from 'react';
import AuthService from '../auth/AuthService';

const Profile: React.FC = () => {
    const [field, setField] = useState<'name' | 'password'>('name');
    const [value, setValue] = useState('');
    const [message, setMessage] = useState<string | null>(null);

    const handleChange = async () => {
        const result = await AuthService.change(field, value);
        if (result) {
            setMessage(result);
        } else {
            setMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
            setValue(''); // Clear input after successful update
        }
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
        if (!confirmDelete) return;

        const result = await AuthService.deleteAccount();
        if (result) {
            setMessage(result); // Show error message if deletion failed
        } else {
            setMessage("Your account has been deleted successfully.");
            // Redirect user or take any appropriate action after account deletion
            setTimeout(() => {
                window.location.href = '/'; // Redirect to home page or login page
            }, 3000);
        }
    };

    return (
        <>
            <h3>Profile</h3>
            <p>
                Welcome to your profile page, <strong>{AuthService.getUsername()}</strong>
            </p>
            <div>
                <h4>Update Profile</h4>
                <label>
                    Field to update:
                    <select value={field} onChange={(e) => setField(e.target.value as 'name' | 'password')}>
                        <option value="name">Username</option>
                        <option value="password">Password</option>
                    </select>
                </label>
                <br />
                <label>
                    New {field}:
                    <input
                        type={field === 'password' ? 'password' : 'text'}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={`Enter new ${field}`}
                    />
                </label>
                <br />
                <button onClick={handleChange}>Update</button>
                {message && <p>{message}</p>}
            </div>
            <hr />
            <div>
                <h4>Danger Zone</h4>
                <button onClick={handleDeleteAccount} style={{ color: 'red' }}>
                    Delete Account
                </button>
            </div>
        </>
    );
};

export default Profile;
