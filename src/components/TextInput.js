// TextInput.js
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

export default function TextInput({
   handleSetCharacterCount,
   handleSetTextContent,
}) {
   const quillRef = useRef(null);
   // We'll store the editor contents as a Delta (object) rather than HTML.
   const [editorDelta, setEditorDelta] = useState(null);

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

   // This helper computes word and character counts from the editor's text.
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

   // Initialize Quill only once.
   useLayoutEffect(() => {
      if (!quillRef.current) {
         const quill = new Quill("#editor", {
            theme: "snow",
            modules: { toolbar: toolbarOptions },
            placeholder: "Note...",
         });
         quillRef.current = quill;

         // Register custom fonts.
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

         // Load any saved Delta from localStorage (if available).
         const savedDelta = localStorage.getItem("textContent");
         if (savedDelta) {
            try {
               const delta = JSON.parse(savedDelta);
               quill.setContents(delta);
               setEditorDelta(delta);
            } catch (e) {
               console.error("Error parsing saved delta from localStorage:", e);
            }
         }

         // Listen for text changes.
         quill.on("text-change", () => {
            const delta = quill.getContents(); // Get the Delta object.
            setEditorDelta(delta);
            localStorage.setItem("textContent", JSON.stringify(delta));
            extractWords(quill.root);

            // Save note to Firestore if the user is signed in.
            const currentUser = auth.currentUser;
            if (currentUser) {
               const noteDocRef = doc(db, "notes", currentUser.uid);
               setDoc(
                  noteDocRef,
                  { content: delta, updatedAt: new Date() },
                  { merge: true }
               ).catch((err) =>
                  console.error("Error saving note to Firestore:", err)
               );
            }
         });

         quill.focus();
      }
      // We intentionally do not include editorDelta in dependencies so that
      // the editor isn't re-initialized every time its content changes.
   }, [toolbarOptions, extractWords]);

   // When the authentication state changes, load the user's note from Firestore.
   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
         if (user) {
            try {
               const noteDocRef = doc(db, "notes", user.uid);
               const docSnap = await getDoc(noteDocRef);
               if (docSnap.exists()) {
                  const data = docSnap.data();
                  if (data.content && quillRef.current) {
                     // data.content is expected to be a Delta object.
                     quillRef.current.setContents(data.content);
                     setEditorDelta(data.content);
                  }
               }
            } catch (err) {
               console.error("Error loading note from Firestore:", err);
            }
         }
      });
      return unsubscribe;
   }, []);

   return <div id="editor" style={{ minHeight: "80vh" }}></div>;
}
