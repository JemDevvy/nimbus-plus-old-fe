import { useEffect, useRef, useState } from "react";

interface SlideInItemProps {
  children: React.ReactNode;
  index?: number; // for mapped items
  direction?: "left" | "right"; // default for single items
  delayIncrement?: number; // ms between items
  startSequence?: boolean; // when parent says "start"
  onVisible?: () => void; // callback to parent to trigger next
}

const SlideIn: React.FC<SlideInItemProps> = ({
  children,
  index,
  direction = "left",
  delayIncrement = 1000,
  startSequence = false,
  onVisible,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [inView, setInView] = useState(false);

  // Observe scroll into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Trigger sequential animation when in view and parent allows
  useEffect(() => {
    if (inView && startSequence) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        if (onVisible) onVisible();
      }, delayIncrement);
      return () => clearTimeout(timer);
    }
  }, [inView, startSequence, delayIncrement, onVisible]);

  const slideFrom = index !== undefined ? (index % 2 === 0 ? "left" : "right") : direction;

  return (
    <div
      ref={ref}
      className={`transition-transform transition-opacity duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-x-0"
          : slideFrom === "left"
          ? "opacity-0 -translate-x-20"
          : "opacity-0 translate-x-20"
      }`}
    >
      {children}
    </div>
  );
};

export default SlideIn;
