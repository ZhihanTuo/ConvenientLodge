import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';


export default function SignIn() {
  // formData is an object manipulated using setFormData
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData(
      {
        ...formData, // Keep the form data
        [e.target.id]: e.target.value, // Set the changing form's value 
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signin', // Use fetch to request api route 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }); 
      const data = await res.json();
      // If an error occurs
      if (data.success === false) { 
        setLoading(false);
        setError(data.message);
        return; 
      }
      setLoading(false); // Finished loading by this point
      // If no errors, set error to null and navigate user to home page 
      setError(null); 
      navigate('/');
    } catch(error) {
      setLoading(false);
      setError(error.message);
    }
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'> Sign In </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input 
          type="email" 
          placeholder='email' 
          className='border p-3 rounded-lg' 
          id='email' 
          onChange={handleChange} 
        />
        <input 
          type="password" 
          placeholder='password' 
          className='border p-3 rounded-lg' 
          id='password' 
          onChange={handleChange} 
        />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Sign In'}
        </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>} {/* Error message at bottom of page */}
    </div>
  )
}
