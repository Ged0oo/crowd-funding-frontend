import { registerUser } from '../api/authApi'
import { useMutation } from "@tanstack/react-query";


export const useRegister = () => {
    return useMutation({
        mutationFn: (data: any) => registerUser(data),
        onSuccess: (response) => {
            console.log("Registered successfully ", response)
        },
        onError: (error) => {
            console.error("Registeration Fail", error)
        }
    })
}
