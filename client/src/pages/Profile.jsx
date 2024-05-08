import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserFailure } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector(state => state.user);
  const [file, setFile] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  /* Upload file to be used as the profile avatar and handles any errors that occur */ 
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name; // Safeguard against user adding 2 files of same name 
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // Gets percentage of upload 
        setFilePercent(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => setFormData({ ...formData, avatar: downloadURL }));
      }
    );
  };

  // Change/update formData (username, email, password, avatar)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  /* Submit function */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    try {
      // Start user update
      dispatch(updateUserStart());
      // Requests api route of the user to be updated
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        }, body: JSON.stringify(formData)
      });
      // Save into data as a json
      const data = await res.json();
      // If failed, pass error message 
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      // Passed failure check, pass data to updateUserSuccess
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  /* Delete user function */
  const handleDeleteUser = async() => {
    try {
      // Start user delete
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      // Save into data as json
      const data = await res.json();
      if (data.success === false) {
        // If failed, pass error message
        dispatch(deleteUserFailure(data.message));
        return;
      }
      // Passed failure check, pass data to deleteUserSuccess
      dispatch(deleteUserSuccess(data));  
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  /* SignOut functions */
  const handleSignout = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure());
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      {/* Submit */}
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* Profile icon change */}
        <input onChange={(e) => setFile(e.target.files[0])} 
          type='file' ref={fileRef} 
          hidden 
          accept='image/*'
        />
        {/* Profile icon */}
        <img onClick={()=>fileRef.current.click()} 
          src={formData.avatar || currentUser.avatar} 
          alt="Profile" 
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        {/* Error message */}
        <p className='text-sm self-center'>
          {/* If fileUploadError, generate error message */}
          {(fileUploadError) ? (<span className='text-red-700'>Image Upload Error &#40;Must be &lt;2MB&#41;</span>
          // Else check upload progress, display progress if still uploading
          ) : (filePercent > 0 && filePercent < 100) ? (
            <span>{`Uploading ${filePercent}%`}</span>
            // Else check file is uploaded successfully: generate success message if so, empty string otherwise 
            // TODO: Omit the initial successful upload message when an error occurs
          ) : (!fileUploadError) && (filePercent === 100) ? (
            <span className='text-green-700'>Image Uploaded Successfully!</span>
          ) : ( // Else empty string
            ''
          )}
        </p>
        {/* Username */}
        <input 
          type='text' 
          placeholder='Username' 
          id='username'
          defaultValue={currentUser.username}
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        {/* Email */}
        <input 
          type='email' 
          placeholder='Email' 
          id='email' 
          defaultValue={currentUser.email}
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        {/* Password */}
        <input 
          type='password' 
          placeholder='Password' 
          id='password' 
          className='border p-3 rounded-lg'
        />
        {/* Update button */}
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={"/create-listing"}>
          Create Listing
        </Link>
      </form>
      {/* Sign Out & Delete account options */}
      <div className="flex justify-between mt-5">
        <span onClick={handleSignout} className='text-red-600 cursor-pointer'>Sign Out</span>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
      </div>
      {/* Update error/success message  */}
      <p className='text-red-700 mt-5'>{error ? error : ''} </p>
      <p className='text-green-700 mt-5'>{updateSuccess ? 'Profile updated successfully!' : ''} </p>
    </div>
  )
}
