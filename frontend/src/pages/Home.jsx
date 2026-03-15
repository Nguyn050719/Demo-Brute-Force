import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Home() {
    const [books, setBooks] = useState([]);
    const { user } = useContext(AuthContext);

    const handleBuy = (bookTitle) => {
        if (!user) {
            alert('Vui lòng đăng nhập để mua sách!');
        } else {
            alert(`Cảm ơn bạn đã đặt mua cuốn "${bookTitle}". Sách sẽ được giao trong vài ngày tới!`);
        }
    };

    useEffect(() => {
        fetch('http://localhost:3001/api/books')
            .then(res => res.json())
            .then(data => setBooks(data.books))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="home-container">
            <h1 className="home-title">Tiệm Sách Lumina</h1>
            <p className="home-subtitle">
                Tuyển tập các tác phẩm đặc sắc của nhà văn Nguyễn Nhật Ánh.
            </p>
            
            <div className="books-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
                {books.map(book => (
                    <div key={book.id} className="book-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', textAlign: 'center', transition: 'transform 0.3s ease' }}>
                        <img src={book.cover_image} alt={book.title} style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>{book.title}</h3>
                        <p style={{ fontSize: '1rem', color: '#fff', fontWeight: 'bold' }}>{book.price.toLocaleString('vi-VN')} đ</p>
                        <p style={{ fontSize: '0.85rem', marginTop: '1rem', color: 'var(--color-text-muted)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{book.description}</p>
                        <button 
                            className="btn-primary" 
                            style={{ marginTop: '1.5rem', width: '100%', padding: '0.75rem', fontSize: '1rem', borderRadius: '8px' }}
                            onClick={() => handleBuy(book.title)}
                        >
                            Mua Sách
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
