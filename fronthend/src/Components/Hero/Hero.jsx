import React, { useState, useEffect } from 'react';
import './Hero.css';
import arrow_icon from '../Assests/arrow.png';

// Import your hero images
import hero_image1 from '../Assests/hero_image1.png';
import hero_image2 from '../Assests/hero_image2.png';
import hero_image3 from '../Assests/hero_image3.png';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      
      image: hero_image1,
    },
    {
    
      image: hero_image2,
    },
    {
      
      image: hero_image3,
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="hero-container">
      {slides.map((slide, index) => (
        <div 
          key={index}
          className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="hero-content">
            <h2 className={`slide-title ${index === currentSlide ? 'animate' : ''}`}>
              {slide.title}
            </h2>
            <div className="slide-subtitles">
              <p className={`subtitle ${index === currentSlide ? 'animate' : ''}`}>
                {slide.subtitle1}
              </p>
              <p className={`subtitle ${index === currentSlide ? 'animate' : ''}`}>
                {slide.subtitle2}
              </p>
            </div>
            {/* {index === currentSlide && (
              <button className="hero-btn">
                Shop Now <img src={arrow_icon} alt="Arrow" />
              </button>
            )} */}
          </div>
        </div>
      ))}
      <div className="slide-indicators">
        {slides.map((_, index) => (
          <div 
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;