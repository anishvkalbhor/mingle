'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Heart,
  MessageCircle,
  TrendingUp,
  X,
  Home,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';

interface DashboardSidebarProps {
  isOpen: boolean;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'matches', label: 'Matches', icon: Heart },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
  { id: 'insights', label: 'Insights', icon: TrendingUp },
];

export const DashboardSidebar = ({
  isOpen,
  collapsed,
  onToggleCollapse,
  onCloseMobile,
  activeTab,
  onTabChange,
}: DashboardSidebarProps) => {
  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <TooltipProvider>
      <div
        className={cn(
          'fixed top-0 left-0 h-full z-50 bg-white/80 backdrop-blur-md border-r border-pink-100 transition-all duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          collapsed ? 'w-20' : 'w-64'
        )}
      >
        <div className="p-4 h-full flex flex-col relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-500 fill-current" />
              {!collapsed && (
                <Link href="/" className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Mingle
                </span>
                </Link>
              )}
            </div>
            {/* Close button for mobile only */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onCloseMobile}
              className="block lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* User Info */}
          {isLoaded && isSignedIn && user && (
            <div
              className={cn(
                'flex items-center gap-3 mb-6',
                collapsed && 'justify-center'
              )}
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} />
                <AvatarFallback>
                  {user.fullName
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              const button = (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3 h-12 text-base font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-pink-50 hover:text-pink-700',
                    collapsed && 'justify-center'
                  )}
                  onClick={() => onTabChange(item.id)}
                >
                  <Icon className="w-5 h-5" />
                  {!collapsed && item.label}
                </Button>
              );

              return collapsed ? (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent side="right" className="text-sm">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              ) : (
                button
              );
            })}
          </nav>

          {/* Tip */}
          {!collapsed && (
            <div className="mt-auto">
              <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg p-4 border border-pink-100">
                <h3 className="font-semibold text-gray-800 mb-2">💡 Pro Tip</h3>
                <p className="text-sm text-gray-600">
                  Complete your profile to get 3x more matches!
                </p>
              </div>
            </div>
          )}

          {/* Collapse Toggle for large screens */}
          <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 hidden lg:block">
            <Button
              size="icon"
              className="rounded-full bg-white text-black hover:bg-gray-100 border shadow"
              onClick={onToggleCollapse}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
