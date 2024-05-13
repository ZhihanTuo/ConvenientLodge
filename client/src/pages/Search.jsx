import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    utilsIncluded: false,
    pets: false,
    sort: 'created_at',
    order: 'desc'
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const petsFromUrl = urlParams.get('pets');
    const utilsIncludedFromUrl = urlParams.get('utilsIncluded');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');
    /* Change sidebardata if there is a change in search bar */
    if (
      searchTermFromUrl || 
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      petsFromUrl ||
      utilsIncludedFromUrl || 
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === true ? true : false,
        furnished: furnishedFromUrl === true ? true : false,
        pets: petsFromUrl === true ? true : false,
        utilsIncluded: utilsIncludedFromUrl === true ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc'
      });
    }
  // Gets listings that match search query and store in listings
  const fetchListings = async () => {
    setShowMore(false);
    setLoading(true);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    // Set show more to true if there are 10+ listings
    if (data.length > 9) {
      setShowMore(true);
    } else { setShowMore(false); }
    setListings(data);
    setLoading(false);
  };
  // fetch listings
  fetchListings(); 
}, [location.search]);

  /* Handles changes to sideabr filters */
  const handleChange = (e) => {
    // Handles type changes
    if (e.target.id === 'sale' || e.target.id === 'rent' || e.target.id === 'shared' || e.target.id === 'all') {
      setSidebardata({...sidebardata, type: e.target.id});
    }
    // Handles search term changes
    if (e.target.id === 'searchTerm') {
      setSidebardata({...sidebardata, searchTerm: e.target.value});
    }
    // Handles accomodations changes
    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'pets' || e.target.id === 'utilsIncluded') {
      setSidebardata({...sidebardata, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false}); // Also includes 'true' string
    }
    // Handles sorting order changes
    if (e.target.id === 'sort_order') {
      // Separate sort and order
      // Default: sort by recent, order by descending
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebardata({...sidebardata, sort, order});
    }
  };
  /* Handles search submission */
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);  
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('pets', sidebardata.pets);
    urlParams.set('utilsIncluded', sidebardata.utilsIncluded);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    // searchQuery string of all the search terms
    const searchQuery = urlParams.toString();
    // Direct user to the search url with queries
    navigate(`/search?${searchQuery}`)
  }

  const onShowMoreClick = async() => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get${searchQuery}`);
    const data = await res.json();
    // No need to display show more if there are less than 10 listings
    if (data.length < 10) {
      setShowMore(false);
    }
    // Add new listings to previous listings
    setListings([...listings, ...data]);
  }

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-6 border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'> 
          <div className='flex items-center gap-2'> 
            <label className='whitespace-nowrap font-semibold'>Search term:</label>
            <input 
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
              value={sidebardata.searchTerm}
              onChange={handleChange}  
            />
          </div>
          {/* Types of listings */}
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Type:</label>
            <div className='flex gap-2'>
              <input type='checkbox' id='all' className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === 'all'}
              />
              <span>All</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='rent' className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === 'rent'}
              />
              <span>For Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='sale' className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === 'sale'}
              />
              <span>For Sale</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='shared' className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === 'shared'}
              />
              <span>Shared</span>
            </div>
          </div>
          {/* Accomodations */}
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Accomodations:</label>
            <div className='flex gap-2'>
              <input type='checkbox' id='parking' className='w-5'
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='furnished' className='w-5'
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='pets' className='w-5'
                onChange={handleChange}
                checked={sidebardata.pets}
              />
              <span>Pet Friendly</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='utilsIncluded' className='w-5'
                onChange={handleChange}
                checked={sidebardata.utilsIncluded}
              />
              <span>Includes Utilities</span>
            </div>
          </div>
          {/* Sorting options */}
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Sort:</label>
            <select id='sort_order' className='border rounded-lg p-2'
              onChange={handleChange}
              defaultValue={'created_at_desc'}
            >
              <option value='price_desc'>Price high to low</option>
              <option value='price_asc'>Price low to high</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>
          {/* Search button */}
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Search</button>
        </form>
      </div>
      {/* Results list */}
      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-4'>Listing Results:</h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && listings.length === 0 && (
            <p className='text-xl text-slate-700'>No listings found</p>
          )}
          {loading && (
            <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>
          )}
          {!loading && listings && listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
            {/* Show more button */}
            {showMore && (
              <button onClick={() =>{ onShowMoreClick(); }} className='text-green-700 hover:underline p-7 text-center w-full'>         
                Show more
              </button>
            )}
        </div>
      </div>
    </div>
  )
}
