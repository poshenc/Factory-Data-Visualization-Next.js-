import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

export interface GetUserQueryParams {
    userId: number | string
}

export const useGetAllUsersQuery = () => {
    return useQuery({
        queryKey: ['Users'],
        queryFn: () => {
            return axios.get<any[]>('api/users')
        }
    })
}

export const useGetUserByIdQuery = (params: GetUserQueryParams) => {
    return useQuery({
        queryKey: ['Users', params.userId],
        queryFn: () => {
            return axios.get<any>(`api/users/${params.userId}`)
        }
    })
}

export const useAddUserQuery = (name: String) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (name: String) => {
            return axios.post<any>('api/users', { name })
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['Users'] })
    })
}

export const useDeleteUserQuery = (params: GetUserQueryParams) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (params: GetUserQueryParams) => {
            return axios.delete<any>(`api/users${params.userId}`)
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['Users'] })
    })
}