import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useRegister } from "@/hooks/useRegister"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/hooks/useAuth"

interface SignupFormProps extends React.ComponentProps<"form"> {
  mode?: "public" | "admin";
  onSuccess?: () => void;
}

export function SignupForm({
  className,
  mode = "public",
  onSuccess,
  ...props
}: SignupFormProps) {
  const { register, handleSubmit, onSubmit, formState, formState: { errors } } = useRegister(onSuccess)
  const { isAdmin, isManager } = useAuth()



  // Determine available roles based on current user's role
  const getAvailableRoles = () => {
    if (mode === "public") {
      return [
        { value: "STAFF_GUDANG", label: "Staff" },
        { value: "PICKER", label: "Picker" }
      ];
    }

    if (isAdmin) {
      return [
        { value: "ADMIN", label: "Admin" },
        { value: "MANAGER", label: "Manager" },
        { value: "STAFF_GUDANG", label: "Staff" },
        { value: "PICKER", label: "Picker" }
      ];
    }

    if (isManager) {
      return [
        { value: "STAFF_GUDANG", label: "Staff" },
        { value: "PICKER", label: "Picker" }
      ];
    }

    return [];
  };

  const availableRoles = getAvailableRoles();

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">
            {mode === "admin" ? "Create New Account" : "Create your account"}
          </h1>
          <p className="text-muted-foreground text-sm text-balance">
            {mode === "admin" 
              ? "Fill in the form to register a new user in the system" 
              : "Fill in the form below to create your account"}
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            type="text"
            {...register("full_name")}
            placeholder="John Doe"
          />
          {errors.full_name && <p className="text-destructive text-xs">{errors.full_name.message}</p>}
        </Field>
        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input
            id="username"
            type="text"
            {...register("username")}
            placeholder="Username"
          />
          {errors.username && <p className="text-destructive text-xs">{errors.username.message}</p>}
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="m@example.com"
          />
          {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
        </Field>
        <Field>
          <FieldLabel htmlFor="role">Role</FieldLabel>

          <select
            id="role"
            {...register("role")}
            className="border rounded px-3 py-2 w-full bg-background"
          >
            <option value="" disabled>-- Choose Role --</option>
            {availableRoles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>

          {errors.role && <p className="text-destructive text-xs">{errors.role.message}</p>}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            {...register("password")}
            placeholder="********"
          />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
          {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            {...register("confirmPassword")}
            placeholder="********"
          />
          {errors.confirmPassword && <p className="text-destructive text-xs">{errors.confirmPassword.message}</p>}

          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field>
        <Field>
          <Button
            type="submit"
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting ? (
              <>
                <Spinner /> {mode === "admin" ? "Creating..." : "Signing up..."}
              </>
            ) : (
              mode === "admin" ? "Create Account" : "Sign Up"
            )}

          </Button>
        </Field>
        
        {mode === "public" && (
          <>
            <FieldSeparator>Or continue with</FieldSeparator>
            <Field>
              <FieldDescription className="px-6 text-center">
                Already have an account? <a href="/login" className="underline underline-offset-4 hover:text-primary">Sign in</a>
              </FieldDescription>
            </Field>
          </>
        )}
      </FieldGroup>
    </form>
  )
}
