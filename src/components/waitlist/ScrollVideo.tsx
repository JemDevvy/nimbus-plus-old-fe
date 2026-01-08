import { useRef, useEffect } from "react";
import Video from "../../assets/TrailerVideo.mp4";

const ScrollVideo = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch((e) => console.log(e));
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 } // Play when 50% visible
    );

    observer.observe(video);

    return () => observer.unobserve(video);
  }, []);

  return (
    <video
      ref={videoRef}
      src={Video}
      muted
      loop
      playsInline
      className="w-full md:h-fit rounded-lg "
    />
  );
};

export default ScrollVideo;
