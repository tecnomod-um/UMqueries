import React from "react";
import AboutStyles from "./about.module.css";

function About() {
  return (
    <div className={AboutStyles.pageContainer}>
      <h1 className={AboutStyles.mainHeader}>UM - ABOUT</h1>
      <div className={AboutStyles.container}>
        <section className={AboutStyles.section}>
          <h2 className={AboutStyles.sectionHeader}>Team Members</h2>
          <ul className={AboutStyles.memberList}>
            <li className={AboutStyles.memberItem}>
              <span className={AboutStyles.memberName}>John Doe</span>
              <span className={AboutStyles.memberRole}>Front-end Developer</span>
            </li>
            <li className={AboutStyles.memberItem}>
              <span className={AboutStyles.memberName}>Jane Smith</span>
              <span className={AboutStyles.memberRole}>Back-end Developer</span>
            </li>
            {/* Add more team members as needed */}
          </ul>
        </section>
        <section className={AboutStyles.section}>
          <h2 className={AboutStyles.sectionHeader}>Contact Info</h2>
          <p className={AboutStyles.sectionText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac justo rhoncus, aliquam magna eu,
            pulvinar nisi. Suspendisse sit amet sagittis dolor, sed fringilla dui. In sit amet eros et ligula placerat
            vestibulum. Curabitur lobortis consectetur ipsum, eget tincidunt tellus ultricies a.
          </p>
          <p className={AboutStyles.contactInfo}>Email: info@example.com</p>
          <p className={AboutStyles.contactInfo}>Phone: +1234567890</p>
        </section>
      </div>
    </div>
  );
}

export default About;
