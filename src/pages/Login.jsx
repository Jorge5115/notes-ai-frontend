import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

// Toma la URL del backend de Vercel o usa localhost si estás en desarrollo local
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/notes');
        } catch (err) {
            setError('Credenciales inválidas');
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${API_URL}/oauth2/authorization/google`;
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <span className="auth-pill">Notes AI</span>
                    <h2 className="auth-title">Iniciar sesión</h2>
                    <p className="auth-subtitle">Accede a tus notas y sigue trabajando con tu asistente.</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <input className="auth-input" type="email" placeholder="Email" value={email}
                           onChange={(e) => setEmail(e.target.value)} required />
                    <input className="auth-input" type="password" placeholder="Contraseña" value={password}
                           onChange={(e) => setPassword(e.target.value)} required />
                    {error && <p className="auth-error">{error}</p>}
                    <button className="auth-button primary" type="submit">Entrar</button>
                </form>

                <div className="auth-divider">o</div>
                <button className="auth-button secondary" onClick={handleGoogleLogin}>
                    Continuar con Google
                </button>

                <p className="auth-footer">
                    ¿No tienes cuenta? <Link className="auth-link" to="/register">Regístrate</Link>
                </p>
            </div>
        </div>
    );
}