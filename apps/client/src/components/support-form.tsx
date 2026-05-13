import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supportSchema } from "@/schemas/support";
import type { SupportFormValues } from "@/schemas/support";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supportService } from "@/services/support";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface SupportFormProps {
  onSuccess?: () => void;
}

export function SupportForm({ onSuccess }: SupportFormProps) {
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<SupportFormValues>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
    },
  });

  async function onSubmit(values: SupportFormValues) {
    setIsPending(true);
    try {
      await supportService.createTicket(values);
      toast.success("Support ticket submitted successfully");
      reset();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit ticket");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">Subject</FieldLabel>
          <Input
            id="title"
            placeholder="Enter issue subject"
            {...register("title")}
          />
          <FieldError errors={[errors.title]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="priority">Priority</FieldLabel>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[errors.priority]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          {/* <Textarea 
            id="description"
            placeholder="Describe your issue in detail..." 
            className="min-h-[120px]"
            {...register("description")} 
          /> */}
          <Input {...register("description")} />
          <FieldError errors={[errors.description]} />
        </Field>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Ticket
        </Button>
      </FieldGroup>
    </form>
  );
}
