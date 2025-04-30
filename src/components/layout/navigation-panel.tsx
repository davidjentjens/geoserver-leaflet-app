// src/components/layout/NavigationPanel.tsx
import { ChevronDown, Map, Settings } from "lucide-react";

// Add these new imports for the Collapsible component
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
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

type SidebarMenuItemProps = BaseSidebarMenuItem &
  (
    | { url: string; subItems?: never }
    | { url?: never; subItems: { title: string; url: string }[] }
  );

// Updated items with sub-items for collapsible menus
const items: SidebarMenuItemProps[] = [
  {
    title: "Analysis",
    icon: Map,
    subItems: [
      { title: "Maps", url: "#maps" },
      { title: "Layers", url: "#layers" },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    subItems: [
      { title: "General", url: "#general" },
      { title: "Appearance", url: "#appearance" },
      { title: "Advanced", url: "#advanced" },
    ],
  },
];

export function NavigationPanel() {
  return (
    <Sidebar>
      <SidebarHeader>GeoServer Testing</SidebarHeader>
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
                              <a
                                href={subItem.url}
                                className="flex w-full px-6 py-2 text-sm"
                              >
                                {subItem.title}
                              </a>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    // Render regular menu button for items without subItems
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="flex items-center">
                        <item.icon className="mr-2" />
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
      <SidebarFooter>
        <span className="text-sm text-gray-500">Version 1.0</span>
      </SidebarFooter>
    </Sidebar>
  );
}
