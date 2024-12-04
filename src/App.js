import React from "react";
import Title from "./Title.js";
import Tools from "./Tools.js";
import TextInput from "./TextInput.js";
import Stats from './Stats.js';

export default function App() {
   return (
      <div className="Main">
         <Title />
         <Tools />
         <TextInput />
         <Stats />
      </div>
   );
}
