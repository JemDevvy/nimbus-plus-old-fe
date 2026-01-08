import React from "react";

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
  { name: "Engineer", review: 'RFIs and design changes get buried in endless email threads. If Nimbus+ can bring everything, RFIs, changes, and decisions, into one shared system, it’s a game-changer.' },
  { name: "Director", review: 'Most platforms are made for builders. Architects need something that understands the design phase, coordination, feedback, revisions. Nimbus+ actually feels like it was built for us.' },
];

// Duplicate for seamless loop
const infiniteCards = [...cards, ...cards];

const Carousel: React.FC = () => {
  return (
    <div className="relative w-3/5 lg:w-4/5 xl:w-3/5 overflow-hidden py-4 mb-36 items-center mx-auto font-heading">
      {/* Gradient overlays*/}
      <div className="absolute left-0 top-0 h-full w-48 bg-gradient-to-r from-brand-whiteback to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-48 bg-gradient-to-l from-brand-whiteback to-transparent z-10 pointer-events-none" />

      {/* Carousel Track */}
      <div className="flex items-center justify-center flex-row gap-6 animate-scroll-lg">
        {infiniteCards.map((card, index) => (
          <div
            key={index}
            className="w-80 h-[330px] flex-shrink-0 flex flex-col rounded-2xl bg-white p-6 shadow-md text-left
            hover:scale-105 transform transition-all duration-300 ease-in-out">
            <p className="sm:mb-6 text-[12px] sm:text-lg">{card.review}</p>

            <div className="mt-auto flex flex-row items-center gap-4">
              <div className="rounded-full inline-block h-14 w-14 overflow-hidden border-2 border-brand-primary">
                <img src="https://placehold.net/avatar.png" alt="Avatar" />
              </div>
              <div>
                <h2 className="text-xl font-bold align-bottom">{card.name}</h2>
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
