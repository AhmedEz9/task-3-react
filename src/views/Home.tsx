import MediaRow from '../components/MediaRow';
import { useMedia } from '../hooks/apiHooks';

const Home = () => {
  const { mediaArray, error, isLoading } = useMedia();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl font-semibold text-blue-500 animate-pulse">Loading media items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md m-4">
        <p className="font-bold">Error loading media:</p>
        <p>{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Explore Media</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="p-3">Thumbnail</th>
              <th className="p-3">Owner</th>
              <th className="p-3">Title</th>
              <th className="p-3">Description</th>
              <th className="p-3">Created</th>
              <th className="p-3">Size</th>
              <th className="p-3">Type</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mediaArray?.map((item) => (
              <MediaRow key={item.media_id} item={item} />
            ))}
          </tbody>
        </table>
      </div>
      
      {mediaArray?.length === 0 && (
        <p className="text-center text-gray-500 mt-10 text-lg">No media found. Be the first to upload!</p>
      )}
    </div>
  );
};

export default Home;