import React, {
   useState,
   useEffect,
   useLayoutEffect,
   useRef,
   useCallback,
} from "react";
import Quill from "quill";
import { auth, db } from "../configs/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Delta from "quill-delta";

export default function TextInput({
   handleSetCharacterCount,
   handleSetTextContent,
}) {
   const quillRef = useRef(null);
   const [editorDelta, setEditorDelta] = useState(null);
   const selectedFontRef = useRef("oxygen");

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

   const extractWords = useCallback(
      (editorElement) => {
         if (!editorElement) return;
         const text = editorElement.innerText || "";
         const cleanedText = text.replace(/\n/g, "");
         const words = cleanedText.split(/\s+/).filter(Boolean).length;
         const characters = cleanedText.length;
         handleSetTextContent(words);
         handleSetCharacterCount(characters);
      },
      [handleSetTextContent, handleSetCharacterCount]
   );

   useLayoutEffect(() => {
      const storedFont = localStorage.getItem("selectedFont") || "oxygen";
      selectedFontRef.current = storedFont;

      if (!quillRef.current) {
         const quill = new Quill("#editor", {
            theme: "snow",
            modules: {
               toolbar: toolbarOptions,
               keyboard: {
                  bindings: {
                     customEnter: {
                        key: 13,
                        handler(range, context) {
                           quill.insertText(range.index, "\n", {
                              ...context.format,
                              font: selectedFontRef.current,
                           });
                           quill.setSelection(range.index + 1, 0);
                           return false;
                        },
                     },
                  },
               },
            },
            placeholder: "Note...",
         });

         quillRef.current = quill;

         quill.on("selection-change", (range) => {
            if (range && range.length === 0) {
               quill.format("font", selectedFontRef.current);
            }
         });

         quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
            const ops = delta.ops.map((op) => {
               if (typeof op.insert === "string") {
                  return {
                     insert: op.insert,
                     attributes: { font: selectedFontRef.current },
                  };
               }
               return op;
            });

            return new Delta(ops);
         });

         const FontAttributor = Quill.import("attributors/class/font");
         FontAttributor.whitelist = [
            "oxygen",
            "oxygenmono",
            "lexend",
            "newsreader",
            "poppins",
            "electrolize",
            "nunitosans",
         ];
         Quill.register(FontAttributor, true);

         const toolbar = quill.getModule("toolbar");
         toolbar.addHandler("font", (value) => {
            const font = value || "oxygen";
            selectedFontRef.current = font;
            localStorage.setItem("selectedFont", font);
            quill.format("font", font);
            quill.formatText(0, quill.getLength(), "font", font);
         });

         const savedDelta = localStorage.getItem("textContent");
         if (savedDelta) {
            try {
               const delta = JSON.parse(savedDelta);
               quill.setContents(delta);
               setEditorDelta(delta);
               quill.formatText(0, quill.getLength(), "font", storedFont);
               quill.format("font", storedFont);
               extractWords(quill.root);
            } catch (e) {
               console.error("Error parsing saved delta:", e);
            }
         }

         quill.on("text-change", () => {
            const delta = quill.getContents();
            const plainDelta = JSON.parse(JSON.stringify(delta));
            setEditorDelta(plainDelta);

            localStorage.setItem("textContent", JSON.stringify(plainDelta));
            extractWords(quill.root);

            quill.format("font", selectedFontRef.current);
            quill.formatText(0, quill.getLength(), "font", selectedFontRef.current);

            const currentUser = auth.currentUser;
            if (currentUser) {
               const noteDocRef = doc(db, "notes", currentUser.uid);
               setDoc(
                  noteDocRef,
                  { content: plainDelta, updatedAt: new Date() },
                  { merge: true }
               ).catch((err) => console.error("Error saving note:", err));
            }
         });

         quill.focus();
         quill.format("font", selectedFontRef.current);
      }
   }, [toolbarOptions, extractWords]);

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
         if (user) {
            try {
               const noteDocRef = doc(db, "notes", user.uid);
               const docSnap = await getDoc(noteDocRef);
               if (docSnap.exists()) {
                  const data = docSnap.data();
                  if (data.content && quillRef.current) {
                     quillRef.current.setContents(data.content);
                     setEditorDelta(data.content);
                     quillRef.current.formatText(
                        0,
                        quillRef.current.getLength(),
                        "font",
                        selectedFontRef.current
                     );
                  }
               }
            } catch (err) {
               console.error("Error loading note:", err);
            }
         }
      });
      return unsubscribe;
   }, []);

   return <div id="editor" style={{ minHeight: "80vh" }}></div>;
}
