import { useRef, useState } from 'react'

type Params = {
  onBlobStream: (blob: Blob) => void
  timeSlice?: number
}

export const useAudioStream = ({ onBlobStream, timeSlice }: Params) => {
  const [activeStream, setActiveStream] = useState(false)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const captureUserAudio = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream: MediaStream) => {
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      mediaStreamRef.current = stream
      mediaRecorder.start(timeSlice)
      mediaRecorder.addEventListener('dataavailable', (blobEvent: BlobEvent) => {
        onBlobStream(blobEvent.data)
      })
    })
  }
  const handleStartAudioStream = () => {
    captureUserAudio()
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current?.start()
    }
    setActiveStream(true)
  }
  const handleStopAudioStream = () => {
    if (mediaStreamRef.current) {
      // biome-ignore lint/complexity/noForEach: <explanation>
      mediaStreamRef.current.getTracks().forEach((track) => {
        if (track.readyState === 'live' && track.kind === 'audio') {
          track.stop()
        }
      })
    }
    setActiveStream(false)
  }

  return {
    activeStream,
    handleStartAudioStream,
    handleStopAudioStream,
  }
}
