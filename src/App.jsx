import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';
import OAuth2Redirect from './pages/OAuth2Redirect';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
                    <Route
                        path="/notes"
                        element={
                            <PrivateRoute>
                                <Notes />
                            </PrivateRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/notes" />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;