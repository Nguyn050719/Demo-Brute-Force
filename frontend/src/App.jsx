import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import MyAccount from './pages/MyAccount';
import ReadBook from './pages/ReadBook';
import AdminDashboard from './pages/AdminDashboard'; // new route

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<MyAccount />} />
          <Route path="/admin" element={<AdminDashboard />} /> {/* admin route */}
          <Route path="/book/ngay-xua-co-mot-chuyen-tinh" element={<ReadBook />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
