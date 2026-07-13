import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

    return (
        <div>
            <h2>Iniciar sesión</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email}
                       onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Contraseña" value={password}
                       onChange={(e) => setPassword(e.target.value)} required />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Entrar</button>
            </form>
            <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
        </div>
    );
}
