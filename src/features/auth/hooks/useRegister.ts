import { registerUser } from '../api/authApi'
import { useMutation } from "@tanstack/react-query";
import { type RegisterPayload } from '../../../types/auth';

export const useRegister = () => {
    return useMutation({
        mutationFn: (data: RegisterPayload) => registerUser(data),
        onSuccess: (response) => {
            console.log("Registered successfully ", response)
        },
        onError: (error) => {
            console.error("Registeration Fail", error)
        }
    })
}
