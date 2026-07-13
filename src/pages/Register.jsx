import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
        <div>
            <h2>Crear cuenta</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Nombre" value={name}
                       onChange={(e) => setName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email}
                       onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Contraseña (mín. 6 caracteres)" value={password}
                       onChange={(e) => setPassword(e.target.value)} required />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Registrarme</button>
            </form>
            <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
        </div>
    );
}
