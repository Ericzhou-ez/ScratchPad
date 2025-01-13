import React, { useEffect, useRef } from "react";
import Quill from "quill";

export default function Title({ title, handleTitleChange }) {
   const quillRef = useRef(null);

   useEffect(() => {
      if (!quillRef.current) {
         quillRef.current = new Quill("#title");

         const editor = quillRef.current;

         editor.root.innerHTML = localStorage.getItem("title") || "Title";

         const handleInput = () => {
            const content = editor.root.innerText.trim();
            localStorage.setItem("title", content);
            if (handleTitleChange) {
               handleTitleChange(content);
            }
         };

         editor.on("text-change", handleInput);

         return () => {
            editor.off("text-change", handleInput);
            quillRef.current = null;
         };
      }
   }, [handleTitleChange]);

   return <div id="title"> </div>;
}


// import React, { useEffect, useRef } from "react";
// import Quill from "quill";

// export default function Title({ title, handleTitleChange }) {
//    const quillRef = useRef(null);

//    useEffect(() => {
//       if (!quillRef.current) {
//          quillRef.current = new Quill("#title", {
//             theme: "bubble", // Use a minimal theme for the title
//             placeholder: "Enter title...",
//             modules: {
//                toolbar: false, // Disable toolbar for title
//             },
//          });

//          const editor = quillRef.current;

//          // Set initial content from localStorage or props
//          editor.root.innerHTML = localStorage.getItem("title") || "Title";

//          // Event listener for input changes
//          const handleInput = () => {
//             const content = editor.root.innerText.trim();
//             localStorage.setItem("title", content);
//             if (handleTitleChange) {
//                handleTitleChange(content);
//             }
//          };

//          editor.on("text-change", handleInput);

//          // Cleanup function
//          return () => {
//             editor.off("text-change", handleInput);
//             quillRef.current = null;
//          };
//       }
//    }, [handleTitleChange]);

//    return (
//       <div id="title" style={{ fontSize: "2rem", fontWeight: "bold" }}></div>
//    );
// }