import { ListItemProps } from '@mui/material/ListItem';

import { IconProps } from '@iconify/react';

export interface PureSidebarProps {
  /** If the sidebar is fully expanded open or shrunk. */
  open?: boolean;
  /** If the user has selected to open/shrink the sidebar */
  openUserSelected?: boolean;
  /** To show in the sidebar. */
  items: SidebarItemProps[];
  /** The selected route name of the sidebar open. */
  selectedName: string | null;
  /** If the sidebar is the temporary one (full sidebar when user selects it in mobile). */
  isTemporaryDrawer?: boolean;
  /** If the sidebar is in narrow mode. */
  isNarrowOnly?: boolean;
  /** Called when sidebar toggles between open and closed. */
  onToggleOpen: () => void;
  /** The search part of the url */
  search?: string;
  /** A place to put extra components below the links. */
  linkArea: React.ReactNode;
}

export interface SidebarEntry {
  /**
   * Name of this SidebarItem.
   */
  name: string;
  /**
   * Text to display under the name.
   */
  subtitle?: string;
  /**
   * Label to display.
   */
  label: string;
  /**
   * Name of the parent SidebarEntry.
   */
  parent?: string | null;
  /**
   * URL to go to when this item is followed.
   */
  url?: string;
  /**
   * Should URL have the cluster prefix? (default=true)
   */
  useClusterURL?: boolean;
  /**
   * An iconify string or icon object that will be used for the sidebar's icon
   *
   * @see https://icon-sets.iconify.design/mdi/ for icons.
   */
  icon?: IconProps['icon'];
  /** The sidebar to display this item in. If not specified, it will be displayed in the default sidebar.
   */
  sidebar?: string;
  route?: string;
}

export interface SidebarItemProps extends ListItemProps, SidebarEntry {
  /** Whether this item is selected. */
  isSelected?: boolean;
  /** The navigation is a child. */
  hasParent?: boolean;
  /** Displayed wide with icon and text, otherwise with just a small icon. */
  fullWidth?: boolean;
  /** Search part of the URL. */
  search?: string;
  /** If a menu item has sub menu items, they will be in here. */
  subList?: Omit<this, 'sidebar'>[];
  /** Whether to hide the sidebar item. */
  hide?: boolean;
}
