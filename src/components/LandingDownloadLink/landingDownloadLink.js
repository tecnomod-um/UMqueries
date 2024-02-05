import React from 'react';

const LandingDownloadLink = ({ fileName, label }) => {
  const fileUrl = `${process.env.PUBLIC_URL}/useCases/${fileName}`;

  return (
    <a href={fileUrl} download>
      {label}
    </a>
  );
}

export default LandingDownloadLink;
