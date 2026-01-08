import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { PlaceRounded, ArrowBackRounded } from '@mui/icons-material';
import ProjectMembersList from "../components/newUI/ProjectMembersList";
import PopupAddMembers from "../components/modals/PopUpAddMembers";


type Contact = {
  id: number;
  userId?: number;
  fullName: string;
  companyName: string;
  discipline: string;
  position: string;
  accountStatus: string;
  name?: string;
};

const AddProjectMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("AddProjectMember user:", user);
    console.log("AddProjectMember token:", token);
    if (!user?.userId) return;
    fetch(`${import.meta.env.VITE_API_URL}api/contacts/${user.userId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        console.log("AddProjectMember contacts response:", data);
        const contactsArray = Array.isArray(data.contacts) ? data.contacts : Array.isArray(data) ? data : [];
        setContacts(contactsArray);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch contacts");
        setLoading(false);
      });
  }, [user]);

  const handleAddMember = async () => {
    if (!selectedContact) return;
    const token = localStorage.getItem("token");
    try {
      const payload = {
        projectId: Number(id),
        userId: selectedContact.userId || selectedContact.id // support both userId and id
      };
      console.log("AddProjectMember payload:", payload);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/project-members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const responseText = await res.text();
      console.log("AddProjectMember response:", responseText);
      if (!res.ok) throw new Error("Failed to add member");
      navigate(`/projects/${id}`);
    } catch {
      setError("Failed to add member");
    }
  };

  return (
    <div className="max-w-[100vw] max-h-[100vw]">
      
      <div className="pt-26 pl-30 pr-10">

        <div className="flex flex-row justify-between gap-5 mb-5">
          <div>
            <h1 className="font-bold text-xl">Project Name</h1>
            <PlaceRounded className="text-gray-400 -ml-1" />
            <p className="text-md text-gray-500 inline-block ml-1">Project Address</p>
          </div>
          <div className="ml-auto">
            <button className="px-8 py-2 mx-5 bg-gray-300 shadow-sm font-bold rounded-lg hover:bg-blue-100 transition cursor-pointer" onClick={() => navigate(-1)}>
              <span className="font-bold text-xl"><ArrowBackRounded /> </span>
              Back to Project Dashboard
            </button>
            <button className="px-10 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-blue-700 transition cursor-pointer" onClick={() => setShowPopup(true)}>
              <span className="font-bold text-xl">+ </span>Add to Project
            </button>
          </div>
        </div>

        <div className='w-full'>
          {id && <ProjectMembersList projectId={Number(id)} />}
        </div>
      </div>

      <PopupAddMembers 
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onSubmit={handleAddMember}
        projectId={id ? Number(id) : undefined}
      />

    </div>
  );
}

export default AddProjectMember