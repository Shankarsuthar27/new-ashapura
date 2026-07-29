import React, { useState } from "react";

const slides = [
  {
    img: "main.jpeg",
    text: ["PREMIUM MARBLE", "EXCELLENCE"],
  },
  {
    img: "g1.jpeg",
    text: ["TIMELESS STONE", "CRAFTSMANSHIP"],
  },
  {
    img: "main2.jpeg",
    text: ["LUXURY GRANITE", "REDEFINED"],
  },
  { 
    img: "main3.jpeg",
    text: ["NATURAL BEAUTY", "IN EVERY SLAB"],
  },
  {
    img: "m1.jpeg",
    text: ["HERITAGE QUARRY", "MASTERY"],
  },
];

export default function Slideshow() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  // Auto-advance every 3 seconds; resets if the user navigates manually
  React.useEffect(() => {
    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer);
  }, [current]);

  return (
    <div className="slideshow">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`slide ${i === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide.img})` }}
        >
          <div className="slide-text">
            {slide.text.map((t, j) => (
              <span key={j}>{t}</span>
            ))}
          </div>
        </div>
      ))}

      {/* Controls */}
     

      {/* Counter */}
      <div className="counter">
        0{current + 1} / 0{slides.length}
      </div>
    </div>
  );
}
