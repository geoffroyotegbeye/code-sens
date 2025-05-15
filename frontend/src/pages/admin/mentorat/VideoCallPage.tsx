import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Video, Mic, MicOff, Camera, CameraOff, PhoneOff, MessageSquare, Users, ScreenShare, Monitor } from 'lucide-react';
import AdminLayout from '../../../components/layout/AdminLayout';
import Button from '../../../components/ui/Button';
import { mentoringApi } from '../../../services/mentoringApi';
import { MentoringSession } from '../../../types/mentoring';
import toast from 'react-hot-toast';

// Cette page utilise WebRTC pour la visioconférence
// Dans une implémentation réelle, vous pourriez utiliser une bibliothèque comme PeerJS, Simple-Peer ou une solution SaaS

const VideoCallPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<MentoringSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isCameraOff, setIsCameraOff] = useState<boolean>(false);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ sender: string; text: string; time: string }[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [participants, setParticipants] = useState<{ id: string; name: string; isConnected: boolean }[]>([]);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Simuler des données pour la démo
  const demoParticipants = [
    { id: '1', name: 'Vous (Admin)', isConnected: true },
    { id: '2', name: 'John Doe (Mentoré)', isConnected: true }
  ];
  
  const demoMessages = [
    { sender: 'Système', text: 'Bienvenue dans la session de mentorat', time: '14:00' },
    { sender: 'John Doe', text: 'Bonjour, merci de m\'accueillir pour cette session', time: '14:01' },
    { sender: 'Vous', text: 'Bonjour John, comment puis-je vous aider aujourd\'hui ?', time: '14:02' }
  ];

  useEffect(() => {
    // Simuler le chargement d'une session pour la démo
    const fetchSession = async () => {
      setIsLoading(true);
      
      try {
        if (sessionId) {
          // Dans une implémentation réelle, vous récupéreriez la session depuis l'API
          // const sessionData = await mentoringApi.sessions.getSessionById(sessionId);
          
          // Pour la démo, nous créons une session fictive
          const sessionData: MentoringSession = {
            _id: sessionId,
            mentee_id: 'user123',
            title: 'Session de mentorat sur React',
            description: 'Aide sur les hooks React et l\'optimisation des performances',
            date: new Date().toISOString().split('T')[0],
            start_time: '14:00:00',
            end_time: '15:00:00',
            status: 'confirmed',
            meeting_url: 'https://meet.example.com/abc123',
            price: 50,
            payment_status: 'paid',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          setSession(sessionData);
          setParticipants(demoParticipants);
          setMessages(demoMessages);
          setError(null);
          
          // Initialiser la webcam
          initializeWebcam();
        }
      } catch (err) {
        console.error('Erreur lors du chargement de la session:', err);
        setError('Impossible de charger la session de mentorat');
        toast.error('Impossible de charger la session de mentorat');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSession();
    
    // Nettoyage lors du démontage du composant
    return () => {
      // Arrêter les flux vidéo/audio
      stopMediaTracks();
    };
  }, [sessionId]);

  useEffect(() => {
    // Faire défiler automatiquement vers le bas lorsque de nouveaux messages sont ajoutés
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Dans une implémentation réelle, vous établiriez ici la connexion WebRTC
      // et vous géreriez les flux distants
      
      // Simuler une vidéo distante pour la démo
      setTimeout(() => {
        if (remoteVideoRef.current) {
          // Dans une vraie implémentation, ce serait le flux du pair distant
          remoteVideoRef.current.srcObject = stream;
        }
      }, 1000);
      
    } catch (err) {
      console.error('Erreur lors de l\'accès à la webcam:', err);
      toast.error('Impossible d\'accéder à votre caméra ou microphone');
    }
  };

  const stopMediaTracks = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    
    if (screenShareRef.current && screenShareRef.current.srcObject) {
      const tracks = (screenShareRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const toggleMicrophone = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTracks = (localVideoRef.current.srcObject as MediaStream)
        .getAudioTracks();
      
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      
      setIsMicMuted(!isMicMuted);
    }
  };

  const toggleCamera = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTracks = (localVideoRef.current.srcObject as MediaStream)
        .getVideoTracks();
      
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      
      setIsCameraOff(!isCameraOff);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        // Arrêter le partage d'écran
        if (screenShareRef.current && screenShareRef.current.srcObject) {
          const tracks = (screenShareRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach(track => track.stop());
          screenShareRef.current.srcObject = null;
        }
        setIsScreenSharing(false);
      } else {
        // Démarrer le partage d'écran
        const stream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true 
        });
        
        if (screenShareRef.current) {
          screenShareRef.current.srcObject = stream;
        }
        
        // Écouter l'événement de fin de partage (lorsque l'utilisateur clique sur "Arrêter le partage")
        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
        };
        
        setIsScreenSharing(true);
      }
    } catch (err) {
      console.error('Erreur lors du partage d\'écran:', err);
      toast.error('Impossible de partager votre écran');
    }
  };

  const endCall = () => {
    // Dans une implémentation réelle, vous fermeriez la connexion WebRTC ici
    stopMediaTracks();
    
    // Rediriger vers la page des sessions
    navigate('/admin/mentorat/sessions');
    
    toast.success('Appel terminé');
  };

  const sendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const now = new Date();
    const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    setMessages([
      ...messages,
      {
        sender: 'Vous',
        text: newMessage,
        time
      }
    ]);
    
    setNewMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {session ? session.title : 'Session de mentorat'}
          </h1>
          <div className="flex space-x-2">
            <Button 
              onClick={endCall}
              className="bg-red-600 hover:bg-red-700 flex items-center"
            >
              <PhoneOff size={16} className="mr-1" />
              Terminer l'appel
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Erreur !</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Vidéos */}
            <div className="lg:col-span-3">
              <div className="bg-gray-900 rounded-lg overflow-hidden relative">
                {/* Vidéo principale (distante) */}
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-[calc(100vh-300px)] object-cover"
                />
                
                {/* Vidéo locale (petite fenêtre) */}
                <div className="absolute bottom-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden shadow-lg">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Contrôles */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                  <button
                    onClick={toggleMicrophone}
                    className={`p-3 rounded-full ${isMicMuted ? 'bg-red-600' : 'bg-gray-700'} text-white hover:opacity-90`}
                  >
                    {isMicMuted ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                  <button
                    onClick={toggleCamera}
                    className={`p-3 rounded-full ${isCameraOff ? 'bg-red-600' : 'bg-gray-700'} text-white hover:opacity-90`}
                  >
                    {isCameraOff ? <CameraOff size={20} /> : <Camera size={20} />}
                  </button>
                  <button
                    onClick={toggleScreenShare}
                    className={`p-3 rounded-full ${isScreenSharing ? 'bg-blue-600' : 'bg-gray-700'} text-white hover:opacity-90`}
                  >
                    {isScreenSharing ? <Monitor size={20} /> : <ScreenShare size={20} />}
                  </button>
                  <button
                    onClick={endCall}
                    className="p-3 rounded-full bg-red-600 text-white hover:opacity-90"
                  >
                    <PhoneOff size={20} />
                  </button>
                </div>
              </div>
              
              {/* Partage d'écran (si actif) */}
              {isScreenSharing && (
                <div className="mt-4 bg-gray-900 rounded-lg overflow-hidden">
                  <video
                    ref={screenShareRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 object-contain"
                  />
                </div>
              )}
            </div>
            
            {/* Panneau latéral (chat et participants) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden h-[calc(100vh-300px)] flex flex-col">
                {/* Onglets */}
                <div className="flex border-b">
                  <button className="flex-1 py-3 px-4 bg-blue-50 text-blue-600 font-medium flex items-center justify-center">
                    <MessageSquare size={16} className="mr-2" />
                    Chat
                  </button>
                  <button className="flex-1 py-3 px-4 text-gray-600 hover:bg-gray-50 font-medium flex items-center justify-center">
                    <Users size={16} className="mr-2" />
                    Participants ({participants.length})
                  </button>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`flex flex-col ${msg.sender === 'Vous' ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center mb-1">
                        <span className="text-xs font-medium text-gray-500">
                          {msg.sender} • {msg.time}
                        </span>
                      </div>
                      <div 
                        className={`px-3 py-2 rounded-lg max-w-[85%] ${
                          msg.sender === 'Vous' 
                            ? 'bg-blue-600 text-white' 
                            : msg.sender === 'Système'
                              ? 'bg-gray-200 text-gray-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Saisie de message */}
                <div className="border-t p-3">
                  <div className="flex">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Écrivez un message..."
                      className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={2}
                    />
                    <button
                      onClick={sendMessage}
                      className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default VideoCallPage;
