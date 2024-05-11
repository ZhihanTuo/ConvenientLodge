import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import { useSelector } from 'react-redux';
import 'swiper/css/bundle';
import { FaBath, FaBed, FaCat, FaMapMarkerAlt, FaParking, FaShare } from 'react-icons/fa';
import { FaPersonCirclePlus, FaTrash } from 'react-icons/fa6'
import { TbArmchair2Off } from "react-icons/tb";
import { RiArmchairFill } from "react-icons/ri";
import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const {currentUser} = useSelector((state) => state.user);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json(); 
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    }
    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && <p className='text-center my-7 text-2xl'>Something went wrong</p>}
      {listing && !loading && !error && (
      <div>
        <Swiper navigation>
          {listing.imageUrls.map(url => <SwiperSlide key={url}>
            <div 
              className='h-[500px]' 
              style={{
                background: `url(${url}) center no-repeat`, 
                backgroundSize: 'cover'
              }}>
            </div>
          </SwiperSlide>)}  
        </Swiper>
        <div className='fixed top-[10%] right-[5%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
          <FaShare 
            className='text-slate-500' 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 2000);
            }}
          />
        </div>
        {copied && (
          <p className='fixed top-[25%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>Link copied!</p>
        )}
        <div className='flex flex-col max-w-4xl mx-auto p-3 my-5 gap-4'>
          <p className='text-3xl font-semibold'>
            {listing.name} - $
            {listing.price.toLocaleString('en-US')}
            {listing.type === 'rent' && ' / Month'}
            {listing.utilsIncluded ? '' : ` | Utilities - $${listing.utilitiesPrice.toLocaleString('en-US')}` }
          </p>
          <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
            <FaMapMarkerAlt className='text-green-700' />
            {listing.address}
          </p>
          <div className='flex gap-4'>
            <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
              {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
            </p>
          </div>
          <p className='text-slate-800'>
          <span className='font-semibold text-black'>Description - </span>
          {listing.description}
          </p>
          <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
            <li className='flex items-center gap-1 whitespace-nowrap'> 
              <FaBed className='text-lg'/>
              {listing.bedrooms > 1 ? `${listing.bedrooms} Beds ` : `${listing.bedrooms} Bed `} 
            </li>
            <li className='flex items-center gap-1 whitespace-nowrap'> 
              <FaBath className='text-lg'/>
              {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms ` : `${listing.bathrooms} Bathroom `} 
            </li>
            {listing.parking &&
              <li className='flex items-center gap-1 whitespace-nowrap'>
                <FaParking className='text-lg'/>
                Parking Available
              </li>
            }
            <li className='flex items-center gap-1 whitespace-nowrap'>
              {listing.furnished ? <RiArmchairFill className='text-lg'/> : <TbArmchair2Off className='text-lg'/>}
              {listing.furnished ? 'Furnished' : 'Unfurnished'} 
            </li>
            {listing.pets && 
              <li className='flex items-center gap-1 whitespace-nowrap'> 
                <FaCat className='text-lg'/>
                Pets Welcome
              </li>
            }
            {listing.shared && 
              <li className='flex items-center gap-1 whitespace-nowrap'> 
                <FaPersonCirclePlus className='text-lg'/>
                Shared
              </li>
            }
            {listing.utilsIncluded && 
              <li className='flex items-center gap-1 whitespace-nowrap'> 
                <FaTrash className='text-lg'/>
                Includes Utilities
              </li>
            }
          </ul>
          {currentUser && listing.userRef !== currentUser._id && !contact && (
            <button 
              onClick={() => setContact(true)}
              className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'>
            Contact
            </button>
          )}
          {contact && <Contact listing={listing}/>}
        </div>
      </div>
        )}
    </main>
  );
}
