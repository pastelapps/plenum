import {
  ShieldCheck,
  Eye,
  FileCheck,
  Scale,
  BookOpen,
  Users,
  Landmark,
  FileSpreadsheet,
  Shield,
  User,
  MapPin,
  CalendarDays,
  Clock,
  CheckCircle2,
  Download,
  Mail,
  Phone,
  Link2,
  ChevronUp,
  ChevronDown,
  Play,
  X,
  Menu,
  Building2,
  Globe,
  Hotel,
  GraduationCap,
  Briefcase,
  Award,
  Target,
  TrendingUp,
  Zap,
  Heart,
  Star,
  Coffee,
  Wifi,
  Headphones,
  Monitor,
  Printer,
  Utensils,
  Car,
  type LucideIcon,
} from 'lucide-react';

/**
 * Maps string icon names (stored in the database) to Lucide React components.
 * Used by dynamic components to render icons from JSONB data.
 *
 * Usage:
 *   const IconComponent = getIcon('ShieldCheck');
 *   <IconComponent className="w-6 h-6" />
 */
const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  Eye,
  FileCheck,
  Scale,
  BookOpen,
  Users,
  Landmark,
  FileSpreadsheet,
  Shield,
  User,
  MapPin,
  CalendarDays,
  Clock,
  CheckCircle2,
  Download,
  Mail,
  Phone,
  Link2,
  ChevronUp,
  ChevronDown,
  Play,
  X,
  Menu,
  Building2,
  Globe,
  Hotel,
  GraduationCap,
  Briefcase,
  Award,
  Target,
  TrendingUp,
  Zap,
  Heart,
  Star,
  Coffee,
  Wifi,
  Headphones,
  Monitor,
  Printer,
  Utensils,
  Car,
};

/**
 * Get a Lucide icon component by name.
 * Returns the icon component or a fallback (CheckCircle2) if not found.
 */
export function getIcon(name: string): LucideIcon {
  return iconMap[name] || CheckCircle2;
}

/**
 * Get all available icon names (for admin icon picker).
 */
export function getAvailableIconNames(): string[] {
  return Object.keys(iconMap).sort();
}

export default iconMap;
