import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  UploadCloud,
  History as HistoryIcon,
  User as UserIcon,
  LogOut,
  Users,
  BarChart3,
  FileSpreadsheet
} from 'lucide-react';
import { UserRole } from '../../types';
import BrandLogo from './BrandLogo';

interface SidebarProps {
  role: UserRole;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const farmerMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Detect Disease', icon: UploadCloud },
    { id: 'history', label: 'Prediction History', icon: HistoryIcon },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'analytics', label: 'Prediction Analytics', icon: BarChart3 },
    { id: 'all_predictions', label: 'All Predictions', icon: FileSpreadsheet },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  const menuItems = role === 'admin' ? adminMenuItems : farmerMenuItems;

  // Determine current active section from location pathname or prop
  const currentPath = location.pathname.replace(/\/$/, '');
  const pathParts = currentPath.split('/');
  const urlTab = pathParts.length > 2 && pathParts[1] === 'dashboard' ? pathParts[2] : 'dashboard';

  const handleItemClick = (id: string) => {
    if (setActiveTab) setActiveTab(id);
    if (id === 'dashboard') {
      navigate('/dashboard');
    } else {
      navigate(`/dashboard/${id}`);
    }
  };

  return (
    <aside className="sidebar">
      <div>
        <div
          className="sidebar-brand"
          style={{ cursor: 'pointer' }}
          onClick={() => handleItemClick('dashboard')}
        >
          <div className="navbar-brand-icon">
            <BrandLogo size={20} />
          </div>
          <span>FarmVision AI</span>
        </div>

        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab ? activeTab === item.id : urlTab === item.id;
            return (
              <li
                key={item.id}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => handleItemClick(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-item btn-danger btn-full"
          onClick={onLogout}
          style={{ justifyContent: 'flex-start', border: 'none', cursor: 'pointer' }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
