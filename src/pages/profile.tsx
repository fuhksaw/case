import React, { useState, useEffect } from 'react';
import './profile.css';

const Profile: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [skills, setSkills] = useState('...');
    const [description, setDescription] = useState('...');

    // Буфер для хранения данных до начала редактирования
    const [tempData, setTempData] = useState({ name: '', email: '', skills: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
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
            .catch(() => console.log("Бэкенд недоступен"));
        }
    }, []);

    // Функция входа в режим редактирования
    const startEditing = () => {
        // Сохраняем текущие значения в буфер перед тем как дать их менять
        setTempData({ name, email, skills, description });
        setIsEditing(true);
    };

    // Функция отмены
    const handleCancel = () => {
        // Возвращаем значения из буфера обратно
        setName(tempData.name);
        setEmail(tempData.email);
        setSkills(tempData.skills);
        setDescription(tempData.description);
        setIsEditing(false);
    };

    const handleSave = () => {
        setIsEditing(false);
        console.log('Данные сохранены в БД:', { name, email, skills, description });
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-field">
                    <label>Name</label>
                    {isEditing ? (
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    ) : (
                        <p className="profile-value">{name || 'Не указано'}</p>
                    )}
                </div>

                <div className="profile-field">
                    <label>Mail</label>
                    {isEditing ? (
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    ) : (
                        <p className="profile-value">{email || 'Не указано'}</p>
                    )}
                </div>

                <div className="profile-field">
                    <label>Skills</label>
                    {isEditing ? (
                        <textarea value={skills} onChange={(e) => setSkills(e.target.value)} rows={3} />
                    ) : (
                        <p className="profile-value">{skills || 'Пусто'}</p>
                    )}
                </div>

                <div className="profile-field">
                    <label>Description</label>
                    {isEditing ? (
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
                    ) : (
                        <p className="profile-value">{description || 'Пусто'}</p>
                    )}
                </div>

                <div className="profile-actions">
                    {isEditing ? (
                        <>
                            <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                            <button className="save-btn" onClick={handleSave}>Save Changes</button>
                        </>
                    ) : (
                        <>
                            <button className="edit-btn" onClick={startEditing}>Edit Profile</button>
                            <button className="change-pass-btn">Change Password</button>
                        </>
                    )}
                </div>

                <div className="teams-section">
                    <h3 className="teams-title">My teams</h3>
                    <div className="teams-list">
                        {/* Пока команд нет */}
                        <div className="team-item empty">
                            <p className="empty-text">No teams yet. Join or create your first team!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;