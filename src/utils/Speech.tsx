import React, { useState, useCallback, useEffect } from 'react';

type VoiceSettings = {
    speakerE?: string;
    speakerC?: string;
};

type VoiceChangeListener = () => void;

class SpeechService {
    private static instance: SpeechService;
    public readonly synth: SpeechSynthesis;
    private voices: SpeechSynthesisVoice[] = [];
    private speakerE: string = "";
    private speakerC: string = "";
    private initialized: boolean = false;
    private voiceChangeListeners: VoiceChangeListener[] = [];

    private constructor() {
        this.synth = window.speechSynthesis;
    }

    public static getInstance(): SpeechService {
        if (!SpeechService.instance) {
            SpeechService.instance = new SpeechService();
        }
        return SpeechService.instance;
    }

    public async initialize() {
        if (this.initialized) {
            this.loadSavedSettings();
            return
        };

        const loadVoices = () => {
            this.voices = this.synth.getVoices();
            for (let voice of this.voices) {
                if (this.speakerE == "" && (voice.name === "Microsoft Emma Online (Natural) - English (United States)" ||
                    voice.name === "Fred")) {
                    this.speakerE = voice.name;
                }

                if (this.speakerC == "" && (voice.name === "Microsoft Hanhan - Chinese (Traditional, Taiwan)" ||
                    voice.name === "美嘉" ||
                    voice.name === "Mei-Jia")) {
                    this.speakerC = voice.name;
                }
            }
            this.notifyListeners();
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        // 讀取保存的設置
        this.loadSavedSettings();

        window.addEventListener('beforeunload', () => {
            this.synth.cancel();
        });

        this.initialized = true;
    }

    // 添加監聽器
    public addVoiceChangeListener(listener: VoiceChangeListener) {
        this.voiceChangeListeners.push(listener);
    }

    // 移除監聽器
    public removeVoiceChangeListener(listener: VoiceChangeListener) {
        this.voiceChangeListeners = this.voiceChangeListeners.filter(l => l !== listener);
    }

    // 通知所有監聽器
    private notifyListeners() {
        this.voiceChangeListeners.forEach(listener => listener());
    }

    private loadSavedSettings() {
        const savedSettings = localStorage.getItem('voice-settings');
        if (savedSettings) {
            try {
                const settings: VoiceSettings = JSON.parse(savedSettings);
                if (settings.speakerE) {
                    this.speakerE = settings.speakerE;
                }
                if (settings.speakerC) {
                    this.speakerC = settings.speakerC;
                }
                this.notifyListeners();
            } catch (error) {
                console.error('Error parsing voice settings:', error);
            }
        }
    }

    public setSpeakerE(speakerName: string) {
        // 檢查是否為有效的語音
        const isValidVoice = this.voices.some(voice => voice.name === speakerName);
        if (!isValidVoice) {
            console.warn('Invalid voice name:', speakerName);
            return false;
        }

        this.speakerE = speakerName;

        // 更新 localStorage
        try {
            const savedSettings = localStorage.getItem('voice-settings');
            const settings: VoiceSettings = savedSettings ? JSON.parse(savedSettings) : {};
            settings.speakerE = speakerName;
            localStorage.setItem('voice-settings', JSON.stringify(settings));
            this.notifyListeners();
            return true;
        } catch (error) {
            console.error('Error saving voice settings:', error);
            return false;
        }
    }

    public setSpeakerC(speakerName: string) {
        const isValidVoice = this.voices.some(voice => voice.name === speakerName);
        if (!isValidVoice) {
            console.warn('Invalid voice name:', speakerName);
            return false;
        }

        this.speakerC = speakerName;

        try {
            const savedSettings = localStorage.getItem('voice-settings');
            const settings: VoiceSettings = savedSettings ? JSON.parse(savedSettings) : {};
            settings.speakerC = speakerName;
            localStorage.setItem('voice-settings', JSON.stringify(settings));
            this.notifyListeners();
            return true;
        } catch (error) {
            console.error('Error saving voice settings:', error);
            return false;
        }
    }

    public speakE(text: string) {
        if (this.speakerE) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = this.voices.find(v => v.name === this.speakerE) || this.voices[0];
            this.synth.speak(utterance);
        }
    }

    public speakC(text: string) {
        if (this.speakerC) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = this.voices.find(v => v.name === this.speakerC) || this.voices[0];
            this.synth.speak(utterance);
        }
    }

    public getVoices() {
        return this.voices;
    }

    public getSpeakerE() {
        return this.speakerE;
    }

    public getSpeakerC() {
        return this.speakerC;
    }

    public static getSynth(): SpeechSynthesis {
        return SpeechService.getInstance().synth;
    }
}

export function useSpeech() {
    const speechService = SpeechService.getInstance();
    const [voicesList, setVoicesList] = useState<string[]>([])
    const [currentSpeakerE, setCurrentSpeakerE] = useState(speechService.getSpeakerE());
    const [currentSpeakerC, setCurrentSpeakerC] = useState(speechService.getSpeakerC());

    useEffect(() => {
        const handleVoiceChange = () => {
            setCurrentSpeakerE(speechService.getSpeakerE());
            setCurrentSpeakerC(speechService.getSpeakerC());
            setVoicesList(speechService.getVoices().map(e => (e.name)))
        };

        speechService.addVoiceChangeListener(handleVoiceChange);
        speechService.initialize();
        return () => {
            speechService.removeVoiceChangeListener(handleVoiceChange);
        }
    }, []);

    const updateSpeakerE = useCallback((newSpeaker: string) => {
        const success = speechService.setSpeakerE(newSpeaker);
        if (success) {
            setCurrentSpeakerE(newSpeaker);
        }
        return success;
    }, []);

    const updateSpeakerC = useCallback((newSpeaker: string) => {
        const success = speechService.setSpeakerC(newSpeaker);
        if (success) {
            setCurrentSpeakerC(newSpeaker);
        }
        return success;
    }, []);

    return {
        synth: speechService.synth,
        voices: speechService.getVoices(),
        voicesList: voicesList,
        speakerE: currentSpeakerE,
        speakerC: currentSpeakerC,
        speakE: (text: string) => speechService.speakE(text),
        speakC: (text: string) => speechService.speakC(text),
        setSpeakerE: updateSpeakerE,
        setSpeakerC: updateSpeakerC
    };
}

export default useSpeech