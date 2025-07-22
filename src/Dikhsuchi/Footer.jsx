import './Footer.css'; // Import specific styling for the Footer

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} SOCaiL. All rights reserved.</p>
      <div className="social-links">
        {/* Add links to social media accounts if applicable */}
        <a href="#" className="social-icon">Twitter</a>
        <a href="#" className="social-icon">Instagram</a>
      </div>
    </footer>
  );
}

export default Footer;
