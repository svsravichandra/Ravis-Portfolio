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
        } else {
          setVisibleSections(prev => {
            const newSet = new Set(Array.from(prev));
            newSet.delete(sectionIndex);
            return newSet;
          });
        }
      });

      // Find the section that's closest to the center of the viewport
      const viewportCenter = window.innerHeight / 2;
      let closestSection = 0;
      let closestDistance = Infinity;

      sections.forEach((section, index) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          const sectionCenter = rect.top + rect.height / 2;
          const distance = Math.abs(sectionCenter - viewportCenter);
          
          if (distance < closestDistance && rect.bottom > 0 && rect.top < window.innerHeight) {
            closestDistance = distance;
            closestSection = index;
          }
        }
      });

      setActiveSection(closestSection);
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
