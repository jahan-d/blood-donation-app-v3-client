import { Outlet } from "react-router";
import Sidebar from "../../components/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex bg-base-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
