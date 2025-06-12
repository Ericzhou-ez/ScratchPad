import React, { useState, useEffect } from "react";
import "./BackToTop.css";
import { ArrowUp } from "@phosphor-icons/react";

const BackToTop = () => {
   const [isVisible, setIsVisible] = useState(false);

   useEffect(() => {
      const toggleVisibility = () => {
         const scrollPosition = window.scrollY;
         const pageHeight =
            document.documentElement.scrollHeight - window.innerHeight;
         const scrollPercentage = scrollPosition / pageHeight;

         if (scrollPercentage > 0.2) {
            setIsVisible(true);
         } else {
            setIsVisible(false);
         }
      };

      window.addEventListener("scroll", toggleVisibility);
      return () => window.removeEventListener("scroll", toggleVisibility);
   }, []);

   const scrollToTop = () => {
      window.scrollTo({
         top: 0,
         behavior: "smooth",
      });
   };

   return (
      <>
         {isVisible && (
            <button
               className="back-to-top"
               onClick={scrollToTop}
               title="Back to Top"
            >
               <ArrowUp weight="bold" size={18} />
            </button>
         )}
      </>
   );
};

export default BackToTop;
