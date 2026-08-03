import { useEffect, useState, useRef } from 'react';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './Notes.css';

const FILTERS = [
    { label: 'Todas', value: null },
    { label: 'Texto', value: 'TEXT' },
    { label: 'Listas', value: 'CHECKLIST' },
];

export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [filter, setFilter] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [busyId, setBusyId] = useState(null);
    const { user, logout } = useAuth();

    const dragItem = useRef(null);
    const dragOverItem = useRef(null);

    const loadNotes = async (type = filter) => {
        const { data } = await axiosInstance.get('/notes', { params: type ? { type } : {} });
        setNotes(data);
    };

    useEffect(() => {
        loadNotes(filter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    // Drag & Drop Reordenable
    const handleDragStart = (index) => { dragItem.current = index; };

    const handleDragEnter = (index) => {
        if (dragItem.current === null || dragItem.current === index) return;
        const copy = [...notes];
        const dragged = copy[dragItem.current];
        copy.splice(dragItem.current, 1);
        copy.splice(index, 0, dragged);
        dragItem.current = index; // importante: actualiza la posición actual
        setNotes(copy);
    };

    const handleDragEnd = () => {
        if (dragItem.current !== null && dragOverItem.current !== null) {
            const copyListItems = [...notes];
            const dragItemContent = copyListItems[dragItem.current];
            copyListItems.splice(dragItem.current, 1);
            copyListItems.splice(dragOverItem.current, 0, dragItemContent);
            dragItem.current = null;
            dragOverItem.current = null;
            setNotes(copyListItems);
        }
    };

    const handleDelete = async (id, e) => {
        e?.stopPropagation();
        await axiosInstance.delete(`/notes/${id}`);
        if (selectedNote?.id === id) setSelectedNote(null);
        loadNotes();
    };

    // Guardar cambios al editar el texto de una nota
    const handleSaveNote = async (id, updatedFields) => {
        await axiosInstance.put(`/notes/${id}`, updatedFields);
        await loadNotes();
        const updated = await axiosInstance.get(`/notes`);
        const current = updated.data.find(n => n.id === id);
        if (current) setSelectedNote(current);
    };

    const handleSummarize = async (id) => {
        setBusyId(id);
        try {
            await axiosInstance.post(`/notes/${id}/summarize`);
            await loadNotes();
            const updated = await axiosInstance.get(`/notes`);
            const current = updated.data.find(n => n.id === id);
            if (current) setSelectedNote(current);
        } finally {
            setBusyId(null);
        }
    };

    const handleRewrite = async (id) => {
        setBusyId(id);
        try {
            await axiosInstance.post(`/notes/${id}/rewrite`);
            await loadNotes();
            const updated = await axiosInstance.get(`/notes`);
            const current = updated.data.find(n => n.id === id);
            if (current) setSelectedNote(current);
        } finally {
            setBusyId(null);
        }
    };

    const handleToggleItem = async (noteId, itemId, checked, e) => {
        e?.stopPropagation();
        setNotes((prev) =>
            prev.map((n) =>
                n.id !== noteId
                    ? n
                    : { ...n, items: n.items.map((it) => (it.id === itemId ? { ...it, checked } : it)) }
            )
        );
        if (selectedNote?.id === noteId) {
            setSelectedNote(prev => ({
                ...prev,
                items: prev.items.map(it => it.id === itemId ? { ...it, checked } : it)
            }));
        }
        await axiosInstance.patch(`/notes/${noteId}/items/${itemId}`, { checked });
    };

    return (
        <div className="board-layout">
            <header className="board-topbar">
                <div className="brand">
                    <span className="board-eyebrow">WORKSPACE DE</span>
                    <h1 className="board-title">{user?.name || 'Mi Bloc'}</h1>
                </div>
                <button className="btn-logout" onClick={logout}>Cerrar sesión</button>
            </header>

            <nav className="board-filters">
                {FILTERS.map((f) => (
                    <button
                        key={f.label}
                        className={`filter-pill ${filter === f.value ? 'active' : ''}`}
                        onClick={() => setFilter(f.value)}
                    >
                        {f.label}
                    </button>
                ))}
            </nav>

            {notes.length === 0 ? (
                <div className="board-empty">
                    <p>No hay notas guardadas.</p>
                </div>
            ) : (
                <div className="notes-grid">
                    {notes.map((note, index) => (
                        <div
                            key={note.id}
                            className="note-card"
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragEnter={() => handleDragEnter(index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => setSelectedNote(note)}
                        >
                            <div className="card-header">
                                <span className="card-tag">{note.type === 'CHECKLIST' ? '☑ Lista' : '✎ Texto'}</span>
                                <button className="btn-icon-delete" onClick={(e) => handleDelete(note.id, e)} title="Borrar">✕</button>
                            </div>
                            
                            <h3 className="card-title">{note.title}</h3>

                            <div className="card-preview">
                                {note.type === 'TEXT' ? (
                                    <div className="text-snippet-container">
                                        {/* 1. Dividimos por saltos de línea O por guiones */}
                                        {note.content
                                            ?.split(/(?=\n|- )/) 
                                            .map(line => line.trim())
                                            .filter(line => line.length > 0)
                                            .slice(0, 4) // Mostramos máximo 4 líneas independientes
                                            .map((line, idx) => (
                                                <p key={idx} className="single-line-text">
                                                    {line}
                                                </p>
                                            ))
                                        }
                                    </div>
                                ) : (
                                    <ul className="checklist-snippet">
                                        {/* Si hay más de 3 ítems, mostramos solo los 3 primeros para dejar espacio al contador */}
                                        {(note.items?.length > 3 ? note.items.slice(0, 3) : note.items?.slice(0, 4))?.map((item) => (
                                            <li key={item.id} className={item.checked ? 'checked' : ''}>
                                                <span>{item.checked ? '✓' : '○'}</span> {item.text}
                                            </li>
                                        ))}
                                        {note.items?.length > 3 && (
                                            <li className="more-items">
                                                +{note.items.length - 3} {note.items.length - 3 === 1 ? 'punto restante...' : 'puntos restantes...'}
                                            </li>
                                        )}
                                    </ul>
                                )}
                            </div>

                            {note.aiSummary && (
                                <div className="summary-badge">
                                    <span>★ RESUMEN CON IA ADJUNTO</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <button className="fab" onClick={() => setShowCreateModal(true)} title="Nueva nota">+</button>

            {showCreateModal && (
                <NewNoteModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={() => {
                        setShowCreateModal(false);
                        loadNotes();
                    }}
                />
            )}

            {selectedNote && (
                <ViewNoteModal
                    note={selectedNote}
                    busyId={busyId}
                    onClose={() => setSelectedNote(null)}
                    onDelete={handleDelete}
                    onSave={handleSaveNote}
                    onSummarize={handleSummarize}
                    onRewrite={handleRewrite}
                    onToggleItem={handleToggleItem}
                />
            )}
        </div>
    );
}

// Modal de edición y detalle de la nota
function ViewNoteModal({ note, busyId, onClose, onDelete, onSave, onSummarize, onRewrite, onToggleItem }) {
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content || '');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setTitle(note.title);
        setContent(note.content || '');
        setIsEditing(false);
    }, [note]);

    const handleContentChange = (e) => {
        setContent(e.target.value);
        setIsEditing(true);
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        setIsEditing(true);
    };

    const handleSaveChanges = async () => {
        await onSave(note.id, {
            title,
            type: note.type,
            content: note.type === 'TEXT' ? content : null,
            items: null,
        });
        setIsEditing(false);
    };

    const handleCancelChanges = () => {
        setTitle(note.title);
        setContent(note.content || '');
        setIsEditing(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-stack" onClick={(e) => e.stopPropagation()}>
                
                {/* 1. VENTANA PRINCIPAL DE LA NOTA */}
                <div className="modal-card modal-desktop-extra-wide">
                    <div className="modal-header">
                        <span className="card-tag">
                            {note.type === 'CHECKLIST' ? '☑ Lista de tareas' : '✎ Nota de texto'}
                        </span>
                        <button className="btn-close" onClick={onClose}>✕</button>
                    </div>

                    {/* Título editable */}
                    <input
                        className="modal-title-input"
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Título de la nota..."
                    />

                    <div className="main-content-col">
                        <div className="content-label-row">
                            <span className="col-label">Contenido de la nota</span>
                            {note.type === 'TEXT' && (
                                <div className="ai-quick-actions">
                                    <button
                                        className="btn-action-ai"
                                        onClick={() => onSummarize(note.id)}
                                        disabled={busyId === note.id}
                                    >
                                        {busyId === note.id ? 'Generando...' : 'Resumir con IA'}
                                    </button>
                                    <button
                                        className="btn-action-ai outline"
                                        onClick={() => onRewrite(note.id)}
                                        disabled={busyId === note.id}
                                    >
                                        {busyId === note.id ? 'Procesando...' : 'Hacer más breve'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {note.type === 'TEXT' ? (
                            <textarea
                                className="editor-textarea"
                                value={content}
                                onChange={handleContentChange}
                                placeholder="Escribe aquí tu nota..."
                                rows={8}
                            />
                        ) : (
                            <ul className="full-checklist">
                                {note.items?.map((item) => (
                                    <li key={item.id}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={item.checked}
                                                onChange={(e) => onToggleItem(note.id, item.id, e.target.checked)}
                                            />
                                            <span className={item.checked ? 'checked' : ''}>{item.text}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Footer del Modal: Guardar / Cancelar si se ha editado, o Borrar */}
                    <div className="modal-footer">
                        {isEditing ? (
                            <div className="edit-actions">
                                <button className="btn-secondary" onClick={handleCancelChanges}>
                                    Cancelar
                                </button>
                                <button className="btn-primary" onClick={handleSaveChanges}>
                                    Guardar cambios
                                </button>
                            </div>
                        ) : (
                            <button className="btn-danger" onClick={(e) => onDelete(note.id, e)}>
                                Borrar esta nota
                            </button>
                        )}
                    </div>
                </div>

                {/* 2. SUBVENTANA FLOTANTE DE IA (DEBAJO Y MISMO ANCHO) */}
                {note.aiSummary && (
                    <div className="modal-card ai-floating-card">
                        <div className="ai-floating-header">
                            <span className="card-tag font-ai">★ Resumen Asistente IA</span>
                        </div>
                        <div className="ai-floating-content">
                            <p>{note.aiSummary}</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

function NewNoteModal({ onClose, onCreated }) {
    const [type, setType] = useState('TEXT');
    const [useAi, setUseAi] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [itemsText, setItemsText] = useState('');
    const [prompt, setPrompt] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (useAi) {
                await axiosInstance.post('/notes/generate', { title, type, prompt });
            } else if (type === 'TEXT') {
                await axiosInstance.post('/notes', { title, type, content, items: null });
            } else {
                const items = itemsText.split('\n').map((s) => s.trim()).filter(Boolean);
                await axiosInstance.post('/notes', { title, type, content: null, items });
            }
            onCreated();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <form className="modal-card modal-create" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
                <h3>Nueva nota</h3>

                <div className="type-toggle">
                    <button
                        type="button"
                        className={type === 'TEXT' ? 'active' : ''}
                        onClick={() => setType('TEXT')}
                    >
                        ✎ Texto
                    </button>
                    <button
                        type="button"
                        className={type === 'CHECKLIST' ? 'active' : ''}
                        onClick={() => setType('CHECKLIST')}
                    >
                        ☑ Lista
                    </button>
                </div>

                <input
                    className="input-field"
                    placeholder="Título de la nota"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    autoFocus
                />

                <label className="ai-switch">
                    <input type="checkbox" checked={useAi} onChange={(e) => setUseAi(e.target.checked)} />
                    <span>Generar contenido con IA</span>
                </label>

                {useAi ? (
                    <textarea
                        className="input-field"
                        placeholder={type === 'TEXT' ? '¿Qué quieres redactar?' : '¿De qué trata la lista?'}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        required
                        rows={4}
                    />
                ) : type === 'TEXT' ? (
                    <textarea
                        className="input-field"
                        placeholder="Escribe tu contenido aquí..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={5}
                    />
                ) : (
                    <textarea
                        className="input-field"
                        placeholder={'Un elemento por línea:\nElemento 1\nElemento 2'}
                        value={itemsText}
                        onChange={(e) => setItemsText(e.target.value)}
                        required
                        rows={5}
                    />
                )}

                <div className="modal-actions">
                    <button type="submit" className="btn-primary" disabled={submitting}>
                        {submitting ? 'Guardando...' : 'Crear Nota'}
                    </button>
                    <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
                </div>
            </form>
        </div>
    );
}