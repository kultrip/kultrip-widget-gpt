import { Button } from "@/components/ui/button";

interface QuickOptionProps {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline";
  disabled?: boolean;
}

const QuickOption = ({ label, onClick, variant = "outline", disabled = false }: QuickOptionProps) => {
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {label}
    </Button>
  );
};

export default QuickOption;
