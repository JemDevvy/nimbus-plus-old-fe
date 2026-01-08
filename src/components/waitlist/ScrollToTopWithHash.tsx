import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTopWithHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
  if (hash) {
    const el = document.querySelector(hash);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100; // adjust 100
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}, [pathname, hash]);

  return null;
}
