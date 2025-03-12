// frontend/src/components/Home.jsx
import React from 'react';
import './Home.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; //  ESSENTIAL
import "slick-carousel/slick/slick-theme.css"; //  ESSENTIAL for default styling
// import heroImage1 from '../assets/hero-image1.jpg';
// import heroImage2 from '../assets/hero-image2.jpg';
// import heroImage3 from '../assets/hero-image3.jpg';
// import aboutImage from '../assets/about-image.jpg';

function Home() {
  const settings = {
    dots: true, //  Enable dots
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: "linear",
  };

  return (
    <>
      <section className="hero">
        {/* <div className="hero-overlay"></div> */}
        <Slider {...settings}>
          {/* Each slide contains BOTH the image and the content */}
          <div className="hero-slide">
            <img src="/assets/hero-image1.jpg" alt="Tunisian Culture 1" className="hero-image" />
            <div className="hero-content text-center">
              <h1 className="hero-title mb-1">Welcome to the Alberta Tunisian Association</h1>
              <p className="hero-subtitle mb-2">Connecting Tunisians and promoting our culture.</p>
              <a href="#about" className="hero-button">Learn More</a>
            </div>
          </div>
          <div className="hero-slide">
            <img src="/assets/hero-image2.jpg" alt="Tunisian Culture 2" className="hero-image" />
            <div className="hero-content text-center">
              <h1 className="hero-title mb-1">Welcome to the Alberta Tunisian Association</h1>
              <p className="hero-subtitle mb-2">Connecting Tunisians and promoting our culture.</p>
              <a href="#about" className="hero-button">Learn More</a>
            </div>
          </div>
          <div className="hero-slide">
            <img src="/assets/hero-image3.jpg" alt="Tunisian Culture 3" className="hero-image" />
            <div className="hero-content text-center">
              <h1 className="hero-title mb-1">Welcome to the Alberta Tunisian Association</h1>
              <p className="hero-subtitle mb-2">Connecting Tunisians and promoting our culture.</p>
              <a href="#about" className="hero-button">Learn More</a>
            </div>
          </div>
        </Slider>
      </section>

      <section className="about container py-3" id="about">
        <div className="about-content">
          <h2>About Us</h2>
          <p>
          The Alberta Tunisian Association (ATA) is a non-profit organization registered in Alberta. 
          The ATA was created in 2011 in Calgary Alberta (Canada) by a group of Tunisians who shared one vision which is to form a stronger united community.
          Its main goal is to bring together all Tunisians in Alberta by providing a social and a cultural umbrella for them and to connect every Tunisian living in Canada with the rest of the society and help them integrate and be successful.
          Our core values are Compassion, Respect, Excellence, Integrity, and Co-operation. 
          The ATA reaches out to Tunisians, cares about them and helps them integrate in the North American society. 
          The ATA promotes respect and co-existence between all ethnicities.
          As members of the ATA we strive to be the best in what we do and be a model to emulate for others by being honest, trustworthy and accountable. We always try to be effective and innovative. We will always encourage teamwork and partnerships with other organizations and community associations.
          </p>
        </div>
        <div className="about-image">
          <img src="/assets/about-image.jpg" alt="About Us" />
        </div>
      </section>

      <section className="mission container py-3">
        <h2 className="mb-2 text-center">Our Mission</h2>
        <p className="text-center">
        To build a strong and supportive community for Tunisians in Alberta,
        fostering cultural exchange and providing resources for personal and
        professional growth.
        </p>
      </section>

      <section className="services container py-3">
        <h2 className="mb-2 text-center">Key Services</h2>
        <ul className="text-center">
          <li>Community Events</li>
          <li>Cultural Celebrations</li>
          <li>Networking Opportunities</li>
          <li>Resource Center</li>
        </ul>
      </section>

      <section className="events container py-3">
        <h2 className="mb-2 text-center">Featured Events</h2>
        {/* Placeholder for events carousel */}
        <p>Upcoming events carousel will go here...</p>
      </section>

      <section className="culture container py-3">
        <h2 className="mb-2 text-center">Tunisian Culture</h2>
        <p className="text-center">Explore the rich heritage and traditions of Tunisia.</p>
        {/* Placeholder for cultural highlights */}
      </section>

      <section className="newsletter container py-3">
        <h2 className="mb-2 text-center">Subscribe to Our Newsletter</h2>
        <p className="text-center">Stay up-to-date with the latest news and events.</p>
        {/* Placeholder for newsletter subscription form */}
        <div className="newsletter-form text-center">
          <input type="email" placeholder="Enter your email" className="mb-1" />
          <button>Subscribe</button>
        </div>
      </section>
    </>
  );
}

export default Home;
