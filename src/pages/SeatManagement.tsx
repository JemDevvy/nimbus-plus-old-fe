import React, { useState } from 'react'
import { CreateOutlined, ArrowBackRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const members = [
  { id: 1, fullName: "James Smith",email: "james.smith@email.com", company: "Arkitask", discipline: "Architect", position: "Director", status: "Active", avatar: "https://placehold.net/400x400.png"},
  { id: 2, fullName: "Richia Cabrales", email: "r1ch1aaa@email.com", company: "Chicha", discipline: "Designer", position: "President", status: "Invited", avatar: "https://placehold.net/400x400.png"},
  ];

const SeatManagement = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState<number[]>([]);

    const toggleSelect = (id: number) => {
      setSelected((prev: number[]) =>
        prev.includes(id) ? prev.filter((x: number) => x !== id) : [...prev, id]
      );
    };

    const toggleSelectAll = () => {
      if (selected.length === members.length) setSelected([]);
      else setSelected(members.map((m: ProjectMember) => m.id));
    };

  return (
    <div className="max-w-[100vw] max-h-[100vw]">
        <div className="pt-26 pl-30 pr-10">
            <div className='flex flex-row justify-between items-center mb-5'>
                <div>
                    <button className="mr-2 px-6 py-2 bg-gray-300 shadow-sm font-bold rounded-lg hover:bg-blue-100 transition cursor-pointer" onClick={() => navigate(-1)} >
                        <span className="font-bold text-xl"><ArrowBackRounded /> </span>Back to Tenants
                    </button>
                    <button className="px-6 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-blue-700 transition cursor-pointer" 
                    // onClick={() => setShowPopup(true)}
                    >
                        <span className="font-bold text-xl">+ </span>Add Seats
                    </button>
                </div>
                <div>
                    <button className="mr-2 px-6 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-blue-700 transition cursor-pointer" 
                    // onClick={() => setShowPopup(true)}
                    >
                        <span className="font-bold text-xl">+ </span>Add Users
                    </button>
                    <button className="px-6 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-blue-700 transition cursor-pointer" 
                        // onClick={() => setShowPopup(true)}
                        >
                        <span className="font-bold text-xl"></span>Export
                    </button>
                </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-gray-700 text-center">
                    <thead className="bg-gray-50 border-b border-gray-200 text-xl">
                        <tr>
                        <th className="p-4">
                            <input
                            type="checkbox"
                            checked={selected.length === members.length}
                            onChange={toggleSelectAll}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                        </th>
                        <th className="px-4 py-3 font-semibold text-gray-900 text-left">Name</th>
                        <th className="px-4 py-3 font-semibold text-gray-900">Company</th>
                        <th className="px-4 py-3 font-semibold text-gray-900">Discipline</th>
                        <th className="px-4 py-3 font-semibold text-gray-900">Position</th>
                        <th className="px-4 py-3 font-semibold text-gray-900">Account Status</th>
                        <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member, i) => (
                        <tr
                            key={member.id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-lg"
                        >
                            <td className="p-4">
                            <input
                                type="checkbox"
                                checked={selected.includes(member.id)}
                                onChange={() => toggleSelect(member.id)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            </td>
                            <td className="px-4 py-3 flex items-center gap-3 text-left">
                            <img
                                src={member.avatar || `https://i.pravatar.cc/${Math.floor(Math.random() * (50 - 1 + 1)) + 1}`}
                                alt={member.fullName || "Unknown User"}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-semibold text-gray-900">{member.fullName || "Unknown User"}</p>
                                <p className="text-gray-500 text-sm">{member.email || ""}</p>
                            </div>
                            </td>
                            <td className="px-4 py-3">{member.company || ""}</td>
                            <td className="px-4 py-3">{member.discipline || ""}</td>
                            <td className="px-4 py-3">{member.position || ""}</td>
                            <td className="px-4 py-3 font-medium">{member.status || ""}</td>
                            <td className="px-4 py-3 text-gray-400 hover:text-gray-600 cursor-pointer">
                            <CreateOutlined />
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>  
    </div>
  )
}

export default SeatManagement