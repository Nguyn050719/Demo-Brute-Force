const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const authRoutes = require('./auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

const bcrypt = require('bcrypt');
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.serialize(() => {
            // Create users table
            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    role TEXT DEFAULT 'user',
                    full_name TEXT,
                    credit_card TEXT
                )
            `);
            // Create books table
            db.run(`
                CREATE TABLE IF NOT EXISTS books (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    author TEXT NOT NULL,
                    price REAL NOT NULL,
                    cover_image TEXT,
                    description TEXT
                )
            `);

            // Seed Books
            db.get("SELECT COUNT(*) AS count FROM books", (err, row) => {
                if (row && row.count === 0) {
                    const books = [
                        { title: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh', price: 90000, image: 'https://vi.wikipedia.org/wiki/Special:FilePath/Toi_thay_hoa_vang_tren_co_xanh.png', desc: 'Truyện dài về tuổi thơ' },
                        { title: 'Mắt Biếc', price: 110000, image: 'https://vi.wikipedia.org/wiki/Special:FilePath/Mat_biec.jpg', desc: 'Một câu chuyện tình buồn' },
                        { title: 'Cho Tôi Xin Một Vé Đi Tuổi Thơ', price: 85000, image: 'https://vi.wikipedia.org/wiki/Special:FilePath/Cho_toi_xin_mot_ve_di_tuoi_tho.jpg', desc: 'Chiếc vé trở về tuổi thơ' },
                        { title: 'Cô Gái Đến Từ Hôm Qua', price: 95000, image: 'https://vi.wikipedia.org/wiki/Special:FilePath/Co_gai_den_tu_hom_qua.jpg', desc: 'Tuổi học trò áo trắng' },
                        { title: 'Kính Vạn Hoa', price: 150000, image: 'https://vi.wikipedia.org/wiki/Special:FilePath/Kính_vạn_hoa_version_2_(2006).jpg', desc: 'Những cuộc phiêu lưu lý thú' },
                        { title: 'Tôi Là Bê Tô', price: 75000, image: 'https://vi.wikipedia.org/wiki/Special:FilePath/Tôi_là_Bê_Tô.jpg', desc: 'Thế giới qua góc nhìn chú chó' },
                        { title: 'Ngồi Khóc Trên Cây', price: 105000, image: 'https://vi.wikipedia.org/wiki/Special:FilePath/NGOIKHOCTRENCAY_TruyenNgay.jpg', desc: 'Chuyện tình lãng mạn' },
                        { title: 'Chú Bé Rắc Rối', price: 80000, image: 'https://vi.wikipedia.org/wiki/Special:FilePath/ChuBeRacRoi.jpg', desc: 'Cậu bé tinh nghịch' },
                        { title: 'Bảy Bước Tới Mùa Hè', price: 90000, image: 'https://vi.wikipedia.org/wiki/Special:FilePath/Bay_buoc_toi_mua_he.jpg', desc: 'Hè tuổi thơ dữ dội' },
                        { title: 'Con Chó Nhỏ Mang Giỏ Hoa Hồng', price: 100000, image: 'https://vi.wikipedia.org/wiki/Special:FilePath/Con_Chó_Nhỏ_Mang_Giỏ_Hoa_Hồng_bìa.png', desc: 'Câu chuyện về những chú chó' },
                    ];
                    const stmt = db.prepare('INSERT INTO books (title, author, price, cover_image, description) VALUES (?, ?, ?, ?, ?)');
                    books.forEach(b => stmt.run(b.title, 'Nguyễn Nhật Ánh', b.price, b.image, b.desc));
                    stmt.finalize();
                    console.log('Seeded 10 books.');
                }
            });

            // Seed Users
            db.get("SELECT COUNT(*) AS count FROM users", async (err, row) => {
                if (row && row.count === 0) {
                    const usersToSeed = [
                        { u: 'admin', p: 'password', r: 'admin', n: 'System Admin', c: '0000-0000-0000-0000' },
                        { u: 'user1', p: '123456', r: 'user', n: 'Nguyễn Văn A', c: '1111-2222-3333-4444' },
                        { u: 'user2', p: 'password', r: 'user', n: 'Trần Thị B', c: '5555-6666-7777-8888' },
                        { u: 'user3', p: 'iloveyou', r: 'user', n: 'Lê Minh C', c: '9999-0000-1111-2222' },
                        { u: 'user4', p: 'qwerty', r: 'user', n: 'Phạm Văn D', c: '3333-4444-5555-6666' },
                        { u: 'user5', p: '123123', r: 'user', n: 'Hoàng Thị E', c: '7777-8888-9999-0000' },
                        { u: 'nguyen', p: 'H.z050719', r: 'user', n: 'Nguyễn Demo', c: '9876-5432-1098-7654' },
                    ];
                    for (const user of usersToSeed) {
                        const hash = await bcrypt.hash(user.p, 10);
                        db.run('INSERT INTO users (username, password, role, full_name, credit_card) VALUES (?, ?, ?, ?, ?)',
                            [user.u, hash, user.r, user.n, user.c]
                        );
                    }
                    console.log('Seeded admin and 5 users.');
                }
            });
        });
    }
});

// Setup Auth Routes
app.use('/api/auth', authRoutes(db));

// Root Endpoint
app.get('/', (req, res) => {
    res.send('Bookstore API is running');
});

// Setup Books Routes
app.get('/api/books', (req, res) => {
    db.all('SELECT * FROM books', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ books: rows });
    });
});

app.post('/api/books', (req, res) => {
    const { title, author, price, cover_image, description } = req.body;
    db.run('INSERT INTO books (title, author, price, cover_image, description) VALUES (?, ?, ?, ?, ?)',
        [title, author || 'Nguyễn Nhật Ánh', price, cover_image, description],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID });
        }
    );
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
