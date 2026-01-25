import { useRef, useEffect, useState } from "react";
import MacVideo from "../../assets/TrailerVideo_mac.mp4";

const ScrollVideo = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Handle video errors
    const handleError = () => {
      console.error("Video playback error:", video.error);
      setError(true);
    };

    video.addEventListener("error", handleError);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch((error) => {
                console.log("Autoplay prevented:", error);
              });
            }
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(video);

    return () => {
      observer.unobserve(video);
      video.removeEventListener("error", handleError);
    };
  }, []);

  if (error) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center p-8">
        <p className="text-gray-600 text-center">
          Video playback is not supported on this device.
        </p>
      </div>
    );
  }

  // Use Mac video for all devices - it's better encoded and smaller (18MB vs 50MB)
  const videoSrc = MacVideo;

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="auto"
      className="w-full h-full"
      style={{ objectFit: "cover" }}
    >
      <source src={videoSrc} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default ScrollVideo;
