import { useState } from "react";
import "../styles/contact.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Contact = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <Navbar currentPage="contact" />

      {/* CONTACT HEADER */}
      <header className="contact-header">
        <h1>Contact HomeLink Rentals</h1>
        <p>Your questions, feedback, or concerns matter to us.</p>
      </header>

      {/* CONTACT FORM SECTION */}
      <section className="contact-section">
        <h2>Contact Form</h2>
        <form>
          <label htmlFor="name">Full Name *</label>
          <input type="text" id="name" placeholder="Enter your name" required />

          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            placeholder="example@email.com"
            required
          />

          <label htmlFor="subject">Subject *</label>
          <input
            type="text"
            id="subject"
            placeholder="Message subject"
            required
          />

          <label htmlFor="message">Message *</label>
          <textarea
            id="message"
            rows="5"
            placeholder="Write your message..."
            required
          ></textarea>

          <label htmlFor="phone">Phone Number</label>
          <input type="number" id="phone" placeholder="Optional" />

          <button type="submit">Submit</button>
          <button type="reset" className="reset-button">
            Reset
          </button>
        </form>
      </section>

      {/* FOOTER */}
      <Footer />
    </>
  );
};

export default Contact;
