import React from 'react';
import { User as UserType } from '../../types';
import ThemeToggle from './ThemeToggle';
import { Shield, Sprout } from 'lucide-react';

interface TopHeaderProps {
  user: UserType;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ user }) => {
  return (
    <header className="top-header">
      <ThemeToggle />

      <div className="user-profile-badge">
        <div className="user-avatar">
          {user.role === 'admin' ? <Shield size={16} /> : <Sprout size={16} />}
        </div>
        <div className="user-profile-info">
          <span className="user-profile-name">{user.name || (user.role === 'admin' ? 'Admin' : 'Farmer')}</span>
          <span className="user-profile-role">
            {user.role === 'admin' ? 'Administrator' : 'Farmer'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;

