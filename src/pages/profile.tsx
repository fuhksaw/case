// src/pages/profile.tsx
import React, { useState, useEffect } from 'react';
import './profile.css';

const Profile: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [skills, setSkills] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        // Загружаем данные из localStorage или через fetch
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:8080/api/users/me', {
                headers: { 'Authorization': 'Bearer ' + token }
            })
            .then(res => res.json())
            .then(data => {
                setName(data.name || '');
                setEmail(data.email || '');
                setSkills(data.skills || '');
                setDescription(data.description || '');
            })
            .catch(err => console.error("Ошибка загрузки профиля", err));
        }
    }, []);

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/users/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ name, email, skills, description })
        });

        if (response.ok) {
            alert('Изменения сохранены!');
        } else {
            alert('Ошибка при сохранении');
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-field">
                    <label>Name</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Name"
                    />
                </div>

                <div className="profile-field">
                    <label>Mail</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Mail"
                    />
                </div>

                <div className="profile-field">
                    <label>Skills</label>
                    <textarea 
                        value={skills} 
                        onChange={(e) => setSkills(e.target.value)} 
                        placeholder="Skills"
                        rows={3}
                    />
                </div>

                <div className="profile-field">
                    <label>Description</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        placeholder="Description"
                        rows={5}
                    />
                </div>

                <div className="profile-actions">
                    <button className="change-pass-btn">Change password</button>
                    <button className="save-btn" onClick={handleSave}>Save changes</button>
                </div>
                
                <div className="teams-section">
                    <h3>My teams</h3>
                    <div className="teams-list">
                        <p className="empty-text">No teams yet</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;