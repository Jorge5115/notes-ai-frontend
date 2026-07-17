import { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { user, logout } = useAuth();

    const loadNotes = async () => {
        const { data } = await axiosInstance.get('/notes');
        setNotes(data);
    };

    useEffect(() => {
        loadNotes();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        await axiosInstance.post('/notes', { title, content });
        setTitle('');
        setContent('');
        loadNotes();
    };

    const handleDelete = async (id) => {
        await axiosInstance.delete(`/notes/${id}`);
        loadNotes();
    };

    const handleSummarize = async (id) => {
        await axiosInstance.post(`/notes/${id}/summarize`);
        loadNotes();
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2>Mis notas ({user?.name})</h2>
                <button onClick={logout}>Cerrar sesión</button>
            </div>

            <form onSubmit={handleCreate}>
                <input placeholder="Título" value={title}
                       onChange={(e) => setTitle(e.target.value)} required />
                <textarea placeholder="Contenido" value={content}
                          onChange={(e) => setContent(e.target.value)} required />
                <button type="submit">Crear nota</button>
            </form>

            <ul>
                {notes.map((note) => (
                    <li key={note.id}>
                        <strong>{note.title}</strong>
                        <p>{note.content}</p>
                        {note.aiSummary && <p><em>Resumen IA: {note.aiSummary}</em></p>}
                        <button onClick={() => handleSummarize(note.id)}>Resumir con IA</button>
                        <button onClick={() => handleDelete(note.id)}>Borrar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}