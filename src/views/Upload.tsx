import { useState } from 'react';
import { useNavigate } from 'react-router';
import useForm from '../hooks/formHooks';
import { useFile, useMedia } from '../hooks/apiHooks'; 

const Upload = () => {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();
  
  // Bring in the API functions
  const { postFile } = useFile();
  const { postMedia } = useMedia();

  const initValues = {
    title: '',
    description: '',
  };

  const doUpload = async (formInputs: Record<string, string>) => {
    setUploading(true);
    try {
      // 1. Grab the user's token from memory
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found. Are you logged in?');
      if (!file) throw new Error('No file selected.');

      console.log('1. Uploading the actual file to the file server...');
      const fileResult = await postFile(file, token);
      console.log('File server response:', fileResult);

      console.log('2. Linking the file to your title/description in the database...');
      const mediaResult = await postMedia(fileResult, formInputs, token);
      console.log('Database response:', mediaResult);

      // If we make it here, it was a massive success!
      alert('Upload successful!');
      navigate('/');
    } catch (e) {
      console.error('Upload error:', (e as Error).message);
      alert('Upload failed. Check the console for details.');
    } finally {
      // Whether it succeeded or failed, turn off the loading text
      setUploading(false);
    }
  };

  const { inputs, handleInputChange, handleSubmit } = useForm(doUpload, initValues);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <>
      <h2>Upload Media</h2>
      {uploading && <p style={{ color: 'blue', fontWeight: 'bold' }}>Uploading... Please wait.</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            name="title"
            type="text"
            id="title"
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            rows={5}
            id="description"
            onChange={handleInputChange}
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="file">File</label>
          <input
            name="file"
            type="file"
            id="file"
            accept="image/*, video/*"
            onChange={handleFileChange}
          />
        </div>
        
        <div style={{ margin: '15px 0' }}>
          <img
            src={
              file
                ? URL.createObjectURL(file)
                : 'https://placehold.co/320x240?text=Choose+image'
            }
            alt="preview"
            width="200"
            style={{ border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        
        <button
          type="submit"
          disabled={!file || inputs.title.length < 3}
        >
          Upload
        </button>
      </form>
    </>
  );
};

export default Upload;