import { useState } from "react";

interface PopUpAddContactProps {
    open: boolean;
    onClose: () => void;
}


const PopUpAddContact = (props: PopUpAddContactProps) => {
    const {
        open,
        onClose,
    } = props;

    const [email, setEmail] = useState("");

    if (!open) return null;

    const handleClose = () => {
        onClose();
    };

    return (
    <div className="fixed inset-0 flex items-center bg-[#1E2C41]/60 justify-center z-100">
        <div onClick={(e) => e.stopPropagation()} className="w-[50%] xl:w-[30vw]  bg-white rounded-xl shadow-lg p-6 px-8 relative transform animate-fadeInUp ">
            <button className="absolute top-6 right-8 text-xl text-gray-500 hover:text-gray-800 cursor-pointer">
            ✕
            </button>

            <h2 className="text-2xl font-semibold mb-4">Invite Contact</h2>

            <div className="border-b-2 -mx-8 border-gray-200"></div>

            <form >
                <div className="flex flex-row items-center justify-between gap-4 pt-4 text-md">
                    <div className="flex flex-col flex-3">
                        <label className="font-semibold mb-1">
                        Email*
                        </label>
                        <input
                            type="email"
                            placeholder="Enter Email Address*"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mb-3 px-4 py-2 bg-brand-whiteback rounded-lg border border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none"
                            required
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-6 -mb-6 -mx-8 py-6 px-8 bg-brand-whiteback rounded-b-lg">
                    <button className="px-6 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-blue-700 transition cursor-pointer">
                        Send Invite
                    </button>
                </div>
            </form>
        </div>
        {/* <Toast
            message={toast.message}
            show={toast.show}
            onClose={() => setToast({ ...toast, show: false })}
            type={toast.type as "success" | "error"}
        /> */}
    </div>
  )
}

export default PopUpAddContact
