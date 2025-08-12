import React, { useEffect, useState } from 'react'
import  CategoryBar from '../../../components/public/Home/CategoryBar'
import { Settings2 } from 'lucide-react'
import SearchVideoGrid from '../../../components/public/search/SearchVideoGrid'
import axiosInstance from '../../../axios/AxiosInstance'
import { useLocation, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const SearchResult = () => {
    const [searchParams] = useSearchParams();
    const [videos, setVideos] = useState([])
    
    // Get current search parameters
    const q = searchParams.get("q") || '';
    const type = searchParams.get("type") || '';

    const fetchData = async() => {
        try {
            let response = await axiosInstance.get('video/search/result', {
                params: { q, type }
            })
            
            if(response.data.success) {
                setVideos(response.data.data)
            } else {
                toast.error('Failed to fetch results')
            }
        } catch(error) {
            console.log(error);
            toast.error('An error occurred while searching')
        }
    }

    useEffect(() => {
        if(q) { // Only fetch if there's a query
            fetchData();
        }
    }, [q, type]) // Re-run when either q or type changes

    return (
        <section className='pt-5 w-full px-5 pr-10 bg-white text-black'>
            <div className='flex items-center justify-between w-full'>
                <CategoryBar categories={['All', "Videos", 'Unwatched', 'Watched', 'Recently Uploaded','Subscribed']}/>
                <div className='flex items-center gap-1'>
                    <span className='font-bold'>Filters</span> 
                    <Settings2 size={'20'} className="text-black"/>
                </div>
            </div>
            <SearchVideoGrid videos={videos}/>
        </section>
    )
}

export default SearchResult