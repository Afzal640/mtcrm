import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GitBranch, 
  Activity, 
  Target, 
  UserSquare2, 
  Briefcase,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'sales'] },
  { name: 'Leads', href: '/leads', icon: Users, roles: ['admin', 'sales'] },
  { name: 'Pipeline', href: '/pipeline', icon: GitBranch, roles: ['admin', 'sales'] },
  { name: 'Activity', href: '/activity', icon: Activity, roles: ['admin', 'sales'] },
  { name: 'Targets', href: '/targets', icon: Target, roles: ['admin', 'sales'] },
  { name: 'Team', href: '/team', icon: UserSquare2, roles: ['admin', 'sales'] },
  { name: 'Production Dashboard', href: '/production', icon: LayoutDashboard, roles: ['production'] },
  { name: 'Production', href: '/production/projects', icon: Briefcase, roles: ['admin', 'production'] }
];

export const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role)
  );

  const userAvatar = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366f1&color=fff`;

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div className={`
        flex flex-col w-64 bg-white border-r border-gray-100 h-screen fixed top-0 left-0 z-50 
        transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-gray-100">
          <div className="bg-indigo-600 p-1.5 rounded-lg mr-3">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">SoftHouse</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`
                  flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center p-2 mb-2">
            <div className="relative">
              <img
                src={userAvatar}
                alt={user?.name}
                className="w-10 h-10 rounded-full border-2 border-white ring-1 ring-gray-100"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs font-medium text-gray-500 capitalize truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};
