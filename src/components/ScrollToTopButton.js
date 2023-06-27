import React, { useState } from 'react';
import { FaArrowUp } from "react-icons/fa";

const ScrollToTopButton = () => {
    const [showButton, setShowButton] = useState(false);
  
    // Add a scroll event listener to track the scroll position
    window.addEventListener("scroll", () => {
      // Check if the user has scrolled down a certain distance to show the button
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    });
  
    // Function to scroll to the top of the screen
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  
    return (
      // Render the button conditionally based on the scroll position
      <button
        className={`fixed bottom-4 right-4 z-10 p-4 bg-gray-800 text-white rounded-full transition-opacity ${
          showButton ? "opacity-100" : "opacity-0"
        }`}
        onClick={scrollToTop}
      >
        <FaArrowUp />
      </button>
    );
  };

  export default ScrollToTopButton
  