import React from "react";
import { useState, useLayoutEffect, useRef } from "react";
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

   // configuring the toolbar
   const toolbarOptions = [
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
   ];

   const extractWords = (ele) => {
      if (!ele) return;
      const text = ele.innerText || "";
      const cleanedText = text.replace(/\n/g, "");
      const words = cleanedText.split(/\s+/).filter(Boolean).length;
      const characters = cleanedText.split("").length;
      handleSetTextContent(words);
      handleSetCharacterCount(characters);
   };

   useLayoutEffect(() => {
      // quill is only initialized once
      if (!quillRef.current && !isInitialized.current) {
         // new quill editor
         const quill = new Quill("#editor", {
            theme: "snow",
            modules: {
               toolbar: toolbarOptions,
            },
         });

         // prevent multi-renders
         quillRef.current = quill;
         isInitialized.current = true;

         quill.root.innerHTML = textContent;

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

         // get char and word counts
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
   }, []);

   return <div id="editor" style={{ minHeight: "80vh" }}></div>
}
