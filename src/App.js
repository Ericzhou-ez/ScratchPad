import React, { useState, useEffect } from "react";
import Title from "./components/Title.js";
import TextInput from "./components/TextInput.js";
import { Themes, ThemeHoverBtns } from "./components/themes.js";
import Stats from "./components/Stats.js";

export default function App() {
   const [textContent, setTextContent] = useState(0);
   const [characterCount, setCharacterCount] = useState(0);
   const [themeMenu, setThemeMenu] = useState(false);
   const [selectedTheme, setSelectedTheme] = useState(() => {
      const storedTheme = localStorage.getItem("selectedTheme");
      return storedTheme ? JSON.parse(storedTheme) : "light";
   });
   const [title, setTitle] = useState('Title');

   useEffect(() => {
      document.body.setAttribute("data-theme", selectedTheme);
      localStorage.setItem("selectedTheme", JSON.stringify(selectedTheme));
   }, [selectedTheme]);

   function toggleThemeMenu() {
      setThemeMenu((prev) => !prev);
   }

   function applyTheme(theme) {
      setSelectedTheme(theme);
   }

   return (
      <>
         <div className="Main">
            <Title title={title} handleTitleChange={setTitle} />
            <TextInput
               handleSetCharacterCount={setCharacterCount}
               handleSetTextContent={setTextContent}
            />
         </div>
         <div className="side">
            <Stats textContent={textContent} characterCount={characterCount} />

            <div class="theme-button-container">
               <Themes toggleThemeMenu={toggleThemeMenu} />

               {themeMenu && (
                  <>
                     <ThemeHoverBtns
                        toggleThemeMenu={toggleThemeMenu}
                        applyTheme={applyTheme}
                     />
                     <div className="overlay" onClick={toggleThemeMenu}></div>
                  </>
               )}
            </div>
         </div>
      </>
   );
}
