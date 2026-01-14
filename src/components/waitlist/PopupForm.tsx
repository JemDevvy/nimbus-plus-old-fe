import CustomSelect from "./CustomSelect";
import Toast from "./Toast";
import { useState } from "react";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    waitlistRole: string;
    // newsletterSubscription: boolean;
    email: string;
  }) => Promise<void>;
  email: string;
}

const PopupForm: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  onSubmit,
  email,
}) => {
  const [emailAddress, setEmailAddress] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [waitlistRole, setWaitlistRole] = useState("");
  // const [newsletterSubscription, setNewsletterSubscription] = useState(true);

  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [firstNameValid, setFirstNameValid] = useState<boolean | null>(null);
  const [lastNameValid, setLastNameValid] = useState<boolean | null>(null);

  const nameRegex = /^[a-zA-ZÀ-ž\s'-]+$/;

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      await onSubmit({
        firstName,
        lastName,
        waitlistRole,
        email: email === "" ? emailAddress : email,
      });

      if (email === "" || !emailValid) {
        setToast({
          show: true,
          message: "Please enter a valid email.",
          type: "error",
        });
        return;
      }

      if (!firstName.trim() || !nameRegex.test(firstName.trim())) {
        setFirstNameValid(false);
        setToast({
          show: true,
          message: "Please enter a valid first name.",
          type: "error",
        });
        return;
      }

      if (!lastName.trim() || !nameRegex.test(lastName.trim())) {
        setLastNameValid(false);
        setToast({
          show: true,
          message: "Please enter a valid last name.",
          type: "error",
        });
        return;
      }

      setToast({
        show: true,
        message: "Form submitted successfully!",
        type: "success",
      });

      setEmailAddress("");
      setFirstName("");
      setLastName("");
      // setNewsletterSubscription(true);
      setWaitlistRole("Select Your Role");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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

  const handleClose = async () => {
    // Only submit if the user hasn't filled anything else
    if (!firstName && !lastName && !waitlistRole) {
      try {
        await onSubmit({
          firstName: "",
          lastName: "",
          waitlistRole: "",
          // newsletterSubscription: true,
          email,
        });
      } catch (err) {
        console.error(err);
      }
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[300px] sm:w-[400px] md:w-[450px] bg-white rounded-xl shadow-lg p-6 relative transform animate-fadeInUp "
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-xl text-gray-500 hover:text-gray-800 cursor-pointer"
        >
          ✕
        </button>

        {email === "" ? (
          <h2 className="text-xl font-semibold mb-4 font-heading">
            Join Our Waitlist
          </h2>
        ) : (
          <h2 className="text-xl font-semibold mb-4 font-heading">
            Complete Sign Up
          </h2>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex flex-col items-center justify-center "
        >
          {/* {email === "" ? (
                <input
                    type="email"
                    placeholder="Email Address"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className="w-full xs:mb-3 px-4 py-3 sm:py-4 text-lg sm:text-xl bg-white rounded-2xl border border-gray-400 focus:ring-2 focus:ring-brand outline-none font-heading"
                />
                ) : null } */}
          {email === "" && (
            <div className="relative w-full">
              <input
                type="email"
                placeholder="Email Address"
                value={emailAddress}
                onChange={(e) => {
                  const value = e.target.value;
                  setEmailAddress(value);

                  const isValid =
                    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                      value
                    );
                  setEmailValid(isValid ? true : false);
                }}
                className={`w-full xs:mb-3 px-4 py-3 sm:py-4 text-lg sm:text-xl bg-white rounded-2xl border border-gray-400 focus:ring-2 focus:ring-brand outline-none font-heading pr-12 ${emailValid === false ? "border-red-500" : emailValid === true ? "border-green-500" : ""}`}
              />

              {emailValid === true && (
                <svg
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}

              {emailValid === false && emailAddress !== "" && (
                <svg
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
          )}
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => {
              const value = e.target.value;
              setFirstName(value);

              if (value.trim() === "") {
                setFirstNameValid(true); // blank allowed
              } else {
                const valid = nameRegex.test(value.trim());
                setFirstNameValid(valid);
              }
            }}
            className={`
                        w-full xs:mb-3 px-4 py-3 sm:py-4 text-lg sm:text-xl bg-white rounded-2xl 
                        border ${firstNameValid === false ? "border-red-500" : "border-gray-400"}
                        focus:ring-2 focus:ring-brand outline-none font-heading
                    `}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => {
              const value = e.target.value;
              setLastName(value);

              if (value.trim() === "") {
                setLastNameValid(true); // blank allowed
              } else {
                const valid = nameRegex.test(value.trim());
                setLastNameValid(valid);
              }
            }}
            className={`
                        w-full xs:mb-3 px-4 py-3 sm:py-4 text-lg sm:text-xl bg-white rounded-2xl 
                        border ${lastNameValid === false ? "border-red-500" : "border-gray-400"}
                        focus:ring-2 focus:ring-brand outline-none font-heading
                    `}
          />
          <CustomSelect
            options={options}
            placeholder="Select Your Role"
            value={waitlistRole}
            onChange={setWaitlistRole}
            className="w-[250px] sm:w-[350px] md:w-[400px] text-2xl font-heading text-black"
          />
          {/* <label className="flex items-center space-x-0.5 cursor-pointer select-none">
                <input type="checkbox" checked={newsletterSubscription} className="peer hidden" onChange={() => setNewsletterSubscription(!newsletterSubscription)} value={newsletterSubscription} />
                <span
                    className="
                    w-5 h-5 flex items-center justify-center rounded-md border 
                    border-gray-400 text-transparent transition-colors
                    peer-checked:bg-blue-600 peer-checked:border-blue-600 
                    peer-checked:text-white"    
                >
                    ✓
                </span>
                <span className="text-gray-700">&nbsp;Sign up to monthly newsletter</span>
                </label> */}

          <button
            type="submit"
            disabled={loading}
            className={`font-heading text-white font-bold text-xl px-10 py-2.5 rounded-full shadow-md
                    transform transition-all duration-300 ease-in-out 
                    ${loading ? "bg-gray-400 cursor-wait opacity-50" : "bg-gradient-to-r from-brand-primary to-brand-secondary hover:scale-105 cursor-pointer"}`}
          >
            Submit
          </button>
        </form>
      </div>
      <Toast
        message={toast.message}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        type={toast.type as "success" | "error"}
      />
    </div>
  );
};

export default PopupForm;
