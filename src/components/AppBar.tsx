import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import SideNav from './layout/SideNav';
import MenuBar from './layout/MenuBar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSidebar } from '../context/SidebarContext';
import { useAuth } from "../hooks/useAuth";
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProjectSelection } from '../hooks/useProjectSelection';


const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const StyledSelect = styled(Select)(({ theme }) => ({
'& .MuiOutlinedInput-root': {
  borderRadius: '12px',
  backgroundColor: '#f5f5f5',
  '& fieldset': {
    borderColor: 'transparent',
  },
  '&:hover fieldset': {
    borderColor: 'transparent',
  },
  '&.Mui-focused fieldset': {
    borderColor: 'transparent',
  },
},
}));

const CompanyBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
  padding: '8px 12px',
  marginRight: '16px',
}));

const NewButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#1976d2',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: '#1565c0',
  },
}));

  function ResponsiveAppBar() {
    const { isMini, setIsMini } = useSidebar();
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [openMobileMenu, setOpenMobileMenu] = React.useState(false);
    const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'));
    // Get user from your auth context/hook
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedProject, setSelectedProject } = useProjectSelection();

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };
    // IconButton toggles mini variant on desktop/tablet and mobile sidebar on mobile
    const handleMenuIconClick = () => {
      if (isDesktop) {
        setIsMini(!isMini);
      } else {
        setOpenMobileMenu(true);
      }
    };

      const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId);

    // Update URL based on current page and selected project
    const currentPath = location.pathname;

    if (currentPath.startsWith('/rfi-list')) {
      if (projectId) {
        navigate(`/rfi-list/${projectId}`);
      } else {
        navigate('/rfi-list');
      }
    } else if (currentPath.startsWith('/rfi-register')) {
      if (projectId) {
        navigate(`/rfi-register/${projectId}`);
      } else {
        navigate('/rfi-register');
      }
    } else if (currentPath.startsWith('/projects') && !currentPath.includes('/add-member')) {
      if (projectId) {
        navigate(`/projects/${projectId}`);
      } else {
        navigate('/projects');
      }
    }
  };

    return (
      <>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: "background.paper" }}>
          <MenuBar />
          <SideNav />
        </AppBar>
      </>
    );
  }



  export default ResponsiveAppBar;
