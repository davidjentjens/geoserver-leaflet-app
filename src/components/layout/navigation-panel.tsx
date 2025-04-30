// src/components/layout/NavigationPanel.tsx
import {
  ChevronDown,
  Layers,
  Map,
  Paintbrush,
  Settings,
  Shapes,
  TestTube2,
} from "lucide-react";
import Link from "next/link";

// Add these new imports for the Collapsible component
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Separator } from "../ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  // Add these new imports
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "../ui/sidebar";

interface BaseSidebarMenuItem {
  title: string;
  icon: React.ElementType;
}

interface SidebarSubItemProps {
  title: string;
  url: string;
  icon?: React.ElementType;
}

type SidebarMenuItemProps = BaseSidebarMenuItem &
  (
    | { url: string; subItems?: never }
    | { url?: never; subItems: SidebarSubItemProps[] }
  );

// Updated items with sub-items for collapsible menus
const items: SidebarMenuItemProps[] = [
  {
    title: "Analysis",
    icon: Map,
    subItems: [
      { title: "Maps", url: "/", icon: Map },
      { title: "Layers", url: "/layers", icon: Layers },
      { title: "Polygons", url: "/polygons", icon: Shapes },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    subItems: [
      { title: "General", url: "/general", icon: Settings },
      { title: "Appearance", url: "/appearance", icon: Paintbrush },
      { title: "Advanced", url: "/advanced" },
    ],
  },
];

export function NavigationPanel() {
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center flex-row p-4 gap-3">
        <TestTube2 className="text-gray-500" />
        GeoServer Testing Env.
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.subItems ? (
                    // Render collapsible menu for items with subItems
                    <Collapsible className="w-full group/collapsible">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full flex justify-between">
                          <div className="flex items-center">
                            <item.icon width={16} className="mr-2" />
                            <span>{item.title}</span>
                          </div>
                          <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <Link
                                href={subItem.url}
                                className="flex w-full px-4 py-1 hover:bg-gray-100"
                              >
                                {subItem.icon && (
                                  <subItem.icon width={16} className="mr-2" />
                                )}
                                {subItem.title}
                              </Link>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    // Render regular menu button for items without subItems
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="flex items-center">
                        <item.icon width={16} className="mr-2" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <Separator />
      <SidebarFooter className="flex items-center justify-between p-4">
        <span className="text-sm text-gray-500">Version Alpha</span>
      </SidebarFooter>
    </Sidebar>
  );
}
