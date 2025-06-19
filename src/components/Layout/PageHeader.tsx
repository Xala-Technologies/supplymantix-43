import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
interface PageHeaderProps {
  title: string;
  description?: string;
  additionalInfo?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  onBack?: () => void;
  children?: React.ReactNode;
}
export function PageHeader({
  title,
  description,
  additionalInfo,
  showBackButton = false,
  backButtonText = "Back",
  onBack,
  children
}: PageHeaderProps) {
  return;
}