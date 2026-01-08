
import CustomSelect from "../newUI/CustomSelect";
import Toast from "../newUI/Toast";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth-context";
import type { PopupProps } from "../../types/popup";
interface ContactsData {
    contactName: string;
    email: string;
    contactImage: File | null;
}

const PopupAddMembers = (props: PopupProps<ContactsData>) => {
    const { isOpen, onClose, onSubmit } = props;

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
        const { user } = useAuth();
        const [contacts, setContacts] = useState<any[]>([]);

        useEffect(() => {
            if (!user?.userId) return;
            const token = localStorage.getItem("token");
            fetch(`${import.meta.env.VITE_API_URL}/api/contacts/${user.userId}`, {
                method: "GET",
                credentials: "include"
            })
                .then(res => res.json())
                .then(data => setContacts(Array.isArray(data.contacts) ? data.contacts : Array.isArray(data) ? data : []))
                .catch(() => setContacts([]));
        }, [user]);

    const toggleSelect = (id: number) => {
        setSelectedIds(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleClose = () => {
        onClose();
    }

    // const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    };

  return (
    <div className="fixed inset-0 flex items-center bg-[#1E2C41]/60 justify-center z-50" onClick={onClose}>
        <div onClick={(e) => e.stopPropagation()} className="w-[25vw] bg-white rounded-xl shadow-lg p-6 px-8 relative transform animate-fadeInUp ">
            <button onClick={handleClose} className="absolute top-6 right-8 text-xl text-gray-500 hover:text-gray-800 cursor-pointer">
            ✕
            </button>
            
            <p className="absolute top-7 right-15 text-md text-gray-400">
            0 Selected
            </p>

            <h2 className="text-2xl font-semibold mb-4">Add Project Members</h2>

            <div className="text-lg space-y-3 overflow-y-scroll h-[20vw] mb-4">
            {contacts.map(contact => (
                <div
                    key={contact.id}
                    className="flex items-center gap-3 cursor-pointer"
                    // onClick={() => toggleSelect(contact.id)}
                >
                <input
                    type="checkbox"
                    checked={selectedIds.includes(contact.id)}
                    onChange={() => toggleSelect(contact.id)}
                    className="w-5 h-5 accent-blue-600"
                />
                <img
                    src={contact.avatar || `https://placehold.net/avatar.png`}
                    alt={contact.fullName || contact.name}
                    className="w-15 h-15 rounded-full object-cover"
                />
                <div>
                    <p className="font-medium text-gray-800">{contact.fullName || contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.email}</p>
                </div>
                </div>
            ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end -mb-6 -mx-8 py-5 px-8 bg-brand-whiteback rounded-b-lg">
            <button
                className="px-6 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-blue-700 transition cursor-pointer"
                onClick={async () => {
                    if (!selectedIds.length) return;
                    const token = localStorage.getItem("token");
                    const rawProjectId = props.projectId || props.project?.id;
                    const projectId = Number(rawProjectId);
                    if (!projectId || isNaN(projectId)) {
                        console.error("Invalid projectId:", rawProjectId);
                        return;
                    }
                    let success = true;
                    for (const userId of selectedIds) {
                        try {
                            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/project-members`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${token}`,
                                },
                                body: JSON.stringify({ projectId, userId }),
                            });
                            if (!res.ok) success = false;
                        } catch (err) {
                            success = false;
                            console.error("Error adding member:", err);
                        }
                    }
                    setSelectedIds([]);
                    onClose();
                    if (success) {
                        setToast({ show: true, message: "Members added successfully!", type: "success" });
                        setTimeout(() => {
                            window.location.reload();
                        }, 1200);
                    } else {
                        setToast({ show: true, message: "Failed to add one or more members.", type: "error" });
                    }
                }}
            >
                Add to Project
            </button>
        <Toast
            message={toast.message}
            show={toast.show}
            onClose={() => setToast({ ...toast, show: false })}
            type={toast.type as "success" | "error"}
        />
        </div>
            
        </div>
        
        {/* <Toast
            message={toast.message}
            show={toast.show}
            onClose={() => setToast({ ...toast, show: false })}
            type={toast.type as "success" | "error"}
        /> */}
    </div>
  );
};

export default PopupAddMembers;
