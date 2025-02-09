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
      if (!quillRef.current) {
         const quill = new Quill("#editor", {
            theme: "snow",
            modules: { toolbar: toolbarOptions },
            placeholder: "Note...",
         });
         quillRef.current = quill;

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

         const savedDelta = localStorage.getItem("textContent");
         if (savedDelta) {
            try {
               const delta = JSON.parse(savedDelta);
               quill.setContents(delta);
               setEditorDelta(delta);
            } catch (e) {
               console.error("Error parsing saved delta:", e);
            }
         }

         quill.on("text-change", () => {
            const delta = quill.getContents();
            // Convert delta to a plain object via serialization.
            const plainDelta = JSON.parse(JSON.stringify(delta));
            setEditorDelta(plainDelta);
            localStorage.setItem("textContent", JSON.stringify(plainDelta));
            extractWords(quill.root);

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
