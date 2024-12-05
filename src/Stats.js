import React from "react";

export default function Stats({ textContent, characterCount }) {
   return (
      // <p className="stats">
      //    <span style={{ marginBottom: "10px" }}>
      //       {textContent} {textContent > 1 ? "words" : "word"}{" "}
      //    </span>
      //    <br /> {characterCount} {characterCount > 1 ? 'characters' : 'character'}
      // </p>

      <div className="stats">
         <select>
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
