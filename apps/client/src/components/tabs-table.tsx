import { cn } from "@/lib/utils";

// Tambahkan di bagian bawah atau file baru
interface TableTabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
}

function TableTabsList({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 border-b border-border mb-4 overflow-x-auto",
        className
      )}
      {...props}
    />
  );
}

function TableTabTrigger({ className, isActive, ...props }: TableTabProps) {
  return (
    <button
      type="button"
      className={cn(
        "px-4 py-2 text-sm font-medium transition-all relative",
        "text-muted-foreground hover:text-foreground",
        // Gaya saat aktif
        isActive && "text-foreground border-b-2 border-green-500",
        className
      )}
      {...props}
    />
  );
}

export {
  // ... export lama Anda
  TableTabsList,
  TableTabTrigger
}