import React from "react";
import AboutStyles from "./about.module.css";

function About() {
  return (
    <div className={AboutStyles.pageContainer}>
      <h1 className={AboutStyles.mainHeader}>Intuition - About Us</h1>
      <div className={AboutStyles.container}>
        <section className={AboutStyles.section}>
          <h2 className={AboutStyles.sectionHeader}>Team Members</h2>
          <ul className={AboutStyles.memberList}>
            <li className={AboutStyles.memberItem}>
              <span className={AboutStyles.memberRole}>Principal Investigator</span>
              <span className={AboutStyles.memberName}>Jesualdo Tomas Fernandez Breis</span>
            </li>
            <li className={AboutStyles.memberItem}>
              <span className={AboutStyles.memberRole}>Collaborator</span>
              <span className={AboutStyles.memberName}>Juan Mulero Hernandez</span>
            </li>
            <li className={AboutStyles.memberItem}>
              <span className={AboutStyles.memberRole}>Lead Developer</span>
              <span className={AboutStyles.memberName}>Daniel Ibáñez Molero</span>
            </li>
          </ul>
        </section>
        <div className={AboutStyles.infoResourcesWrapper}>
          <section className={AboutStyles.section}>
            <h2 className={AboutStyles.sectionHeader}>Contact Info</h2>
<p className={AboutStyles.contactInfo}>Email: jfernand@um.es</p>
            <p className={AboutStyles.contactInfo}>Email: danibanez.info@gmail.com</p>
            <p className={AboutStyles.contactInfo}>Phone: 868 88 87 87</p>
          </section>
          <section className={AboutStyles.section}>
            <h2 className={AboutStyles.sectionHeader}>Additional Resources</h2>
            <p className={AboutStyles.sectionText}>
              For more information, user guides, or to contribute to the project, visit our <a href="https://github.com/orgs/tecnomod-um/projects/4" className={AboutStyles.link}>GitHub page</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default About;