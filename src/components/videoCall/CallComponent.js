// components/CallComponent.js
import React, { useState, useRef, useEffect } from 'react';
import Peer from 'peerjs';
import '../css/videocall.css'


// utils/idGenerator.js
export function generatePeerId() {
  //const id = Math.random().toString().slice(2, 18); // Generate a 16-digit number
  //return id.replace(/(\d{4})(?=\d)/g, '$1-'); // Add hyphens every 4 digits
  return Math.random().toString().slice(2, 18); // Generate a 16-digit number
}

const CallComponent = ({ showMessage }) => {
  const [userId, setUserId] = useState('');
  const [remoteUserId, setRemoteUserId] = useState(Array(4).fill(''));
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callType, setCallType] = useState('video'); // 'video' or 'audio'
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const inputRefs = useRef([]);

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const PORT = process.env.REACT_APP_PORT;
  const hostPath = process.env.REACT_APP_API_BASE_URL_PEER;
  




  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 4) {
      const updatedValue = [...remoteUserId];
      updatedValue[index] = value;
      setRemoteUserId(updatedValue);

      if (value.length === 4 && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && remoteUserId[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };





  useEffect(() => {

    // Generate a human-readable ID
    const id = generatePeerId();

    console.log("vedio id",id, "PORT",PORT)
    // Initialize PeerJS
    peerRef.current = new Peer(id, {
      host: hostPath,
      //port: PORT,   // this only can use in localhost
      path: '/api/videocalls/userId',
      secure: true, //false for localhost
    });

    peerRef.current.on('open', (id) => {
      setUserId(id);
    });

    peerRef.current.on('call', (call) => {
      console.log('Receiving call from:', call.peer);
      call.answer(localStream);
      call.on('stream', (stream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
        setRemoteStream(stream);
      });
    });



    navigator.mediaDevices.getUserMedia({
      video: callType === 'video',
      audio: callType === 'video',
    })
    .then(stream => {
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    })
    .catch(error => {
      console.error('Error accessing media devices.', error);
      showMessage('Error accessing media devices.');
    });

    // Cleanup on unmount
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, [callType]);

  const callUser = () => {

    let formattedUserId = parseInt(remoteUserId.join(''), 10) // Converts to 1234
    formattedUserId =formattedUserId.toString().trim(); 
    const isValidId = formattedUserId.length === 16 && !isNaN(formattedUserId) && formattedUserId.match(/^\d{16}$/);

    if (isValidId) {
      console.log('Calling user with ID:', formattedUserId);

       // Log the call initiation on the server
       
    fetch(`${BASE_URL}/videocalls/userId/log`, { // Make sure this endpoint exists on your server
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: formattedUserId, action: 'call_initiated' }),
    });

      const call = peerRef.current.call(formattedUserId, localStream);
      call.on('stream', (stream) => {
        setRemoteStream(stream);
      });
      call.on('close', () => {
        setRemoteStream(null); // Optionally clear remote stream when call ends
      });
      call.on('error', (error) => {
        showMessage(`Call error: ${error.message}`);
      });

    } else {
      showMessage('Please enter a remote Remote ID.');
    }
  };

  const formatPeerId = (id) => {
    if (!id) return '';
    // Split the ID into chunks of 4 characters and join with '-'
    const formattedId = id.match(/.{1,4}/g).join('-');

    // Create an array of elements to be rendered with hyphens
    return formattedId.split('-').map((chunk, index) => (
      <React.Fragment key={index}>
        <span className="peer-id-box">
          {chunk}
        </span>
        {index < formattedId.split('-').length - 1 && <span className="peer-id-separator">-</span>}
      </React.Fragment>
    ));
  };



  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">
        {callType.charAt(0).toUpperCase() + callType.slice(1)} Call
      </h1>
      <div className="mb-3">
        <div className="peer-id-container">
          <label className="form-label peer-id-label">Your ID:</label>
          <div className="peer-id-boxes">
            {formatPeerId(userId)}
          </div>
        </div>
        <br />
        <label className="form-label peer-id-label">Enter Remote ID:</label>
        <div className="d-flex justify-content-center mb-3">
          {remoteUserId.map((value, index) => (
            <input
              key={index}
              type="text"
              className="form-control mx-1 text-center peer-id-input"
              style={{width: '8%'}}
              value={value}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              maxLength="4"
            />
          ))}
        </div>
        <div className="container m-2">
        <button 
        style={{marginLeft: '40%'}}
        className="btn btn-primary connect-now" onClick={callUser}>
          Connect Now
        </button>
        </div>
       
      </div>
      <div className="video-container d-flex justify-content-center mb-4">
        {callType === 'video' && (
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="me-2 border border-primary"
            style={{ width: '100%', maxWidth: '300px', height: 'auto' }}
          />
        )}
        {callType === 'video' && (
          <video
            ref={remoteVideoRef}
            autoPlay
            className="border border-secondary"
            style={{ width: '100%', maxWidth: '300px', height: 'auto' }}
          />
        )}
      </div>
      <button
        className="btn btn-secondary"
        onClick={() => setCallType(callType === 'video' ? 'audio' : 'video')}
      >
        Switch to {callType === 'video' ? 'Audio' : 'Video'} Call
      </button>
    </div>
  );
};

export default CallComponent;
