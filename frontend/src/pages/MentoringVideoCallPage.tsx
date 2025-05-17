import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/layout/MainLayout';
import { Mic, MicOff, Video, VideoOff, Phone, MessageSquare, Users } from 'lucide-react';
import Button from '../components/ui/Button';
import mentoringApi from '../services/mentoringApi';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const MentoringVideoCallPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string; timestamp: Date }[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/mentoring/videocall/${sessionId}` } });
      return;
    }

    const fetchSessionDetails = async () => {
      if (!sessionId) return;

      try {
        const sessionData = await mentoringApi.sessions.getSessionById(sessionId);
        setSession(sessionData);

        // Vérifier si l'utilisateur est autorisé à accéder à cette session
        if (!user?.is_admin) {
          try {
            const mentee = await mentoringApi.mentees.getMenteeByUserId(user?.id || '');
            if (mentee.id !== sessionData.mentee_id) {
              setError("Vous n'êtes pas autorisé à accéder à cette session de mentorat.");
              return;
            }
          } catch (error) {
            setError("Vous n'êtes pas autorisé à accéder à cette session de mentorat.");
            return;
          }
        }

        // Vérifier si la session est confirmée
        if (sessionData.status !== 'confirmed') {
          setError("Cette session n'est pas encore confirmée ou a été annulée.");
          return;
        }

        // Vérifier si la session est dans le futur ou le passé récent (moins de 24h)
        const sessionDate = new Date(sessionData.date);
        const now = new Date();
        const timeDiff = Math.abs(sessionDate.getTime() - now.getTime());
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        if (sessionDate > now && hoursDiff > 1) {
          setError(`Cette session est prévue pour ${formatDate(sessionDate)} à ${formatTime(sessionDate)}. Vous pourrez y accéder 1 heure avant le début.`);
          return;
        }

        if (now > sessionDate && hoursDiff > 24) {
          setError("Cette session est terminée depuis plus de 24 heures.");
          return;
        }

        // Initialiser la visioconférence
        initializeVideoCall();

      } catch (error) {
        console.error('Erreur lors du chargement de la session:', error);
        setError("Impossible de charger les détails de la session.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId, isAuthenticated, navigate, user]);

  const initializeVideoCall = async () => {
    try {
      // Simuler l'initialisation d'une visioconférence
      // Dans une implémentation réelle, vous utiliseriez WebRTC ou une API comme Twilio, Daily.co, etc.
      
      // Accéder à la caméra et au microphone de l'utilisateur
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      // Afficher le flux vidéo local
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Simuler la connexion à un pair distant
      setTimeout(() => {
        toast.success('Connexion établie avec succès!');
        
        // Dans une implémentation réelle, vous recevriez le flux distant via WebRTC
        // Pour cette simulation, nous utilisons le même flux local
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      }, 2000);
      
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la visioconférence:', error);
      toast.error('Impossible d\'accéder à votre caméra ou microphone');
      setError("Veuillez autoriser l'accès à votre caméra et microphone pour rejoindre la visioconférence.");
    }
  };

  const toggleAudio = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const audioTracks = stream.getAudioTracks();
      
      audioTracks.forEach(track => {
        track.enabled = !audioEnabled;
      });
      
      setAudioEnabled(!audioEnabled);
    }
  };

  const toggleVideo = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const videoTracks = stream.getVideoTracks();
      
      videoTracks.forEach(track => {
        track.enabled = !videoEnabled;
      });
      
      setVideoEnabled(!videoEnabled);
    }
  };

  const handleEndCall = () => {
    // Arrêter tous les flux médias
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    
    toast.success('Vous avez quitté la visioconférence');
    navigate('/dashboard');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const message = {
      sender: user?.full_name || 'Vous',
      text: newMessage,
      timestamp: new Date()
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    // Simuler une réponse du mentor après 2 secondes
    if (!user?.is_admin) {
      setTimeout(() => {
        const mentorResponse = {
          sender: 'Mentor',
          text: 'Merci pour votre message. Je vais vous aider avec ça.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, mentorResponse]);
      }, 2000);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return format(date, 'EEEE d MMMM yyyy', { locale: fr });
  };

  const formatTime = (dateString: string | Date) => {
    const date = new Date(dateString);
    return format(date, 'HH:mm');
  };

  const formatMessageTime = (date: Date) => {
    return format(date, 'HH:mm');
  };

  if (!isAuthenticated) {
    return null; // Redirection gérée par useEffect
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-4">Impossible de rejoindre la visioconférence</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => navigate('/dashboard')} className="text-white">
              Retour au tableau de bord
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Session de mentorat</h1>
          {session && (
            <p className="text-gray-600">
              {formatDate(session.date)} à {formatTime(session.date)} • {session.duration} minutes
            </p>
          )}
        </div>
        
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Zone principale de visioconférence */}
          <div className={`flex-1 ${chatOpen ? 'lg:w-2/3' : 'w-full'}`}>
            <div className="bg-gray-900 rounded-lg overflow-hidden relative">
              {/* Vidéo du pair distant (mentor ou mentoré) */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-[500px] object-cover"
              />
              
              {/* Vidéo locale (utilisateur) */}
              <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Contrôles de la visioconférence */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                <button
                  onClick={toggleAudio}
                  className={`p-3 rounded-full ${audioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {audioEnabled ? <Mic size={24} className="text-white" /> : <MicOff size={24} className="text-white" />}
                </button>
                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-full ${videoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {videoEnabled ? <Video size={24} className="text-white" /> : <VideoOff size={24} className="text-white" />}
                </button>
                <button
                  onClick={handleEndCall}
                  className="p-3 rounded-full bg-red-600 hover:bg-red-700"
                >
                  <Phone size={24} className="text-white transform rotate-135" />
                </button>
                <button
                  onClick={() => setChatOpen(!chatOpen)}
                  className={`p-3 rounded-full ${chatOpen ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  <MessageSquare size={24} className="text-white" />
                </button>
              </div>
            </div>
            
            {/* Informations sur la session */}
            <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-2">Détails de la session</h2>
              {session && (
                <div className="space-y-2">
                  <p><span className="font-medium">Sujet:</span> {session.notes}</p>
                  <p><span className="font-medium">Durée:</span> {session.duration} minutes</p>
                  <p><span className="font-medium">Statut:</span> {session.status === 'confirmed' ? 'Confirmée' : session.status}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Chat */}
          {chatOpen && (
            <div className="lg:w-1/3 bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[600px]">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-semibold">Chat</h2>
                <div className="flex items-center">
                  <Users size={16} className="mr-2" />
                  <span>2 participants</span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                    <p>Aucun message pour le moment</p>
                    <p className="text-sm">Envoyez un message pour démarrer la conversation</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`flex ${msg.sender === (user?.full_name || 'Vous') ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.sender === (user?.full_name || 'Vous') 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm">{msg.sender}</span>
                          <span className="text-xs opacity-75 ml-2">{formatMessageTime(msg.timestamp)}</span>
                        </div>
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tapez votre message..."
                    className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                  >
                    Envoyer
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default MentoringVideoCallPage;
