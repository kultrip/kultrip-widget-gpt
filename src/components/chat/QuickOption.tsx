import { Button } from "@/components/ui/button";

interface QuickOptionProps {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline";
}

const QuickOption = ({ label, onClick, variant = "outline" }: QuickOptionProps) => {
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      className="rounded-full"
    >
      {label}
    </Button>
  );
};

export default QuickOption;
