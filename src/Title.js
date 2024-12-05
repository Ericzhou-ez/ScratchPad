import React from "react";
import { useRef, useEffect } from "react";
import Quill from "quill";

export default function Title() {
   const quillRef = useRef(null);

   useEffect(() => {
      if (!quillRef.current) {
         quillRef.current = new Quill("#title");
      }
   }, []);

   return (
      <div id="title">
         <h1>Title</h1>
      </div>
   );
}
