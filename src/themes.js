import React from "react";
import { useState, useEffect } from "react";

export function Themes() {
   function handleRenderThemeMenu(e) {
      e.preventDefault();
      const themeMenu = document.querySelector(`.theme-selector--menu`);
      themeMenu.classList.toggle("hidden");
   }

   return (
      <button
         className="btn--theme"
         onClick={(e) => handleRenderThemeMenu(e)}
      ></button>
   );
}

export function ThemeHoverBtns() {
   const themes = [
      {
         name: "Light",
         value: "light",
         highlight: "#c6daff",
         secondary: "#f4f4f4",
      },
      {
         name: "Dark",
         value: "dark",
         highlight: "#ebf9ff",
         secondary: "#505050",
      },
      {
         name: "Marina",
         value: "marina",
         highlight: "#04045d",
         secondary: "#165f86",
      },
      {
         name: "Paper",
         value: "paper",
         highlight: "#ffcd68",
         secondary: "#f9f2d5",
      },
      {
         name: "Blueberry",
         value: "blueberry",
         highlight: "#cec3df",
         secondary: "#e2dffb",
      },
      {
         name: "Shadow",
         value: "shadow",
         highlight: "#0e6d7c",
         secondary: "#393939",
      },
   ];

   const [selectedTheme, setSelectedTheme] = useState(
      () => JSON.parse(localStorage.getItem("selectedTheme")) || themes[0]
   );

   function renderThemeSelecion(e) {
      e.preventDefault();
      const themeMenu = document.querySelector(`.theme-selector--menu`);
      themeMenu.classList.toggle("hidden");
      const theme = e.target.getAttribute("data-theme");
      setSelectedTheme(theme);
   }

   useEffect(() => {
      document.body.setAttribute("data-theme", selectedTheme);
      localStorage.setItem("selectedTheme", JSON.stringify(selectedTheme));
   }, [selectedTheme]);


   return (
      <div className="theme-selector--menu hidden">
         {themes.map((theme) => {
            return (
               <button
                  className="btn--theme"
                  key={theme.value}
                  data-theme={theme.value}
                  style={{
                     background: `linear-gradient(to top right, ${theme.highlight} 0%, ${theme.secondary} 100%)`,
                  }}
                  onClick={(e) => renderThemeSelecion(e)}
               ></button>
            );
         })}
      </div>
   );
}
