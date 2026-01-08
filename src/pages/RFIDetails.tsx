import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlaceRounded, ArrowBackRounded, CreateOutlined, PersonOutline, DateRange, Person, Today, Timelapse, GpsFixed, Category, SaveOutlined } from "@mui/icons-material";
import CustomSelect from "../components/newUI/CustomSelect";
import { validateText } from "../utils/validate";
import Toast from "../components/newUI/Toast";

const statusOptions = [
  { value: "requested", label: "Requested" },
  { value: "in_progress", label: "In Progress" },
  { value: "pending_info", label: "Pending Info" },
  { value: "responded", label: "Responded" },
  { value: "closed", label: "Closed" },
  { value: "overdue", label: "Overdue" },
  { value: "cancelled", label: "Cancelled" },
];

// RFI schema type
interface RFI {
  id: number;
  projectId: number;
  rfiNumber: string;
  subject: string;
  discipline: string;
  category: string; 
  requestTo: number[];
  requestToName: string[];
  ccTo: number[];
  requestFrom: number;
  requiredResponseDate: string;
  requestedDate: string;
  comment?: string;
  rfiDescription: string;
  status: string;
  attachedFiles?: Array<{ url?: string; path?: string; originalname?: string; name?: string } | string>;
  createdAt: string;
  updatedAt: string;
  requestToGuest?: Guest[];
}

interface Guest {
  email: string;
  name?: string;
}

interface Member {
  userId: string; // always string for comparison
  fullName?: string;
  name?: string;
}

interface RFIComment {
  avatar?: string;
  author?: string;
  comment: string;
  createdAt?: string;
}

const RFIDetails = () => {
  const { id: rfiId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [rfi, setRfi] = useState<RFI | null>(null);
  const [form, setForm] = useState<Partial<RFI>>({});
  const [status, setStatus] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [commentFiles, setCommentFiles] = useState<File[]>([]);
  const [editFiles, setEditFiles] = useState<File[]>([]);
  const [selectedRequestTo, setSelectedRequestTo] = useState<string[]>([]);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [comments, setComments] = useState<RFIComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [projectDetails, setProjectDetails] = useState<{ name?: string; address?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [commentError, setCommentError] = useState<string>("");
  const [showPopup, setShowPopup] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const triggerToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
  };

  // Fetch RFI details, comments, members, and project details
  useEffect(() => {
    if (!rfiId) return;
    setLoading(true);
    const token = localStorage.getItem("token");
    // Fetch RFI details
    fetch(`${import.meta.env.VITE_API_URL}/api/rfi/${rfiId}`, {
      // headers: token ? { Authorization: `Bearer ${token}` } : {},
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        setRfi(data);
        setForm(data);
        setStatus(data.status || "requested");
        setSelectedRequestTo(Array.isArray(data.requestTo) ? data.requestTo : []);
        if (data.projectId) {
          fetch(`${import.meta.env.VITE_API_URL}/api/projects/${data.projectId}`, {
            // headers: token ? { Authorization: `Bearer ${token}` } : {},
            method: "GET",
            credentials: "include",
          })
            .then(async (res) => res.ok ? res.json() : null)
            .then((proj) => setProjectDetails(proj));
        }
      })
      .catch((err) => 
        setError(err.message)
      )
      .finally(() => setLoading(false));
    // Fetch comments
    fetchComments(rfiId);
    // Fetch members (if projectId is available after RFI fetch)
  }, [rfiId]);

  // Fetch members when rfi.projectId is available
  useEffect(() => {
    if (!rfi || !rfi.projectId) return;
    //const token = localStorage.getItem("token");
    fetch(`${import.meta.env.VITE_API_URL}/api/project-members/${rfi.projectId}`, {
      // headers: { 'Authorization': `Bearer ${token}` },
      method: "GET",
      credentials: "include",
    })
      .then(res => res.json())
      .then(async (data) => {
        // Ensure userId is always a string
        const membersRaw: { userId?: string }[] = Array.isArray(data.members) ? data.members : Array.isArray(data) ? data : [];
        const membersWithNames: Member[] = await Promise.all(
          membersRaw.map(async (member: { userId?: string }) => {
            // Fix name, not showing member names in request to
            let name = "";
            if (member.userId) {
              try {
                const userRes = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${member.userId}`, {
                  method: "GET",
                  credentials: "include",
                });
                if (userRes.ok) {
                  const userData = await userRes.json();
                  name = userData.name || userData.fullName || "";
                }
              } catch (err) {
                // Log error
                console.error("Error fetching user name", err);
              }
            }
            return { ...member, userId: member.userId ? String(member.userId) : "", name };
          })
        );
        setMembers(membersWithNames);
        console.log("members");
        console.log(membersWithNames);
      })
      .catch(() => setMembers([]));
  }, [rfi]);

  // Fetch comments from backend
  const fetchComments = async (rfiId: string) => {
    setCommentsLoading(true);
    try {
      //const token = localStorage.getItem("token");
      // Use correct plural route for GET
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rfi/${rfiId}/comments`, {
        method: "GET",
        // headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(Array.isArray(data) ? data as RFIComment[] : []);
    } catch {
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  // Handle RFI field changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    const { valid, error } = validateText(value, { maxLength: 500 });
    if (!valid) {
      // setError(error!);
      triggerToast(error!, "error")
    } else {
      // setError("");
      setForm({ ...form, [name]: value });
    }
  };

  // Handle status change
  const handleStatusChange = (val: string) => {
    setStatus(val);
    setForm({ ...form, status: val });
  };

  // Handle PATCH (edit RFI) - match backend expectations
  const handleEditRfi = async () => {
    setLoading(true);
    if (!rfiId) return;
    const formData = new FormData();
    // Convert userIds to integers for requestTo
    const intRequestTo: (string | number)[] = selectedRequestTo.map(uid => {
      const n = Number(uid);
      return Number.isInteger(n) ? n.toString() : uid;
    });
    // Add all fields to FormData
    formData.append("subject", form.subject || "");
    formData.append("discipline", form.discipline || selectedDiscipline || "");
    formData.append("rfiDescription", form.rfiDescription || "");
    formData.append("status", status || "requested");
    formData.append("requestedDate", form.requestedDate || "");
    formData.append("requiredResponseDate", form.requiredResponseDate || "");
    formData.append("comment", form.comment || "");
    // Arrays: requestTo, ccTo
    intRequestTo.forEach(v => formData.append("requestTo", v.toString()));
    if (form.ccTo && Array.isArray(form.ccTo)) {
      form.ccTo.forEach((v: number) => formData.append("ccTo", v.toString()));
    }
    // Files: attachedFiles (existing), editFiles (new uploads)
    if (editFiles && editFiles.length > 0) {
      editFiles.forEach((f: File) => formData.append("attachedFiles", f));
    } else if (form.attachedFiles && Array.isArray(form.attachedFiles)) {
      form.attachedFiles.forEach((f) => {
        // If f is a string, append as string; if object, append url/path
        if (typeof f === "string") {
          formData.append("attachedFiles", f);
        } else if (f && (f.url || f.path)) {
          formData.append("attachedFiles", f.url || f.path || "");
        }
      });
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rfi/${rfiId}`, {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json(); 
        triggerToast(data.message, "error")
        throw new Error(await res.text());
      }
      let updated: RFI | null = null;
      const text = await res.text();
      if (text) {
        try {
          updated = JSON.parse(text);
        } catch {
          updated = null;
        }
      }
      if (updated) {
        setRfi(updated);
        setForm(updated);
        setStatus(updated.status || "requested");
      }
      setIsEditing(false);
      fetch(`${import.meta.env.VITE_API_URL}/api/rfi/${rfiId}`, {
        method: "GET",
        credentials: "include",
      })
        .then(async (res) => {
          if (!res.ok) {
            const data = await res.json(); 
            triggerToast(data.message, "error")
            throw new Error(await res.text());
          }
          return res.json();
        })
        .then((data: RFI) => {
          setRfi(data);
          setForm(data);
          setStatus(data.status || "requested");
          setSelectedRequestTo(Array.isArray(data.requestTo) ? data.requestTo.map(String) : []);
        })
        .catch((err: Error) => 
          // setError(err.message)
          triggerToast(err.message, "error")
      );
      fetchComments(rfiId);
      triggerToast("RFI Edit Successful", "success")
    } catch (err) {
      if (err instanceof Error) setError(err.message || "Failed to update RFI");
      // else setError("Failed to update RFI");
      else triggerToast("Failed to update RFI", "error")
    } finally {
      setLoading(false);
    }
  };

  // Handle POST (add comment)
  const handleAddComment = async () => {
    if (!rfiId || !comment) return;
    setLoading(true);

    // Final validation
    const commentValidation = validateText(comment, { minLength: 1, maxLength: 100, pattern: /^[A-Za-z0-9 .,'"()\-!?#&/:=%]+$/ });
    if (!commentValidation.valid) {
        // setCommentError(commentValidation.error!);
        triggerToast(commentValidation.error!, "error")
        setLoading(false);
        return;
    }

    const data = new FormData();
    data.append("comment", comment);
    // data.append("userId", userId.toString()); // Add userId
    data.append("rfiId", rfiId.toString());  
    commentFiles.forEach((f: File) => data.append("files", f));
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rfi/${rfiId}/comment`, {
        method: "POST",
        credentials: "include",
        body: data
      });
      if (!res.ok) throw new Error(await res.text());
      // Safely handle empty or non-JSON response
      const text = await res.text();
      if (text) {
        try {
          JSON.parse(text);
        } catch {
          // ignore parse error
        }
      }
      setComment("");
      setCommentFiles([]);
      fetchComments(rfiId);
      triggerToast("Comment sent", "success")
    } catch (err) {
      if (err instanceof Error) {
        // setCommentError(err.message || "Failed to add comment");
      console.log(err.message)
      triggerToast("Failed to add comment", "error")
      }
      // else setCommentError("Failed to add comment");
      else triggerToast("Failed to add comment", "error")
    } finally {
      setLoading(false);
    }
  };

  // --- Render ---
  // Dropdown options for discipline and category (example, should be replaced with real options)
  const disciplineOptions = [
    { value: "Civil", label: "Civil" },
    { value: "Electrical", label: "Electrical" },
    { value: "Mechanical", label: "Mechanical" },
    
  ];
  const categoryOptions = [
    { value: "General", label: "General" },
    { value: "Design", label: "Design" },
    { value: "Site", label: "Site" },
  ];
  // RequestTo dropdown options from members
  const requestToOptions = members.map((m) => ({ value: m.userId, label: m.fullName || m.name || m.userId }));
  

  const getFileNameFromUrl = (url: string) => {
    const parts = url.split('/');
    
    return decodeURIComponent(parts[parts.length - 1].split('_')[1]);
  };

  useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsEditing(false)
        }
      };
  
      if (isEditing) {
        document.addEventListener("keydown", handleEscape);
      }
  
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
  }, [isEditing]);

  return (
    <div className="max-w-[100vw]">
      {isEditing ? (
        <div className="absolute -z-50 w-[100vw] h-[100vh] overflow-y-hidden bg-gray-400/50 text-yellow-800 text-center font-semibold" />
      ) : null}
      <div className="pt-26 pl-30 pr-10">
        <div className="relative flex flex-row justify-between mb-5">
          <div>
            <h1 className='font-bold text-2xl '>{projectDetails?.name || "Project Name"}</h1>
            <PlaceRounded className="text-gray-400 -ml-1" />
            <p className="text-md text-gray-500 inline-block ml-1">{projectDetails?.address || "Project Address"}</p>
          </div>
          {isEditing ? (
            <div className="absolute right-0 flex flex-row gap-3 z-50">
              <button className={`px-8 py-2 bg-gray-300 shadow-sm font-bold rounded-lg  transition 
              ${loading ? "cursor-wait" : "hover:bg-blue-100 cursor-pointer"}`}
                onClick={() => setIsEditing(false)} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className={`flex flex-row items-center w-full px-8 py-2 text-white font-bold rounded-lg  transition 
              ${loading ? "bg-gray-400 cursor-wait" : "bg-brand-primary hover:bg-blue-700 cursor-pointer"}`} 
                onClick={handleEditRfi} disabled={loading}
              >
                {loading && (
                    <div className="w-4 h-4 mr-2">
                        <div className="w-full h-full border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
                {loading ? "Saving...": <p><span className="font-bold text-xl mr-1"><SaveOutlined /></span>Save</p>}
              </button>
            </div>
          ) : (
            <div className="absolute right-0 flex flex-row gap-3 ">
              <button className="px-8 py-2 bg-gray-300 shadow-sm font-bold rounded-lg hover:bg-blue-100 transition cursor-pointer"
                onClick={() => navigate(-1)}>
                <span className="font-bold text-xl"><ArrowBackRounded /> </span>  Back to RFI Manager
              </button>
              <button type="submit" className="px-8 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-blue-700 transition cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                <span className="font-bold text-xl"><CreateOutlined /> </span>Edit RFI
              </button>
            </div>
          )}
        </div>
        <div className='flex flex-col xl:flex-row w-full rounded-xl border-1 border-gray-300 bg-white mb-10'>
          <div className='my-8 mx-15 flex-2 flex flex-col'>
            <p className='py-1 px-3 border-1 border-gray-300 rounded-lg text-sm max-w-fit'>RFI Number: {rfi?.rfiNumber || "-"}</p>
            
            {isEditing ? (
              <div>
                <input
                  type="text"
                  name="subject"
                  value={form.subject || ""}
                  onChange={handleFormChange}
                  className="my-2 text-2xl font-bold px-2 py-1 border border-gray-300 rounded-lg"
                  placeholder="RFI Subject"
                  disabled={loading}
                />
                <p className='text-sm text-gray-500'>Requested by {(() => {
                    if (rfi?.requestFrom) {
                      const member = members.find(m => String(m.userId) === String(rfi.requestFrom));
                      return member ? (member.fullName || member.name || member.userId) : rfi.requestFrom;
                    }
                    return "FirstName LastName";
                  })()
                  } at {rfi?.requestedDate ? new Date(rfi.requestedDate).toLocaleDateString() : "Day Month Year"}
                </p>
              </div>
            ) : (
              <div>
                <p className='mt-2 text-2xl font-bold'>{form.subject || rfi?.subject || "RFI Subject"}</p>
                <p className='text-sm text-gray-500'>Requested by {(() => {
                    if (rfi?.requestFrom) {
                      const member = members.find(m => String(m.userId) === String(rfi.requestFrom));
                      return member ? (member.fullName || member.name || member.userId) : rfi.requestFrom;
                    }
                    return "FirstName LastName";
                  })()
                  } at {rfi?.requestedDate ? new Date(rfi.requestedDate).toLocaleDateString() : "Day Month Year"}
                </p>
              </div>
            )}
            <div className='grid grid-cols-4 grid-rows-4 gap-4 pt-5'>
              <div className="">
                <DateRange className="-mt-1 mr-5 max-w-fit" />
                <p className="text-md font-semibold inline-block">Required date</p>
              </div>
              <div className="">
                {isEditing ? (
                  <input
                    type="date"
                    name="requiredResponseDate"
                    value={form.requiredResponseDate ? form.requiredResponseDate.slice(0,10) : ""}
                    onChange={handleFormChange}
                    className="text-md w-full text-gray-500 px-2 rounded-md border border-gray-300"
                    disabled={loading}
                  />
                ) : (
                  <p className="text-md inline-block">{rfi?.requiredResponseDate ? new Date(rfi.requiredResponseDate).toLocaleDateString() : "Day Month Year"}</p>
                )} 
              </div>
              <div className="col-start-1 row-start-2">
                <Person className="-mt-1 mr-5 max-w-fit" />
                <p className="text-md font-semibold inline-block">Request to</p>
              </div>
              <div className="col-start-2 row-start-2">
                {isEditing ? (
                  <CustomSelect
                    options={requestToOptions}
                    value={selectedRequestTo}
                    onChange={val => setSelectedRequestTo(Array.isArray(val) ? val : val ? [val] : [])}
                    extraActionLabel="+ Add Contact"
                    onExtraAction={() => null}
                    isMulti
                    placeholder="Select Request To"
                    className="w-full px-2 py-0.5 bg-brand-whiteback rounded-lg border border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none"
                  />
                ) : (
                  <p className="text-md inline-block">{
                    Array.isArray(selectedRequestTo) && selectedRequestTo.length > 0
                      ? rfi?.requestToName.join(", ")
                      : (rfi?.requestToName || "FirstName LastName")
                  }</p>
                )}


              </div>
              <div className="row-start-3">
                <Timelapse className="-mt-1 mr-5 max-w-fit" />
                <p className="text-md font-semibold inline-block">Status</p>
              </div>
              <div className="row-start-3">
                {isEditing ? (
                  <CustomSelect
                    options={statusOptions}
                    value={status}
                    onChange={val => handleStatusChange(val as string)}
                    placeholder="Select Status"
                    className="w-full px-2 py-0.5 bg-brand-whiteback rounded-lg border border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none"
                  />
                ) : (
                  <p className="text-md inline-block">
                    {
                      statusOptions.find(opt => opt.value === (rfi?.status || status))?.label || "Status"
                    }
                  </p>
                )}
              </div>
              <div className="col-start-3 row-start-1">
                <GpsFixed className="-mt-1 mr-5 max-w-fit" />
                <p className="text-md font-semibold inline-block">Discipline</p>
              </div>
              <div className="col-start-4 row-start-1">
                {isEditing ? (
                  <CustomSelect
                    options={disciplineOptions}
                    value={form.discipline || selectedDiscipline}
                    onChange={val => {
                      setSelectedDiscipline(typeof val === 'string' ? val : (val[0] || ''));
                      setForm({ ...form, discipline: typeof val === 'string' ? val : (val[0] || '') });
                    }}
                    placeholder="Select Discipline"
                    className="w-full px-2 py-0.5 bg-brand-whiteback rounded-lg border border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none"
                  />
                ) : (
                  <p className="text-md inline-block">{rfi?.discipline || "Discipline"}</p>
                )}
              </div>
              <div className="col-start-3 row-start-2">
                <Category className="-mt-1 mr-5 max-w-fit" />
                <p className="text-md font-semibold inline-block">Category</p>
              </div>
              <div className="col-start-4 row-start-2">
                {isEditing ? (
                  <CustomSelect
                    options={categoryOptions}
                    value={form.category || selectedCategory}
                    onChange={val => {
                      setSelectedCategory(typeof val === 'string' ? val : (val[0] || ''));
                      setForm({ ...form, category: typeof val === 'string' ? val : (val[0] || '') });
                    }}
                    placeholder="Select Category"
                    className="w-full px-2 py-0.5 bg-brand-whiteback rounded-lg border border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none"
                  />
                ) : (
                  <p className="text-md inline-block">{rfi?.category || "Category"}</p>
                )}
              </div>
            </div>
            <p className='mb-5 text-2xl font-bold'>Description</p>
            <textarea
              className='px-6 py-4 border-1 border-gray-300 rounded-lg '
              placeholder='Write Description...'
              rows={4}
              name="rfiDescription"
              value={form.rfiDescription || rfi?.rfiDescription || ""}
              onChange={isEditing ? handleFormChange : undefined}
              readOnly={!isEditing}
            />
            <p className='my-5 text-2xl font-bold'>Attachments</p>
            {/* Download buttons for each file */}
            <div className="flex flex-col gap-2 mb-4">
              {Array.isArray(rfi?.attachedFiles) && rfi.attachedFiles.length > 0 ? (
                rfi.attachedFiles.map((file, idx: number) => {
                  let fileUrl = "";
                  let fileName = "";
                  if (typeof file === "string") {
                    fileUrl = file;
                    fileName = getFileNameFromUrl(fileUrl);
                  } else if (file) {
                    fileUrl = file.url || file.path || "";
                    fileName = file.originalname || file.name || getFileNameFromUrl(fileUrl) || `File_${idx+1}`;
                  }
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="truncate max-w-xs">{fileName}</span>
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={fileName}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
                      >
                        Download File
                      </a>
                    </div>
                  );
                })
              ) : (
                <span className="text-gray-400 italic">No attachments.</span>
              )}
            </div>
            {/* Upload area remains below if editing is needed */}
            <div className="flex items-center justify-center">
              <label className="flex flex-col items-center justify-center w-full border-1 border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center py-5">
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">Drop your files here to <u>upload</u>.</p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept="*"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setEditFiles(Array.from(e.target.files));
                    } else {
                      setEditFiles([]);
                    }
                  }}
                  disabled={loading}
                />
              </label>
            </div>
          </div>

          {/* Activity & Comments Area */}
          <div className='h-100% border-l border-gray-300'></div>
          <div className='flex-1 bg-brand-whiteback mt-2 rounded-lg relative'>
            <div className='flex flex-row bg-white border-b border-gray-300 py-2 px-5 pb-3 text-xl font-semibold'>
              Activity
            </div>
            <div className='px-10 py-5 flex-1 overflow-y-scroll h-[50vh] xl:h-[70vh] pb-15' 
            style={isEditing ? { pointerEvents: 'none', opacity: 0.5, filter: 'blur(2px)' } : {}}
            ref={(el) => el && (el.scrollTop = el.scrollHeight)}>
              {comments.length === 0 && !commentsLoading && (
                <div className="text-gray-400 italic">No comments yet.</div>
              )}
              {comments.map((comment, i) => (
                <div key={i} className="flex items-start gap-2 mb-4">
                  <img
                    src={comment.avatar || "https://placehold.net/avatar.png"}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className='w-full'>
                    <div className='flex flex-row justify-between text-sm text-gray-500 mb-1'>
                      <p className="font-semibold">{comment.author || 'User'}</p>
                      {/* <p className="">{comment.timestamp ? new Date(comment.createdAt).toLocaleString("en-UK", {
                        day: "numeric",
                        month: "long",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      }).replace(",", " at") : ""}</p> */}
                    </div>
                    <p className="bg-white border-1 border-gray-300 rounded-lg px-4 py-2">
                      {comment.comment}
                    </p>
                  </div>
                </div>
              ))}
              {commentsLoading && (
                <div className="text-gray-400 italic">Loading comments...</div>
              )}
              
            </div>
            
            {/* Comment Input */}
            <div className="absolute w-[85%] border-1 border-gray-300 bg-white rounded-full flex items-center mx-10 bottom-4 px-4 py-2" style={isEditing ? { pointerEvents: 'none', opacity: 0.5, filter: 'blur(2px)' } : {}}>
              <input
                type="text"
                placeholder="Write a comment..."
                className="flex-1 bg-transparent focus:outline-none text-sm"
                value={comment}
                onChange={e => setComment(e.target.value)}
                disabled={loading}
              />
              {/* {commentError && <div className="text-red-300 text-sm items-end">Not Sent. {commentError}</div>} */}
              <button className={`ml-2  
              ${loading ? "text-gray-400 cursor-wait" : "hover:text-brand-primary cursor-pointer" }`}
              disabled={loading} onClick={handleAddComment}>
                ➤
              </button>
            </div>
            
          </div>
        </div>
        {/* Toast Test Button */}
        {/* <button className="bg-blue-400 p-3  cursor-pointer text-white max-w-fit" onClick={() => triggerToast("Toast Test", "error")}>Show Toast</button> */}
      </div>
      {/* {error && <div className="text-red-500 font-semibold mb-2">{error}</div>} */}

      <Toast
        message={toast.message}
        show={toast.show}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
        duration={3000}
      />
    </div>
  );
}

export default RFIDetails;
