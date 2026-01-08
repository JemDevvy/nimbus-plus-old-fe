import { useEffect, useRef, useState } from "react";

interface PopInItemProps {
  children: React.ReactNode;
  index: number; // needed for stagger
  delayIncrement?: number; // ms between items
  durationMs?: string;
}

const PopInItem: React.FC<PopInItemProps> = ({
  children,
  index,
  delayIncrement = 400,
  durationMs = "duration-500",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), index * delayIncrement);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [index, delayIncrement]);

  return (
    <div
      ref={ref}
      className={`transition-transform transition-opacity ${durationMs} ease-out ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
      }`}
    >
      {children}
    </div>
  );
};

export default PopInItem;
