import { useState, useEffect, useRef } from "react";

interface TypingTextProps {
  text: string;
  speed?: number; // ms per character
}

const TypingText: React.FC<TypingTextProps> = ({ text, speed = 100 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let observer: IntersectionObserver;

    if (ref.current) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            interval = setInterval(() => {
              setDisplayedText((prev) => {
                const nextChar = text[prev.length];
                if (nextChar) return prev + nextChar;
                clearInterval(interval);
                return prev;
              });
            }, speed);

            observer.unobserve(ref.current);
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(ref.current);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (ref.current && observer) observer.unobserve(ref.current);
    };
  }, [text, speed]);

  return (
    <div ref={ref} className="">
      {displayedText}
    </div>
  );
};

export default TypingText;
