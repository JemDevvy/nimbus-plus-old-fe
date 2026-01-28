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

// Duplicate the cards for seamless infinite loop (same as desktop)
const infiniteCards = [...cards, ...cards];

const Carouselmobile: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const positionRef = useRef(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Touch/swipe handling
  const touchStartX = useRef(0);
  const touchStartPosition = useRef(0);
  const isDragging = useRef(false);
  const isPaused = useRef(false);

  const cardWidth = 280; // w-70 = 280px (mobile card width)
  const gap = 24; // gap-6 = 24px
  const cardWithGap = cardWidth + gap;
  const totalWidth = cards.length * cardWithGap;
  const speed = 0.3; // pixels per frame (adjust for speed)

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    isPaused.current = true;
    touchStartX.current = e.touches[0].clientX;
    touchStartPosition.current = positionRef.current;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;

    const currentX = e.touches[0].clientX;
    const diff = touchStartX.current - currentX;
    const newPosition = touchStartPosition.current + diff;

    // Update position
    positionRef.current = newPosition;

    // Update which card is in view
    const cardIndex =
      Math.floor(positionRef.current / cardWithGap) % cards.length;
    setCurrentCardIndex(cardIndex >= 0 ? cardIndex : cards.length + cardIndex);

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(-${positionRef.current}px, 0, 0)`;
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;

    // Snap to nearest card - allow it to go into duplicate territory
    let nearestCardIndex = Math.round(positionRef.current / cardWithGap);
    let snapPosition = nearestCardIndex * cardWithGap;

    // Calculate final position after wrap-around (what we'll silently reposition to)
    let finalPosition = snapPosition;
    if (snapPosition >= totalWidth) {
      finalPosition = snapPosition % totalWidth;
    } else if (snapPosition < 0) {
      finalPosition = totalWidth + (snapPosition % totalWidth);
    }

    const needsRepositioning = snapPosition !== finalPosition;

    if (trackRef.current) {
      // Animate to the snap position (might be in duplicate range)
      trackRef.current.style.transition = "transform 0.3s ease-out";
      trackRef.current.style.transform = `translate3d(-${snapPosition}px, 0, 0)`;

      setTimeout(() => {
        if (trackRef.current) {
          trackRef.current.style.transition = "";

          // After animation completes, silently reposition to final position if needed
          if (needsRepositioning) {
            positionRef.current = finalPosition;
            trackRef.current.style.transform = `translate3d(-${finalPosition}px, 0, 0)`;
          } else {
            positionRef.current = snapPosition;
          }

          // Update card index
          const cardIndex =
            Math.floor(positionRef.current / cardWithGap) % cards.length;
          setCurrentCardIndex(
            cardIndex >= 0 ? cardIndex : cards.length + cardIndex,
          );
        }
      }, 300);
    }

    // Resume auto-scroll after a delay
    setTimeout(() => {
      isPaused.current = false;
    }, 2000);
  };

  // Continuous animation loop
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const animate = () => {
      if (!isPaused.current && !isDragging.current) {
        positionRef.current += speed;

        // When we've scrolled through one set of cards (50% of total), reset seamlessly
        if (positionRef.current >= totalWidth) {
          positionRef.current -= totalWidth;
        }

        // Update which card is currently in view
        const cardIndex =
          Math.floor(positionRef.current / cardWithGap) % cards.length;
        setCurrentCardIndex(cardIndex);

        if (track) {
          // Use translate3d for hardware acceleration and smoother performance
          track.style.transform = `translate3d(-${positionRef.current}px, 0, 0)`;
        }
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
    <div className="relative w-10/12 overflow-hidden py-4 mb-12 sm:mb-36 md:mb-20 lg:mb-36 items-center mx-auto font-heading">
      {/* Gradient overlays - full height with vertical and horizontal fading */}
      {/* Left gradient overlay */}
      <div 
        className="absolute z-10 left-0 top-0 bottom-0 w-[12vw] pointer-events-none"
        style={{
          background: 'linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.85) 25%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 10%, rgba(0,0,0,0.7) 90%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 10%, rgba(0,0,0,0.7) 90%, transparent 100%)',
          backdropFilter: 'blur(1.5px)',
          WebkitBackdropFilter: 'blur(1.5px)',
        }}
      />
      {/* Right gradient overlay */}
      <div 
        className="absolute z-10 right-0 top-0 bottom-0 w-[12vw] pointer-events-none"
        style={{
          background: 'linear-gradient(to left, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.85) 25%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 10%, rgba(0,0,0,0.7) 90%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 10%, rgba(0,0,0,0.7) 90%, transparent 100%)',
          backdropFilter: 'blur(1.5px)',
          WebkitBackdropFilter: 'blur(1.5px)',
        }}
      />

      {/* Carousel Track - using transform like desktop */}
      <div
        ref={trackRef}
        className="flex py-5 px-10 gap-6 cursor-grab active:cursor-grabbing"
        style={{ willChange: "transform" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {infiniteCards.map((card, index) => (
          <div
            key={index}
            className="w-70 sm:w-80 sm:h-[330px] flex-shrink-0 flex flex-col rounded-2xl bg-white p-6 shadow-md text-left"
          >
            <p className="sm:mb-6 text-[12px] sm:text-lg">{card.review}</p>

            <div className="mt-auto flex flex-row items-center gap-4">
              <div>
                <h2 className="text-sm font-bold align-bottom">{card.name}</h2>
                <p className="text-[12px] sm:text-lg">{card.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bullet Indicators (non-clickable) - overlaid on carousel */}
      <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-center items-center gap-2">
        {cards.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              currentCardIndex === i
                ? "h-2.5 w-2.5 bg-brand-primary shadow-lg"
                : "h-2 w-2 bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carouselmobile;
