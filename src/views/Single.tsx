import {useLocation, useNavigate} from 'react-router';
import {MediaItem} from '../types/DBTypes';

const Single = () => {
  const {state} = useLocation();
  const navigate = useNavigate();

  const item: MediaItem = state?.item;

  if (!item) {
    return <p>No item selected.</p>;
  }

  return (
    <div>
      {}
      <h3>{item.title}</h3>
      
      {item.media_type.includes('video') ? (
        <video width="640" height="480" controls>
          <source src={item.filename} type={item.media_type} />
        </video>
      ) : (
        <img src={item.filename} alt={item.title} width="400" />
      )}

      <p>File size: {item.filesize}</p>
      <p>Type: {item.media_type}</p>
      <p>Created: {new Date(item.created_at).toLocaleString('fi-FI')}</p>

      {}
      <button 
        onClick={() => navigate(-1)}
        style={{marginTop: '20px', padding: '10px 20px'}}
      >
        Go Back
      </button>
    </div>
  );
};

export default Single;