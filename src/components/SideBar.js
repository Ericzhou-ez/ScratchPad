import React, { useEffect, useRef } from "react";

export default function Sidebar() {
   const sidebarRef = useRef(null);

   useEffect(() => {
      if (sidebarRef.current) {
         sidebarRef.current.style.transform = "translateX(-80%)";
      }

      setTimeout(() => {
         sidebarRef.current.style.transform = "translateX(-110%)";
      }, "400");
   }, []);

   // Show the sidebar fully (100% visible)
   function openSidebar() {
      if (sidebarRef.current) {
         sidebarRef.current.style.transform = "translateX(10%)";
      }
   }

   // Hide the sidebar fully (0% visible)
   function closeSidebar() {
      if (sidebarRef.current) {
         sidebarRef.current.style.transform = "translateX(-110%)";
      }
   }

   return (
      <>
         <div
            className="hover-zone"
            onMouseEnter={openSidebar}
            onMouseLeave={closeSidebar}
         ></div>

         <div
            className="sidebar"
            ref={sidebarRef}
            onMouseEnter={openSidebar}
            onMouseLeave={closeSidebar}
         >
            <div>
            
            </div>
         </div>
      </>
   );
}
