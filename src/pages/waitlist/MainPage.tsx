// Components
import Carousel from "../../components/waitlist/Carousel";
import Carouselmobile from "../../components/waitlist/Carouselmobile";
import WaitlistBanner from "../../components/waitlist/WaitlistBanner";
import MenuBar from "../../components/waitlist/MenuBar";
import Footer from "../../components/waitlist/Footer";
import ScrollVideo from "../../components/waitlist/ScrollVideo";
import PopupForm from "../../components/waitlist/PopupForm";
import Toast from "../../components/waitlist/Toast";

// Assets
import Feature1 from "../../assets/Task Tracker.png";
import Feature2 from "../../assets/RFI Manager.png";
import Feature3 from "../../assets/Design Change.png";
import Feature4 from "../../assets/Drawing Management.png";
import Drawing from "../../assets/icons/Drawing.svg";
import DesignChange from "../../assets/icons/DesignChangeIcon.svg";
import {
  AssignmentTurnedInOutlined,
  PersonOutlineRounded,
  PeopleAltOutlined,
  SettingsOutlined,
} from "@mui/icons-material";

// Animations
import FadeInSection from "../../components/waitlist/animations/FadeInSection";
import SlideIn from "../../components/waitlist/animations/SlideIn";
// import TypingText from '../../components/waitlist/animations/TypingText';
import PopInItem from "../../components/waitlist/animations/PopInItem";
// import TypingText from '../../components/ui/shadcn-io/typing-text/index';

// React Functions
import { useState, useEffect } from "react";

// Content Arrays
const features = [
  {
    title: "Task Tracker",
    description:
      "Assign, prioritize, and monitor progress in real time without losing sight of the bigger picture.",
    image: Feature1,
  },
  {
    title: "RFI Manager",
    description:
      "No more email chains or lost requests. Manage every RFI in one organized system.",
    image: Feature2,
  },
  {
    title: "Design Change",
    description:
      "Turn feedback into actionable updates without breaking workflow.",
    image: Feature3,
  },
  {
    title: "Drawing Management",
    description:
      "Keep your team aligned with live drawing versions, smart organization, and instant access.",
    image: Feature4,
  },
];

const benefits = [
  {
    title: "Built for Design Teams",
    description:
      "Mirrors the real process of design - how your team thinks, plans, and delivers.",
    icon: <PeopleAltOutlined className="w-14 h-14 p-2" />,
  },
  {
    title: "Connected Design Threads",
    description:
      "Tasks, RFIs, and design changes interlink with each other and drawings - keeping every decision traceable.",
    icon: <img src={Drawing} alt="Drawing Icon" className="w-12 h-12 p-2" />,
  },
  {
    title: "Single Source of Truth",
    description:
      "Mirrors the real process of design - how your team thinks, plans, and delivers.",
    icon: <AssignmentTurnedInOutlined className="w-14 h-14 p-2" />,
  },
  {
    title: "Design Change Control",
    description:
      "Track, update, and approve revisions within the platform - transparent, traceable, and accountable.",
    icon: (
      <img src={DesignChange} alt="Drawing Icon" className="w-14 h-14 p-2" />
    ),
  },
  {
    title: "Aligned Consultants",
    description:
      "Architects, engineers, and designers collaborate through shared yet discipline-specific dashboard  ",
    icon: <PersonOutlineRounded className="w-14 h-14 p-2" />,
  },
  {
    title: "Agile, Not Messy",
    description:
      "Iterate quickly without losing clarity - built for the fast, feedback-driven design process.",
    icon: <SettingsOutlined className="w-14 h-14 p-2" />,
  },
];

export default function MainPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  // Detect window width changes
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determine which carousel to show based on window width
  const getCarouselComponent = () => {
    if (windowWidth < 1024) {
      // Mobile & Tablet: < 1024px
      return <Carouselmobile />;
    } else {
      // Desktop: >= 1024px
      return <Carousel />;
    }
  };

  const handleVisible = () => setCurrentIndex((prev) => prev + 1);

  const handleOpenForm = () => {
    setEmail(""); // store the prop for the popup
    setShowPopup(true); // show the popup
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setEmailError(true);
      setToast({
        show: true,
        message: "Please enter a valid email address.",
        type: "error",
      });
      return;
    }
    setEmailError(false);
    setShowPopup(true);
  };

  const handlePopupSubmit = async (formData: {
    firstName: string;
    lastName: string;
    waitlistRole: string;
    newsletterSubscription: boolean;
    email: string;
  }) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/waitlist/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      let data;
      // Only parse JSON if response has content
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = {};
      }

      if (!res.ok) {
        throw { status: res.status, message: data.message || "Unknown error" };
      }
      setShowPopup(false);
      setToast({
        show: true,
        message: "Form submitted successfully!",
        type: "success",
      });
      setEmail("");
    } catch (err: any) {
      if (
        err?.status === 409 ||
        (err?.message &&
          typeof err.message === "string" &&
          err.message.toLowerCase().includes("already registered"))
      ) {
        setToast({
          show: true,
          message: "This email is already registered.",
          type: "error",
        });
      } else {
        setToast({ show: true, message: err.message, type: "error" });
      }
      console.error(err);
      throw err;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative m-0 overflow-x-clip">
      <MenuBar onOpenForm={handleOpenForm} />

      {/* Gradient Backgrounds */}
      <div className="sm:hidden absolute left-0 h-[65vh] sm:h-[100vh] w-[25vw] bg-gradient-to-r from-brand-primary/20 to-transparent -z-10 pointer-events-none">
        <div className="h-20 w-[30vw] bg-gradient-to-b from-brand-whiteback to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 h-20 w-[30vw] bg-gradient-to-t from-brand-whiteback to-transparent z-10 pointer-events-none" />
      </div>
      <div className="sm:hidden absolute right-0 h-[65vh] sm:h-[100vh] w-[25vw] bg-gradient-to-l from-brand-primary/20 to-transparent -z-10 pointer-events-none">
        <div className="h-20 w-[30vw] bg-gradient-to-b from-brand-whiteback to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 h-20 w-[30vw] bg-gradient-to-t from-brand-whiteback to-transparent z-10 pointer-events-none" />
      </div>

      <div className="hidden sm:block absolute left-0 h-[100vh] w-1/2 -z-10 pointer-events-none bg-[radial-gradient(circle_at_left,_rgba(59,130,246,0.2)_0%,_transparent_45%)]" />
      <div className="hidden sm:block absolute right-0 h-[100vh] w-1/2 -z-10 pointer-events-none bg-[radial-gradient(circle_at_right,_rgba(59,130,246,0.2)_0%,_transparent_45%)]" />

      {/* Hero Section */}
      <FadeInSection>
        <main
          id="waitlist"
          className="mx-auto w-full sm:w-[90%] md:w-[80%] lg:w-[70%] h-[55vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] flex flex-col items-center justify-center text-center z-10 mb-20 sm:mb-0"
        >
          <h1 className="px-4 sm:px-6 md:px-8 font-heading font-bold text-3xl leading-snug sm:leading-snug md:text-5xl md:leading-snug lg:text-6xl lg:leading-snug whitespace-normal">
            Finally, <span className="text-brand-primary">one place</span> for
            building <span className="text-brand-primary">design</span>{" "}
            coordination
          </h1>

          <FadeInSection>
            <p className="mt-4 text-gray-600 text-md sm:text-lg md:text-xl lg:text-2xl font-heading">
              Be among one of the first to use Nimbus+
              {/* Already <span className="text-brand-primary font-bold"><RollingNumber value={3472} duration={1500} /></span> AEC pioneers have joined <span className="visible sm:hidden"><br /></span> – will you? */}
              {/* <TypingText text="Be among the First Design Professionals shaping Nimbus+" speed={50} /> */}
              {/* <TypingText
                    text={["Be among the First Design Professionals shaping Nimbus+"]}
                    typingSpeed={20}
                    pauseDuration={1500}
                    showCursor={false}
                    cursorCharacter="|"
                    className="mt-4 text-gray-600 text-md sm:text-lg md:text-xl lg:text-2xl font-heading"
                    startOnVisible={true}
                /> */}
            </p>
          </FadeInSection>

          {/* Email Form */}
          <form
            className="px-4 sm:px-0 mt-5 sm:mt-20 sm:w-full lg:w-5xl xl:w-6xl space-y-4 "
            onSubmit={handleSubmit}
          >
            <div className="flex-col sm:flex sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Email Address*"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(false);
                }}
                required
                className={`mr-2 sm:mr-0 mb-2 sm:mb-0 w-full flex-1 px-4 py-3 text-sm sm:text-2xl bg-white rounded-2xl border font-heading ${
                  emailError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-400 focus:ring-2 focus:ring-brand outline-none"
                }`}
              />
              <button
                type="submit"
                className="font-heading px-10 py-3 text-white font-bold text-md sm:text-2xl rounded-full shadow-md
                                    bg-gradient-to-r from-brand-primary from-40% to-brand-secondary
                                    hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
              >
                Join the Waitlist
              </button>
            </div>
          </form>
        </main>
      </FadeInSection>

      {/* Intro Video */}
      <FadeInSection>
        <div className="relative h-[34vh] w-full sm:h-[45vh] lg:h-[55vh] mb-20 lg:mb-15 xl:mb-24 flex items-center justify-center overflow-hidden">
          <ScrollVideo />
          {/* Top gradient */}
          <div className="pointer-events-none absolute left-0 top-0 w-full h-12 bg-gradient-to-b from-brand-whiteback to-transparent z-10" />
          {/* Bottom gradient */}
          <div className="pointer-events-none absolute left-0 bottom-0 w-full h-12 bg-gradient-to-t from-brand-whiteback to-transparent z-10" />
          {/* Left gradient */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-brand-whiteback to-transparent z-10" />
          {/* Right gradient */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-brand-whiteback to-transparent z-10" />
        </div>
      </FadeInSection>

      {/* Features Section */}
      <div
        className="container mx-auto flex flex-col text-center items-center justify-center p-4 mb-20 md:mb-20 lg:mb-36"
        id="features"
      >
        <FadeInSection durationMs="duration-500">
          <h1 className="mb-3 font-heading font-bold text-xl leading-tight sm:text-3xl sm:leading-tight md:text-4xl md:leading-tight lg:text-5xl lg:leading-tight">
            Just the <span className="text-brand-primary">Right Tools</span>,{" "}
            <br />
            in One Place
          </h1>
        </FadeInSection>

        <div
          id="features"
          className="flex flex-col items-center justify-center sm:grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 font-heading"
        >
          {features.map((feature, i) => (
            <SlideIn
              key={i}
              index={i}
              startSequence={i === currentIndex}
              onVisible={handleVisible}
              delayIncrement={400}
              durationMs="duration-300"
            >
              <div className="group w-[80vw] sm:max-w-md 2xl:min-w-[550px] lg:max-w-fit my-2 mx-4 bg-white rounded-2xl shadow-lg overflow-hidden p-4 hover:shadow-2xl hover:scale-105 transform transition-all duration-300 ease-in-out text-left flex flex-col">
                <div className="max-w-lg h-[25vh] sm:h-[30vh] mb-3 bg-brand-whiteback rounded-2xl shadow-inner p-2 group-hover:bg-gray-100 transition-all duration-300 ease-in-out">
                  <img
                    src={feature.image}
                    alt="Feature Graphic"
                    className="w-full h-full object-contain group-hover:scale-118 transition-all duration-300 ease-in-out"
                  />
                </div>
                <div className="mt-auto ml-2">
                  <h2 className="text-lg sm:text-2xl font-heading font-bold mb-2">
                    {feature.title}
                  </h2>
                  <p className="text-sm sm:text-lg max-w-lg text-gray-600">
                    {/* <TypingText text={feature.description} speed={20} /> */}
                    {feature.description}
                  </p>
                </div>
              </div>
            </SlideIn>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div
        className="container mx-auto flex flex-col text-center items-center justify-center p-4 mb-20 sm:mb-20"
        id="benefits"
      >
        <div className="sm:hidden absolute left-0 h-[170vh] sm:h-[50vw] w-[15vw] bg-gradient-to-r from-brand-primary/20 to-transparent -z-10 pointer-events-none">
          <div className="h-20 w-[30vw] bg-gradient-to-b from-brand-whiteback to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 h-20 w-[30vw] bg-gradient-to-t from-brand-whiteback to-transparent z-10 pointer-events-none" />
        </div>
        <div className="sm:hidden absolute right-0 h-[170vh] sm:h-[50vw] w-[15vw] bg-gradient-to-l from-brand-primary/20 to-transparent -z-10 pointer-events-none">
          <div className="h-20 w-[30vw] bg-gradient-to-b from-brand-whiteback to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 h-20 w-[30vw] bg-gradient-to-t from-brand-whiteback to-transparent z-10 pointer-events-none" />
        </div>

        <div className="hidden sm:block absolute left-0 h-[100vh] w-1/2 -z-10 pointer-events-none bg-[radial-gradient(circle_at_left,_rgba(59,130,246,0.2)_0%,_transparent_45%)]" />
        <div className="hidden sm:block absolute right-0 h-[100vh] w-1/2 -z-10 pointer-events-none bg-[radial-gradient(circle_at_right,_rgba(59,130,246,0.2)_0%,_transparent_45%)]" />

        <FadeInSection durationMs="duration-500">
          <h1 className="mx-auto mb-10 font-heading font-bold text-xl leading-tight sm:text-3xl sm:leading-tight md:text-4xl md:leading-tight lg:text-5xl lg:leading-tight">
            Built with <span className="text-brand-primary">Design</span>,{" "}
            <br />
            at its Core
          </h1>
        </FadeInSection>

        <FadeInSection durationMs="duration-500">
          <div className="flex flex-col items-center justify-center sm:grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-y-4 font-heading">
            {benefits.map((benefit, i) => (
              <PopInItem
                key={i}
                index={i}
                delayIncrement={200}
                durationMs="duration-200"
              >
                <div className="group w-3/4 sm:max-w-md lg:w-xs xl:w-[370px] h-full mx-auto lg:mx-2 bg-white rounded-2xl shadow-lg overflow-hidden p-4 hover:shadow-2xl hover:scale-105 transform transition-all duration-300 ease-in-out text-left flex flex-col">
                  <div className="rounded-lg bg-brand-whiteback text-brand-primary w-fit h-fit mb-3">
                    {benefit.icon}
                  </div>
                  <h2 className="text-md sm:text-xl font-heading font-bold mb-2">
                    {benefit.title}
                  </h2>
                  <p className="text-sm sm:text-md text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              </PopInItem>
            ))}
          </div>
        </FadeInSection>
      </div>

      {/* Testimonials */}
      <div className="container mx-auto flex flex-col items-center justify-center text-center px-4 mb-0 sm:mb-0">
        <FadeInSection>
          <h1 className="mb-3 sm:mt-20 sm:mb-3 md:mt-3 lg:mt-20 font-heading font-bold text-xl leading-snug sm:text-3xl sm:leading-snug md:text-4xl md:leading-snug lg:text-5xl lg:leading-snug">
            What we're hearing from <br />
            <span className="text-brand-primary">Design Professionals</span>
          </h1>
        </FadeInSection>
      </div>

      <FadeInSection>{getCarouselComponent()}</FadeInSection>

      <FadeInSection>
        <WaitlistBanner onOpenForm={handleOpenForm} />
      </FadeInSection>

      <Footer onOpenForm={handleOpenForm} />

      <PopupForm
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onSubmit={handlePopupSubmit}
        email={email}
      />

      <Toast
        message={toast.message}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        type={toast.type as "success" | "error"}
      />
    </div>
  );
}
