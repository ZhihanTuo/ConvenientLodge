import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className='bg-slate-200 shadow-md'>
      {/* Site name */}
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        {/* Link to home page */}
        <Link to='/'>
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
          <span className='text-slate-400'>Convenient</span>
          <span className='text-slate-500'>Lodge</span>
        </h1>
        </Link>
        {/* Search Bar */}
        <form className='bg-slate-100 p-3 rounded-lg flex items-center'> 
          <input 
            type="text" 
            placeholder='Search...' 
            className='bg-transparent focus:outline-non w-24 sm:w-64'
          />
          <FaSearch className='text-slate-500' />
        </form>
        {/* Home, About, and Sign in buttons*/}
        <ul className='flex gap-4'>
          <Link to='/'>
            <li className='hidden sm:inline text-slate-500 hover:underline'>Home</li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline text-slate-500 hover:underline'>About</li>
          </Link>
          <Link to='/sign-in'>
            <li className='text-slate-500 hover:underline'>Sign in</li>
          </Link>
        </ul>
      </div>
    </header>
  )
}
