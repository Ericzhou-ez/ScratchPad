import React from "react";
import { useState, useLayoutEffect, useRef } from "react";
import Quill from "quill";

export default function TextInpput({
   handleSetCharacterCount,
   handleSetTextContent,
}) {
   const quillRef = useRef(null);
   const isInitialized = useRef(false);

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
            placeholder: "Note...",
            modules: {
               toolbar: toolbarOptions,
            },
         });

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

         // const toolbar = document.querySelector(".ql-toolbar");
         // if (toolbar) {
         //    const fontPickerOptions = toolbar.querySelectorAll(
         //       ".ql-font .ql-picker-item"
         //    );
         //    const fontPickerLabel = toolbar.querySelector(
         //       ".ql-font .ql-picker-label"
         //    );

         //    fontPickerOptions.forEach((option) => {
         //       const fontName = option.getAttribute("data-value");
         //       option.style.fontFamily = fontName.replace("-", " ");
         //       option.textContent = fontName
         //          .replace("-", " ")
         //          .replace(/([a-z])([A-Z])/g, "$1 $2");
         //    });

         //    toolbar.querySelector(".ql-font").addEventListener("click", () => {
         //       const selectedFont = fontPickerLabel.getAttribute("data-value");
         //       if (selectedFont) {
         //          fontPickerLabel.style.fontFamily = selectedFont.replace(
         //             "-",
         //             " "
         //          );
         //       }
         //    });
         // }

         // prevent multi-renders
         quillRef.current = quill;
         isInitialized.current = true;

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

   return <div id="editor"></div>;
}
