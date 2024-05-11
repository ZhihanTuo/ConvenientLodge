import React from 'react'

export default function Search() {
  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-6 border-b-2 md:border-r-2 md:min-h-screen'>
        <form className='flex flex-col gap-8'> 
          <div className='flex items-center gap-2'> 
            <label className='whitespace-nowrap font-semibold'>Search term:</label>
            <input 
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
            />
          </div>
          {/* Types of listings */}
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Type:</label>
            <div className='flex gap-2'>
              <input type='checkbox' id='all' className='w-5'/>
              <span>All</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='rent' className='w-5'/>
              <span>For Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='sale' className='w-5'/>
              <span>For Sale</span>
            </div>
          </div>
          {/* Accomodations */}
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Accomodations:</label>
            <div className='flex gap-2'>
              <input type='checkbox' id='parking' className='w-5'/>
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='furnished' className='w-5'/>
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='pets' className='w-5'/>
              <span>Pet Friendly</span>
            </div>
          </div>
          {/* Sorting options */}
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Sort:</label>
            <select id='sort_order' className='border rounded-lg p-2'>
              <option>Price high to low</option>
              <option>Price low to high</option>
              <option>Latest</option>
              <option>Oldest</option>
            </select>
          </div>
          {/* Search button */}
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Search</button>
        </form>
      </div>
      {/* Results list */}
      <div className=''>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-4'>Listing Results:</h1>
      </div>
    </div>
  )
}
