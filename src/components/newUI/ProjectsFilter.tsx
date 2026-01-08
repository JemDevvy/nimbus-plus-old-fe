import { useState } from "react";

const ProjectsFilter = () => {
  const [active, setActive] = useState("All");

  const tabs = ["All", "Starred", "Archived"];

  return (
    <div className="flex bg-gray-200 rounded-lg px-4 py-1.5 w-fit shadow-sm my-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
            ${
              active === tab
                ? "bg-white shadow text-gray-900 font-semibold" 
                : "text-gray-500 hover:text-gray-700"
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default ProjectsFilter
