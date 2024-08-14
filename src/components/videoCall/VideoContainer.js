import React from 'react';
import VideoStream from './VideoStream';

const VideoContainer = ({ localStream, remoteStream }) => {
  return (
    <div className="video-container">
      <VideoStream stream={localStream} muted width="300" height="200" />
      <VideoStream stream={remoteStream} width="300" height="200" />
    </div>
  );
};

export default VideoContainer;
