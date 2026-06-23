import { Outlet } from 'react-router';

const DashboardLayout = () => {
  return (
    <div>
      <h1 className="text-xl">Navbar component will come here</h1>
      <Outlet />
      <h1>Footer component will come here</h1>
    </div>
  );
};

export default DashboardLayout;
