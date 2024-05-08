import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useState } from 'react'
import { app } from '../firebase';

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: []
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  /* Handles image submission */ 
  const handleImageSubmit = (e) => {
    // If there are 6 or less files to upload
    if (files.length > 0 && formData.imageUrls.length + files.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      // Add each one of the image files
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      // Get urls for each of the files after waiting for all of them
      Promise.all(promises).then((urls) => {
        // Concat new urls to list of existing ones
        setFormData({...formData, imageUrls: formData.imageUrls.concat(urls) });
        setImageUploadError(false);
        setUploading(false);
      }).catch((err) => {
          setImageUploadError('Upload failed (Each image must be <2MB)');
          setUploading(false);
      })
    } else {
      setImageUploadError('You can only upload a max of 6 images');
      setUploading(false);
    }
  };

  // Store image file as a promise 
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`)
        },
        (error) => {
          reject(error);
        },
        // Get the URL if no error
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      )
    })
  };

  /* Handles uploaded image deletion */
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      // Remove the image url that matches the index
      imageUrls: formData.imageUrls.filter((_, i) => i !== index)
    })
  }

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
              <input type='number' id='utilitiesPrice' required className='p-3 border-gray-300 rounded-lg'/>
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
            <input 
              onChange={(e)=>setFiles(e.target.files)} 
              className='p-3 border border-gray-300 rounded w-full' 
              type='file' 
              id='images/*' 
              multiple 
            />
            <button 
              type='button' 
              disabled={uploading}
              onClick={handleImageSubmit} 
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>{imageUploadError}</p>
          {
            formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
              <div key={url} className='flex justify-between p-3 border items-center'> 
                <img src={url} alt="listing image" className='w-20 h-20 object-contain rounded-lg'/>
                <button type='button' onClick={() => handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-65'>Delete</button>
              </div>
            ))
          }
          <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            Create Listing
          </button>
        </div>
      </form>
    </main>
  )
}
