
import { 
  Building2, 
  Wrench, 
  DollarSign, 
  FileText, 
  Factory, 
  Package, 
  ClipboardList, 
  BarChart3, 
  MapPin, 
  TrendingUp, 
  MessageSquare,
  Languages,
  LayoutDashboard
} from "lucide-react";

export const menuItems = [
  {
    title: "nav.dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    group: "sidebar.overview"
  },
  {
    title: "nav.workOrders",
    url: "/dashboard/work-orders",
    icon: Wrench,
    group: "sidebar.operations"
  },
  {
    title: "nav.purchaseOrders",
    url: "/dashboard/purchase-orders",
    icon: DollarSign,
    group: "sidebar.operations"
  },
  {
    title: "nav.requests",
    url: "/dashboard/requests",
    icon: FileText,
    group: "sidebar.operations"
  },
  {
    title: "nav.assets",
    url: "/dashboard/assets",
    icon: Factory,
    group: "sidebar.resources"
  },
  {
    title: "nav.inventory",
    url: "/dashboard/inventory",
    icon: Package,
    group: "sidebar.resources"
  },
  {
    title: "nav.procedures",
    url: "/dashboard/procedures",
    icon: ClipboardList,
    group: "sidebar.resources"
  },
  {
    title: "nav.meters",
    url: "/dashboard/meters",
    icon: BarChart3,
    group: "sidebar.resources"
  },
  {
    title: "nav.locations",
    url: "/dashboard/locations",
    icon: MapPin,
    group: "sidebar.resources"
  },
  {
    title: "nav.reporting",
    url: "/dashboard/reporting",
    icon: TrendingUp,
    group: "sidebar.collaboration"
  },
  {
    title: "nav.messages",
    url: "/dashboard/messages",
    icon: MessageSquare,
    group: "sidebar.collaboration"
  },
  {
    title: "nav.organization",
    url: "/dashboard/organization", 
    icon: Building2,
    group: "sidebar.administration"
  },
  {
    title: "nav.translations",
    url: "/dashboard/translations",
    icon: Languages,
    group: "sidebar.administration"
  }
];

export const groupedItems = menuItems.reduce((acc, item) => {
  if (!acc[item.group]) {
    acc[item.group] = [];
  }
  acc[item.group].push(item);
  return acc;
}, {} as Record<string, typeof menuItems>);
