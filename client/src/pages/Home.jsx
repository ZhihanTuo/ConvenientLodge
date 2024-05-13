import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [sharedListings, setSharedListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    // Fetch sale listings and calls fetchRentListings
    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    // Fetch rent listings and calls fetchSharedListings
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSharedListings();
      } catch (error) {
        console.log(error);
      }
    };
    // Fetch shared listings
    const fetchSharedListings = async () => {
      try {
        const res = await fetch('/api/listing/get?shared=true&limit=4');
        const data = await res.json();
        setSharedListings(data);
      } catch (error) {
        console.log(error);
      }
    }
    /* Fetch sale, rent, and shared listings consecutively */
    fetchSaleListings();
  }, []);

  return (
    <div>
      {/* Page Intro */}
        <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto '>
          <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>Find your next <span className='text-slate-500'>home</span></h1>
          <div className='text-gray-400 text-xs sm:text-sm'>
            Convenience Lodging is the premier tool to find your next perfect place to live.
            <br/>
            Featuring a wide range of properties available nationwide.
          </div>
          <Link to={'/search'} className='text-lg sm:text-lg text-[#A99985] font-bold hover:underline'>
            Get Started...
          </Link>
        </div>

      {/* Swiper */}
      <Swiper navigation>
        {saleListings && saleListings.length > 0 && saleListings.map((listing) => (
          <SwiperSlide>
            <div style={{background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover'}} className='h-[550px]' key={listing._id}></div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Listing results */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {saleListings && saleListings.length > 0 && (
            <div>
              <div className='my-3'>
                <h2 className='text-2xl font-semibold text-slate-600'>Recent For Sale Listings</h2>
                <Link className='text-md text-[#A99985] hover:underline' to={'/search?type=sale'}>
                  Show more
                </Link>
              </div>
              <div className='flex flex-wrap gap-4'>
                {saleListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id}/>
                ))}
              </div>
            </div>
          )}
        {rentListings && rentListings.length > 0 && (
            <div>
              <div className='my-3'>
                <h2 className='text-2xl font-semibold text-slate-600'>Recent For Rent Listings</h2>
                <Link className='text-md text-[#A99985] hover:underline' to={'/search?type=rent'}>
                  Show more
                </Link>
              </div>
              <div className='flex flex-wrap gap-4'>
                {rentListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id}/>
                ))}
              </div>
            </div>
          )}
        {sharedListings && sharedListings.length > 0 && (
            <div>
              <div className='my-3'>
                <h2 className='text-2xl font-semibold text-slate-600'>Recent Shared Listings</h2>
                <Link className='text-md text-[#A99985] hover:underline' to={'/search?shared=true'}>
                  Show more
                </Link>
              </div>
              <div className='flex flex-wrap gap-4'>
                {sharedListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id}/>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  )
}
