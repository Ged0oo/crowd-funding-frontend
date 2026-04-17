import { useLogin } from '../hooks/useLogin';
import { useForm, type SubmitHandler } from "react-hook-form";
import { type LoginPayload } from '../../../types/auth';
import { useNavigate } from 'react-router-dom';
import Input from '../../../shared/components/ui/Input';
import Button from '../../../shared/components/ui/Button';

const LoginForm = () => {
  const {register, handleSubmit, formState: { errors }} = useForm<LoginPayload>()
  const {mutate: submitLogin, isPending, isError} = useLogin();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginPayload> = (data) => {
    console.log(data);
    submitLogin(data, {
      onSuccess: () => {
        alert(`logged in  successfully`);
        navigate('/');
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
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
          type="password"
          placeholder="Password"
          {...register("password", { 
            required: "Password is required", 
            minLength: { value: 8, message: "Must be at least 8 characters" } 
          })}
        />
        {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
      </div>
      {isError && (
          <p className="text-red-500 text-sm sm:col-span-2 font-semibold">
            
          </p>
        )}
      <Button 
        type="submit" 
        className="sm:col-span-2 mt-2 disabled:opacity-70 flex justify-center"
        disabled={isPending}
      >
        {isPending ? "Logging..." : "Login"}
      </Button>
    </form>

  )
}

export default LoginForm