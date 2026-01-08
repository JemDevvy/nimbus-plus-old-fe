import React, { useRef, useState, useEffect } from "react";

interface CardProps {
  name: string;
  review: string;
  role?: string;
  imageUrl?: string;
}

const cards: CardProps[] = [
  { name: "Engineer", review: 'RFIs and design changes get buried in endless email threads. If Nimbus+ can bring everything, RFIs, changes, and decisions, into one shared system, it’s a game-changer.' },
  { name: "Director", review: 'Most platforms are made for builders. Architects need something that understands the design phase, coordination, feedback, revisions. Nimbus+ actually feels like it was built for us.' },
  { name: "Project Architect", review: 'Keeping track of what changed, who changed it, and which file is current shouldn’t need detective work. Live drawings and tracked design changes in Nimbus+ would save hours every week.', imageUrl: "https://randomuser.me/api/portraits/men/46.jpg" },
];

// Duplicate for seamless loop
// const infiniteCards = [...cards, ...cards];

const Carouselmobile: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Track active slide on scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const index = Math.round(
        container.scrollLeft / container.offsetWidth
      );
      setActiveIndex(index);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to slide
  const scrollToIndex = (index: number) => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTo({
      left: container.offsetWidth * index,
      behavior: "smooth",
    });
  };

  // Auto swipe every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % cards.length;
        scrollToIndex(next);
        return next;
      });
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="block sm:hidden relative w-10/12 overflow-hidden py-4 mb-36 items-center mx-auto font-heading">
      {/* Gradient overlays*/}
      <div className="absolute z-10 left-0 top-0 h-[30vh] w-[10vw] bg-gradient-to-r from-brand-whiteback to-transparent pointer-events-none"  />
      <div className="absolute z-10 right-0 top-0 h-[30vh] w-[10vw] bg-gradient-to-l from-brand-whiteback to-transparent pointer-events-none"  />
      {/* <div className="hidden sm:block sm:absolute right-0 top-0 h-full w-48 bg-gradient-to-l from-brand-whiteback to-transparent z-10 pointer-events-none" /> */}

      {/* Carousel Track */}
      <div ref={containerRef} className="flex py-5 px-10 overflow-x-auto snap-x snap-mandatory scroll-smooth carousel-no-scrollbar gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="snap-center w-70 sm:w-80 sm:h-[330px] flex-shrink-0 flex flex-col rounded-2xl bg-white p-6 shadow-md text-left">
            <p className="sm:mb-6 text-[12px] sm:text-lg">{card.review}</p>

            <div className="mt-auto flex flex-row items-center gap-4">
              <div className="hidden rounded-full sm:inline-block h-14 w-14 overflow-hidden border-2 border-brand-primary">
                <img src={card.imageUrl} alt="https://randomuser.me/api/portraits/women/44.jpg" />
              </div>
              <div>
                <h2 className="text-sm font-bold align-bottom">{card.name}</h2>
                <p className="text-[12px] sm:text-lg">{card.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="block sm:hidden flex justify-center gap-2 mt-4">
        {cards.map((card, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            className={`h-2 w-2 rounded-full transition ${
              activeIndex === i ? "bg-brand-primary" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carouselmobile;
