//import React, { useState } from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
//import { ProjectSelectionProvider } from "./context/ProjectSelectionProvider";
import { AuthProvider } from "./context/auth-context";
import './App.css';
import AppBar from './components/AppBar';
import { useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { SidebarProvider } from './context/SidebarContext';
import { ProjectSelectionProvider } from "./context/ProjectSelectionProvider";

// Software pages
import Dashboard from "./pages/DashboardNew";
import Signup from './pages/Signup';
import Login from './pages/Login';
import Project from './pages/Project';
import AddProjectMember from './pages/AddProjectMember';
import RfiSelect from './pages/RFIProjectSelect';
import RfiList from './pages/RfiList';
import RFIDetails from './pages/RFIDetails';
import UserManagement from "./pages/UserManagement";
import TenantManagement from './pages/TenantManagement';
import SeatManagement from './pages/SeatManagement';
import UserProfile from "./pages/UserProfile";

// Waitlist pages and components
import MainPage from './pages/waitlist/MainPage'
// import JoinWaitlist from './pages/waitlist/JoinWaitlist'
import ScrollToTopWithHash from './components/waitlist/ScrollToTopWithHash';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      
      <AuthProvider>
          <ProjectSelectionProvider>
              <SidebarProvider>
                <BrowserRouter>
                  <AppWithConditionalAppBar />
                </BrowserRouter>
              </SidebarProvider>
          </ProjectSelectionProvider>
      </AuthProvider>

    </ThemeProvider>
  );
}

function AppWithConditionalAppBar() {
  const location = useLocation();
  const hideAppBarRoutes = ['/', '/login', '/signup', '/joinwaitlist', '/login-old'];
  const normalizedPath = location.pathname.replace(/\/+$/, '') || '/'; 
  const shouldHideAppBar = hideAppBarRoutes.includes(normalizedPath);
  return (
    <>
      {!shouldHideAppBar && <AppBar />}
      {/* <ScrollToTopWithHash /> */}
      <Routes>
        {/* <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects/:id" element={<Project />} />
        <Route path="/rfi-list" element={<RfiSelect />} />
        <Route path="/rfi-list/:id" element={<RfiList />} />
        <Route path="/rfi-details/:id" element={<RFIDetails />} />
        <Route path="/projects/:id/add-member" element={<AddProjectMember />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/tenant-management" element={<TenantManagement />} />
        <Route path="/seats/:id" element={<SeatManagement />} /> */}
        <Route path='/' element={<MainPage />} />
        {/* <Route path='/joinwaitlist' element={<JoinWaitlist />} /> */}
      </Routes>
    </>
  );
}
