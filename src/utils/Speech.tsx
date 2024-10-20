import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNotify } from '../context/NotifyContext';

function useSpeech() {
    const synth = window.speechSynthesis;
    const voices = useRef<SpeechSynthesisVoice[]>([])
    const speakerCRef = useRef<string>("");
    const speakerERef = useRef<string>("");
    const { popNotify } = useNotify();

    useEffect(() => {
        const loadVoices = () => {
            voices.current = synth.getVoices();
            for (let i = 0; i < voices.current.length; i++) {

                if (voices.current[i].name == "Microsoft Emma Online (Natural) - English (United States)" || voices.current[i].name == "Fred") {
                    speakerERef.current = voices.current[i].name
                }

                if (voices.current[i].name == "Microsoft Hanhan - Chinese (Traditional, Taiwan)" || voices.current[i].name == "美嘉" || voices.current[i].name == "Mei-Jia") {
                    speakerCRef.current = voices.current[i].name
                }
            }
            // popNotify('Voices loaded')
        };
        
        loadVoices();
        
        window.speechSynthesis.onvoiceschanged = loadVoices;
        window.addEventListener('beforeunload', (event) => {
            synth.cancel();
        });
        
        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);
    
    const speakE = useCallback((text: string) => {
        if (speakerERef) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = voices.current.find(v => v.name === speakerERef.current) || voices.current[0];
            window.speechSynthesis.speak(utterance);
        }
    }, [speakerERef]);
    
    return { synth, voices: voices.current, speakerE: speakerERef.current, speakerC: speakerCRef.current, speakE };
}

export default useSpeech