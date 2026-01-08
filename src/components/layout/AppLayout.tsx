import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";
import MenuBar from "./MenuBar";

// Make SideNav and MenuBar always visible
function AppLayout() {
  return (
    <div className="flex">
      <aside className="w-64 border-r p-4">
        <SideNav />
      </aside>

      <div className="flex-1 flex flex-col">
        <MenuBar />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

 export default AppLayout;