import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/ui/Input";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useRegister } from "../hooks/useRegister";
import type { RegisterPayload } from "../../../types/auth";
import { useNavigate } from "react-router-dom";


const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterPayload>();
  const { mutate: submitRegistration, isPending, isError } = useRegister();
  const currentPassword = watch("password");
  const onSubmit: SubmitHandler<RegisterPayload> = (data) => {
    console.log(data);
    submitRegistration(data, {
      onSuccess: (response) => {
        alert(`Account created successfuly please check your email!`);

        navigate("/verify-otp", {
          state: {email: response.data.User.email}
        });
      },
      onError: (error) => {
        console.error("Failed to register:", error);
      }
    })};

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
        
        {/* --- Personal Details --- */}
        <div>
          <Input 
            placeholder="First name" 
            {...register("first_name", { required: "First name is required" })} 
          />
          {errors.first_name && <span className="text-red-500 text-xs">{errors.first_name.message}</span>}
        </div>

        <div>
          <Input 
            placeholder="Last name" 
            {...register("last_name", { required: "Last name is required" })} 
          />
          {errors.last_name && <span className="text-red-500 text-xs">{errors.last_name.message}</span>}
        </div>
        
        <div className="sm:col-span-2">
          <Input 
            placeholder="Username" 
            {...register("username", { required: "Username is required" })}
          />
          {errors.username && <span className="text-red-500 text-xs">{errors.username.message}</span>}
        </div>

        <div className="sm:col-span-2">
          <Input 
            type="email" 
            placeholder="Email" 
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
          />
          {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
        </div>

        <div className="sm:col-span-2">
          <Input 
            placeholder="Phone Number" 
            {...register("phone_number", { 
              required: "Phone number is required",
              pattern: {
                  value: /^01[0-25][0-9]{8}$/, 
                  message: "Must be a valid Egyptian number (e.g., 01012345678)"
              }
          })}
          />
          {errors.phone_number && <span className="text-red-500 text-xs">{errors.phone_number.message}</span>}
        </div>

        <div>
          <Input 
            type="date" 
            {...register("birthdate", { required: "Birthdate is required" })}
          />
          {errors.birthdate && <span className="text-red-500 text-xs">{errors.birthdate.message}</span>}
        </div>

        <div>
          <Input 
            placeholder="Country" 
            {...register("country")}
          />
        </div>

        <div className="sm:col-span-2">
          <Input 
            placeholder="Profile Picture URL (Optional)" 
            {...register("profile_picture")}
          />
        </div>

        <div className="sm:col-span-2">
          <Input 
            placeholder="Facebook Profile Link (Optional)" 
            {...register("facebook_profile", {
            pattern: {
                value: /^(https?:\/\/)?(www\.)?facebook\.com\/.*$/i,
                message: "Please enter a valid Facebook URL"
            }
            })}
          />
          {errors.facebook_profile && <span className="text-red-500 text-xs">{errors.facebook_profile.message}</span>}
        </div>

        <div className="sm:col-span-2">
          <Input
            type="password"
            placeholder="Password"
            {...register("password", { 
              required: "Password is required", 
              minLength: { value: 8, message: "Must be at least 8 characters" } 
            })}
          />
          {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
        </div>

        <div className="sm:col-span-2">
          <Input
            type="password"
            placeholder="Confirm password"
            {...register("confirm_password", { 
              required: "Please confirm your password",
              validate: (value) => value === currentPassword || "Passwords do not match!"
            })}
          />
          {errors.confirm_password && <span className="text-red-500 text-xs">{errors.confirm_password.message}</span>}
        </div>

        {isError && (
          <p className="text-red-500 text-sm sm:col-span-2 font-semibold">
            Registration failed. Please check your details and try again.
          </p>
        )}

        <Button 
          type="submit" 
          className="sm:col-span-2 mt-2 disabled:opacity-70 flex justify-center"
          disabled={isPending}
        >
          {isPending ? "Creating Account..." : "Create Account"}
        </Button>
        
      </form>
  );
}

export default RegisterForm

function watch(arg0: string) {
    throw new Error("Function not implemented.");
}
