import React from 'react';
import LandingDownloadLinkStyles from './landingDownloadLink.module.css'

const LandingDownloadLink = ({ fileName, label }) => {
  const fileUrl = `${process.env.PUBLIC_URL}/useCases/${fileName}`;

  return (
    <a href={fileUrl} className={LandingDownloadLinkStyles.linkElement} download>
      {label}
    </a>
  );
}

export default LandingDownloadLink;
