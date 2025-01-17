import React, { useEffect, useRef, useState } from "react";
import { AuthenticationPopUp } from "./authentication";
import {
   ArrowLineRight,
   CaretDoubleLeft,
   SignIn,
   TextAlignCenter,
} from "@phosphor-icons/react";

export default function Sidebar() {
   const sidebarRef = useRef(null);
   const [isSideBarLocked, setIsSideBarLocked ] = useState(false);
   const [isPrivacyPolicyOverlay, setIsPrivacyPolicyOverlay] = useState(false);
   const [isAuthenticationPopUpOpen, setIsAuthenticationPopUpOpen] = useState(false);

   useEffect(() => {
      if (sidebarRef.current) {
         sidebarRef.current.style.transform = "translateX(-80%)";
      }

      setTimeout(() => {
         sidebarRef.current.style.transform = "translateX(-100%)";
      }, "400");
   }, []);

   // Show the sidebar fully (100% visible)
   function openSidebar() {
      if (isSideBarLocked) {
         return;
      }
      if (sidebarRef.current) {
         sidebarRef.current.style.transform = "translateX(0)";
      }
   }

   // Hide the sidebar fully (0% visible)
   function closeSidebar() {
      if (isSideBarLocked) {
         return;
      }
      if (sidebarRef.current) {
         sidebarRef.current.style.transform = "translateX(-100%)";
      }
   }

   function lockSidebar() {
      setIsSideBarLocked(!isSideBarLocked)
      if (sidebarRef.current) {
         sidebarRef.current.classList.toggle("locked-sidebar");
      }
   }

   function togglePrivacyPolicy() {
      setIsPrivacyPolicyOverlay(!isPrivacyPolicyOverlay);
   }

   function toggleAuthenticationPopUp() {
      setIsAuthenticationPopUpOpen(!isAuthenticationPopUpOpen);
   }

   return (
      <>
         <div
            className="hover-zone"
            {...(!isSideBarLocked && {
               onMouseEnter: openSidebar,
               onMouseLeave: closeSidebar,
            })}
         ></div>

         <div
            className="sidebar"
            ref={sidebarRef}
            {...(!isSideBarLocked && {
               onMouseEnter: openSidebar,
               onMouseLeave: closeSidebar,
            })}
         >
            <div>
               <SidebarTitle
                  lockSidebar={lockSidebar}
                  isSideBarLocked={isSideBarLocked}
               />
               <div className="divider"></div>

               <SidebarMisallaneous
                  togglePrivacyPolicy={togglePrivacyPolicy}
                  toggleAuthenticationPopUp={toggleAuthenticationPopUp}
               />
            </div>
         </div>

         {isAuthenticationPopUpOpen && (
            <div className="modalOverlay-light" onClick={toggleAuthenticationPopUp}>
               <AuthenticationPopUp />
            </div>
         )}

         {isPrivacyPolicyOverlay && (
            <div className="modalOverlay" onClick={togglePrivacyPolicy}>
               <PrivacyPolicyOverlay />
            </div>
         )}
      </>
   );
}

function SidebarTitle({ lockSidebar, isSideBarLocked }) {
   return (
      <div className="sidebarTitle">
         <h2>Quick Notes</h2>

         {isSideBarLocked ? (
            <CaretDoubleLeft
               size={32}
               weight="fill"
               role="button"
               onClick={lockSidebar}
            />
         ) : (
            <ArrowLineRight
               size={32}
               weight="fill"
               role="button"
               onClick={lockSidebar}
            />
         )}
      </div>
   );
}

function SidebarMisallaneous({
   toggleAuthenticationPopUp,
   togglePrivacyPolicy,
}) {
   return (
      <>
         <PrivacyPolicy onClick={togglePrivacyPolicy} />
         <SideBarLogin onClick={toggleAuthenticationPopUp} />
      </>
   );
}

function PrivacyPolicy({ onClick }) {
   return (
      <div className="privacy-policy" role="button" onClick={onClick}>
         <TextAlignCenter size={25} weight="fill" />
         <p>Privacy Policy</p>
      </div>
   );
}

function SideBarLogin({ onClick }) {
   return (
      <div className="sideBarLogin" onClick={onClick}>
         <SignIn size={25} weight="fill" />
         <p>Login</p>
      </div>
   );
}

function PrivacyPolicyOverlay() {
   return (
      <div className="privacypolicy" onClick={(e) => e.stopPropagation()}>
         <h3>Privacy Policy</h3>
         <p>
            <strong>Privacy Policy Last Updated</strong>: January 13, 2025
         </p>
         <p>
            Thank you for using <strong>QuickNotesEZ</strong> (the “App”). This
            Privacy Policy explains how we collect, use, and safeguard your
            personal information when you use the App. By using the App, you
            agree to the terms outlined in this Privacy Policy.
         </p>
         <div className="divider"></div>
         <p>
            By accessing, installing, or otherwise utilizing the QuickNotesEZ
            (https://quicknotesez.netlify.app/) application (hereinafter
            referred to as the “App”), you, as the user (hereinafter “User”),
            acknowledge and agree that all data collection, processing, and
            usage within the App is subject to the terms and conditions
            contained herein. <br></br><br></br> This Privacy Policy is designed to
            apprise you of the manner in which we, the operators and proprietors
            of the App (“we,” “us,” or “our”), collect, store, utilize, and
            safeguard your personal information, as well as to disclose your
            rights and responsibilities with respect to such information. The
            User’s continued use of the App constitutes acceptance of this
            Privacy Policy in its entirety, including any future modifications.
            In order to facilitate essential functionality, the App integrates
            backend services provided by Google Firebase (“Firebase”), a
            third-party platform that enables user authentication and the
            storage of user-generated content in a secure environment,
            specifically including notes stored within Firebase Cloud Firestore
            or Realtime Database (collectively, the “Database”).<br></br><br></br> We
            collect minimal personally identifiable information (such as your
            email address) solely to establish and maintain your account and to
            enable secure access to the App’s core features. We do not solicit
            or gather additional personal details from you except to the extent
            explicitly provided by you for legitimate purposes related to the
            performance and improvement of the App. <br></br><br></br> All user-generated
            notes (hereinafter “Notes”) created, edited, or retained within the
            App are transmitted and stored through the Database. We expressly
            disclaim any intention or practice of accessing, reading, reviewing,
            modifying, or otherwise becoming privy to these Notes, except as
            strictly necessary to maintain or improve the technical
            functionality of the App or to comply with lawful requests by public
            authorities. The Notes remain under your exclusive control unless
            you opt, at your sole discretion, to share them through features or
            services designated for that purpose. <br></br><br></br> We reserve the
            right, pursuant to standard industry practice, to employ Firebase
            Analytics or analogous services to collect aggregate and anonymized
            data regarding App performance, crash reports, and feature
            utilization for the sole purpose of diagnosing technical issues and
            refining user experiences. Such data is not used to identify or
            track individual Users. By using the App, you consent to the
            collection and processing of these anonymized metrics, which remain
            strictly ancillary to the operation, development, and improvement of
            the App. The App’s usage of your information is limited to (i)
            providing and maintaining essential App functionalities, including
            the secure storage of Notes, user authentication, and necessary
            backend operations; (ii) implementing improvements or bug fixes
            based on anonymized analytics; and (iii) fulfilling any legal or
            regulatory obligations as mandated under applicable law. We
            categorically do not sell, rent, lease, or otherwise disseminate
            your personal data or Note content to third parties. We employ
            industry-standard security protocols and encryption measures through
            Firebase to safeguard data both at rest and in transit. However, you
            acknowledge that no transmission or storage method is entirely
            immune from unauthorized access, and we thus disclaim liability for
            any data breach, interception, or other form of unauthorized access
            except to the extent imposed by mandatory law. <br></br><br></br> You are
            solely responsible for preserving the confidentiality of any
            authentication credentials (e.g., usernames, passwords, or tokens)
            associated with your account and for notifying us promptly of any
            suspected unauthorized access or misuse of your account. In
            addition, this App may display hyperlinks or references to
            third-party websites or services that operate independently of our
            control. We assume no responsibility or liability for the privacy
            practices, terms, or content of such external sites. We encourage
            you to review the relevant privacy policies or terms of service for
            any external sites you choose to visit. <br></br><br></br> Furthermore, while
            this App is not directed toward individuals under the age of
            thirteen (13), we do not knowingly collect any personal information
            from minors. If we discover that a minor under thirteen has provided
            us with personal information without the requisite parental consent,
            we shall undertake commercially reasonable efforts to expunge such
            data from our systems. <br></br><br></br> All provisions of this Privacy
            Policy are subject to periodic revision. We reserve the right to
            update or modify these terms in our sole discretion, with or without
            prior notice, and such changes shall be effective immediately upon
            posting within the App or on our official website. The date
            indicated under “Last Updated” shall reflect the most recent
            revision. <br></br><br></br> Your continued use of the App following any such
            modification shall constitute conclusive acceptance of the revised
            Privacy Policy. Should you have inquiries regarding the terms
            herein, the scope of data collected, or your rights as a User, you
            may direct written correspondence to zhoueric882@gmail.com. We shall
            endeavor to respond to any legitimate requests or concerns in a
            timely manner and in accordance with any applicable legal
            requirements.
         </p>
      </div>
   );
}