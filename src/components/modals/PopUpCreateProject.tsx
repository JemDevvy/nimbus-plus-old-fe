import React, { useState, useEffect } from "react";
import CustomSelect from "../newUI/CustomSelect";
import Toast from "../newUI/Toast";
import type { PopupProps } from "../../types/popup";
import { validateText } from "../../utils/validate"

import { PROJECT_STATUS } from "../../constants/projectStatus";
import { PROJECT_STAGE } from "../../constants/projectStage";

import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
interface ProjectData {
  projectName: string;
  address: string;
  buildingType: string;
  buildingClass: string;
  client: string;
  status: string;
  projectsStage: string;
  projectImage: File | null;
}

const statusOptions = PROJECT_STATUS.map((status) => ({
  value: status,
  label: status.charAt(0).toUpperCase() + status.slice(1)
}));
const stageOptions = PROJECT_STAGE.map((status) => ({ value: status, label: status }));

const PopupCreateProj = (props: PopupProps<ProjectData>) => {
    const { isOpen, onClose, onSubmit } = props;

    const [projectName, setProjectName] = useState("");
    const [address, setAddress] = useState("");
    const [buildingType, setBuildingType] = useState("");
    const [buildingClass, setBuildingClass] = useState("");
    const [client, setClient] = useState("");
    const [projectImage, setProjectImage] = useState<File | null>(null);

    const [status, setStatus] = useState(statusOptions[0].value);
    const [projectsStage, setProjectsStage] = useState(stageOptions[0].value);

    // Members dropdown state
    const [members, setMembers] = useState<{ value: string; label: string }[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);
    // const [error, setError] = useState("");
    // const [showPopup, setShowPopup] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success" as "success" | "error",
    });

    const triggerToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ show: true, message, type });
    };


    // Fetch logged-in user's contacts for Members dropdown using cookies only
    useEffect(() => {
    console.log("PopupCreateProj useEffect triggered. isOpen:", isOpen);
    if (!isOpen) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        method: "GET",
        credentials: "include"
    })
        .then(res => res.json())
        .then(data => {
        const userId = data.id; // <-- FIXED
        if (!userId) {
            console.error("No userId found in /api/users/me response", data);
            setMembers([]);
            return;
        }
        const url = `${import.meta.env.VITE_API_URL}/api/contacts/${userId}`;
        console.log("Fetching:", url);
        fetch(url, {
            method: "GET",
            credentials: "include"
        })
            .then(async res => {
            if (!res.ok) {
                setMembers([]);
                return [];
            }
            return res.json();
            })
            .then(data => {
            console.log("Contacts API response:", data);
            if (Array.isArray(data)) {
                setMembers(data.map((c: { id: string|number; fullName?: string; name?: string }) => ({
                value: String(c.id),
                label: c.fullName || c.name || String(c.id)
                })));
            } else {
                setMembers([]);
            }
            })
            .catch((err) => {
            console.error("Contacts fetch error:", err);
            setMembers([]);
            });
        });
    }, [isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Final validation
        // const fieldsToValidate = [
        //     { value: projectName, rules: { minLength: 3, maxLength: 100 } },
        //     { value: address, rules: { maxLength: 500 } },
        //     { value: buildingType, rules: { maxLength: 50 } },
        //     { value: buildingClass, rules: { maxLength: 50 } },
        //     { value: client, rules: { maxLength: 100 } },
        //     ];

        //     const pattern = /^[A-Za-z0-9 .,'"()\-!?#&/:=%]+$/;

        //     for (const { value, rules } of fieldsToValidate) {
        //     const validation = validateText(value, { ...rules, pattern: pattern });

        //     if (!validation.valid) {
        //         triggerToast(validation.error!, "error");
        //         console.log(error!);
        //         setLoading(false);
        //         return;
        //     }
        //     }

        // const projectNameValidation = validateText(projectName, { minLength: 3, maxLength: 100, pattern: /^[A-Za-z0-9 .,'"()\-!?#&/:=%]+$/ });
        // if (!projectNameValidation.valid) {
        //     // setError(subjectValidation.error!);
        //     triggerToast(projectNameValidation.error!, "error")
        //     setLoading(false);
        //     return;
        // }

        // const addressValidation = validateText(address, { maxLength: 500, pattern: /^[A-Za-z0-9 .,'"()\-!?#&/:=%]+$/ });
        // if (!addressValidation.valid) {
        //     // setError(descriptionValidation.error!);
        //     triggerToast(addressValidation.error!, "error")
        //     setLoading(false);
        //     return;
        // }

        // const bTypeValidation = validateText(buildingType, { maxLength: 500, pattern: /^[A-Za-z0-9 .,'"()\-!?#&/:=%]+$/ });
        // if (!bTypeValidation.valid) {
        //     // setError(descriptionValidation.error!);
        //     triggerToast(bTypeValidation.error!, "error")
        //     setLoading(false);
        //     return;
        // }
        
        // const bClassValidation = validateText(buildingClass, { maxLength: 500, pattern: /^[A-Za-z0-9 .,'"()\-!?#&/:=%]+$/ });
        // if (!bClassValidation.valid) {
        //     // setError(descriptionValidation.error!);
        //     triggerToast(bClassValidation.error!, "error")
        //     setLoading(false);
        //     return;
        // }

        try {
            await onSubmit({
                projectName,
                address,
                buildingType,
                buildingClass,
                client,
                status,
                projectsStage,
                projectImage
            });
            setProjectName("");
            setAddress("");
            setBuildingType("");
            setBuildingClass("");
            setClient("");
            setStatus(statusOptions[0].value);
            setProjectsStage(stageOptions[0].value);
            setSelectedMembers([]);
            handleClose();
        } catch (err) {
            console.error(err);
            triggerToast(err instanceof Error ? err.message : String(err) || "Failed to Edit Project", "error")
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="fixed inset-0 flex items-center bg-[#1E2C41]/60 justify-center z-50" onClick={handleClose}>
        <div onClick={(e) => e.stopPropagation()} className="w-[70%] xl:w-[50vw]  bg-white rounded-xl shadow-lg p-6 px-8 relative transform animate-fadeInUp ">
            <button onClick={handleClose} className="absolute top-6 right-8 text-xl text-gray-500 hover:text-gray-800 cursor-pointer">
            ✕
            </button>

            <h2 className="text-2xl font-semibold mb-4">Create Project</h2>

            <div className="border-b-2 -mx-8 border-gray-200"></div>

            <form onSubmit={handleSubmit}>
                <div className="flex flex-row items-center justify-between gap-4 pt-4 text-md">
                    <div className="flex flex-col flex-3">
                        <label className="font-semibold mb-1">
                        Project Name*
                        </label>
                        <input
                            type="text"
                            placeholder="Project Name*"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="w-full mb-3 px-4 py-2 bg-brand-whiteback rounded-lg border border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none"
                            required
                            disabled={loading}
                        />
                        <label className="font-semibold mb-1">
                        Address*
                        </label>
                        <input
                            type="text"
                            placeholder="Address*"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full mb-3 px-4 py-2 bg-brand-whiteback rounded-lg border border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none"
                            required
                            disabled={loading}
                        />
                        <label className="font-semibold mb-1">
                        Building Type
                        </label>
                        <input
                            type="text"
                            placeholder="Building Type"
                            value={buildingType}
                            onChange={(e) => setBuildingType(e.target.value)}
                            className="w-full mb-3 px-4 py-2 bg-brand-whiteback rounded-lg border border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none"
                            disabled={loading}
                        />
                        <label className="font-semibold mb-1">
                        Building Class
                        </label>
                        <input
                            type="text"
                            placeholder="Building Class"
                            value={buildingClass}
                            onChange={(e) => setBuildingClass(e.target.value)}
                            className="w-full mb-3 px-4 py-2 bg-brand-whiteback rounded-lg border border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none"
                            disabled={loading}
                        />
                        <label className="font-semibold mb-1">
                        Client
                        </label>
                        <input
                            type="text"
                            placeholder="Client"
                            value={client}
                            onChange={(e) => setClient(e.target.value)}
                            className="w-full px-4 py-2 bg-brand-whiteback rounded-lg border border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none"
                            disabled={loading}
                        />
                    </div>
                    <div className="flex flex-col flex-2">
                        <label className="font-semibold mb-1"> 
                        Status
                        </label>
                        <CustomSelect
                            options={statusOptions}
                            placeholder="Select Status"
                            value={status}
                            onChange={val => setStatus((val as typeof statusOptions[number]["value"]) ?? statusOptions[0].value)}
                            className="w-full mb-3 px-4 py-2 bg-brand-whiteback rounded-lg border border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none"
                        />
                        <label className="font-semibold mb-1"> 
                        Project Stage
                        </label>
                        <CustomSelect
                            options={stageOptions}
                            placeholder="Select Project Stage"
                            value={projectsStage}
                            onChange={val => setProjectsStage((val as typeof stageOptions[number]["value"]) ?? stageOptions[0].value)}
                            className="w-full mb-3 px-4 py-2 bg-brand-whiteback rounded-lg border border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none"
                        />
                        <label className="font-semibold mb-1"> 
                        Members
                        </label>
                        <CustomSelect
                            options={members}
                            placeholder="Add Members"
                            value={selectedMembers}
                            onChange={val => setSelectedMembers(Array.isArray(val) ? val : val ? [val] : [])}
                            isMulti
                            className="w-full mb-3.5 px-4 py-2 bg-brand-whiteback rounded-lg border border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none"
                        />
                        
                        <div className="flex items-center justify-center">
                            <label className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center px-2 py-5">
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
                                        setProjectImage(e.target.files[0]);
                                        } else {
                                        setProjectImage(null);
                                        }
                                    }}
                                    disabled={loading}
                                    />
                            </label>
                        </div> 

                    </div>
                    {/* <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full xs:mb-3 px-4 py-3 sm:py-4 text-lg sm:text-xl bg-white rounded-2xl border border-gray-400 focus:ring-2 focus:ring-brand outline-none"
                    />
                
                    <button
                        type="submit"
                        className="
                        text-white font-bold text-xl px-10 py-2.5 rounded-full shadow-md
                        bg-gradient-to-r from-brand-primary to-brand-secondary hover:scale-105
                        transform transition-all duration-300 ease-in-out cursor-pointer" 
                    >
                        Submit
                    </button> */}
                </div>
                <div className="flex items-center justify-end mt-6 -mb-6 -mx-8 py-6 px-8 bg-brand-whiteback rounded-b-lg">
                    <button className={`flex flex-row items-center px-6 py-2  text-white font-bold rounded-lg transition ${loading ? "bg-gray-400 opacity-70 cursor-wait" : "bg-brand-primary hover:bg-blue-700 cursor-pointer"}`} disabled={loading}>
                        {loading && (
                            <div className="w-4 h-4 mr-2">
                                <div className="w-full h-full border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                        {loading ? "Creating..." : "Create Project"}
                    </button>
                </div>
            </form>
        </div>
        <Toast
            message={toast.message}
            show={toast.show}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
            duration={3000}
        />
    </div>
  );
};

export default PopupCreateProj;
