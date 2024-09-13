// components/CallComponent.js
import React, { useState, useRef, useEffect } from 'react';
import Peer from 'peerjs';
import '../css/videocall.css'




const CallComponent = ({ showMessage }) => {
  // const [userId, setUserId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // New state for phone number

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callType, setCallType] = useState('video'); // 'video' or 'audio'
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const [ongoingCall, setOngoingCall] = useState(null); // Track the ongoing call
  const [incomingCall, setIncomingCall] = useState(null); // For managing incoming calls
  const [remoteUserPhoneNumber, setRemoteUserPhoneNumber] = useState('');
  const [callButtonsDisabled, setCallButtonsDisabled] = useState(false);


  const incomingCallAudioRef = useRef(new Audio('Incoming_Call.mp3')); // Add your sound file path here

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const PORT = process.env.REACT_APP_PORT;
  const hostPath = process.env.REACT_APP_API_BASE_URL_PEER;


 


  // utils/idGenerator.js
  const getUserPhoneNumber = async () => {
    const token = localStorage.getItem('authToken');
    //const id = Math.random().toString().slice(2, 18); // Generate a 16-digit number
    //return id.replace(/(\d{4})(?=\d)/g, '$1-'); // Add hyphens every 4 digits

    const response = await fetch(`${BASE_URL}/users/auth/authToken`, { // Make sure this endpoint exists on your server
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response}`);
    }
    const data = await response.json();
    console.log("response from call compoments data", data);
    setPhoneNumber(data.phoneNumber);
    return data.phoneNumber// Generate a 16-digit number
  }



  const handlePhoneNumberChange = (e) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 10) { // Assuming a 10-digit phone number
      setRemoteUserPhoneNumber(value);
    }
  };


  // const handleChange = (e, index) => {
  //   const { value } = e.target;
  //   if (/^\d*$/.test(value) && value.length <= 4) {
  //     const updatedValue = [...remoteUserId];
  //     updatedValue[index] = value;
  //     setRemoteUserId(updatedValue);

  //     if (value.length === 4 && index < 3) {
  //       inputRefs.current[index + 1].focus();
  //     }
  //   }
  // };

  // const handleKeyDown = (e, index) => {
  //   if (e.key === 'Backspace' && remoteUserId[index] === '' && index > 0) {
  //     inputRefs.current[index - 1].focus();
  //   }
  // };

  const clearRemoteUserId = () => {
    setRemoteUserPhoneNumber('');
    // setRemoteUserId(Array(4).fill('')); // Clear the remote user ID inputs
    // inputRefs.current[0].focus(); // Set focus to the first input field
  };

  useEffect(() => {
    // Generate a human-readable ID
    initializePhoneId();
    // Cleanup on unmount
    getUserPhoneNumber();
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };

  }, [callType]);




  const initializePhoneId = async () => {
    const localPeerId = await getUserPhoneNumber();
    //let localPeerId  = phoneNumber; 
    //debugger
    console.log("id is ", localPeerId)
    if (localPeerId) {
      console.log("vedio id", localPeerId, "PORT", PORT);
      // Initialize PeerJS



      if (localStream) {
        console.log("vedio localStream ");
        localStream.getTracks().forEach(track => track.stop());
      }
      if (peerRef.current) {
        console.log("vedio localStream destroy ");
        peerRef.current.destroy();
      }

      peerRef.current = new Peer(localPeerId, {
        host: hostPath,
        //port: PORT,   // this only can use in localhost
        path: '/api/videocalls/userId',
        secure: true, //false for localhost, true for https
      });
      console.log('Peer object initialized:', peerRef.current);
      peerRef.current.on('open', (remoteId) => {
        // setRemoteUserPhoneNumber(remoteId);
        console.log('PeerJS connection opened:', peerRef.current);
        console.log('PeerJS connection opened with ID:', remoteId);
      });
      peerRef.current.on('error', (err) => {
        console.error('PeerJS encountered an error:', err);
      });

      peerRef.current.on('call', (call) => {
        console.log('Receiving call from:', call.peer);
        incomingCallAudioRef.current.loop = true;
        incomingCallAudioRef.current.play(); // Play incoming call sound
        setOngoingCall(call); // Set the ongoing call
        setIncomingCall(call); // Set the incoming call
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

    }
  }

  const callUser = () => {

    // let formattedUserId = parseInt(remoteUserId.join(''), 10) // Converts to 1234
    //formattedUserId = formattedUserId.toString().trim();
    //const isValidId = formattedUserId.length === 16 && !isNaN(formattedUserId) && formattedUserId.match(/^\d{16}$/);
    const isValidPhoneNumber = remoteUserPhoneNumber.length === 10 && !isNaN(remoteUserPhoneNumber);

    if (isValidPhoneNumber) {

      // Log the call initiation on the server

      // fetch(`https://${hostPath}/api/videocalls/userId/log`, { // Make sure this endpoint exists on your server
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ userId: remoteUserPhoneNumber, action: 'call_initiated' }),
      // });
      //debugger
      initializePhoneId();
      if (!peerRef.current) {
        console.error("Peer reference is not initialized");
        return;
      }

      if (!peerRef.current.open) {
        console.error("PeerJS connection is not open");
        return;
      }
      const call = peerRef.current.call(remoteUserPhoneNumber, localStream);
      setOngoingCall(call); // Set the ongoing call

      call.on('stream', (stream) => {debugger
        console.log('Calling call on stream user with Phone Number:');

        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
        //setRemoteStream(stream);
      });
      call.on('close', () => {
       // setRemoteStream(null); // Optionally clear remote stream when call ends
        showMessage('Call ended by the other peer.');
      });

      peerRef.current.on('connection', (conn) => {debugger
        debugger
        conn.on('data', (data) => {
          if (data.type === 'call-end') {
            endCall();
          }
        });
      });

      call.on('error', (error) => {
        showMessage(`Call error: ${error.message}`);
      });

    } else {
      showMessage('Please enter Phone Number.');
    }
  };
  const endCall = () => {

    if (ongoingCall) {
      // Send call-end message to the remote peer
      const conn = peerRef.current.connect(remoteUserPhoneNumber); // Create a connection to the remote peer
      conn.on('open', () => {
        conn.send({ type: 'call-end' });
      });

      ongoingCall.close();
      setOngoingCall(null);
    }
    if (peerRef.current) {
      peerRef.current.disconnect();
      peerRef.current.destroy();
    }
    setLocalStream(null);
    //setRemoteStream(null);
    showMessage('Call ended.');

  };

  // const formatPeerId = (id) => {
  //   if (!id) return '';
  //   // Split the ID into chunks of 4 characters and join with '-'
  //   const formattedId = id.match(/.{1,4}/g).join('-');

  //   // Create an array of elements to be rendered with hyphens
  //   return formattedId.split('-').map((chunk, index) => (
  //     <React.Fragment key={index}>
  //       <span className="peer-id-box">
  //         {chunk}
  //       </span>
  //       {index < formattedId.split('-').length - 1 && <span className="peer-id-separator">-</span>}
  //     </React.Fragment>
  //   ));
  // };


  const answerCall = () => {
    if (incomingCall) {
      incomingCallAudioRef.current.pause(); // Stop the incoming call sound
      incomingCallAudioRef.current.currentTime = 0; // Reset sound position
      console.log("incomingCall in answer", incomingCall)
      incomingCall.answer(localStream);
      // Debugging logs
      console.log('Answering call with local stream:', localStream);

      incomingCall.on('stream', (stream) => {
        debugger
        console.log('Received localStream stream:', localStream, "Received remote stream",stream);
        if (remoteVideoRef.current) {
          console.log('Assigning stream to remoteVideoRef');
          remoteVideoRef.current.srcObject = stream;
        }
        
      });

      // Optional: Add error handling
      incomingCall.on('error', (error) => {
        console.error('Incoming call error:', error);
        showMessage(`Incoming call error: ${error.message}`);
      });
      setIncomingCall(null); // Clear incoming call
      setCallButtonsDisabled(true); // Disable the buttons after answering
    }
  };

  const rejectCall = () => {
    if (incomingCall) {
      incomingCallAudioRef.current.pause(); // Stop the incoming call sound
      incomingCallAudioRef.current.currentTime = 0; // Reset sound position
      incomingCall.close(); // Close the incoming call
      setIncomingCall(null); // Clear incoming call
      setCallButtonsDisabled(true); // Disable the buttons after answering

    }
    else {
      showMessage('No incoming call to answer.');
    }
  };



  return (
    <div className="main-content my-3">
      <div className='container my-3'>
        <h1 className="mb-4 text-center">
          {callType.charAt(0).toUpperCase() + callType.slice(1)} Call
        </h1>
        <div className="mb-3">
          <div className="peer-id-container">
            <label className="form-label peer-id-label">Your ID:</label>
            <div className="peer-id-boxes">
              {phoneNumber}
            </div>
          </div>
          {/* <br /> */}
          {/* <label className="form-label peer-id-label">Enter Remote ID:</label> */}
          {/* <div className="d-flex justify-content-center mb-3">
            {remoteUserId.map((value, index) => (
              <input
                key={index}
                type="text"
                className="form-control mx-1 text-center peer-id-input"
                style={{ width: '8%' }}
                value={value}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                maxLength="4"
              />
            ))}
          </div> */}

          <div className="mb-3">
            <label className="form-label peer-id-label">Enter Remote User Phone Number:</label>
            <input
              type="text"
              className="form-control mx-1 text-center peer-id-input"
              value={remoteUserPhoneNumber}
              onChange={handlePhoneNumberChange}
              maxLength="10"
              placeholder="Enter 10-digit phone number"
            />
          </div>

          <div className="container m-2">
            <button
              style={{ marginLeft: '40%' }}
              className="btn btn-primary connect-now" onClick={callUser}
              disabled={!!ongoingCall || callButtonsDisabled}
            >

              Connect Now
            </button>
            <button
              className="btn btn-secondary mx-2"
              onClick={clearRemoteUserId}
            >
              Clear
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
        {/* Incoming call action buttons */}
        {incomingCall && (
          <div className="d-flex justify-content-center mt-3">
            <button className="btn btn-success me-2"
              onClick={answerCall}
              disabled={callButtonsDisabled}
            >
              Answer
            </button>
            <button className="btn btn-danger"
              onClick={rejectCall}
              disabled={callButtonsDisabled}
            >
              Reject
            </button>
          </div>
        )}
        {ongoingCall && (
          <button className="btn btn-danger mx-3" onClick={endCall}>
            End Call
          </button>
        )}
      </div>
    </div>
  );
};

export default CallComponent;
