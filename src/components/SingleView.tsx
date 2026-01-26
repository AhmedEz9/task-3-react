import {MediaItem} from '../types/DBTypes';

const SingleView = (props: {
  item: MediaItem;
  setSelectedItem: (item: MediaItem | undefined) => void;
}) => {
  const {item, setSelectedItem} = props;

  return (
    <>
      <dialog
        open
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          padding: '20px',
          background: 'white',
          border: '1px solid #ccc',
        }}
      >
        <h3>{item.title}</h3>
        
        {}
        {item.media_type.includes('video') ? (
          <video width="320" height="240" controls>
            <source src={item.filename} type={item.media_type} />
          </video>
        ) : (
          <img src={item.filename} alt={item.title} width="200" />
        )}

        <p>File size: {item.filesize}</p>
        <p>Type: {item.media_type}</p>
        
        <button
          onClick={() => {
            setSelectedItem(undefined); 
          }}
        >
          Close
        </button>
      </dialog>
    </>
  );
};

export default SingleView;