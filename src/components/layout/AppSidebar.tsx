import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  LayoutDashboard, 
  GitBranch, 
  Settings, 
  Zap,
  Activity
} from 'lucide-react';
import { HubSelector } from '@/components/layout/HubSelector';

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
    badge: null
  },
  {
    title: 'Repositories',
    url: '/repositories',
    icon: GitBranch,
    badge: null
  },
  // {
  //   title: 'Scans & Reports',
  //   url: '/scans',
  //   icon: Activity,
  //   badge: '3'
  // },
  {
    title: 'Integrations',
    url: '/integrations',
    icon: Zap,
    badge: null
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
    badge: null
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === 'collapsed';

  const isActive = (path: string) => location.pathname === path;
  
  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 transition-smooth ${
      isActive 
        ? 'bg-primary/10 text-primary font-medium border-r-2 border-primary' 
        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
    }`;

  return (
    <Sidebar className={isCollapsed ? 'w-16' : 'w-64'} collapsible="icon">
      <SidebarContent className="bg-card border-r border-border">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-glow flex-shrink-0">
              <Shield className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
               <h1 className="font-bold text-lg text-primary truncate">
                  AI Guardian
                </h1>
                <p className="text-xs text-muted-foreground truncate">
                  Security Platform
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup className="px-4 py-6">
          {/* <SidebarGroupLabel className={isCollapsed ? 'sr-only' : ''}>
            Navigation
          </SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavClassName}
                      end
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="truncate">{item.title}</span>
                          {item.badge && (
                            <Badge 
                              variant="secondary" 
                              className="ml-auto text-xs px-1.5 py-0.5"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Hub Info - Bottom */}
        {/* {!isCollapsed && (
          <div className="mt-auto p-4 border-t border-border">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs font-medium text-foreground">Active Hub</p>
              <p className="text-sm font-semibold truncate">Main Project Hub</p>
              <p className="text-xs text-muted-foreground">3 repositories</p>
            </div>
          </div>
        )} */}
        {/* Hub Selector - Bottom */}
        <div className="mt-auto">
          <HubSelector isCollapsed={isCollapsed} />
        </div>

      </SidebarContent>
    </Sidebar>
  );
}