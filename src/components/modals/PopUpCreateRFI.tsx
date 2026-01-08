import PopUpAddContact from "./PopUpAddContact";
import CustomSelect from "../newUI/CustomSelect";
import Toast from "../newUI/Toast";
import { useState, useEffect } from "react";
import { validateText } from "../../utils/validate"
import PopupAddMembers from "./PopUpAddMembers";

import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';

interface RFIData {
    subject: string;
    rfiDescription: string;
    discipline?: string;
    requestTo?: string[];
    ccTo?: string[];
    tags?: string[];
    requiredResponseDate?: string;
    file?: File | null;
}

interface PopUpCreateRFIProps {
    isOpen: boolean;
    onClose: () => void;
    members: any[];
    selectedProject: number;
    disciplineOptions: { value: string; label: string }[];
    tagOptions: { value: string; label: string }[];
    onSuccess: () => void;
}

const PopUpCreateRFI = (props: PopUpCreateRFIProps) => {
    const {
        isOpen,
        onClose,
        members,
        selectedProject,
        disciplineOptions,
        tagOptions,
        onSuccess
    } = props;

    const [subject, setSubject] = useState("");
    const [rfiDescription, setRfiDescription] = useState("");
    const [discipline, setDiscipline] = useState("");
    const [requestTo, setRequestTo] = useState<string[]>([]);
    const [ccTo, setCcTo] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [requiredResponseDate, setRequiredResponseDate] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success" as "success" | "error",
    });
    const [addMembersOpen, setAddMembersOpen] = useState(false);
    const [addContactOpen, setAddContactOpen] = useState(false);

    const triggerToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ show: true, message, type });
    };

    if (!isOpen) return null;

    const handleClose = () => {
        onClose();
        setSubject("");
        setRfiDescription("");
        setDiscipline("");
        setRequestTo([]);
        setCcTo([]);
        setTags([]);
        setRequiredResponseDate("");
        setFile(null);
        setError("");
        setSuccess(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Final validation
        const subjectValidation = validateText(subject, { minLength: 3, maxLength: 100, pattern: /^[A-Za-z0-9 .,'"()\-!?#&/:=%]+$/ });
        if (!subjectValidation.valid) {
            // setError(subjectValidation.error!);
            triggerToast(subjectValidation.error!, "error")
            setLoading(false);
            return;
        }

        const descriptionValidation = validateText(rfiDescription, { maxLength: 500, pattern: /^[A-Za-z0-9 .,'"()\-!?#&/:=%]+$/ });
        if (!descriptionValidation.valid) {
            // setError(descriptionValidation.error!);
            triggerToast(descriptionValidation.error!, "error")
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const data = new FormData();
            data.append("projectId", String(selectedProject));
            data.append("subject", subject);
            data.append("discipline", discipline);
            requestTo.forEach((name) => {
                const member = members.find((m) => m.name === name);
                data.append("requestTo", String(member?.userId || name));
            });
            ccTo.forEach((name) => {
                const member = members.find((m) => m.name === name);
                data.append("ccTo", String(member?.userId || name));
            });
            tags.forEach((t) => data.append("tags", t));
            data.append("requiredResponseDate", requiredResponseDate);
            data.append("requestedDate", new Date().toISOString().slice(0, 10));
            data.append("rfiDescription", rfiDescription);
            if (file) {
                data.append("files", file);
            }
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rfi/`, {
                method: "POST",
                credentials: 'include',
                body: data,
            });
            // if (!res.ok) throw new Error(await res.text());
            if (!res.ok) {
                const data = await res.json(); 
                triggerToast(data.message, "error")
                throw new Error(data.message || "Failed to create RFI");
            }
            triggerToast("RFI Successfully Created", "success")
            setSuccess(true);
            setLoading(false);
            onSuccess();
            handleClose();
        } catch (err: any) {
            // setError(err.message || "Failed to create RFI");
            triggerToast(err.message || "Failed to create RFI", "error")
        } finally {
            setLoading(false);
        }
    };

    const handleAddContact = () => {
        setAddMembersOpen(true);
    };

    const handleMembersAdded = (userIds: string[] | number[]) => {
        // Add selected userIds to requestTo
        setRequestTo(prev => [...prev, ...userIds.map(String)]);
        setAddMembersOpen(false);
    };

  return (
    <div className="fixed inset-0 flex items-center bg-[#1E2C41]/60 justify-center z-50" onClick={handleClose}>
        <div onClick={(e) => e.stopPropagation()} className="w-[70%] xl:w-[50vw] bg-white rounded-xl shadow-lg p-6 px-8 relative transform animate-fadeInUp ">
            <button onClick={handleClose} className="absolute top-6 right-8 text-xl text-gray-500 hover:text-gray-800 cursor-pointer">
            ✕
            </button>

            <h2 className="text-2xl font-semibold mb-4">Create New RFI</h2>

            <div className="w-[50vw] border-b-2 -mx-8 border-gray-200"></div>

            <form onSubmit={handleSubmit}>
                <div className="flex flex-row items-center justify-between gap-4 pt-4 text-md">
                    <div className="flex flex-col flex-3">
                        <label className="font-semibold mb-1">Subject*</label>
                        <input
                            type="text"
                            placeholder="Subject*"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full mb-3 px-4 py-2 bg-brand-whiteback rounded-lg border border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none"
                            required
                            disabled={loading}
                        />
                        <label className="font-semibold mb-1">Description</label>
                        <textarea
                            rows={5}
                            placeholder="Write Description..."
                            value={rfiDescription}
                            onChange={(e) => setRfiDescription(e.target.value)}
                            className="w-full mb-3 px-4 py-2 bg-brand-whiteback rounded-lg border border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none"
                        />
                        <label className="font-semibold mb-1">Discipline</label>
                        <CustomSelect
                            options={disciplineOptions}
                            placeholder="Select Discipline"
                            value={discipline}
                            onChange={(val) => setDiscipline(typeof val === 'string' ? val : (val[0] || ''))}
                            className="w-full mb-3 px-4 py-2 bg-brand-whiteback rounded-lg border border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none"
                        />
                        <label className="font-semibold mb-1">Tags</label>
                        <CustomSelect
                            options={tagOptions}
                            placeholder="Select Tags"
                            value={tags}
                            onChange={(val) => setTags(Array.isArray(val) ? val : val ? [val] : [])}
                            isMulti
                            className="w-full mb-3 px-4 py-2 bg-brand-whiteback rounded-lg border border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none"
                        />
                    </div>
                    <div className="flex flex-col flex-2">
                        <label className="font-semibold mb-1">Request to*</label>
                        <CustomSelect
                            options={members.map((m) => ({ value: m.id, label: m.name || m.fullName || m.id }))}
                            placeholder="Send Request to..."
                            value={requestTo}
                            onChange={(val) => setRequestTo(Array.isArray(val) ? val : val ? [val] : [])}
                            extraActionLabel="+ Add Contact"
                            onExtraAction={() => setAddContactOpen(true)}
                            isMulti
                            className="w-full mb-3 px-4 py-2 bg-brand-whiteback rounded-lg border border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none"
                        />
                        <label className="font-semibold mb-1">CC</label>
                        <CustomSelect
                            options={members.map((m) => ({ value: m.name, label: m.name }))}
                            placeholder="Copy to..."
                            value={ccTo}
                            onChange={(val) => setCcTo(Array.isArray(val) ? val : val ? [val] : [])}
                            isMulti
                            className="w-full mb-3 px-4 py-2 bg-brand-whiteback rounded-lg border border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none"
                        />
                        <label className="font-semibold mb-1">Required Response Date*</label>
                        <input
                            type="date"
                            value={requiredResponseDate}
                            onChange={(e) => setRequiredResponseDate(e.target.value)}
                            className="w-full mb-3 px-4 py-2 bg-brand-whiteback rounded-lg border border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none"
                            required
                            disabled={loading}
                        />
                        <label className="font-semibold mb-1">Files</label>
                        <div className="flex items-center justify-center">
                            <label className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center p-2 xl:px-5">
                                    <AddPhotoAlternateRoundedIcon style={{ fontSize: 50 }} className="mb-3 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                                <input
                                    id="dropzone-file"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={e => {
                                        if (e.target.files && e.target.files[0]) {
                                            setFile(e.target.files[0]);
                                        } else {
                                            setFile(null);
                                        }
                                    }}
                                    disabled={loading}
                                />
                            </label>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center justify-between mt-6 -mb-6 -mx-8 py-6 px-8 bg-brand-whiteback rounded-b-lg">
                    {error ? <div className="text-red-500 font-semibold mb-2">{error}</div> : <div></div>}
                    <button type="submit" className={`flex flex-row items-center
                    px-10 py-2  text-white text-xl font-bold rounded-lg  transition 
                    ${loading ? "bg-gray-400 opacity-70 cursor-wait" : "bg-brand-primary hover:bg-blue-700 cursor-pointer"}
                    `} disabled={loading}>
                        {loading && (
                            <div className="w-4 h-4 mr-2">
                                <div className="w-full h-full border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                        {loading ? "Sending..." : "Send RFI"}
                    </button>
                </div>
            </form>
            
        {/* <button className="bg-blue-400 p-3  cursor-pointer text-white max-w-fit" onClick={() => triggerToast("Toast Test", "error")}>Show Toast</button> */}
        </div>
        <Toast
            message={toast.message}
            show={toast.show}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
            duration={3000}
        />
        <PopupAddMembers
            isOpen={addMembersOpen}
            onClose={() => setAddMembersOpen(false)}
            onSubmit={(data) => handleMembersAdded(data.selectedIds)}
            projectId={selectedProject}
        />
        <PopUpAddContact
            open={addContactOpen}
            onClose={() => setAddContactOpen(false)}
        />
    </div>
  );
};

export default PopUpCreateRFI;
