// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import {
//   Field,
//   FieldDescription,
//   FieldGroup,
//   FieldLabel,
// } from "@/components/ui/field"
// import { Input } from "@/components/ui/input"

// export function LoginForm({
//   className,
//   ...props
// }: React.ComponentProps<"form">) {
//   return (
//     <form className={cn("flex flex-col gap-6", className)} {...props}>
//       <FieldGroup>
//         <div className="flex flex-col items-center gap-1 text-center">
//           <h1 className="text-2xl font-bold">Login to your account</h1>
//           <p className="text-muted-foreground text-sm text-balance">
//             Enter your email below to login to your account
//           </p>
//         </div>
//         <Field>
//           <FieldLabel htmlFor="email">Email</FieldLabel>
//           <Input id="email" type="email" placeholder="m@example.com" required />
//         </Field>
//         <Field>
//           <div className="flex items-center">
//             <FieldLabel htmlFor="password">Password</FieldLabel>
//             <a
//               href="#"
//               className="ml-auto text-sm underline-offset-4 hover:underline"
//             >
//               Forgot your password?
//             </a>
//           </div>
//           <Input id="password" type="password" required />
//         </Field>
//         <Field>
//           <Button 
//             variant="outline" 
//             type="submit"
//             className="hover:bg-black hover:text-white"
//             >
//             Login
//           </Button>
//         </Field>
//         <Field>
//           <FieldDescription className="text-center">
//             Don&apos;t have an account?{" "}
//             <a href="#" className="underline underline-offset-4">
//               Sign up
//             </a>
//           </FieldDescription>
//         </Field>
//       </FieldGroup>
//     </form>
//   )
// }

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useLogin } from "@/hooks/useLogin"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { register, handleSubmit, onSubmit, formState } = useLogin()

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm">
            Enter your email below to login
          </p>
        </div>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input
            {...register("email", { required: true })}
            type="email"
          />
        </Field>

        <Field>
          <FieldLabel>Password</FieldLabel>
          <Input
            {...register("password", { required: true })}
            required
            type="password"
          />
        </Field>

        <Button
          type="submit"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? "Logging in..." : "Login"}
        </Button>

        <FieldDescription className="text-center">
          Don&apos;t have an account?{" "}
          <a href="#" className="underline">
            Sign up
          </a>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
