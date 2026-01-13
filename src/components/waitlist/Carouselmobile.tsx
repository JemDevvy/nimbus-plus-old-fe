import React, { useRef, useState, useEffect } from "react";

interface CardProps {
  name: string;
  review: string;
  role?: string;
  imageUrl?: string;
}

const cards: CardProps[] = [
  { 
    name: "Principal, Architecture Practice (Milson's Point, NSW)", 
    review: "For something like this to really work in practice, it has to extend beyond just one team. If sharing with consultants is seamless, that's where it becomes genuinely useful" 
  },
  { 
    name: "Architectural Firm Principal (Sydney, NSW)", 
    review: "Having a clear, traceable record of decisions and communication removes a lot of ambiguity. When things get questioned later, being able to point to what was agreed, and when, really matters." 
  },
  { 
    name: "Senior Principal, Architectural Firm (Sydney, NSW)", 
    review: "When software isn't built around design workflows, teams end up using only the parts that don't get in their way. Everything else just adds complexity." 
  },
  { 
    name: "Development Manager, Private Developer / Builder Company (Sydney, NSW)", 
    review: "The industry doesn't need another project management tool. It needs something built specifically for how design work actually happens." 
  },
  { 
    name: "Design Manager, Builder / Developer (North Stratfield, NSW)", 
    review: "Most platforms are built around construction delivery. Design management is treated as an afterthought, and teams feel that every day." 
  },
  { 
    name: "Design Director, Architectural Firm (Sydney, NSW)", 
    review: "Design teams rely on email, spreadsheets, document systems, and transmittals, because no single platform is built around the design phase itself." 
  },
  { 
    name: "Director, Architecture Practice (Ultimo, NSW)", 
    review: "The industry doesn't suffer from a lack of software. It suffers from fragmented workflows. Tools exist, but none of them talk to each other in a way design teams actually operate." 
  },
  { 
    name: "Architecture Practice Director (North Sydney, NSW)", 
    review: "We don't use any formal platform during the design phase, because there isn't one built for it. Tools only come in once projects are on site, and they're almost always driven by builders." 
  },
  { 
    name: "Architecture Graduate (Sydney, NSW)", 
    review: "During design development, the lack of a shared system for communication and updates between consultants often leads to delays and confusion." 
  },
  { 
    name: "Senior Architect (Wellington Parade, VIC)", 
    review: "For me it's all about how intuitive the user interface is and easy it is to access information. Another important item would be linking related RFIs as some people put in the information in multiple correspondence trails which creates confusion." 
  },
];

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

      {/* Carousel Track */}
      <div ref={containerRef} className="flex py-5 px-10 overflow-x-auto snap-x snap-mandatory scroll-smooth carousel-no-scrollbar gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="snap-center w-70 sm:w-80 sm:h-[330px] flex-shrink-0 flex flex-col rounded-2xl bg-white p-6 shadow-md text-left">
            <p className="sm:mb-6 text-[12px] sm:text-lg">{card.review}</p>

            <div className="mt-auto flex flex-row items-center gap-4">
              <div className="hidden rounded-full sm:inline-block h-14 w-14 overflow-hidden border-2 border-brand-primary">
                <img src={card.imageUrl || "https://placehold.net/avatar.png"} alt="Avatar" />
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
