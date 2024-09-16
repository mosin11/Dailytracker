import React, { useState } from 'react';


const PlanItem = ({ title, description, date, tag, deletePlan, editPlan }) => {
  // Format date to a more readable format
  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  const [showFullTitle, setShowFullTitle] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  const toggleTitle = () => {
    setShowFullTitle(!showFullTitle);
  };

  const toggleText = (event) => {
    event.preventDefault();
    setShowFullText(!showFullText);
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diff = now - postDate; // Difference in milliseconds

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className='my-3'>
      <div
        className="card h-100"
        style={{ background: 'linear-gradient(to bottom, #19f5ea, #feb47b)' }}
      ><div>

          <h5
            className="card-header"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </h5>
          <blockquote className="blockquote mb-0">
            <p className="mb-0">{formattedDate}</p>
          </blockquote>
        </div>

        <div
          className="card-body d-flex flex-column"
          style={{ background: 'linear-gradient(to bottom, #19f5ea, #feb47b)' }}
        >
          {/* <h5
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
          </h5> */}
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
              className="mt-2"
              style={{ alignSelf: 'flex-start', textDecoration: 'none' }}
            >
              {showFullText ? 'Show Less' : 'Show More'}
            </a>
          )}
          <div className="position-absolute top-0 end-0 p-2">
            <span
              onClick={editPlan}
              className="badge bg-primary text-white rounded-circle p-2"
              style={{ cursor: 'pointer', marginRight: '5px' }}
              title="Edit"
            >
              <i className="bi bi-pencil"></i>
            </span>
            <span
              onClick={deletePlan}
              className="badge bg-danger text-white rounded-circle p-2"
              style={{ cursor: 'pointer' }}
              title="Delete"
            >
              <i className="bi bi-trash"></i>
            </span>
          </div>
        </div>
        <div className="card-footer text-muted d-flex justify-content-between align-items-center">
          <span>{formatTimeAgo(date)}</span>
          <span
            className="position-absolute top-0 start-20 translate-middle badge rounded-pill bg-danger"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            {tag}
            <span className="visually-hidden">unread messages</span>
          </span>
        </div>

      </div>
    </div>
  );
};

export default PlanItem;
