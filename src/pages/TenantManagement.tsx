import { useEffect, useState } from 'react'
import { ShoppingCartOutlined, MoreHoriz } from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Tenant schema type
interface Tenant {
  id: number;
  name: string;
  slug: string;
  subscriptionPlan: string;
  seatLimit: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const TenantManagement = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [userCounts, setUserCounts] = useState<{ [tenantId: number]: number }>({});
  useEffect(() => {
    document.title = "Tenant Management - YourAppName";
    // Fetch tenants from backend
    fetch(`${import.meta.env.VITE_API_URL}/api/tenants`, {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.json())
      .then((data: Tenant[]) => setTenants(data))
      .catch(() => setTenants([]));
  }, []);

  useEffect(() => {
    if (tenants.length === 0) return;
    tenants.forEach(tenant => {
        fetch(`${import.meta.env.VITE_API_URL}/api/tenants/${tenant.id}/userCount`, {
        method: "GET",
        credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            setUserCounts(prev => ({ ...prev, [tenant.id]: data.userCount }));
        });
    });
    }, [tenants]);

  return (
    <div className="max-w-[100vw] max-h-[100vw]">
        <div className="pt-26 pl-30 pr-10">  
            <div className='bg-white p-5 rounded-lg shadow-sm w-full mb-10'>
                <h1 className='font-bold text-lg '>You have {tenants.length} subscriptions</h1>
                <div className='border-b border-1 border-gray-200 w-[103%] -ml-5 mt-3' />
                <div className='flex flex-row gap-5 mt-5 w-full overflow-y-scroll pb-5'>
                    {tenants.map((tenant) => (
                        <div key={tenant.id} className='p-4 border-1 border-gray-300 shadow-sm flex flex-col rounded-lg min-w-2/9 gap-3'>
                            <div className='flex flex-row items-center gap-3'>  
                                {/* Placeholder image, replace with real if available */}
                                <img 
                                src={`https://placehold.net/400x400.png?text=${tenant.name}`}
                                alt={tenant.name}
                                className='rounded-full w-10 h-10 border-2 border-gray-300'/>
                                <h1 className='font-bold text-lg'>{tenant.name}</h1>
                            </div>
                            <div className='flex flex-row items-center justify-between border-b-1 border-gray-300 py-2.5 w-full'>
                                <p className='text-sm'>Subscription Plan</p>
                                <p className='text-sm'>{tenant.subscriptionPlan}</p>
                            </div>
                            <div className='flex flex-row items-center justify-between border-b-1 border-gray-300 pb-2.5 w-full'>
                                <p className='text-sm'>Seats</p>
                                <p className='text-sm'>{userCounts[tenant.id] ?? "-"}</p>
                            </div>
                            <div className='flex flex-row justify-between'>
                                <div>
                                    <Link to={`/seats/${tenant.id}`}>
                                        <button className="border-1 border-black px-3 py-1 cursor-pointer rounded-md text-sm hover:bg-gray-200 hover:text-blue-600 mr-2">
                                            Manage Seats
                                        </button>
                                    </Link>
                                    <button className="border-1 border-black px-3 py-1 cursor-pointer rounded-md text-sm hover:bg-gray-200 hover:text-blue-600">
                                        <ShoppingCartOutlined className='w-5 h-5 mr-1'/>
                                        Buy
                                    </button>
                                </div>
                                <button className='cursor-pointer  hover:text-gray-500'>
                                    <MoreHoriz className='w-5 h-5'/>
                                </button>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    </div>
  )
}

export default TenantManagement