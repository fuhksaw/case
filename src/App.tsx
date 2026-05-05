import {useEffect, useState} from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/login';
import Register from './pages/register';
import PrivateRoute from "./components/PrivateRoute.tsx";
import Profile from './pages/profile';

function App() {
    const [userName, setUserName] = useState<string>('Гость');

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const path = window.location.pathname;
            const publicPaths = ['/login', '/register', '/'];

            if (!token) {
                console.log("Нет токена");
                /* БЭКЕНД: Временно скрываем редирект, чтобы не выкидывало
                if (!publicPaths.includes(path)) {
                    window.location.href = '/login';
                }
                */
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/users/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const user = await response.json();
                    setUserName(user.name);
                } else {
                    console.log("Токен недействителен");
                    /* БЭКЕНД: Логика очистки при неверном токене
                    localStorage.removeItem('token');
                    setUserName('Гость');
                    */
                }
            } catch (err) {
                console.error("Ошибка при проверке авторизации:", err);
            }
        };

        checkAuth();
    }, []);

    return (
        <Router>
            <Header />
            <div style={{ paddingTop: '60px' }}>
                <Routes>
                    <Route path="/" element={<div style={{ textAlign: 'center', marginTop: '50px' }}>Главная страница. Пользователь: {userName} </div>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* 
                        ВРЕМЕННО: Выносим Profile из-под PrivateRoute.
                        Теперь страница откроется даже без токена.
                    */}
                    <Route path="/profile" element={<Profile />} />

                    <Route element={<PrivateRoute />}>
                        {/* 
                           БЭКЕНД: Когда верстка будет готова и сервер запущен, 
                           перенеси <Route path="/profile" ... /> обратно сюда.
                        */}
                    </Route>
                </Routes>
            </div>
        </Router>
    );
}

export default App;