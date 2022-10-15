import { useEffect, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const SpeechToText = () => {
    const {
        transcript,
        resetTranscript,
      } = useSpeechRecognition();
    const [cnt,setwordcnt] = useState(0)
    useEffect(() => {
        SpeechRecognition.startListening({continuous:true});
    },[]);

    let wrdcnt = transcript.split(' ').length
    useEffect(()=>{
        setwordcnt((prev)=>prev+transcript.split(' ').length)
    },[transcript])


    return (
        <div>
            <div>
                {cnt}
            </div>
        </div>
    )
}

export default SpeechToText;
