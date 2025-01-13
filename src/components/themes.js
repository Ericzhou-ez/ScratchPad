import React from "react";

const themes = [
   {
      name: "Light",
      value: "light",
      highlight: "#c6daff",
      secondary: "#f4f4f4",
   },
   { name: "Dark", value: "dark", highlight: "#ebf9ff", secondary: "#505050" },
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

export function Themes({ toggleThemeMenu }) {
   return <button className="btn--theme" onClick={toggleThemeMenu}></button>;
}

export function ThemeHoverBtns({ toggleThemeMenu, applyTheme }) {
   return (
      <div className="theme-selector--menu">
         {themes.map((theme) => (
            <button
               className="btn--theme"
               key={theme.value}
               data-theme={theme.value}
               style={{
                  background: `linear-gradient(to top right, ${theme.highlight} 0%, ${theme.secondary} 100%)`,
               }}
               onClick={(e) => {
                  applyTheme(theme.value);
                  toggleThemeMenu();
               }}
            ></button>
         ))}
      </div>
   );
}
