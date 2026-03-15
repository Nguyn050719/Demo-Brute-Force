import { useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ReadBook() {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Đang tải thư khố...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="read-page">
            <Link to="/account" className="back-link">← Quay lại Tài Khoản</Link>
            
            <div className="book-content-container">
                <h1 className="book-title">Ngày Xưa Có Một Chuyện Tình</h1>
                <h3 className="book-author">Nguyễn Nhật Ánh</h3>
                
                <div className="book-text">
                    <p className="chapter-title">Chương 1</p>
                    <p>
                        Tôi tên là Vinh, Phạm Hoài Vinh. 
                        Năm đó tôi đang học lớp tám, một cậu nhóc với nhiều mộng mơ bồng bột tuổi thiếu niên. 
                        Gia đình tôi sống ở một vùng quê nghèo miền Trung đầy nắng và gió.
                    </p>
                    <p>
                        Ngày xưa, tôi có một tình bạn tuyệt đẹp với Phúc và Miền. 
                        Chúng tôi lớn lên bên nhau, cùng nhau trải qua biết bao buồn vui của tuổi học trò. 
                        Những ngày tháng ấy tưởng chừng trôi qua yên ả, cho đến khi trong lòng chúng tôi bắt đầu nảy mầm những rung động đầu đời.
                    </p>
                    <p>
                        Miền là một cô bé hiền lành, có đôi mắt buồn man mác. Phúc thì ngược lại, mạnh mẽ, cá tính và luôn sẵn sàng bảo vệ bạn bè. 
                        Tình bạn của ba đứa tôi trong trẻo như giọt sương mai, để rồi khi lớn lên, mọi thứ dần trở nên phức tạp hơn chúng tôi tưởng.
                    </p>
                    <p>
                        Tình yêu là một thứ gì đó thật kỳ diệu. Nó có thể khiến con người ta bay bổng trên chín tầng mây, nhưng cũng có thể dìm ta xuống vực thẳm của sự đau khổ. 
                        Câu chuyện của chúng tôi là một minh chứng cho điều đó, một câu chuyện tình yêu đầy những khắc khoải, nhớ nhung và cả những giọt nước mắt. 
                        Nhưng trên tất cả, nó vẫn là một câu chuyện đẹp, một quãng đời tuyệt vời mà tôi không bao giờ quên...
                    </p>
                    <p style={{ textAlign: 'center', fontStyle: 'italic', marginTop: '3rem', color: 'var(--color-primary)' }}>
                        (Trang sách này chỉ là minh họa văn học. Hãy tìm mua sách thật để ủng hộ tác giả.)
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ReadBook;
