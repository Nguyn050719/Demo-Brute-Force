import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

        try {
            const res = await fetch(`http://localhost:3001${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                // translate basic errors from backend if possible
                let errMsg = data.error || 'Đã có lỗi xảy ra';
                if(errMsg === 'Username and password are required') errMsg = 'Vui lòng nhập tên đăng nhập và mật khẩu';
                if(errMsg === 'Invalid credentials') errMsg = 'Thông tin đăng nhập không hợp lệ';
                if(errMsg === 'Username already exists') errMsg = 'Tên đăng nhập đã tồn tại';
                throw new Error(errMsg);
            }

            if (isLogin) {
                login(data.user, data.token);
                if (data.user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/account');
                }
            } else {
                setIsLogin(true);
                setError('Đăng ký thành công! Vui lòng đăng nhập.');
                setFormData({ username: '', password: '' });
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-panel">
                <h2 className="auth-title">{isLogin ? 'Chào Mừng Trở Lại' : 'Tham Gia Thư Viện'}</h2>
                
                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="username">Tên Đăng Nhập</label>
                        <input 
                            type="text" 
                            id="username"
                            name="username" 
                            className="form-input" 
                            value={formData.username} 
                            onChange={handleChange} 
                            required 
                            autoComplete="off"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Mật Khẩu</label>
                        <input 
                            type="password" 
                            id="password"
                            name="password" 
                            className="form-input" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <button type="submit" className="btn-primary">
                        {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
                    </button>
                </form>

                <div className="auth-toggle">
                    {isLogin ? "Chưa có tài khoản?" : "Đã là thành viên?"}
                    <button 
                        type="button" 
                        className="auth-toggle-btn" 
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                    >
                        {isLogin ? 'Tạo tài khoản' : 'Đăng nhập'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
