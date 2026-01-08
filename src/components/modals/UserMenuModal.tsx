import { Link } from "react-router-dom";
import { AddCircleOutline } from '@mui/icons-material';

const tenants = [
  { name: "Arkitask", role: "Admin", plan: "Basic", image: "https://placehold.net/400x400.png" },
  { name: "Tenant 2", role: "Guest", plan: "Enterprise", image: "https://placehold.net/400x400.png" },
];

const UserMenuModal = () => {
  return (
    <div className="w-70 bg-white border-1 border-gray-300 shadow-lg rounded-lg p-4 z-50 flex flex-col gap-4 text-black" 
    // onMouseLeave={() => setIsOpen(false)}
    >
        <div className="w-full mb-2">
        <h1 className="font-bold text-lg">FirstName LastName</h1>
        <p className="text-sm">email@emailprovider.com</p>
        <button className="border-1 border-black w-full px-10 py-1 cursor-pointer rounded-md text-sm hover:bg-red-100 mt-5">
            Sign out
        </button>
        </div>

        <div className="w-full border-b border-1 border-gray-300"/>

        <div className="w-full">
        <Link to="/tenant-management">
            <div className="flex flex-row justify-between mb-4">
                <h1 className="font-bold text-lg">Tenants</h1>
                <button className="border-1 border-black px-5 py-1 cursor-pointer rounded-md text-sm hover:bg-gray-200">
                Manage
                </button>
            </div>
        </Link>
        {tenants.map((tenant, i) => (
            <div className="flex flex-row w-69.5  hover:bg-brand-primary/10 px-4 py-2 -mx-4 gap-2 cursor-pointer">
            <img 
                src={tenant.image}
                alt={tenant.name}
                className="w-10 h-10 rounded-full border-1 border-black "
            />
            <div className="flex flex-col w-full">
                <div className="flex flex-row justify-between w-full">
                <h2 className="font-bold text-md">{tenant.name}</h2>
                <h2 className="text-md">{tenant.role}</h2>
                </div>
                <h2 className="text-sm">{tenant.plan}</h2>
            </div>
            </div>
        ))}
        <div className="flex flex-row cursor-pointer hover:bg-gray-100 w-69.5 p-4 -mx-4 border-b border-gray-300">
            <AddCircleOutline className="w-7 h-7 mr-2"/>
            <h2 className="font-bold text-md mt-0.5">Add Tenant Account</h2>
        </div>
        </div>

        <div className="w-full mb-2">
        <h1 className="font-bold text-lg cursor-pointer mb-2">My Profile</h1>
        <Link to="/user-profile">
            <p className="text-md cursor-pointer border-b border-gray-300 p-2 hover:bg-gray-100">Open Profile</p>
        </Link>
        <p className="text-md cursor-pointer border-b border-gray-300 p-2 hover:bg-gray-100">Language</p>
        
        </div>
    </div>
  )
}

export default UserMenuModal
