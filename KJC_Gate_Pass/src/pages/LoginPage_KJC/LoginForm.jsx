import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useWindowSize from '../../hooks/useWindowSize';
import eyeClosed from '../../assets/eye_Hide.svg';
import eyeOpened from '../../assets/eye_Show.svg';
import axios from 'axios';

function LoginForm() {
    const { width, height } = useWindowSize();
    const [showPassword, setShowPassword] = useState(false);
    const [text, setText] = useState('Show');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const API_URL = 'http://localhost:3001/api'; // replace <localhost> with this device's IP address to access the website in your network

    useEffect(() => {
        document.title = `Login: ${width} x ${height}`;
    }, [width, height]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
        setText(prevText => (prevText === 'Show' ? 'Hide' : 'Show'));
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleRegister = (event) => {
        event.preventDefault();
        axios.post(`${API_URL}/register`, { username, password, role: 'admin'})
            .then(result => {
                console.log(result);
                setPassword('');
                setUsername('');
            })
            .catch(err => console.log(err));
    };

    const handleLogin = (event) => {
        event.preventDefault();
        const lowercaseUsername = username.toLowerCase();
        axios.post(`${API_URL}/login`, { username: lowercaseUsername, password })
            .then(result => {
                console.log(result);
                if (result.data === "Success") {
                    navigate('/dashboard');
                } else {
                    alert(result.data);
                    navigate('/login');
                }
                setPassword('');
                setUsername('');
            })
            .catch(err => console.log(err));
    };

    return (
            <div className="loginForm">
                <div className="textInput">
                    <label className='textPara' htmlFor='usernameText'>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                        autoComplete="username"
                        id="usernameText"
                        className="inputsB"
                        placeholder="Enter your username"
                    />
                </div>
                <div className="textInput">
                    <div className="textHide">
                        <label className='textPara' htmlFor='passwordText'>Password</label>
                        <div onClick={togglePasswordVisibility}>
                            <img src={showPassword ? eyeOpened : eyeClosed} alt="Toggleable" />
                            <p className='textState'>{text}</p>
                        </div>
                    </div>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={handlePasswordChange}
                        autoComplete="current-password"
                        id="passwordText"
                        className="inputsB"
                        placeholder="Enter your password"
                    />
                </div>
                <button type="submit" className="login-button" onClick={handleLogin}>Log in</button>
                <Link to='/dashboard' className="forgetPwd">Forget your password?</Link>
            </div>
    );
}

export default LoginForm;