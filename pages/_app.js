// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css';
// import '../styles/globals.css'; // Nếu bạn có CSS tùy chỉnh
import Navbar from '../components/Navbar'; // Import Navbar component

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar /> {/* Hiển thị Navbar trên mọi trang */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
