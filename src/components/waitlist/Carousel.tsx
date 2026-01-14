import React, { useRef, useEffect } from "react";

interface CardProps {
  name: string;
  review: string;
  role?: string;
  imageUrl?: string;
}

const cards: CardProps[] = [
  {
    name: "Principal, Architecture Practice (Milson's Point, NSW)",
    review:
      "For something like this to really work in practice, it has to extend beyond just one team. If sharing with consultants is seamless, that's where it becomes genuinely useful",
  },
  {
    name: "Architectural Firm Principal (Sydney, NSW)",
    review:
      "Having a clear, traceable record of decisions and communication removes a lot of ambiguity. When things get questioned later, being able to point to what was agreed, and when, really matters.",
  },
  {
    name: "Senior Principal, Architectural Firm (Sydney, NSW)",
    review:
      "When software isn't built around design workflows, teams end up using only the parts that don't get in their way. Everything else just adds complexity.",
  },
  {
    name: "Development Manager, Private Developer / Builder Company (Sydney, NSW)",
    review:
      "The industry doesn't need another project management tool. It needs something built specifically for how design work actually happens.",
  },
  {
    name: "Design Manager, Builder / Developer (North Stratfield, NSW)",
    review:
      "Most platforms are built around construction delivery. Design management is treated as an afterthought, and teams feel that every day.",
  },
  {
    name: "Design Director, Architectural Firm (Sydney, NSW)",
    review:
      "Design teams rely on email, spreadsheets, document systems, and transmittals, because no single platform is built around the design phase itself.",
  },
  {
    name: "Director, Architecture Practice (Ultimo, NSW)",
    review:
      "The industry doesn't suffer from a lack of software. It suffers from fragmented workflows. Tools exist, but none of them talk to each other in a way design teams actually operate.",
  },
  {
    name: "Architecture Practice Director (North Sydney, NSW)",
    review:
      "We don't use any formal platform during the design phase, because there isn't one built for it. Tools only come in once projects are on site, and they're almost always driven by builders.",
  },
  {
    name: "Architecture Graduate (Sydney, NSW)",
    review:
      "During design development, the lack of a shared system for communication and updates between consultants often leads to delays and confusion.",
  },
  {
    name: "Senior Architect (Wellington Parade, VIC)",
    review:
      "For me it's all about how intuitive the user interface is and easy it is to access information. Another important item would be linking related RFIs as some people put in the information in multiple correspondence trails which creates confusion.",
  },
];

// Duplicate the cards for seamless infinite loop
const infiniteCards = [...cards, ...cards];

const Carousel: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const positionRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const cardWidth = 320; // w-80 = 320px
    const gap = 24; // gap-6 = 24px
    const cardWithGap = cardWidth + gap;
    const totalWidth = cards.length * cardWithGap;
    const speed = 0.5; // pixels per frame (adjust for speed)

    const animate = () => {
      positionRef.current += speed;

      // When we've scrolled through one set of cards (50% of total), reset seamlessly
      if (positionRef.current >= totalWidth) {
        positionRef.current -= totalWidth; // Subtract instead of setting to 0 for smoother transition
      }

      if (track) {
        // Use translate3d for hardware acceleration and smoother performance
        track.style.transform = `translate3d(-${positionRef.current}px, 0, 0)`;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation immediately
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-3/5 lg:w-4/5 xl:w-3/5 overflow-hidden py-4 mb-36 items-center mx-auto font-heading">
      {/* Gradient overlays*/}
      <div className="absolute left-0 top-0 h-full w-48 bg-gradient-to-r from-brand-whiteback to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-48 bg-gradient-to-l from-brand-whiteback to-transparent z-10 pointer-events-none" />

      {/* Carousel Track */}
      <div
        ref={trackRef}
        className="flex items-stretch flex-row gap-6"
        style={{ willChange: "transform" }}
      >
        {infiniteCards.map((card, index) => (
          <div
            key={index}
            className="w-80 flex-shrink-0 flex flex-col rounded-2xl bg-white p-6 shadow-md text-left
            hover:scale-105 transform transition-all duration-300 ease-in-out"
          >
            <p className="sm:mb-6 text-[12px] sm:text-lg">{card.review}</p>

            <div className="mt-auto flex flex-row items-center gap-4">
              <div>
                <div className="inline-block h-14 w-14 overflow-hidden border-2 rounded-full border-brand-primary">
                  <img src="https://placehold.net/avatar.png" alt="Avatar" />
                </div>
              </div>

              <div>
                <h2 className="text-l font-bold align-bottom">{card.name}</h2>
                {/* <p className="text-lg">{card.role}</p> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
