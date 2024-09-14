import React, { useState, useRef, useEffect } from 'react';
import usePeer from './usePeer'; // Import the usePeer hook
import '../css/videocall.css';
import ringtone from './Incoming_Call.mp3';

const CallComponent = ({ phoneNumber,showMessage }) => {
  const [userPhoneNumber, setPhoneNumber] = useState('');
  console.log("phoneNumber",phoneNumber)
  const { peer, peerId: myPeerId } = usePeer(phoneNumber); // Get peer and peerId from usePeer
  const [remotePeerId, setRemotePeerId] = useState('');
  const [call, setCall] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [incomingCall, setIncomingCall] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [dataConnection, setDataConnection] = useState(null);
  const ringtoneAudio = useRef(new Audio(ringtone));
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (peer) {
      peer.on('open', () => {
        setPhoneNumber(peer.id); // Set the phone number (Peer ID) when peer connection opens
      });
      peer.on('data', (data) => {
        if (data === 'endCall') {
          setIsCallActive(false)
        }
      });

      peer.on('call', (incomingCall) => {
        setIncomingCall(true);
        playRingtone();
        timeoutRef.current = setTimeout(() => {
          if (!isCallActive) {
            incomingCall.close();
            setIncomingCall(false);
            stopRingtone();
          }
        }, 120000);

        incomingCall.on('stream', (stream) => {
          setRemoteStream(stream);
          setIsCallActive(true);
          stopRingtone();
          clearTimeout(timeoutRef.current);
        });

        setCall(incomingCall);
      });

      peer.on('connection', (conn) => {
        conn.on('data', (data) => {
          if (data === 'endCall') {
            endCall();
            showMessage('The remote user ended the call.');
          }
        });
      });
      
    }
  }, [peer,isCallActive]);

  const playRingtone = () => {
    ringtoneAudio.current.loop = true;
    ringtoneAudio.current.play();
  };

  const stopRingtone = () => {
    ringtoneAudio.current.pause();
    ringtoneAudio.current.currentTime = 0;
  };

  const makeCall = () => {
    if (remotePeerId && peer) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setLocalStream(stream);
          const outgoingCall = peer.call(remotePeerId, stream);
          outgoingCall.on('stream', (remoteStream) => {
            setRemoteStream(remoteStream);
            setIsCallActive(true);
          });

           // Create or use an existing data connection
        const conn = peer.connect(remotePeerId);
        conn.on('open', () => {
          setDataConnection(conn); // Set the data connection
        });

          setCall(outgoingCall);
        });
    }
  };

  const answerCall = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        call.answer(stream);
        call.on('stream', (remoteStream) => {
          setRemoteStream(remoteStream);
          setIsCallActive(true);
        });
        setIncomingCall(false);
        stopRingtone();
        clearTimeout(timeoutRef.current);
      });
  };

  const rejectCall = () => {
    if (call) {
      call.close();
      setCall(null);
    }
    setIncomingCall(false);
    stopRingtone();
  };

  const endCall = () => {
    if (call) {
      if (dataConnection) {
        dataConnection.send('endCall'); // Use dataConnection to send the message
      }
      call.close();
      setCall(null);
      setRemoteStream(null);
      setLocalStream(null);
      setIsCallActive(false);
      showMessage('Call ended.');
    }
  };

  return (
    <div className='main-content container my-3'>
      <div className="row" style={{ marginTop: '2%' }}>
        <h1
          style={{
            border: '2px solid #333',
            borderRadius: '5px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          }}
          className='text-center'>
          Video Call Interface
        </h1>
        <div className="col-12 my-4 text-center">
          <h4>Your Phone Number (Peer ID): {userPhoneNumber}</h4>
        </div>

        {/* Input Section for Peer ID */}
        {!isCallActive && !incomingCall && (
          <div className="col-12 my-4">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter Remote Phone Number (Peer ID)"
              value={remotePeerId}
              onChange={(e) => setRemotePeerId(e.target.value)}
            />
            <button className="btn btn-primary w-100" onClick={makeCall}>
              Start Call
            </button>
          </div>
        )}

        {/* Incoming Call Alert */}
        {incomingCall && (
          <div className="alert alert-primary text-center">
            <h2>Incoming Call...</h2>
            <div className="mt-3">
              <button className="btn btn-success me-3" onClick={answerCall}>
                Answer
              </button>
              <button className="btn btn-danger" onClick={rejectCall}>
                Reject
              </button>
            </div>
          </div>
        )}

        {/* Video Streams Section */}
        {isCallActive && (
          <div className="col-12 mt-4 text-center">
            <h2>Call Active</h2>
            <button className="btn btn-danger mb-4" onClick={endCall}>
              End Call
            </button>
            <div className="row">
              {/* Local Video */}
              <div className="col-md-6">
                <div className="card border-primary mb-4">
                  <div className="card-header bg-primary text-white">Your Video</div>
                  <div className="card-body">
                    {localStream && (
                      <video
                        className="w-100 border rounded"
                        playsInline
                        ref={(video) => {
                          if (video) {
                            video.srcObject = localStream;
                            video.play();
                          }
                        }}
                        muted
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Remote Video */}
              <div className="col-md-6">
                <div className="card border-success mb-4">
                  <div className="card-header bg-success text-white">Remote Video</div>
                  <div className="card-body">
                    {remoteStream && (
                      <video
                        className="w-100 border rounded"
                        playsInline
                        ref={(video) => {
                          if (video) {
                            video.srcObject = remoteStream;
                            video.play();
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallComponent;
