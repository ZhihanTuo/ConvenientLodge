import React from 'react'

export default function CreateListing() {
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create Listing
      </h1>
      <form className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1' >
          {/* Listing name field */}
          <input 
            type='text' 
            placeholder='Name' 
            className='border p-3 rounded-lg' 
            id='name' 
            maxLength={128} 
            minLength={10} 
            required
          />
          {/* Listing description field*/}
          <textarea 
            type='text' 
            placeholder='Description' 
            className='border p-3 rounded-lg' 
            id='description' 
            required 
          />
          {/* Listing address field */}
          <input 
            type='text' 
            placeholder='Address' 
            className='border p-3 rounded-lg' 
            id='address' 
            required
          />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input 
                type='checkbox' 
                id='sale' 
                className='w-5' 
              />
              <span>For Sale</span>
            </div>
            <div className='flex gap-2'>
              <input 
                type='checkbox' 
                id='rent' 
                className='w-5' 
              />
              <span>For Rent</span>
            </div>
            <div className='flex gap-2'>
              <input 
                type='checkbox' 
                id='share' 
                className='w-5' 
              />
              <span>Shared</span>
            </div>
            <div className='flex gap-2'>
              <input 
                type='checkbox' 
                id='parking' 
                className='w-5' 
              />
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input 
                type='checkbox' 
                id='utilities' 
                className='w-5' 
              />
              <span>Utilities Included</span>
            </div>
            <div className='flex gap-2'>
              <input 
                type='checkbox' 
                id='pets' 
                className='w-5' 
              />
              <span>Pets</span>
            </div>
          </div>
          <div className='flex gap-6 flex-wrap'>
            <div className='flex items-center gap-2'> 
              <input type='number' id='bedooms' min='1' max='20' required className='p-3 border-gray-300 rounded-lg'/>
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'> 
              <input type='number' id='bathrooms' min='0.5' max='10' required className='p-3 border-gray-300 rounded-lg'/>
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'> 
              <input type='number' id='price' required className='p-3 border-gray-300 rounded-lg'/>
              <div className='flex flex-col items-center'>
                <p>Price</p>
                <span className='text-xs'>($ / month)</span>
              </div>
            </div>
            <div className='flex items-center gap-2'> 
              <input type='number' id='price' required className='p-3 border-gray-300 rounded-lg'/>
              <div className='flex flex-col items-center'>
                <p>Utiities</p>
                <span className='text-xs'>($ / month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>Images:
            <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
          </p>
          <div className='flex gap-4'>
            <input className='p-3 border border-gray-300 rounded w-full' type='file' id='images/*' multiple />
            <button className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80' >Upload</button>
          </div>
          <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>
        </div>
      </form>
    </main>
  )
}
