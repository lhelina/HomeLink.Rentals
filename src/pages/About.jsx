import { useState } from "react";
import "../styles/about.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const About = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* NAVBAR */}
      <Navbar currentPage="about" />

      {/* ABOUT SECTION */}
      <section className="about">
        <h2>About Us</h2>
        <p>
          HomeLink Rentals is a small online platform that connects homeowners
          and renters in Ethiopia without intermediaries. Owners can post
          available properties of all sizes, and renters can browse listings,
          search options, and contact owners directly.
        </p>
      </section>

      {/* COMPLAINT FORM */}
      <section className="complaint-section">
        <h3>Submit a Complaint</h3>
        <form>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Enter your name"
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="example@email.com"
          />

          <label htmlFor="message">Complaint</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            required
            placeholder="Describe your issue..."
          ></textarea>

          <button type="submit">Submit</button>
        </form>
      </section>

      <Footer />
    </>
  );
};

export default About;
