import { useQuery } from '@tanstack/react-query';

import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useSingleUserData = () => {
    const { user, loading } = useAuth()
    const axiosSecure = useAxiosSecure()

    const { data: userInfo, isPending: isUserLoading, refetch } = useQuery({
        queryKey: ['user', user?.email],
        // Skip the request entirely when nobody is logged in (e.g. NavBar on
        // public pages) instead of firing a call for a non-existent email.
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/user/${user?.email}`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            // console.log(res.data);
            return res.data;
        }
    })

    return [userInfo, isUserLoading, refetch]
};

export default useSingleUserData;