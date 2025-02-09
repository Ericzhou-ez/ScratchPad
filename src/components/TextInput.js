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
   const [textContent, setTextContent] = useState("");

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

   // Initialize the Quill editor (runs only once).
   useLayoutEffect(() => {
      if (!quillRef.current) {
         const quill = new Quill("#editor", {
            theme: "snow",
            modules: { toolbar: toolbarOptions },
            placeholder: "Note...",
         });
         quillRef.current = quill;

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

         // If there’s any preloaded content (from local state), load it.
         if (textContent) {
            quill.clipboard.dangerouslyPasteHTML(textContent);
         }

         quill.on("text-change", () => {
            const html = quill.root.innerHTML;
            setTextContent(html);
            localStorage.setItem("textContent", JSON.stringify(html));
            extractWords(quill.root);

            // Save note to Firestore if a user is signed in.
            const currentUser = auth.currentUser;
            if (currentUser) {
               const noteDocRef = doc(db, "notes", currentUser.uid);
               setDoc(
                  noteDocRef,
                  { content: html, updatedAt: new Date() },
                  { merge: true }
               ).catch((err) =>
                  console.error("Error saving note to Firestore:", err)
               );
            }
         });

         quill.focus();
      }
      // intentionally do not include textContent in dependencies
      // so that the editor is not re-initialized on every content change.
   }, [toolbarOptions, extractWords]);

   // When the auth state changes, load the saved note from Firestore.
   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
         if (user) {
            try {
               const noteDocRef = doc(db, "notes", user.uid);
               const docSnap = await getDoc(noteDocRef);
               if (docSnap.exists()) {
                  const data = docSnap.data();
                  if (data.content && quillRef.current) {
                     // Use Quill’s clipboard method to paste HTML safely.
                     quillRef.current.clipboard.dangerouslyPasteHTML(
                        data.content
                     );
                     setTextContent(data.content);
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
