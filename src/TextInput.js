import React from "react";
import { useState } from "react";

export default function TextInpput() {
   return <textarea></textarea>;
}

// export default function TextInpput() {
//    const [content, setContent] = useState("");

//    const handleInput = (e) => {
//       setContent(e.target.innerText);
//    };

//    return (
//       <div
//          contentEditable
//          onInput={handleInput}
//          style={{
//             border: "1px solid #ccc",
//             padding: "10px",
//             borderRadius: "5px",
//             minHeight: "100px",
//             background: "#f8f9fa",
//             outline: "none",
//          }}
//       >
//          {content}
//       </div>
//    );
// }
