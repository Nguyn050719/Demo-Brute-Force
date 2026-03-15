import { useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function MyAccount() {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Đang tải thư khố...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="account-page">
            <div className="account-card">
                <div className="account-header">
                    <div className="avatar">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="account-details">
                        <h2>{user.username}</h2>
                        <p style={{ margin: '0.5rem 0', color: '#aaa' }}>Họ tên: {user.full_name || 'Chưa cập nhật'}</p>
                        <p style={{ margin: '0.5rem 0', color: '#aaa' }}>Thẻ tín dụng: {user.credit_card || 'Chưa cập nhật'}</p>
                        <p style={{ marginTop: '0.5rem' }}>Thành viên từ: Kỷ nguyên này</p>
                    </div>
                </div>

                <div className="account-body" style={{ marginTop: '2rem' }}>
                    <h3 style={{ color: 'var(--color-primary)', marginBottom: '1rem', fontSize: '1.5rem' }}>
                        Không Gian Đọc Của Bạn
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                        Chào mừng đến với bộ sưu tập cá nhân của bạn. Dưới đây là cuốn sách dành riêng cho bạn. Hãy đọc và tận hưởng từng trang sách. Trải nghiệm từng câu thơ và dòng chữ đong đầy cảm xúc.
                    </p>

                    <div className="book-item">
                        <Link to="/book/ngay-xua-co-mot-chuyen-tinh" className="book-link">
                            <div className="book-cover">Mở</div>
                            <div className="book-info">
                                <h4>Ngày Xưa Có Một Chuyện Tình</h4>
                                <p>Nguyễn Nhật Ánh</p>
                            </div>
                        </Link>
                    </div>
                    
                    <div style={{
                        marginTop: '2rem',
                        padding: '1.5rem',
                        background: 'rgba(0,0,0,0.2)',
                        borderLeft: '4px solid var(--color-primary)',
                        borderRadius: '0 8px 8px 0',
                        fontStyle: 'italic',
                        color: '#d4af37'
                    }}>
                        "Một người đọc sách sống cả ngàn cuộc đời trước khi chết. Kẻ không bao giờ đọc chỉ sống duy nhất một cuộc đời." – George R.R. Martin
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyAccount;
