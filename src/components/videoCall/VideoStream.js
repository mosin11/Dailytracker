import React, { useEffect, useRef } from 'react';

const VideoStream = ({ stream, muted, ...props }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return <video ref={videoRef} autoPlay muted={muted} {...props} />;
};

export default VideoStream;
