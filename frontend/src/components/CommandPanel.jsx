import { useEffect, useRef, useState } from 'react';
import {
  MicrophoneIcon,
  PaperAirplaneIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon
} from '@heroicons/react/24/solid';
import clsx from 'clsx';

const SAMPLE_COMMANDS = [
  'Vendí 3 unidades del SKU AZUL-01',
  'Registra que Ana llegó a las 9:05',
  'Crea un recordatorio para llamar a Carla mañana a las 10am'
];

export function CommandPanel({ isLoading, result, error, onSubmit }) {
  const [command, setCommand] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [voiceFeedbackEnabled, setVoiceFeedbackEnabled] = useState(true);
  const [voiceError, setVoiceError] = useState('');
  const recognitionRef = useRef(null);
  const spokenMessageRef = useRef('');
  const resetCommandTimeoutRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!command.trim()) return;
    onSubmit(command.trim());
    setCommand('');
  };

  const cyclePlaceholder = () => {
    setPlaceholderIndex((index) => (index + 1) % SAMPLE_COMMANDS.length);
  };

  const toggleVoiceFeedback = () => {
    setVoiceFeedbackEnabled((enabled) => !enabled);
  };

  const stopRecognition = ({ skipStateUpdate = false } = {}) => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // ignored: stopping an idle recognition session throws in some browsers
      }
    }
    if (!skipStateUpdate) {
      setIsListening(false);
    }
  };

  const startRecognition = () => {
    if (!recognitionRef.current) return;
    setVoiceError('');
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      // In Chrome, calling start twice throws an error we can safely ignore
      setVoiceError('No se pudo iniciar el reconocimiento de voz. Intenta nuevamente.');
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (!isSpeechSupported) return;
    if (isListening) {
      stopRecognition();
    } else {
      startRecognition();
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      return undefined;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0]?.transcript;
      if (!transcript) return;
      setCommand(transcript);
      onSubmit(transcript);
      if (resetCommandTimeoutRef.current) {
        clearTimeout(resetCommandTimeoutRef.current);
      }
      resetCommandTimeoutRef.current = window.setTimeout(() => setCommand(''), 200);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event);
      setVoiceError('Hubo un error con el reconocimiento de voz.');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    setIsSpeechSupported(true);

    return () => {
      stopRecognition({ skipStateUpdate: true });
      recognitionRef.current = null;
    };
  }, [onSubmit]);

  useEffect(
    () => () => {
      if (resetCommandTimeoutRef.current) {
        clearTimeout(resetCommandTimeoutRef.current);
      }
    },
    []
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!voiceFeedbackEnabled) {
      window.speechSynthesis?.cancel?.();
      spokenMessageRef.current = '';
      return;
    }
    const message = result?.message;
    if (!message || message === spokenMessageRef.current) {
      return;
    }
    if (!('speechSynthesis' in window)) {
      return;
    }
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'es-ES';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    spokenMessageRef.current = message;
  }, [result, voiceFeedbackEnabled]);

  return (
    <section className="space-y-4 rounded-2xl border border-black/10 bg-white p-6 shadow-[0_25px_70px_-60px_rgba(0,0,0,0.65)]">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Consola conversacional</h2>
          <p className="text-sm text-neutral-500">
            Escribe o dicta instrucciones en español y deja que el agente actualice la base en memoria.
          </p>
        </div>
        <button
          type="button"
          onClick={cyclePlaceholder}
          className="hidden rounded-full border border-black/20 px-3 py-1 text-xs uppercase tracking-[0.35em] text-neutral-500 transition-colors hover:border-black/40 hover:text-neutral-900 sm:block"
        >
          Ver ejemplo
        </button>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <textarea
            rows={2}
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            placeholder={SAMPLE_COMMANDS[placeholderIndex]}
            className="w-full resize-none rounded-xl border border-black/15 bg-white px-4 py-3 text-sm text-neutral-900 shadow-inner shadow-black/10 placeholder:text-neutral-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          <span className="pointer-events-none absolute right-3 top-3 text-[10px] uppercase tracking-[0.45em] text-neutral-400">
            Español natural
          </span>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={toggleListening}
            disabled={!isSpeechSupported || isLoading}
            className={clsx(
              'flex items-center justify-center gap-2 rounded-xl border border-black/60 bg-black px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-900',
              (isLoading || !isSpeechSupported) && 'cursor-not-allowed opacity-60',
              isListening && 'outline outline-2 outline-offset-2 outline-black'
            )}
          >
            <MicrophoneIcon className="h-4 w-4 text-white" />
            {isListening ? 'Escuchando…' : 'Hablar'}
          </button>
          <button
            type="button"
            onClick={toggleVoiceFeedback}
            className={clsx(
              'flex items-center justify-center gap-2 rounded-xl border border-black/20 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:border-black/40 hover:bg-neutral-100',
              !voiceFeedbackEnabled && 'opacity-70'
            )}
          >
            {voiceFeedbackEnabled ? (
              <SpeakerWaveIcon className="h-4 w-4 text-black" />
            ) : (
              <SpeakerXMarkIcon className="h-4 w-4 text-black" />
            )}
            {voiceFeedbackEnabled ? 'Voz activa' : 'Voz apagada'}
          </button>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={clsx(
            'flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/25 transition-colors hover:bg-neutral-900',
            isLoading && 'cursor-not-allowed opacity-60'
          )}
        >
          <PaperAirplaneIcon className="h-4 w-4" />
          {isLoading ? 'Enviando…' : 'Enviar comando'}
        </button>
      </form>

      {error && (
        <p className="rounded-xl border border-black/10 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
          {error}
        </p>
      )}

      {!isSpeechSupported && (
        <p className="rounded-xl border border-black/10 bg-neutral-50 px-4 py-3 text-xs text-neutral-600">
          Tu navegador no soporta reconocimiento de voz. Puedes seguir escribiendo comandos manualmente.
        </p>
      )}

      {voiceError && (
        <p className="rounded-xl border border-black/10 bg-neutral-50 px-4 py-3 text-xs text-neutral-600">{voiceError}</p>
      )}

      {result && (
        <pre className="max-h-64 overflow-y-auto rounded-xl border border-black/10 bg-neutral-50 px-4 py-3 text-xs text-neutral-800">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </section>
  );
}
