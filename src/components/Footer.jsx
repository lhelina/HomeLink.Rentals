import { Link } from "react-router-dom";
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>
            <i className="fas fa-home"></i> HomeLink Rentals
          </h3>
          <p>Copyright © 2025 HomeLink Rentals. All rights reserved</p>
          <div className="anchors">
            <p>
              <strong>
                <Link to="/about">About Us</Link>
              </strong>
            </p>
            <p>
              <strong>
                <Link to="/contact">Contact Us</Link>
              </strong>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
