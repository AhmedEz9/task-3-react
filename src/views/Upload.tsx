import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useFile, useMedia } from '../hooks/apiHooks';
import useForm from '../hooks/formHooks';

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const { postFile } = useFile();
  const { postMedia } = useMedia();
  const navigate = useNavigate();
  const queryClient = useQueryClient(); 

  const initValues = { title: '', description: '' };

  const uploadMutation = useMutation({
    mutationFn: async (inputs: Record<string, string>) => {
      const token = localStorage.getItem('token');
      if (!file || !token) throw new Error('File or token missing');

      const fileResult = await postFile(file, token);
      return await postMedia(fileResult, inputs, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      alert('Upload successful!');
      navigate('/');
    },
    onError: (error: Error) => {
      alert(`Upload failed: ${error.message}`);
    },
  });

  const doUpload = (inputs: Record<string, string>) => {
    uploadMutation.mutate(inputs);
  };

  const { handleSubmit, handleInputChange } = useForm(doUpload, initValues);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6">Upload Media</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input name="title" type="text" onChange={handleInputChange} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea name="description" onChange={handleInputChange} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">File</label>
          <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="w-full" required />
        </div>
        <button 
          type="submit" 
          disabled={uploadMutation.isPending}
          className={`bg-blue-600 text-white py-2 rounded font-bold transition-colors ${uploadMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
        >
          {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default Upload;