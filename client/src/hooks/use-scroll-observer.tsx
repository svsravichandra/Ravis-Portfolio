import { useEffect, useState } from "react";

export function useScrollObserver(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set<number>());

  useEffect(() => {
    const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
    
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const sectionIndex = sections.findIndex(section => section === entry.target);
        
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set(Array.from(prev).concat(sectionIndex)));
          
          // Update active section based on viewport center
          const rect = entry.target.getBoundingClientRect();
          const isInCenter = rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2;
          
          if (isInCenter) {
            setActiveSection(sectionIndex);
          }
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, [sectionIds]);

  const scrollToSection = (index: number) => {
    const section = document.getElementById(sectionIds[index]);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return { activeSection, visibleSections, scrollToSection };
}
