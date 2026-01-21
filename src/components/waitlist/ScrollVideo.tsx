import { useRef, useEffect, useState } from "react";
import MacVideo from "../../assets/TrailerVideo_mac.mp4";

const checkIsSafari = () => {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent;
  const isWebKit = /AppleWebKit/.test(ua);
  const isNotChrome = !/Chrome|Chromium|Edg/.test(ua);

  return isWebKit && isNotChrome;
};

const checkIsMobile = () => {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent;
  // Check for mobile devices
  return /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    ua,
  );
};

const ScrollVideo = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState(false);
  const [isSafari, setIsSafari] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const safariCheck = checkIsSafari();
    const mobileCheck = checkIsMobile();
    setIsSafari(safariCheck);
    setIsMobile(mobileCheck);
    console.log("Device detection:", {
      isSafari: safariCheck,
      isMobile: mobileCheck,
    });
  }, []);

  // Reload video when source changes
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      console.log("Video source changed, reloading");
      video.load();
    }
  }, [isSafari, isMobile]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log("Video element initialized, src:", video.src);

    // Handle video errors
    const handleError = (e: Event) => {
      const errorDetails = {
        code: video.error?.code,
        message: video.error?.message,
        src: video.src,
        currentSrc: video.currentSrc,
        networkState: video.networkState,
        readyState: video.readyState,
      };
      console.error("Video playback error:", errorDetails);
      alert(`Video Error: ${video.error?.code} - ${video.error?.message}`);
      setError(true);
    };

    const handleLoadedData = () => {
      console.log("Video data loaded successfully");
    };

    video.addEventListener("error", handleError);
    video.addEventListener("loadeddata", handleLoadedData);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log("Video is visible, attempting to play");
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  console.log("Video playing successfully");
                })
                .catch((error) => {
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
      video.removeEventListener("loadeddata", handleLoadedData);
    };
  }, []);

  if (error) {
    return (
      <div className="w-full md:h-fit rounded-lg bg-gray-200 flex items-center justify-center p-8">
        <p className="text-gray-600 text-center">
          Video playback is not supported on this device.
        </p>
      </div>
    );
  }

  // Use Mac video for all devices - it's better encoded and smaller (18MB vs 50MB)
  const videoSrc = MacVideo;

  console.log("Rendering video with src:", videoSrc);
  console.log("User Agent:", navigator.userAgent);
  console.log("Device detection:", { isSafari, isMobile });

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="metadata"
      className="w-full md:h-fit rounded-lg"
      style={{ objectFit: "contain" }}
      controls={false}
      autoPlay={false}
    >
      <source src={videoSrc} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default ScrollVideo;
