import React, { useState, useEffect } from 'react'
import { Apartment, BusinessCenter, Settings, Email, Call, CheckCircle, Person, CreateOutlined, FilterAltOutlined, AttachmentRounded, Save } from '@mui/icons-material';
import CustomSelect from '../components/newUI/CustomSelect';

// User schema type
interface User {
    id: number;
    email: string;
    username: string;
    tenantId: number;
    fullName: string;
    role: string;
    initials: string;
    mobileNumber?: string;
    company?: string;
    discipline?: string;
    position?: string;
    accountStatus: string;
    image?: string;
}

// RFI schema type (simplified, adjust as needed)
interface RFI {
  id: number;
  rfiNumber: string;
  discipline?: string;
  category?: string;
  subject?: string;
  requestFrom?: string;
  requestFromAvatar?: string;
  requestedDate?: string;
  requestToName?: string;
  requestToAvatar?: string;
  requiredResponseDate?: string;
  status?: string;
  attachedFiles?: any;
}

const disciplineOptions = [
    { value: "Option1", label: "Option1" },
    { value: "Option2", label: "Option2" },
]

const UserProfile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [rfis, setRfis] = useState<RFI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
            method: "GET",
            credentials: "include"
        })
        .then(res => res.json())
        .then((data: User) => {
            setUser(data);
            setLoading(false);
        })
        .catch(() => {
            setError("Failed to fetch user");
            setLoading(false);
        });

        // Fetch RFIs for the logged-in user
        fetch(`${import.meta.env.VITE_API_URL}/api/users/myrfis`, {
            method: "GET",
            credentials: "include"
        })
        .then(res => res.json())
        .then((data: RFI[]) => setRfis(data))
        .catch(() => setRfis([]));
    }, []);

    if (loading) return <div>Loading user...</div>;
    if (error || !user) return <div className="text-red-600">{error || "User not found"}</div>;

    return (
    <div className="max-w-[100vw] max-h-[100vw]">
      <div className="pt-26 pl-30 pr-10 flex flex-col gap-7">
        {isEditing ? 
        <div className='bg-white p-5 rounded-lg shadow-sm w-full flex flex-row items-center justify-between'>
            <div className='ml-10 flex flex-row items-center'>
                <div className='border-2 border-gray-300 rounded-full w-fit h-fit'>
                    <div className='bg-gray/50 absolute rounded-full'></div>
                    <img 
                        src={user.image || `https://i.pravatar.cc/300?u=${user.id}`}
                        alt={user.fullName}
                        className='w-35 h-35 border-5 border-white rounded-full' 
                    />
                </div>
                
                <div className='flex flex-col ml-10'>
                    <h1 className="text-xl font-bold">{user.fullName}</h1>
                    <h1 className="text-lg">{user.username}</h1>
                </div>
            </div>
            <form className="grid grid-cols-2 grid-rows-3 gap-x-4 gap-y-8">
                <div >
                    <Apartment className="-mt-1 mr-5 max-w-fit"/>
                    <p className="text-md font-semibold inline-block">Company</p>
                </div>
                <div >
                    <input
                        type='text'
                        placeholder='Company'
                        value={user.tenantId || ""}
                        className="text-md text-gray-500 px-2 rounded-md bg-brand-whiteback border-1 border-gray-300 focus:outline-none focus:border-blue-500" 
                    />
                </div>
                <div >
                    <BusinessCenter className="-mt-1 mr-5 max-w-fit"/>
                    <p className="text-md font-semibold inline-block">Position</p>
                </div>
                <div >
                    <CustomSelect
                      options={disciplineOptions}
                      value={user.position || ""}
                      // onChange={() => )}
                      placeholder="Select Position"
                      className="w-full px-2 py-0.5 bg-brand-whiteback rounded-lg border border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none"
                    />
                </div>
                <div >
                    <Settings className="-mt-1 mr-5 max-w-fit"/>
                    <p className="text-md font-semibold inline-block">Discipline</p>
                </div>
                <div >
                    <CustomSelect
                      options={disciplineOptions}
                      value={user.discipline || ""}
                      // onChange={() => )}
                      placeholder="Select Discipline"
                      className="w-full px-2 py-0.5 bg-brand-whiteback rounded-lg border border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-500 outline-none"
                    />
                </div>
            </form>
            <div className="grid grid-cols-2 grid-rows-4 gap-4">
                <div >
                    <Email className="-mt-1 mr-5 max-w-fit"/>
                    <p className="text-md font-semibold inline-block">{user.email}</p>
                </div>
                <div >
                    <input
                        type='text'
                        placeholder='Email'
                        value={user.email}
                        className="text-md text-gray-500 px-2 rounded-md bg-brand-whiteback border-1 border-gray-300 focus:outline-none focus:border-blue-500" 
                    />
                </div>
                <div >
                    <Call className="-mt-1 mr-5 max-w-fit"/>
                    <p className="text-md font-semibold inline-block">Phone Number</p>
                </div>
                <div >
                    <input
                        type='text'
                        placeholder='Phone Number'
                        value={user.mobileNumber || ""}
                        className="text-md text-gray-500 px-2 rounded-md bg-brand-whiteback border-1 border-gray-300 focus:outline-none focus:border-blue-500" 
                    />
                </div>
                <div >
                    <CheckCircle className="-mt-1 mr-5 max-w-fit"/>
                    <p className="text-md font-semibold inline-block">Account Status</p>
                </div>
                <div >
                    <p className="text-md inline-block">{user.accountStatus}</p>
                </div>
                <div >
                    <Person className="-mt-1 mr-5 max-w-fit"/>
                    <p className="text-md font-semibold inline-block">Account Type</p>
                </div>
                <div >
                    <p className="text-md inline-block">{user.role}</p>
                </div>
            </div>
            <div className='mt-auto'>
                <button className="px-8 py-2 bg-gray-300 shadow-sm font-bold rounded-lg hover:bg-blue-100 transition cursor-pointer mr-3"
                onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button type="submit" className="px-8 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-blue-700 transition cursor-pointer"
                // onClick={handleEditRfi}
              >
                <span className="font-bold"><Save /> </span>Save
              </button>
            </div>
        </div> 
        : 
        <div className='bg-white p-5 rounded-lg shadow-sm w-full flex flex-row items-center justify-between'>
            <div className='ml-10 flex flex-row items-center'>
                <div className='border-2 border-gray-300 rounded-full w-fit h-fit'>
                    <img 
                        src={user.image || `https://i.pravatar.cc/300?u=${user.id}`}
                        alt={user.fullName}
                        className='w-35 h-35 border-5 border-white rounded-full' 
                    />
                </div>
                
                <div className='flex flex-col ml-10'>
                    <h1 className="text-xl font-bold">{user.fullName}</h1>
                    <h1 className="text-lg">{user.username}</h1>
                </div>
            </div>
            <div className="grid grid-cols-2 grid-rows-3 gap-x-4 gap-y-8">
                <div >
                    <Apartment className="-mt-1 mr-5 max-w-fit"/>
                    <p className="text-md font-semibold inline-block">Company</p>
                </div>
                <div >
                    <p className="text-md inline-block">{user.company}</p>
                </div>
                <div >
                    <BusinessCenter className="-mt-1 mr-5 max-w-fit"/>
                    <p className="text-md font-semibold inline-block">Position</p>
                </div>
                <div >
                    <p className="text-md inline-block">{user.position}</p>
                </div>
                <div >
                    <Settings className="-mt-1 mr-5 max-w-fit"/>
                    <p className="text-md font-semibold inline-block">Discipline</p>
                </div>
                <div >
                    <p className="text-md inline-block">{user.discipline}</p>
                </div>
            </div>
            <div className="grid grid-cols-2 grid-rows-4 gap-4">
                <div >
                    <Email className="-mt-1 mr-5 max-w-fit"/>
                    <p className="text-md font-semibold inline-block">Email Address</p>
                </div>
                <div >
                    <p className="text-md inline-block">{user.email}</p>
                </div>
                <div >
                    <Call className="-mt-1 mr-5 max-w-fit"/>
                    <p className="text-md font-semibold inline-block">Phone Number</p>
                </div>
                <div >
                    <p className="text-md inline-block">{user.mobileNumber}</p>
                </div>
                <div >
                    <CheckCircle className="-mt-1 mr-5 max-w-fit"/>
                    <p className="text-md font-semibold inline-block">Account Status</p>
                </div>
                <div >
                    <p className="text-md inline-block">{user.accountStatus}</p>
                </div>
                <div >
                    <Person className="-mt-1 mr-5 max-w-fit"/>
                    <p className="text-md font-semibold inline-block">Account Type</p>
                </div>
                <div >
                    <p className="text-md inline-block">{user.role}</p>
                </div>
            </div>
            <div className='mt-auto'>
                <button type="submit" className="px-8 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-blue-700 transition cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                <span className="font-bold text-xl"><CreateOutlined /> </span>Edit Profile
              </button>
            </div>
        </div>
        }

        <h1 className="text-xl font-bold">My RFI Requests</h1>

        {/* {loading ? (
            <div>Loading RFIs...</div>
        ) : error ? (
            <div className="text-red-600">{error}</div>
        ) : rfis.length === 0 ? (
            <div className="text-gray-500">No RFIs found for this project.</div>
        ) : ( */}
            <div>
            <div className="overflow-x-auto rounded-2xl ">
                <table className="min-w-full text-sm text-gray-700 border-0">
                <thead className="bg-white border border-gray-200 rounded-lg shadow-sm text-md uppercase text-gray-500">
                    <tr className="rounded-lg">
                    <th className="px-4 py-3 text-center font-semibold text-lg">#</th>
                    <th className="px-4 py-3 text-left font-semibold">Discipline 
                        <button className="ml-1 cursor-pointer hover:text-black">
                        <FilterAltOutlined />
                        </button>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">Category</th>
                    <th className="px-4 py-3 text-left font-semibold">Subject/Description</th>
                    <th className="px-4 py-3 text-left font-semibold">Request By
                        <button className="ml-1 cursor-pointer hover:text-black">
                        <FilterAltOutlined />
                        </button>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">Request Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Request To
                        <button className="ml-1 cursor-pointer hover:text-black">
                        <FilterAltOutlined />
                        </button>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">Required Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-center font-semibold">Files</th>
                    </tr>
                </thead>
                <tbody className="shadow-md">
                    <tr>
                    <td className="py-2"></td>
                    </tr>
                    {rfis.map((rfi, idx) => (
                    <tr
                        key={rfi.id}
                        className={`bg-white border-b border-gray-300 rounded-lg  hover:bg-gray-100 transition cursor-pointer`}
                        // onClick={() => {
                        // setSelectedRow(rfi.id);
                        // setSelectedRfi(rfi);
                        // window.location.href = `/rfi-details/${rfi.id}`
                        // }}
                    >
                        <td className="px-4 py-3 font-medium text-gray-900 text-center">
                        {String(rfi.rfiNumber).padStart(2, "0")}
                        </td> 
                        <td className="px-4 py-3">{rfi.discipline}</td>
                        <td className="px-4 py-3">{rfi.category || "Category"}</td>

                        <td className="px-4 py-3">{rfi.subject}</td>
                        <td className="px-4 py-3 flex items-center gap-2">
                        <img
                            src={rfi.requestFromAvatar}
                            alt=""
                            className="w-6 h-6 rounded-full"
                        />
                        <span>{rfi.requestFrom}</span>
                        </td>
                        <td className="px-4 py-3">
                        {new Date(rfi.requestedDate).toLocaleString("en-GB", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}</td>
                        <td className="px-4 py-3 flex items-center gap-2">
                        <img
                            src={rfi.requestToAvatar}
                            alt=""
                            className="w-6 h-6 rounded-full"
                        />
                        <span>{rfi.requestToName}</span>
                        </td>
                        <td className="px-4 py-3">
                        {new Date(rfi.requiredResponseDate).toLocaleString("en-GB", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                        </td>
                        <td className="px-4 py-3">
                        <span
                            // className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(rfi.status)}`}
                            className={`px-3 py-1 rounded-md text-xs font-medium`}
                        >
                            {rfi.status}
                        </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                        {rfi.attachedFiles != 0 ? (
                            <button className="text-gray-500 hover:text-gray-700 cursor-pointer">
                            <AttachmentRounded />
                            </button>
                        ) : (null)}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        {/* )} */}
        

        <h1 className="text-xl font-bold">Requests to me</h1>

        {/* {loading ? (
            <div>Loading RFIs...</div>
        ) : error ? (
            <div className="text-red-600">{error}</div>
        ) : rfis.length === 0 ? (
            <div className="text-gray-500">No RFIs found for this project.</div>
        ) : ( */}
            <div>
            <div className="overflow-x-auto rounded-2xl ">
                <table className="min-w-full text-sm text-gray-700 border-0">
                <thead className="bg-white border border-gray-200 rounded-lg shadow-sm text-md uppercase text-gray-500">
                    <tr className="rounded-lg">
                    <th className="px-4 py-3 text-center font-semibold text-lg">#</th>
                    <th className="px-4 py-3 text-left font-semibold">Discipline 
                        <button className="ml-1 cursor-pointer hover:text-black">
                        <FilterAltOutlined />
                        </button>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">Category</th>
                    <th className="px-4 py-3 text-left font-semibold">Subject/Description</th>
                    <th className="px-4 py-3 text-left font-semibold">Request By
                        <button className="ml-1 cursor-pointer hover:text-black">
                        <FilterAltOutlined />
                        </button>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">Request Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Request To
                        <button className="ml-1 cursor-pointer hover:text-black">
                        <FilterAltOutlined />
                        </button>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">Required Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-center font-semibold">Files</th>
                    </tr>
                </thead>
                <tbody className="shadow-md">
                    <tr>
                    <td className="py-2"></td>
                    </tr>
                    {rfis.map((rfi, idx) => (
                    <tr
                        key={rfi.id}
                        className={`bg-white border-b border-gray-300 rounded-lg  hover:bg-gray-100 transition cursor-pointer`}
                        // onClick={() => {
                        // setSelectedRow(rfi.id);
                        // setSelectedRfi(rfi);
                        // window.location.href = `/rfi-details/${rfi.id}`
                        // }}
                    >
                        <td className="px-4 py-3 font-medium text-gray-900 text-center">
                        {String(rfi.rfiNumber).padStart(2, "0")}
                        </td> 
                        <td className="px-4 py-3">{rfi.discipline}</td>
                        <td className="px-4 py-3">{rfi.category || "Category"}</td>

                        <td className="px-4 py-3">{rfi.subject}</td>
                        <td className="px-4 py-3 flex items-center gap-2">
                        <img
                            src={rfi.requestFromAvatar}
                            alt=""
                            className="w-6 h-6 rounded-full"
                        />
                        <span>{rfi.requestFrom}</span>
                        </td>
                        <td className="px-4 py-3">
                        {new Date(rfi.requestedDate).toLocaleString("en-GB", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}</td>
                        <td className="px-4 py-3 flex items-center gap-2">
                        <img
                            src={rfi.requestToAvatar}
                            alt=""
                            className="w-6 h-6 rounded-full"
                        />
                        <span>{rfi.requestToName}</span>
                        </td>
                        <td className="px-4 py-3">
                        {new Date(rfi.requiredResponseDate).toLocaleString("en-GB", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                        </td>
                        <td className="px-4 py-3">
                        <span
                            // className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(rfi.status)}`}
                            className={`px-3 py-1 rounded-md text-xs font-medium`}
                        >
                            {rfi.status}
                        </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                        {rfi.attachedFiles != 0 ? (
                            <button className="text-gray-500 hover:text-gray-700 cursor-pointer">
                            <AttachmentRounded />
                            </button>
                        ) : (null)}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        {/* )} */}
        </div>
      </div>
  )
}

export default UserProfile
