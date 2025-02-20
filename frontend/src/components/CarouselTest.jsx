// frontend/src/components/CarouselTest.jsx
import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import heroImage1 from '../assets/hero-image1.jpg';

function CarouselTest() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <div style={{ width: '500px', margin: '0 auto' }}> {/* Add some basic styling */}
      <h2>Simple Slider</h2>
      <Slider {...settings}>
        <div>
        <img src="/assets/about-image.jpg" alt="Tunisian Culture 1" className="hero-image" />
        </div>
        <div>
          <h3>Slide 2</h3>
        </div>
        <div>
          <h3>Slide 3</h3>
        </div>
      </Slider>
    </div>
  );
}

export default CarouselTest;
