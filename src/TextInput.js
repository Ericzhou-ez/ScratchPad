import React, { useState, useLayoutEffect, useRef, useCallback } from "react";
import Quill from "quill";

export default function TextInpput({
   handleSetCharacterCount,
   handleSetTextContent,
}) {
   const quillRef = useRef(null);
   const observerRef = useRef(null);
   const isInitialized = useRef(false);
   const [textContent, setTextContent] = useState(
      () => JSON.parse(localStorage.getItem("textContent")) || ""
   );

   // Toolbar configuration
   const toolbarOptions = React.useMemo(
      () => [
         [
            {
               font: [
                  "oxygenmono",
                  "oxygen",
                  "lexend",
                  "newsreader",
                  "poppins",
                  "electrolize",
                  "nunitosans",
               ],
            },
         ],
         ["bold", "italic", "underline"],
         [{ header: 2 }, { header: 3 }],
         [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      ],
      []
   );

   // Extract word and character counts
   const extractWords = useCallback(
      (ele) => {
         if (!ele) return;
         const text = ele.innerText || "";
         const cleanedText = text.replace(/\n/g, "");
         const words = cleanedText.split(/\s+/).filter(Boolean).length;
         const characters = cleanedText.split("").length;
         handleSetTextContent(words);
         handleSetCharacterCount(characters);
      },
      [handleSetCharacterCount, handleSetTextContent]
   );

   useLayoutEffect(() => {
      if (!quillRef.current && !isInitialized.current) {
         // Initialize Quill editor
         const quill = new Quill("#editor", {
            theme: "snow",
            modules: {
               toolbar: toolbarOptions,
            },
         });

         quillRef.current = quill;
         isInitialized.current = true;

         // Set the initial content
         quill.root.innerHTML = textContent;

         // Register fonts
         const FontAttributor = Quill.import("attributors/class/font");
         FontAttributor.whitelist = [
            "oxygenmono",
            "oxygen",
            "lexend",
            "newsreader",
            "poppins",
            "electrolize",
            "nunitosans",
         ];
         Quill.register(FontAttributor, true);

         // Add mutation observer to track changes in content
         const editorContent = document.querySelector(".ql-editor");
         observerRef.current = new MutationObserver(() => {
            const text = editorContent.innerText.trim(); // Extract text
            setTextContent(text);
            localStorage.setItem("textContent", JSON.stringify(text));
         });

         observerRef.current.observe(editorContent, {
            childList: true,
            subtree: true,
            characterData: true,
         });

         // Update word and character counts
         const editorElement = document.getElementById("editor");
         const observer = new MutationObserver(() => {
            extractWords(editorElement);
         });

         observer.observe(editorElement, {
            childList: true,
            subtree: true,
            characterData: true,
         });
      }

      return () => {
         if (quillRef.current || isInitialized.current) {
            quillRef.current.off("text-change");
            isInitialized.current = false;
         }
      };
   }, [toolbarOptions, textContent, extractWords]);

   return <div id="editor" style={{ minHeight: "80vh" }}></div>;
}
