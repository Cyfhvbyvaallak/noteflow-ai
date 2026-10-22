import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  Square,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Clock,
  BookOpen,
  Tag,
  CheckCircle2,
  Loader2,
  Volume2
} from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { WaveformVisualizer } from './WaveformVisualizer';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export function AudioRecorder() {
  const navigate = useNavigate();
  const toast = useToast();

  const [recordState, setRecordState] = useState('ready'); // 'ready' | 'recording' | 'paused' | 'processing' | 'completed'
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [permissionError, setPermissionError] = useState(null);
  const [processingStage, setProcessingStage] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const subjects = [
    'Computer Science',
    'Physics',
    'Biology',
    'Mathematics',
    'Chemistry',
    'History',
    'Economics',
    'Psychology',
    'General Studies'
  ];

  useEffect(() => {
    if (recordState === 'recording') {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [recordState]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    setPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(250);
      setRecordState('recording');
      setTimerSeconds(0);
    } catch (err) {
      console.error('Microphone access error:', err);
      setPermissionError('Microphone permission was denied. Please allow microphone access in your browser to record live lectures.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recordState === 'recording') {
      mediaRecorderRef.current.pause();
      setRecordState('paused');
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && recordState === 'paused') {
      mediaRecorderRef.current.resume();
      setRecordState('recording');
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current) {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setRecordState('ready');
    setTimerSeconds(0);
    audioChunksRef.current = [];
  };

  const stopAndProcess = async () => {
    if (!title.trim()) {
      toast.error('Please enter a lecture title before processing.');
      return;
    }

    setRecordState('processing');
    setProcessingStage('Finalizing audio stream...');

    if (mediaRecorderRef.current) {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    try {
      setProcessingStage('Transcribing audio with Speech-to-Text...');
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('file', audioBlob, 'lecture_recording.wav');
      formData.append('title', title.trim());
      formData.append('subject', subject);
      formData.append('source_type', 'RECORDING');

      setProcessingStage('AI synthesizing summary, key points, revision notes & quiz...');
      const response = await api.transcription.uploadAndProcess(formData);

      setRecordState('completed');
      toast.success('Lecture successfully transcribed & study package generated!');

      setTimeout(() => {
        navigate(`/lectures/${response.lecture_id}`);
      }, 1000);
    } catch (err) {
      console.error('Processing error:', err);
      toast.error(err.message || 'Failed to process recorded lecture.');
      setRecordState('ready');
    }
  };

  return (
    <Card className="max-w-3xl mx-auto overflow-hidden shadow-warm-card border-[#E8D5A0]/80 bg-[#FFFDF5]">
      <div className="p-6 sm:p-8 space-y-6">
        {/* Lecture Info Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-stone-600 mb-1.5">
              Lecture Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Operating Systems: Virtual Memory & Page Replacement"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={recordState === 'processing'}
              className="w-full px-4 py-3 rounded-2xl border border-[#E8D5A0] bg-[#FFF9E8] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-semibold shadow-inner"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-stone-600 mb-1.5">
              Academic Subject
            </label>
            <div className="flex flex-wrap gap-2">
              {subjects.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSubject(sub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    subject === sub
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm font-black'
                      : 'bg-[#FFF9E8] text-stone-700 hover:bg-[#FBF1D5] border border-[#E8D5A0]'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Permission Error Banner */}
        {permissionError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Microphone Permission Required</p>
              <p className="text-rose-700 mt-0.5">{permissionError}</p>
            </div>
          </div>
        )}

        {/* Sound Booth Terminal */}
        <div className="p-6 rounded-3xl bg-[#FFF9E8] border border-[#E8D5A0] text-stone-900 space-y-6 shadow-inner text-center relative overflow-hidden">
          <div className="flex items-center justify-between">
            <Badge
              variant={
                recordState === 'recording'
                  ? 'danger'
                  : recordState === 'paused'
                  ? 'warning'
                  : recordState === 'processing'
                  ? 'purple'
                  : 'default'
              }
              dot
            >
              {recordState.toUpperCase()}
            </Badge>

            {/* Glowing Digital Timer */}
            <div className="flex items-center gap-2 font-mono text-xl sm:text-2xl font-black text-teal-800">
              <Clock className="w-5 h-5 text-teal-700" />
              <span>{formatTime(timerSeconds)}</span>
            </div>
          </div>

          {/* Central Pulsing Microphone Orb */}
          <div className="py-4 flex justify-center">
            {recordState === 'ready' && (
              <button
                type="button"
                onClick={startRecording}
                className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 text-white font-black flex flex-col items-center justify-center gap-1 shadow-glow-emerald cursor-pointer hover:scale-105 transition-all"
              >
                <Mic className="w-9 h-9" />
                <span className="text-[10px] font-black uppercase tracking-wider">Record</span>
              </button>
            )}

            {recordState === 'recording' && (
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-600 to-red-600 text-white flex flex-col items-center justify-center gap-1 animate-mic-pulse shadow-md">
                <Mic className="w-9 h-9 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider">Live</span>
              </div>
            )}

            {recordState === 'paused' && (
              <div className="w-24 h-24 rounded-full bg-amber-500 text-white font-black flex flex-col items-center justify-center gap-1 shadow-md">
                <Pause className="w-9 h-9" />
                <span className="text-[10px] font-black uppercase tracking-wider">Paused</span>
              </div>
            )}

            {recordState === 'processing' && (
              <div className="w-24 h-24 rounded-full bg-purple-600 text-white flex flex-col items-center justify-center gap-1 shadow-glow-purple">
                <Loader2 className="w-9 h-9 animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-wider">AI Synced</span>
              </div>
            )}
          </div>

          {/* Waveform Visualizer */}
          <WaveformVisualizer
            isRecording={recordState === 'recording'}
            isPaused={recordState === 'paused'}
            audioStream={streamRef.current}
          />
        </div>

        {/* Processing Stepper Display */}
        {recordState === 'processing' && (
          <div className="p-6 bg-[#FFF9E8] border border-purple-300 rounded-2xl text-center space-y-3 shadow-warm-sm">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
            <h4 className="font-extrabold text-stone-900 text-base">Processing lecture with AI...</h4>
            <p className="text-xs text-purple-800 max-w-md mx-auto">{processingStage}</p>
            <div className="text-[10px] text-teal-800 font-black uppercase tracking-widest">
              Speech-to-Text → Summary → Key Points → Revision Kit → Practice Quiz
            </div>
          </div>
        )}

        {/* Action Controls */}
        {recordState !== 'processing' && recordState !== 'completed' && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {recordState === 'ready' && (
              <Button
                variant="primary"
                size="lg"
                icon={Mic}
                onClick={startRecording}
                className="w-full sm:w-auto px-8 shadow-glow-emerald font-black"
              >
                Start Recording Lecture
              </Button>
            )}

            {recordState === 'recording' && (
              <>
                <Button
                  variant="secondary"
                  size="md"
                  icon={Pause}
                  onClick={pauseRecording}
                  className="w-full sm:w-auto"
                >
                  Pause
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  icon={Square}
                  onClick={stopAndProcess}
                  className="w-full sm:w-auto shadow-glow-emerald font-black"
                >
                  Stop & Process with AI
                </Button>
                <Button
                  variant="ghost"
                  size="md"
                  icon={RotateCcw}
                  onClick={cancelRecording}
                  className="text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </Button>
              </>
            )}

            {recordState === 'paused' && (
              <>
                <Button
                  variant="cyan"
                  size="md"
                  icon={Play}
                  onClick={resumeRecording}
                  className="w-full sm:w-auto font-black"
                >
                  Resume
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  icon={Square}
                  onClick={stopAndProcess}
                  className="w-full sm:w-auto shadow-glow-emerald font-black"
                >
                  Stop & Process with AI
                </Button>
                <Button
                  variant="ghost"
                  size="md"
                  icon={RotateCcw}
                  onClick={cancelRecording}
                  className="text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
