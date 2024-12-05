import React from "react";
import Title from "./Title.js";
import TextInput from "./TextInput.js";
import Stats from "./Stats.js";
import { useState } from "react";

export default function App() {
   const [textContent, setTextContent] = useState(0);
   const [characterCount, setCharacterCount] = useState(0);

   return (
      <div className="Main">
         <Title />
         <TextInput
            handleSetCharacterCount={setCharacterCount}
            handleSetTextContent={setTextContent}
         />
         <Stats textContent={textContent} characterCount={characterCount} />
      </div>
   );
}
