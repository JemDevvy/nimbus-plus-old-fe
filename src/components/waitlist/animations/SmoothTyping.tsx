import { useEffect, useRef, useState } from "react";

interface Segment {
  before: string;   // HTML before the text
  text: string;     // visible text to type
  after: string;    // HTML after the text
}

interface Props {
  segments: Segment[];
  speed?: number;
}

const SmoothTyping = ({ segments, speed = 35 }: Props) => {
  const [html, setHtml] = useState("");
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // start on scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) obs.observe(ref.current);

    return () => obs.disconnect();
  }, []);

  // main typing logic
  useEffect(() => {
    if (!started) return;

    let segIndex = 0;
    let charIndex = 0;

    // initialize HTML with segment wrappers but empty text
    const initialHTML = segments
      .map((s) => `${s.before}${"".padEnd(s.text.length, " ") }${s.after}`)
      .join("");

    setHtml(initialHTML);

    const timer = setInterval(() => {
      const current = segments[segIndex];

      if (!current) {
        clearInterval(timer);
        return;
      }

      if (charIndex < current.text.length) {
        // build the fully typed HTML
        const built = segments
          .map((s, i) => {
            if (i < segIndex) return s.before + s.text + s.after;

            if (i > segIndex)
              return s.before + "".padEnd(s.text.length, " ") + s.after;

            // current typing segment
            const typed = current.text.substring(0, charIndex + 1);
            const remaining = "".padEnd(current.text.length - typed.length, " ");

            return s.before + typed + remaining + s.after;
          })
          .join("");

        setHtml(built);
        charIndex++;
      } else {
        segIndex++;
        charIndex = 0;
      }
    }, speed);

    return () => clearInterval(timer);
  }, [started, segments, speed]);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
};

export default SmoothTyping;
