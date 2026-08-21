import { useEffect, useState } from "react";
import usePublicAxios from "./usePublicAxios";
import { useQuery } from "@tanstack/react-query";



const useDistricts = () => {
    const [districtId, setDistrictid] = useState(1)


    const axiosPublic = usePublicAxios()








    //get districts data (local file: public/districts.json)
    const { data: districts = [] } = useQuery({
        queryKey: ['districs'],
        queryFn: async () => {
            const res = await fetch('/districts.json')
            return res.json()
        }
    })

    //get upuzilla data (local file: public/upazilas.json), filtered by selected district
    const { data: upuzzila = [], refetch } = useQuery({
        queryKey: ['upuzzila', districtId],
        queryFn: async () => {
            const res = await fetch('/upazilas.json')
            const all = await res.json()
            return all.filter(u => String(u.district_id) === String(districtId))
        }
    })




    // console.log(upuzzila);
    // get district id 
    const handleDistricts = (e, value) => {



        setDistrictid(value.district_id)
        refetch()
    }

    useEffect(() => {

        refetch()

        // fetch('districts.json')
        //     .then(res => res.json())
        //     .then(data => {

        //         setDistrict(data)
        //     })
    }, [districtId, refetch])

    // useEffect(() => {
    //     const getUpuzilla = async () => {
    //         const resUpuzilla = await fetch()
    //     }
    // }, [])



    return [districts, handleDistricts, upuzzila, refetch]
};

export default useDistricts;