import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(email, password, name);
            navigate('/notes');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrarse');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <span className="auth-pill">Notes AI</span>
                    <h2 className="auth-title">Crear cuenta</h2>
                    <p className="auth-subtitle">Crea tu espacio y empieza a organizar tus ideas.</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <input className="auth-input" type="text" placeholder="Nombre" value={name}
                           onChange={(e) => setName(e.target.value)} required />
                    <input className="auth-input" type="email" placeholder="Email" value={email}
                           onChange={(e) => setEmail(e.target.value)} required />
                    <input className="auth-input" type="password" placeholder="Contraseña (mín. 6 caracteres)" value={password}
                           onChange={(e) => setPassword(e.target.value)} required />
                    {error && <p className="auth-error">{error}</p>}
                    <button className="auth-button primary" type="submit">Registrarme</button>
                </form>

                <p className="auth-footer">
                    ¿Ya tienes cuenta? <Link className="auth-link" to="/login">Inicia sesión</Link>
                </p>
            </div>
        </div>
    );
}
