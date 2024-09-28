import React, { ReactNode } from 'react';

interface ScrollToProps {
  to: string;          // The ID of the section to scroll to
  children: ReactNode; // The content to be rendered inside the ScrollTo component
}

const ScrollTo: React.FC<ScrollToProps> = ({ to, children }) => {
  const scrollToSection = () => {
    const section = document.getElementById(to);

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  return (
    <div onClick={scrollToSection} style={{ cursor: 'pointer' }}>
      {children}
    </div>
  );
};

export default ScrollTo;