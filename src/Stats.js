import React from "react";
import { useState } from "react";

export default function Stats({ textContent, characterCount }) {
   const [ stats, setStats ] = useState(() => JSON.parse(localStorage.getItem("stats")) || "words");


   function handleChnageStat(e) {
      e.preventDefault();
      setStats(e.target.value);
      localStorage.setItem("stats", JSON.stringify(e.target.value));
   }

   return (
      // <p className="stats">
      //    <span style={{ marginBottom: "10px" }}>
      //       {textContent} {textContent > 1 ? "words" : "word"}{" "}
      //    </span>
      //    <br /> {characterCount} {characterCount > 1 ? 'characters' : 'character'}
      // </p>

      <div className="stats">
         <select onChange={(e) => handleChnageStat(e)} value={stats}>
            <option value="words">
               {textContent} {textContent > 1 ? "words" : "word"}
            </option>
            <option value="characters">
               {characterCount}{" "}
               {characterCount > 1 ? "characters" : "character"}
            </option>
         </select>
      </div>
   );
}
