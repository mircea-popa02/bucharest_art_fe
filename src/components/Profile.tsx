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
        </>
    );
};

export default Profile;
