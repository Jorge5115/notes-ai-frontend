import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function OAuth2Redirect() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        const name = searchParams.get('name');

        if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ email, name }));
            // Recargamos para que AuthContext lea el localStorage ya actualizado
            window.location.href = '/notes';
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate]);

    return <p>Iniciando sesión...</p>;
}