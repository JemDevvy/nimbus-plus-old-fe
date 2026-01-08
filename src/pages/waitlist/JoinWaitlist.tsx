
import FadeInSection from '../../components/waitlist/animations/FadeInSection';
import CustomSelect from '../../components/waitlist/CustomSelect';
import { useState } from "react";
import Toast from "../../components/waitlist/Toast";
import MenuBar from "../../components/waitlist/MenuBar";
import Footer from "../../components/waitlist/Footer";

export default function JoinWaitlist() {
    const [email, setEmail] = useState("");
    const [waitlistRole, setWaitlistRole] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [newsletterSubscription, setNewsletterSubscription] = useState(true);

    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/waitlist/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, waitlistRole, newsletterSubscription, firstName, lastName }),
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

        setToast({ show: true, message: "Form submitted successfully!", type: "success" });

        setEmail("");
        setFirstName("");
        setLastName("");
        setNewsletterSubscription(true);
        setWaitlistRole("Select Your Role");    
        } catch (err: any) {
            if (
                err?.status === 409 ||
                (err?.message && typeof err.message === "string" && err.message.toLowerCase().includes("already registered"))
            ) {
                setToast({ show: true, message: "This email is already registered.", type: "error" });
            } else {
                setToast({ show: true, message: "Submission failed. Please try again.", type: "error" });
            }
            console.error(err);
         }
    };

        const options = [
            { value: "architect", label: "Architect" },
            { value: "engineer", label: "Engineer" },
            { value: "director", label: "Director" },
            { value: "Project Manager", label: "Project Manager" },
            { value: "Consultant", label: "Consultant" },
            { value: "Builder", label: "Builder" },
            { value: "Other", label: "Other" },
        ];
    return (
        <div className="min-h-screen flex flex-col relative m-0 overflow-x-clip">
            <MenuBar />

            {/* Gradient Backgrounds */}
            <div className="sm:hidden absolute left-0 h-[60vh] sm:h-[100vh] w-[25vw] bg-gradient-to-r from-brand-primary/30 to-transparent -z-10 pointer-events-none">
                <div className="h-20 w-[30vw] bg-gradient-to-b from-brand-whiteback to-transparent z-10 pointer-events-none" />
                <div className="absolute bottom-0 h-20 w-[30vw] bg-gradient-to-t from-brand-whiteback to-transparent z-10 pointer-events-none" />
            </div>
            <div className="sm:hidden absolute right-0 h-[60vh] sm:h-[100vh] w-[25vw] bg-gradient-to-l from-brand-primary/30 to-transparent -z-10 pointer-events-none">
                <div className="h-20 w-[30vw] bg-gradient-to-b from-brand-whiteback to-transparent z-10 pointer-events-none" />
                <div className="absolute bottom-0 h-20 w-[30vw] bg-gradient-to-t from-brand-whiteback to-transparent z-10 pointer-events-none" />
            </div>

            <div className="hidden sm:block absolute left-0 h-[100vh] w-1/2 -z-10 pointer-events-none bg-[radial-gradient(circle_at_left,_rgba(59,130,246,0.2)_0%,_transparent_45%)]" />
            <div className="hidden sm:block absolute right-0 h-[100vh] w-1/2 -z-10 pointer-events-none bg-[radial-gradient(circle_at_right,_rgba(59,130,246,0.2)_0%,_transparent_45%)]" />

            <FadeInSection>
            <main className="mx-auto w-full sm:w-[90%] md:w-[80%] lg:w-[70%] h-[70vh] sm:h-[110vh] md:h-[120vh] xl:h-screen flex flex-col items-center justify-center text-center z-10 mb-20 sm:mb-0">

                <h1 className="px-10 font-bold leading-snug text-4xl sm:text-4xl md:text-5xl lg:text-6xl mt-[10vh] sm:mt-0">
                Get Exclusive Access to{" "}<span className="text-brand-primary">Nimbus+</span>
                </h1>
                <p className="mt-4 text-gray-600 text-md sm:text-lg md:text-xl lg:text-xl">
                Be one of the first to <span className='visible sm:hidden'><br /></span>simplify design project management
                </p>

                {/* Email Form */}
                <form onSubmit={handleSubmit} className="mt-10 sm:mt-36 w-[70vw] sm:w-full max-w-5xl space-y-4">
                    <div className="flex flex-col gap-2 sm:grid sm:grid-cols-4 sm:grid-rows-3 sm:gap-4">
                        <input
                            value={email}
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address*"
                            required
                            className="col-span-3 px-4 py-3 text-sm sm:text-2xl bg-white rounded-2xl border border-gray-400 focus:ring-2 focus:ring-brand outline-none"
                        />
                        <CustomSelect
                            options={options}
                            placeholder="Select Your Role"
                            onChange={setWaitlistRole}
                            className="col-start-4 w-full h-full px-4 py-3 text-sm sm:text-2xl bg-white rounded-2xl border border-gray-400 focus:ring-2 focus:ring-brand outline-none"
                        />
                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="col-span-2 row-start-2 px-4 py-3 text-sm sm:text-2xl bg-white rounded-2xl 
                            border border-gray-400 focus:ring-2 focus:ring-brand outline-none"
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="col-span-2 col-start-3 row-start-2 mb-3 sm:mb-0 px-4 py-3 text-sm sm:text-2xl bg-white rounded-2xl 
                            border border-gray-400 focus:ring-2 focus:ring-brand outline-none"
                        />
                        <label className="col-span-2 row-start-3 flex items-center justify-center sm:justify-start space-x-0.5 cursor-pointer select-none">
                            <input type="checkbox" checked={newsletterSubscription} className="peer hidden" onChange={() => setNewsletterSubscription(!newsletterSubscription)} value={newsletterSubscription} />
                            <span
                                className="
                                w-5 h-5 flex items-center justify-center rounded-md border 
                                border-gray-400 text-transparent transition-colors
                                peer-checked:bg-brand-primary peer-checked:border-brand-primary
                                peer-checked:text-white" >
                                ✓
                            </span>
                            <span className="text-sm sm:text-lg text-gray-700">&nbsp;Sign up to monthly newsletter</span>
                        </label>
                        <button
                            type="submit"
                            className="col-span-2 col-start-3 row-start-3 
                            text-white font-bold text-md sm:text-3xl sm:px-36 py-2.5 mt-5 rounded-full shadow-md
                            bg-gradient-to-r from-brand-primary from-40% to-brand-secondary
                            hover:scale-105 transform transition-all duration-300 ease-in-out cursor-pointer" >
                            JOIN
                        </button>
                    </div>
                </form>
                   
            </main>
            </FadeInSection> 

            <Footer />

            <Toast
                message={toast.message}
                show={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
                type={toast.type as "success" | "error"}
            />
        </div>
    )
}