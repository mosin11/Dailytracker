import React, { useState } from 'react';

const NoteItem = ({ title, description, date, tag,deleteNotes,editNotes }) => {
  // Format date to a more readable format
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  const [showFullTitle, setShowFullTitle] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  const toggleTitle = () => {
    setShowFullTitle(!showFullTitle);
  };

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

  return (
    <div className='my-3'>
      <div
        className="card h-100"
        style={{ background: 'linear-gradient(to bottom, #19f5ea, #feb47b)' }}
      >
        <h5
          className="card-header"
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {formattedDate}
        </h5>
        <div
          className="card-body d-flex flex-column"
          style={{ background: 'linear-gradient(to bottom, #19f5ea, #feb47b)' }}
        >
          <h5
            className="card-title"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: showFullTitle ? 'normal' : 'nowrap',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: showFullTitle ? 'none' : 1,
            }}
          >
            {title}
          </h5>
          {title.length > 500 && (
            <span
              onClick={toggleTitle}
              className="btn btn-secondary mt-2"
              style={{ alignSelf: 'flex-start' }}
            >
              {showFullTitle ? 'Show More' : 'Show Less'}
            </span>
          )}
          <p
            className="card-text flex-grow-1"
            style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                
                whiteSpace: showFullText ? 'normal' : 'nowrap',
                transition: 'max-height 0.3s ease',
              }}
          >
            {description}
          </p>
          {description.length > 50 && (
            <a
            href="."
              onClick={toggleText}
              className="mt-2 "
              style={{ alignSelf: 'flex-start', textDecoration: 'none' }}
            >
              {showFullText ? 'Show More' : 'Show Less'}
            </a>
          )}
           <div className="position-absolute top-0 end-0 p-2">
          <span
            onClick={editNotes}
            className="badge bg-primary text-white rounded-circle p-2"
            style={{ cursor: 'pointer', marginRight: '5px' }}
            title="Edit"
          >
            <i className="bi bi-pencil"></i>
          </span>
          <span
            onClick={deleteNotes}
            className="badge bg-danger text-white rounded-circle p-2"
            style={{ cursor: 'pointer' }}
            title="Delete"
          >
            <i className="bi bi-trash"></i>
          </span>
        </div>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
