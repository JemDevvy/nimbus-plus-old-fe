import { useEffect, useState } from "react";

interface RollingNumberProps {
  value: number;
  duration?: number; // in ms
}

const RollingNumber: React.FC<RollingNumberProps> = ({ value, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = displayValue;
    let end = value;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      const current = Math.floor(start + (end - start) * percentage);
      setDisplayValue(current);

      if (percentage < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span>
      {displayValue}
    </span>
  );
};

export default RollingNumber;
