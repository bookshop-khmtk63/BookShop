import React from "react";
import { FaFacebook, FaInstagram, FaTiktok, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <p>Thông tin chung</p>
        <div className="location">
          <FaMapMarkerAlt />Số 3 phố Cầu Giấy, Phường Láng, TP. Hà Nội.<span></span>
        </div>
        <div className="contact">
          <FaPhone /> <span>0123 456 789</span>
        </div>
        <div className="contact">
          <FaEnvelope /> <span>contact@bookstore.com</span>
        </div>
      </div>

      <div className="footer-right">
        <span className="follow-text">Theo dõi chúng tôi tại:</span>
        <div className="social-icons">
          <FaFacebook />
          <FaInstagram />
          <FaTiktok />
        </div>
      </div>
    </footer>
  );
}
