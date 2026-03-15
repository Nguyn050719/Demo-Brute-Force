import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

function Header() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="header">
            <div className="nav-container">
                <NavLink to="/" className="logo-link">
                    <BookOpen size={28} className="logo-icon" />
                    <span>Lumina Books</span>
                </NavLink>

                <nav className="nav-links">
                    <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                        Trang Chủ
                    </NavLink>
                    
                    {user ? (
                        <>
                            {user.role === 'admin' ? (
                                <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                                    Quản Trị
                                </NavLink>
                            ) : (
                                <NavLink to="/account" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                                    Tài Khoản
                                </NavLink>
                            )}
                            <button onClick={handleLogout} className="btn-logout">
                                Đăng Xuất
                            </button>
                        </>
                    ) : (
                        <NavLink to="/login" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                            Đăng Nhập / Đăng Ký
                        </NavLink>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;
