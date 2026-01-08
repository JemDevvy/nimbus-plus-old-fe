import { useRef, useEffect, useState } from "react";
import Video from "../../assets/TrailerVideo.mp4";

const ScrollVideo = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState(false);
  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Handle video errors
    const handleError = (e: Event) => {
      console.error("Video playback error:", e);
      setError(true);
    };

    const handleCanPlay = () => {
      setCanPlay(true);
    };

    video.addEventListener("error", handleError);
    video.addEventListener("canplay", handleCanPlay);

    // Try to load the video
    video.load();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && canPlay) {
            // Use a promise chain to handle autoplay restrictions
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  // Autoplay started successfully
                })
                .catch((error) => {
                  // Autoplay was prevented - this is expected on some devices
                  console.log("Autoplay prevented:", error);
                  // Optionally, you could show a play button here
                });
            }
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 } // Play when 50% visible
    );

    observer.observe(video);

    return () => {
      observer.unobserve(video);
      video.removeEventListener("error", handleError);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [canPlay]);

  if (error) {
    return (
      <div className="w-full md:h-fit rounded-lg bg-gray-200 flex items-center justify-center p-8">
        <p className="text-gray-600 text-center">
          Video playback is not supported on this device.
        </p>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      src={Video}
      muted
      loop
      playsInline
      preload="auto"
      className="w-full md:h-fit rounded-lg"
      style={{ objectFit: "contain" }}
    />
  );
};

export default ScrollVideo;
