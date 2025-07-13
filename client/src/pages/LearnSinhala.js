import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, CheckCircle, Mic, MicOff, ArrowRight, BookOpen, Star, ChevronRight } from 'lucide-react';
import apiClient from '../utils/axios';
import toast from 'react-hot-toast';

// Full Sinhala alphabet: 18 vowels, 41 consonants
const sinhalaVowels = [
  { letter: 'අ', sound: 'a', audio: '/audio/sinhala/a.mp3' },
  { letter: 'ආ', sound: 'aa', audio: '/audio/sinhala/aa.mp3' },
  { letter: 'ඇ', sound: 'ae', audio: '/audio/sinhala/ae.mp3' },
  { letter: 'ඈ', sound: 'aae', audio: '/audio/sinhala/aae.mp3' },
  { letter: 'ඉ', sound: 'i', audio: '/audio/sinhala/i.mp3' },
  { letter: 'ඊ', sound: 'ii', audio: '/audio/sinhala/ii.mp3' },
  { letter: 'උ', sound: 'u', audio: '/audio/sinhala/u.mp3' },
  { letter: 'ඌ', sound: 'uu', audio: '/audio/sinhala/uu.mp3' },
  { letter: 'ඍ', sound: 'ru', audio: '/audio/sinhala/ru.mp3' },
  { letter: 'ඎ', sound: 'roo', audio: '/audio/sinhala/roo.mp3' },
  { letter: 'ඏ', sound: 'lu', audio: '/audio/sinhala/lu.mp3' },
  { letter: 'ඐ', sound: 'loo', audio: '/audio/sinhala/loo.mp3' },
  { letter: 'එ', sound: 'e', audio: '/audio/sinhala/e.mp3' },
  { letter: 'ඒ', sound: 'ee', audio: '/audio/sinhala/ee.mp3' },
  { letter: 'ඓ', sound: 'ai', audio: '/audio/sinhala/ai.mp3' },
  { letter: 'ඔ', sound: 'o', audio: '/audio/sinhala/o.mp3' },
  { letter: 'ඕ', sound: 'oo', audio: '/audio/sinhala/oo.mp3' },
  { letter: 'ඖ', sound: 'au', audio: '/audio/sinhala/au.mp3' },
];

const sinhalaConsonants = [
  { letter: 'ක', sound: 'ka', audio: '/audio/sinhala/ka.mp3' },
  { letter: 'ඛ', sound: 'kha', audio: '/audio/sinhala/kha.mp3' },
  { letter: 'ග', sound: 'ga', audio: '/audio/sinhala/ga.mp3' },
  { letter: 'ඝ', sound: 'gha', audio: '/audio/sinhala/gha.mp3' },
  { letter: 'ඞ', sound: 'nga', audio: '/audio/sinhala/nga.mp3' },
  { letter: 'ච', sound: 'cha', audio: '/audio/sinhala/cha.mp3' },
  { letter: 'ඡ', sound: 'chha', audio: '/audio/sinhala/chha.mp3' },
  { letter: 'ජ', sound: 'ja', audio: '/audio/sinhala/ja.mp3' },
  { letter: 'ඣ', sound: 'jha', audio: '/audio/sinhala/jha.mp3' },
  { letter: 'ඤ', sound: 'nya', audio: '/audio/sinhala/nya.mp3' },
  { letter: 'ට', sound: 'ta', audio: '/audio/sinhala/ta.mp3' },
  { letter: 'ඨ', sound: 'tha', audio: '/audio/sinhala/tha.mp3' },
  { letter: 'ඩ', sound: 'da', audio: '/audio/sinhala/da.mp3' },
  { letter: 'ඪ', sound: 'dha', audio: '/audio/sinhala/dha.mp3' },
  { letter: 'ණ', sound: 'na', audio: '/audio/sinhala/na.mp3' },
  { letter: 'ත', sound: 'tha', audio: '/audio/sinhala/tha2.mp3' },
  { letter: 'ථ', sound: 'thha', audio: '/audio/sinhala/thha.mp3' },
  { letter: 'ද', sound: 'da', audio: '/audio/sinhala/da2.mp3' },
  { letter: 'ධ', sound: 'dha', audio: '/audio/sinhala/dha2.mp3' },
  { letter: 'න', sound: 'na', audio: '/audio/sinhala/na2.mp3' },
  { letter: 'ප', sound: 'pa', audio: '/audio/sinhala/pa.mp3' },
  { letter: 'ඵ', sound: 'pha', audio: '/audio/sinhala/pha.mp3' },
  { letter: 'බ', sound: 'ba', audio: '/audio/sinhala/ba.mp3' },
  { letter: 'භ', sound: 'bha', audio: '/audio/sinhala/bha.mp3' },
  { letter: 'ම', sound: 'ma', audio: '/audio/sinhala/ma.mp3' },
  { letter: 'ය', sound: 'ya', audio: '/audio/sinhala/ya.mp3' },
  { letter: 'ර', sound: 'ra', audio: '/audio/sinhala/ra.mp3' },
  { letter: 'ල', sound: 'la', audio: '/audio/sinhala/la.mp3' },
  { letter: 'ව', sound: 'va', audio: '/audio/sinhala/va.mp3' },
  { letter: 'ශ', sound: 'sha', audio: '/audio/sinhala/sha.mp3' },
  { letter: 'ෂ', sound: 'ssha', audio: '/audio/sinhala/ssha.mp3' },
  { letter: 'ස', sound: 'sa', audio: '/audio/sinhala/sa.mp3' },
  { letter: 'හ', sound: 'ha', audio: '/audio/sinhala/ha.mp3' },
  { letter: 'ළ', sound: 'la', audio: '/audio/sinhala/la2.mp3' },
  { letter: 'ෆ', sound: 'fa', audio: '/audio/sinhala/fa.mp3' },
  { letter: 'ඥ', sound: 'gna', audio: '/audio/sinhala/gna.mp3' },
  { letter: 'ඳ', sound: 'nda', audio: '/audio/sinhala/nda.mp3' },
  { letter: 'ඹ', sound: 'mba', audio: '/audio/sinhala/mba.mp3' },
  { letter: 'ඬ', sound: 'nda', audio: '/audio/sinhala/nda2.mp3' },
  { letter: 'ඦ', sound: 'nja', audio: '/audio/sinhala/nja.mp3' },
];

const beginnerWords = [
  { sinhala: 'අම්මා', english: 'Mother', audio: '/audio/sinhala/amma.mp3' },
  { sinhala: 'තාත්තා', english: 'Father', audio: '/audio/sinhala/thaththa.mp3' },
  { sinhala: 'පානිය', english: 'Drink', audio: '/audio/sinhala/paniya.mp3' },
  { sinhala: 'කෑම', english: 'Food', audio: '/audio/sinhala/kaema.mp3' },
  { sinhala: 'ගුරු', english: 'Teacher', audio: '/audio/sinhala/guru.mp3' },
  { sinhala: 'මිතුරා', english: 'Friend', audio: '/audio/sinhala/mitura.mp3' },
  // ... add more words
];

const grammarLessons = [
  { title: 'Simple Sentences', content: 'In Sinhala, a simple sentence structure is: Subject + Verb + Object. Example: මම පොතක් කියවමි (I read a book).' },
  { title: 'Present Tense', content: 'Present tense verbs in Sinhala often end with "මි" (mi). Example: මම කෑම කමි (I eat food).' },
  // ... add more lessons
];

const speakingPrompts = [
  'Say "Hello" in Sinhala',
  'Introduce yourself in Sinhala',
  'Say "Thank you" in Sinhala',
  // ... add more prompts
];

const activities = [
  { type: 'match', question: 'Match the Sinhala word to its English meaning', pairs: [
    { sinhala: 'අම්මා', english: 'Mother' },
    { sinhala: 'තාත්තා', english: 'Father' },
    { sinhala: 'පානිය', english: 'Drink' },
  ]},
  { type: 'fill', question: 'Fill in the blank: මම ____ කියවමි (I read ____)', answer: 'පොතක්' },
  // Drag-and-drop matching
  { type: 'drag', question: 'Drag the English meaning to the correct Sinhala word', pairs: [
    { sinhala: 'කෑම', english: 'Food' },
    { sinhala: 'මිතුරා', english: 'Friend' },
    { sinhala: 'ගුරු', english: 'Teacher' },
  ]},
  // Listening comprehension
  { type: 'listen', question: 'Listen and select the correct meaning', options: [
    { audio: '/audio/sinhala/amma.mp3', correct: 'Mother', choices: ['Mother', 'Father', 'Friend'] },
    { audio: '/audio/sinhala/kaema.mp3', correct: 'Food', choices: ['Drink', 'Food', 'Teacher'] },
  ]},
];

// Advanced grammar, vocabulary, idioms, and activities
const advancedGrammar = [
  { title: 'Past Tense', content: 'Sinhala past tense verbs often end with "ා" (aa) or "ො" (o). Example: මම කෑම කෑවා (I ate food).' },
  { title: 'Future Tense', content: 'Future tense verbs often end with "ෙම්" (em). Example: මම පොතක් කියවෙම් (I will read a book).' },
  { title: 'Continuous Tense', content: 'Continuous tense uses "කරමින්" (karamin). Example: මම කෑම කමින් සිටිමි (I am eating food).' },
  { title: 'Questions & Negation', content: 'Questions use words like "ද?" (da?). Negation uses "නෑ" (nae). Example: ඔයා කෑම කාලාද? (Did you eat?) මම කෑම කාලා නෑ (I did not eat).' },
  { title: 'Honorifics & Formality', content: 'Sinhala uses honorifics for respect. Example: ඔබ (Oba) is formal for "you"; ඔයා (Oyaa) is informal.' },
  { title: 'Sentence Connectors', content: 'Use "හා" (haa) for "and", "නමුත්" (namuth) for "but". Example: මම කෑම කෑවා හා පානය බීවා (I ate food and drank a drink).' },
];

const advancedVocab = [
  { sinhala: 'ඉදිරියට', english: 'Forward' },
  { sinhala: 'අතීතය', english: 'Past' },
  { sinhala: 'ඉක්මන්', english: 'Quick' },
  { sinhala: 'සාර්ථකත්වය', english: 'Success' },
  { sinhala: 'ඉඩම්', english: 'Land' },
  { sinhala: 'ඉදිරිපත්', english: 'Present (to present something)' },
];

const advancedIdioms = [
  { sinhala: 'අතට අත දීම', english: 'To help (literally: give a hand)' },
  { sinhala: 'ඉර හිරවීම', english: 'To be embarrassed (literally: sun is blocked)' },
  { sinhala: 'කනට කන දීම', english: 'To whisper (literally: give ear to ear)' },
];

const advancedActivities = [
  { type: 'transform', question: 'Change the tense: "මම කෑම කමි" (I eat food) → Past tense', answer: 'මම කෑම කෑවා' },
  { type: 'idiom', question: 'Match the Sinhala idiom to its English meaning', pairs: advancedIdioms },
  { type: 'translate', question: 'Translate to Sinhala: "I will read a book"', answer: 'මම පොතක් කියවෙම්' },
];

const advancedNotes = [
  'Sinhala has a rich set of honorifics and polite forms. Use them in formal situations.',
  'Word order is flexible, but Subject-Object-Verb is most common.',
  'Many Sinhala idioms are based on nature and daily life.',
  'Sinhala script is one of the oldest continuously used scripts in South Asia, with roots in ancient Brahmi.',
  'The language has absorbed words from Pali, Sanskrit, Tamil, Portuguese, Dutch, and English due to Sri Lanka’s long history of trade and colonization.',
  'Writing Sinhala requires mastering the combination of consonants and vowels, as well as special conjunct forms.',
  'Politeness and respect are very important in Sinhala culture, especially when addressing elders or strangers.',
];

const courseSteps = [
  { key: 'alphabet', label: 'Sinhala Alphabet', icon: BookOpen },
  { key: 'words', label: 'Basic Words', icon: Star },
  { key: 'grammar', label: 'Basic Grammar', icon: BookOpen },
  { key: 'speaking', label: 'Speaking Test', icon: Mic },
  { key: 'activities', label: 'Interactive Activities', icon: CheckCircle },
  { key: 'advanced', label: 'Advanced', icon: Star },
];

// English course structure for Sinhala speakers
const englishCourseSteps = [
  { key: 'alphabet', label: 'English Alphabet', icon: BookOpen },
  { key: 'words', label: 'Basic Words', icon: Star },
  { key: 'grammar', label: 'Basic Grammar', icon: BookOpen },
  { key: 'speaking', label: 'Speaking Test', icon: Mic },
  { key: 'activities', label: 'Interactive Activities', icon: CheckCircle },
  { key: 'advanced', label: 'Advanced', icon: Star },
];

// Update English course content for Sinhala speakers
const englishAlphabet = [
  { letter: 'A', sound: 'ඒ', example: 'Apple', sinhala: 'ඇපල්' },
  { letter: 'B', sound: 'බී', example: 'Ball', sinhala: 'බෝලය' },
  { letter: 'C', sound: 'සී', example: 'Cat', sinhala: 'බළලා' },
  { letter: 'D', sound: 'ඩී', example: 'Dog', sinhala: 'බල්ලා' },
  { letter: 'E', sound: 'ඊ', example: 'Elephant', sinhala: 'ඇතා' },
  { letter: 'F', sound: 'එෆ්', example: 'Fish', sinhala: 'මාළුව' },
  { letter: 'G', sound: 'ජී', example: 'Goat', sinhala: 'එළුවා' },
  { letter: 'H', sound: 'එච්', example: 'Hat', sinhala: 'තොප්පිය' },
  { letter: 'I', sound: 'අයි', example: 'Ice', sinhala: 'අයිස්' },
  { letter: 'J', sound: 'ජේ', example: 'Jug', sinhala: 'කූඹය' },
  { letter: 'K', sound: 'කේ', example: 'Kite', sinhala: 'ඉදල' },
  { letter: 'L', sound: 'එල්', example: 'Lion', sinhala: 'සිංහයා' },
  { letter: 'M', sound: 'එම්', example: 'Monkey', sinhala: 'වාදුරා' },
  { letter: 'N', sound: 'එන්', example: 'Nest', sinhala: 'කොටුව' },
  { letter: 'O', sound: 'ඔ', example: 'Orange', sinhala: 'දොඩම්' },
  { letter: 'P', sound: 'පී', example: 'Pen', sinhala: 'පෑන' },
  { letter: 'Q', sound: 'කියු', example: 'Queen', sinhala: 'රැජින' },
  { letter: 'R', sound: 'ආර්', example: 'Rat', sinhala: 'මීයා' },
  { letter: 'S', sound: 'එස්', example: 'Sun', sinhala: 'හිරු' },
  { letter: 'T', sound: 'ටී', example: 'Tiger', sinhala: 'කොටියා' },
  { letter: 'U', sound: 'යූ', example: 'Umbrella', sinhala: 'ඉදල' },
  { letter: 'V', sound: 'වී', example: 'Van', sinhala: 'වෑන් රථය' },
  { letter: 'W', sound: 'ඩබ්ලිව්', example: 'Watch', sinhala: 'ඔරලෝසුව' },
  { letter: 'X', sound: 'එක්ස්', example: 'Box', sinhala: 'පෙට්ටිය' },
  { letter: 'Y', sound: 'වයි', example: 'Yak', sinhala: 'යාක්' },
  { letter: 'Z', sound: 'සෙඩ්', example: 'Zebra', sinhala: 'කලු-සුදු සිංහයා' },
];

const englishBasicWords = [
  { english: 'Mother', sinhala: 'අම්මා', example: 'My mother is kind. (මගේ අම්මා හිතවත්යි)' },
  { english: 'Father', sinhala: 'තාත්තා', example: 'My father is strong. (මගේ තාත්තා ශක්තිමත්යි)' },
  { english: 'Food', sinhala: 'කෑම', example: 'I like food. (මම කෑම කැමතියි)' },
  { english: 'Water', sinhala: 'වතුර', example: 'Water is important. (වතුර වැදගත්)' },
  { english: 'Friend', sinhala: 'මිතුරා', example: 'He is my friend. (ඔහු මගේ මිතුරා)' },
  { english: 'Book', sinhala: 'පොත', example: 'This is a book. (මෙය පොතක්)' },
];

const englishGrammar = [
  { title: 'Simple Sentences', content: 'ඉංග්‍රීසි වාක්‍ය ව්‍යුහය: Subject + Verb + Object. උදා: I read a book. (මම පොතක් කියවමි)' },
  { title: 'Present Tense', content: 'වර්තමාන කාලය: I eat, you go, he runs. (මම කනවා, ඔයා යනවා, ඔහු දුවනවා)' },
  { title: 'Questions', content: 'ප්‍රශ්න: Do/Does යොදා ගන්න. Do you eat? (ඔයා කනවාද?)' },
];

const englishNotes = [
  'ඉංග්‍රීසි ලෝකයේ වැඩිම ජනතාව කතා කරන භාෂාවයි.',
  'ඉංග්‍රීසි අකුරු 26යි. උච්චාරණය සහ අකුරු වෙනස් විය හැක.',
  'ඉංග්‍රීසි කතා කිරීම සහ ඇසීමේ පුහුණුව',
  'ඉංග්‍රීසි වාක්‍ය ව්‍යුහය සාමාන්‍යයෙන් Subject-Verb-Object වේ.',
];

// English activities for Sinhala speakers
const englishActivities = [
  { type: 'match', question: 'ඉංග්‍රීසි වචනය සිංහලයට ගැලපෙන්න', pairs: [
    { english: 'Mother', sinhala: 'අම්මා' },
    { english: 'Book', sinhala: 'පොත' },
    { english: 'Friend', sinhala: 'මිතුරා' },
  ]},
  { type: 'fill', question: 'හිස් තැන පුරවන්න: I ___ a book. (මම පොතක් ___)', answer: 'read' },
  { type: 'listen', question: 'ඉංග්‍රීසි වචනය ඇහුම්කන් දී සිංහල අර්ථය තෝරන්න', options: [
    { audio: '/audio/english/mother.mp3', correct: 'අම්මා', choices: ['අම්මා', 'තාත්තා', 'මිතුරා'] },
    { audio: '/audio/english/book.mp3', correct: 'පොත', choices: ['පොත', 'කෑම', 'වතුර'] },
  ]},
];

export default function Learn() {
  const [languageTab, setLanguageTab] = useState('sinhala');
  const [step, setStep] = useState('alphabet');
  const [traced, setTraced] = useState({});
  const [spoken, setSpoken] = useState('');
  const [activityResult, setActivityResult] = useState(null);
  const [fillInput, setFillInput] = useState('');
  const [matchAnswers, setMatchAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);

  // Drag-and-drop state
  const [dragged, setDragged] = useState(null);
  const [dragAnswers, setDragAnswers] = useState({});
  // Listening comprehension state
  const [listenAnswers, setListenAnswers] = useState({});

  // Advanced activities state
  const [transformInput, setTransformInput] = useState('');
  const [idiomAnswers, setIdiomAnswers] = useState({});
  const [translateInput, setTranslateInput] = useState('');

  // English state
  const [englishStep, setEnglishStep] = useState('alphabet');

  // English activities state
  const [engMatchAnswers, setEngMatchAnswers] = useState({});
  const [engFillInput, setEngFillInput] = useState('');
  const [engListenAnswers, setEngListenAnswers] = useState({});
  const [engActivityResult, setEngActivityResult] = useState(null);
  const [engShowFeedback, setEngShowFeedback] = useState(false);

  // English activity handlers
  const checkEngMatch = () => {
    const correct = englishActivities[0].pairs.every(
      (pair) => engMatchAnswers[pair.english] === pair.sinhala
    );
    setEngShowFeedback(true);
    setEngActivityResult(correct);
  };
  const checkEngFill = () => {
    setEngShowFeedback(true);
    setEngActivityResult(engFillInput.trim().toLowerCase() === englishActivities[1].answer);
  };
  const checkEngListen = (idx, choice) => {
    setEngListenAnswers({ ...engListenAnswers, [idx]: choice });
    setEngShowFeedback(true);
    setEngActivityResult(choice === englishActivities[2].options[idx].correct);
  };

  // Audio play helper
  const playAudio = (audio) => {
    const audioObj = new Audio(audio);
    audioObj.play();
  };

  // Simple Web Speech API speaking test (for Chrome/Edge)
  const handleSpeak = (prompt) => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'si-LK';
    recognition.onresult = (event) => {
      setSpoken(event.results[0][0].transcript);
      setShowFeedback(true);
    };
    recognition.onerror = () => {
      setSpoken('');
      setShowFeedback(true);
    };
    recognition.start();
  };

  // Activity checkers
  const checkFill = () => {
    setShowFeedback(true);
    setActivityResult(fillInput.trim() === activities[1].answer);
  };
  const checkMatch = () => {
    const correct = activities[0].pairs.every(
      (pair) => matchAnswers[pair.sinhala] === pair.english
    );
    setShowFeedback(true);
    setActivityResult(correct);
  };

  // Drag-and-drop handlers
  const handleDragStart = (english) => setDragged(english);
  const handleDrop = (sinhala) => {
    if (dragged) {
      setDragAnswers({ ...dragAnswers, [sinhala]: dragged });
      setDragged(null);
    }
  };
  const checkDrag = () => {
    const correct = activities[2].pairs.every(
      (pair) => dragAnswers[pair.sinhala] === pair.english
    );
    setShowFeedback(true);
    setActivityResult(correct);
  };
  // Listening comprehension check
  const checkListen = (idx, choice) => {
    setListenAnswers({ ...listenAnswers, [idx]: choice });
    setShowFeedback(true);
    setActivityResult(choice === activities[3].options[idx].correct);
  };

  // Advanced activity checkers
  const checkTransform = () => {
    setShowFeedback(true);
    setActivityResult(transformInput.trim() === advancedActivities[0].answer);
  };
  const checkIdiom = () => {
    const correct = advancedIdioms.every(
      (idiom) => idiomAnswers[idiom.sinhala] === idiom.english
    );
    setShowFeedback(true);
    setActivityResult(correct);
  };
  const checkTranslate = () => {
    setShowFeedback(true);
    setActivityResult(translateInput.trim() === advancedActivities[2].answer);
    if (translateInput.trim() === advancedActivities[2].answer) {
      updateProgress('advanced', 'sinhala');
    }
  };

  const updateProgress = async (lessonType, language) => {
    try {
      const xpGained = 10; // Base XP for completing a lesson
      await apiClient.post('/api/progress/update', {
        xpGained,
        lessonCompleted: {
          language,
          lessonId: `${language}_${lessonType}`
        },
        skill: 'reading',
        level: 25 // Increment skill level
      });
      toast.success(`Lesson completed! +${xpGained} XP`);
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  // Tab panel for language selection
  const renderTabs = () => (
    <div className="flex gap-2 mb-6">
      <button
        className={`px-4 py-2 rounded-t-lg font-semibold transition-all ${languageTab === 'sinhala' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
        onClick={() => setLanguageTab('sinhala')}
      >
        Learn Sinhala
      </button>
      <button
        className={`px-4 py-2 rounded-t-lg font-semibold transition-all ${languageTab === 'english' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
        onClick={() => setLanguageTab('english')}
      >
        Learn English
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold mb-2 text-blue-700 dark:text-blue-200">Learn</h1>
        {renderTabs()}
        {languageTab === 'sinhala' && (
          <>
            <div className="mb-6 text-gray-600 dark:text-gray-300">
              <p className="mb-2">Welcome to a complete Sinhala course! Sinhala (සිංහල) is the language of the Sinhalese people of Sri Lanka, with a unique script and rich history. This course covers the full alphabet, pronunciation, grammar, vocabulary, idioms, and cultural context.</p>
              <ul className="list-disc pl-6 text-sm">
                <li><b>Script:</b> Sinhala uses its own script, derived from ancient Brahmi. It is written left-to-right and is syllabic, with each character representing a syllable.</li>
                <li><b>Alphabet:</b> There are 18 vowels and 41 consonants, plus many combined forms. Vowels can stand alone or combine with consonants to form syllables.</li>
                <li><b>Pronunciation:</b> Sinhala has unique sounds not found in English. Listen to the audio for each letter and practice tracing and writing.</li>
                <li><b>Culture:</b> Language and culture are deeply connected in Sinhala. Idioms, honorifics, and politeness are important in daily speech.</li>
              </ul>
            </div>
            <div className="flex gap-4 mb-8">
              {courseSteps.map((s, idx) => (
                <button
                  key={s.key}
                  onClick={() => setStep(s.key)}
                  className={`flex flex-col items-center px-4 py-2 rounded-xl transition-all ${step === s.key ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                >
                  <s.icon className="mb-1" />
                  <span className="text-xs font-semibold">{s.label}</span>
                  {idx < courseSteps.length - 1 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                </button>
              ))}
            </div>
            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-4">
              {courseSteps.map((s, idx) => (
                <div key={s.key} className="flex items-center">
                  <div className={`w-4 h-4 rounded-full ${step === s.key ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                  {idx < courseSteps.length - 1 && <div className="w-8 h-1 bg-gray-300 dark:bg-gray-700 mx-1 rounded"></div>}
                </div>
              ))}
            </div>
            {/* Alphabet Step */}
            {step === 'alphabet' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Sinhala Alphabet</h2>
                <div className="mb-4 text-blue-900 dark:text-blue-200 text-sm">The Sinhala alphabet is divided into vowels (ස්වර) and consonants (ව්‍යංජන). Practice each letter, listen to its sound, and try writing it.</div>
                <h3 className="text-xl font-semibold mb-2 mt-4">Vowels (ස්වර)</h3>
                <div className="grid grid-cols-6 gap-4 mb-6">
                  {sinhalaVowels.map((l, idx) => (
                    <motion.div
                      key={l.letter}
                      whileHover={{ scale: 1.1 }}
                      className="bg-blue-100 dark:bg-blue-900/40 rounded-xl p-4 flex flex-col items-center shadow-md"
                    >
                      <span className="text-3xl font-bold mb-2">{l.letter}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-200 mb-2">{l.sound}</span>
                      <button onClick={() => playAudio(l.audio)} className="text-blue-600 dark:text-blue-300 hover:text-blue-800">
                        <Volume2 />
                      </button>
                      <span className="mt-2 text-xs text-gray-400">(Trace on paper)</span>
                    </motion.div>
                  ))}
                </div>
                <h3 className="text-xl font-semibold mb-2 mt-4">Consonants (ව්‍යංජන)</h3>
                <div className="grid grid-cols-6 gap-4 mb-6">
                  {sinhalaConsonants.map((l, idx) => (
                    <motion.div
                      key={l.letter}
                      whileHover={{ scale: 1.1 }}
                      className="bg-green-100 dark:bg-green-900/40 rounded-xl p-4 flex flex-col items-center shadow-md"
                    >
                      <span className="text-3xl font-bold mb-2">{l.letter}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-200 mb-2">{l.sound}</span>
                      <button onClick={() => playAudio(l.audio)} className="text-green-600 dark:text-green-300 hover:text-green-800">
                        <Volume2 />
                      </button>
                      <span className="mt-2 text-xs text-gray-400">(Trace on paper)</span>
                    </motion.div>
                  ))}
                </div>
                <div className="mb-4 text-xs text-gray-500 dark:text-gray-400">Note: Each consonant can combine with vowels to form syllables (e.g., ක + ආ = කා). Mastering these combinations is key to reading and writing Sinhala.</div>
                <button className="btn-primary" onClick={() => setStep('words')}>Next: Basic Words <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Words Step */}
            {step === 'words' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Basic Words & Phrases</h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {beginnerWords.map((w, idx) => (
                    <motion.div
                      key={w.sinhala}
                      whileHover={{ scale: 1.05 }}
                      className="bg-green-100 dark:bg-green-900/40 rounded-xl p-4 flex flex-col items-center shadow-md"
                    >
                      <span className="text-xl font-bold mb-1">{w.sinhala}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-200 mb-2">{w.english}</span>
                      <button onClick={() => playAudio(w.audio)} className="text-green-600 dark:text-green-300 hover:text-green-800">
                        <Volume2 />
                      </button>
                    </motion.div>
                  ))}
                </div>
                <button className="btn-primary" onClick={() => setStep('grammar')}>Next: Basic Grammar <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Grammar Step */}
            {step === 'grammar' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Basic Grammar</h2>
                <div className="space-y-4 mb-6">
                  {grammarLessons.map((g, idx) => (
                    <motion.div
                      key={g.title}
                      whileHover={{ scale: 1.02 }}
                      className="bg-yellow-100 dark:bg-yellow-900/40 rounded-xl p-4 shadow-md"
                    >
                      <h3 className="font-semibold text-lg mb-2">{g.title}</h3>
                      <p className="text-gray-700 dark:text-gray-200">{g.content}</p>
                    </motion.div>
                  ))}
                </div>
                <button className="btn-primary" onClick={() => setStep('speaking')}>Next: Speaking Test <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Speaking Test Step */}
            {step === 'speaking' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Speaking Test</h2>
                <div className="mb-4">
                  <p className="mb-2 text-gray-600 dark:text-gray-300">Try saying the following in Sinhala:</p>
                  {speakingPrompts.map((prompt, idx) => (
                    <div key={prompt} className="flex items-center gap-2 mb-2">
                      <span className="text-gray-800 dark:text-gray-100">{prompt}</span>
                      <button onClick={() => handleSpeak(prompt)} className="text-blue-600 dark:text-blue-300 hover:text-blue-800">
                        <Mic />
                      </button>
                    </div>
                  ))}
                  {showFeedback && (
                    <div className="mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700">
                      <span className="font-semibold">You said:</span> <span className="text-blue-700 dark:text-blue-200">{spoken}</span>
                    </div>
                  )}
                </div>
                <button className="btn-primary" onClick={() => setStep('activities')}>Next: Interactive Activities <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Activities Step */}
            {step === 'activities' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Interactive Activities</h2>
                <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/30 rounded text-sm text-blue-800 dark:text-blue-200">Try the activities below! Drag, listen, and fill in the blanks to test your Sinhala skills.</div>
                {/* Matching Activity */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">1. {activities[0].question}</h3>
                  <div className="text-xs mb-1 text-gray-500">Select the correct English meaning for each Sinhala word.</div>
                  <div className="grid grid-cols-2 gap-4">
                    {activities[0].pairs.map((pair, idx) => (
                      <div key={pair.sinhala} className="flex items-center gap-2">
                        <span className="font-bold text-blue-700 dark:text-blue-300">{pair.sinhala}</span>
                        <select
                          className="input-field text-sm"
                          value={matchAnswers[pair.sinhala] || ''}
                          onChange={e => setMatchAnswers({ ...matchAnswers, [pair.sinhala]: e.target.value })}
                        >
                          <option value="">Select</option>
                          {activities[0].pairs.map((p) => (
                            <option key={p.english} value={p.english}>{p.english}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                  <button className="btn-secondary mt-2" onClick={checkMatch}>Check</button>
                  {showFeedback && activityResult !== null && (
                    <div className={`mt-2 p-2 rounded-xl ${activityResult ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {activityResult ? 'Correct!' : 'Try again!'}
                    </div>
                  )}
                </div>
                {/* Fill in the Blank Activity */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">2. {activities[1].question}</h3>
                  <div className="text-xs mb-1 text-gray-500">Type the correct Sinhala word in the blank.</div>
                  <input
                    className="input-field text-sm mr-2"
                    value={fillInput}
                    onChange={e => setFillInput(e.target.value)}
                    placeholder="Type your answer"
                  />
                  <button className="btn-secondary" onClick={checkFill}>Check</button>
                  {showFeedback && activityResult !== null && (
                    <div className={`mt-2 p-2 rounded-xl ${activityResult ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {activityResult ? 'Correct!' : 'Try again!'}
                    </div>
                  )}
                </div>
                {/* Drag-and-Drop Matching Activity */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">3. {activities[2].question}</h3>
                  <div className="text-xs mb-1 text-gray-500">Drag the English word to the correct Sinhala word.</div>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Sinhala targets */}
                    <div className="space-y-2">
                      {activities[2].pairs.map((pair) => (
                        <div
                          key={pair.sinhala}
                          className="bg-blue-100 dark:bg-blue-900/40 rounded p-2 flex items-center min-h-[40px]"
                          onDragOver={e => e.preventDefault()}
                          onDrop={() => handleDrop(pair.sinhala)}
                        >
                          <span className="font-bold mr-2">{pair.sinhala}</span>
                          <span className="ml-auto text-green-700 dark:text-green-300">
                            {dragAnswers[pair.sinhala] || <span className="text-gray-400">(Drop here)</span>}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* English draggable options */}
                    <div className="space-y-2">
                      {activities[2].pairs.map((pair) => (
                        <div
                          key={pair.english}
                          className="bg-green-100 dark:bg-green-900/40 rounded p-2 cursor-move"
                          draggable
                          onDragStart={() => handleDragStart(pair.english)}
                        >
                          {pair.english}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button className="btn-secondary mt-2" onClick={checkDrag}>Check</button>
                  {showFeedback && activityResult !== null && (
                    <div className={`mt-2 p-2 rounded-xl ${activityResult ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {activityResult ? 'Correct!' : 'Try again!'}
                    </div>
                  )}
                </div>
                {/* Listening Comprehension Activity */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">4. {activities[3].question}</h3>
                  <div className="text-xs mb-1 text-gray-500">Listen to the audio and select the correct meaning.</div>
                  {activities[3].options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <button onClick={() => playAudio(opt.audio)} className="text-blue-600 dark:text-blue-300 hover:text-blue-800">
                        <Volume2 />
                      </button>
                      <span className="mr-2">Audio {idx + 1}</span>
                      {opt.choices.map(choice => (
                        <button
                          key={choice}
                          className={`btn-secondary ml-1 ${listenAnswers[idx] === choice ? 'ring-2 ring-blue-400' : ''}`}
                          onClick={() => checkListen(idx, choice)}
                        >
                          {choice}
                        </button>
                      ))}
                      {showFeedback && listenAnswers[idx] && (
                        <span className={`ml-2 font-semibold ${listenAnswers[idx] === opt.correct ? 'text-green-700' : 'text-red-700'}`}>
                          {listenAnswers[idx] === opt.correct ? 'Correct!' : 'Try again!'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <button className="btn-primary" onClick={() => setStep('alphabet')}>Restart Course</button>
              </div>
            )}
            {/* Advanced Step */}
            {step === 'advanced' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Advanced Sinhala</h2>
                <div className="mb-4 p-2 bg-purple-50 dark:bg-purple-900/30 rounded text-sm text-purple-800 dark:text-purple-200">
                  Explore advanced grammar, vocabulary, idioms, and cultural notes.
                </div>
                {/* Advanced Grammar */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Advanced Grammar</h3>
                  <div className="space-y-2">
                    {advancedGrammar.map((g, idx) => (
                      <motion.div
                        key={g.title}
                        whileHover={{ scale: 1.02 }}
                        className="bg-yellow-100 dark:bg-yellow-900/40 rounded-xl p-4 shadow-md"
                      >
                        <h4 className="font-semibold text-md mb-1">{g.title}</h4>
                        <p className="text-gray-700 dark:text-gray-200">{g.content}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                {/* Advanced Vocabulary */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Advanced Vocabulary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {advancedVocab.map((w, idx) => (
                      <div key={w.sinhala} className="bg-green-100 dark:bg-green-900/40 rounded-xl p-3 flex flex-col items-center shadow-md">
                        <span className="text-lg font-bold mb-1">{w.sinhala}</span>
                        <span className="text-sm text-gray-700 dark:text-gray-200 mb-1">{w.english}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Advanced Idioms */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Common Idioms</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {advancedIdioms.map((idiom, idx) => (
                      <div key={idiom.sinhala} className="bg-blue-100 dark:bg-blue-900/40 rounded-xl p-3 flex flex-col items-center shadow-md">
                        <span className="text-lg font-bold mb-1">{idiom.sinhala}</span>
                        <span className="text-sm text-gray-700 dark:text-gray-200 mb-1">{idiom.english}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Advanced Activities */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Advanced Activities</h3>
                  {/* Sentence Transformation */}
                  <div className="mb-4">
                    <div className="mb-1 text-gray-500 text-xs">Change the tense of the given sentence to past tense.</div>
                    <div className="mb-1 font-semibold">මම කෑම කමි (I eat food)</div>
                    <input
                      className="input-field text-sm mr-2"
                      value={transformInput}
                      onChange={e => setTransformInput(e.target.value)}
                      placeholder="Type the past tense in Sinhala"
                    />
                    <button className="btn-secondary" onClick={checkTransform}>Check</button>
                    {showFeedback && activityResult !== null && (
                      <div className={`mt-2 p-2 rounded-xl ${activityResult ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {activityResult ? 'Correct!' : 'Try again!'}
                      </div>
                    )}
                  </div>
                  {/* Idiom Matching */}
                  <div className="mb-4">
                    <div className="mb-1 text-gray-500 text-xs">Match the Sinhala idiom to its English meaning.</div>
                    {advancedIdioms.map((idiom) => (
                      <div key={idiom.sinhala} className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-blue-700 dark:text-blue-300">{idiom.sinhala}</span>
                        <select
                          className="input-field text-sm"
                          value={idiomAnswers[idiom.sinhala] || ''}
                          onChange={e => setIdiomAnswers({ ...idiomAnswers, [idiom.sinhala]: e.target.value })}
                        >
                          <option value="">Select</option>
                          {advancedIdioms.map((i) => (
                            <option key={i.english} value={i.english}>{i.english}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                    <button className="btn-secondary mt-2" onClick={checkIdiom}>Check</button>
                    {showFeedback && activityResult !== null && (
                      <div className={`mt-2 p-2 rounded-xl ${activityResult ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {activityResult ? 'Correct!' : 'Try again!'}
                      </div>
                    )}
                  </div>
                  {/* Translation Activity */}
                  <div className="mb-4">
                    <div className="mb-1 text-gray-500 text-xs">Translate the English sentence to Sinhala (future tense).</div>
                    <div className="mb-1 font-semibold">I will read a book</div>
                    <input
                      className="input-field text-sm mr-2"
                      value={translateInput}
                      onChange={e => setTranslateInput(e.target.value)}
                      placeholder="Type the Sinhala translation"
                    />
                    <button className="btn-secondary" onClick={checkTranslate}>Check</button>
                    {showFeedback && activityResult !== null && (
                      <div className={`mt-2 p-2 rounded-xl ${activityResult ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {activityResult ? 'Correct!' : 'Try again!'}
                      </div>
                    )}
                  </div>
                </div>
                {/* Cultural Notes */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Cultural & Language Notes</h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200">
                    {advancedNotes.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                </div>
                <button className="btn-primary" onClick={() => setStep('alphabet')}>Restart Course</button>
              </div>
            )}
          </>
        )}
        {languageTab === 'english' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">ඉංග්‍රීසි ඉගෙන ගන්න (සිංහල භාෂාවෙන්)</h2>
            <div className="mb-6 text-gray-600 dark:text-gray-300">
              <p>මෙම කොටසින් ඔබට ඉංග්‍රීසි අකුරු, වචන, ව්‍යාකරණය, කතා කිරීම, ක්‍රියාකාරකම් සහ සංස්කෘතික සටහන් සිංහලෙන් ඉගෙන ගන්න පුළුවන්.</p>
              <ul className="list-disc pl-6 text-sm">
                <li>අකුරු සහ උච්චාරණය</li>
                <li>මූලික සහ උසස් වචන</li>
                <li>ව්‍යාකරණය සහ වාක්‍ය ව්‍යුහය</li>
                <li>කතා කිරීම සහ ඇසීමේ පුහුණුව</li>
                <li>සංස්කෘතික සටහන් සහ ඉදියම්</li>
              </ul>
            </div>
            <div className="flex gap-4 mb-8">
              {englishCourseSteps.map((s, idx) => (
                <button
                  key={s.key}
                  onClick={() => setEnglishStep(s.key)}
                  className={`flex flex-col items-center px-4 py-2 rounded-xl transition-all ${englishStep === s.key ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                >
                  <s.icon className="mb-1" />
                  <span className="text-xs font-semibold">{s.label}</span>
                  {idx < englishCourseSteps.length - 1 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                </button>
              ))}
            </div>
            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-4">
              {englishCourseSteps.map((s, idx) => (
                <div key={s.key} className="flex items-center">
                  <div className={`w-4 h-4 rounded-full ${englishStep === s.key ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                  {idx < englishCourseSteps.length - 1 && <div className="w-8 h-1 bg-gray-300 dark:bg-gray-700 mx-1 rounded"></div>}
                </div>
              ))}
            </div>
            {/* Alphabet Step */}
            {englishStep === 'alphabet' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">ඉංග්‍රීසි අකුරු</h2>
                <div className="mb-4 text-blue-900 dark:text-blue-200 text-sm">ඉංග්‍රීසි අකුරු 26ක් ඇත. එක් එක් අකුරේ නම, ශබ්දය සහ උදාහරණයක් පහතින් දැක්වේ.</div>
                <div className="grid grid-cols-6 gap-4 mb-6">
                  {englishAlphabet.map((l, idx) => (
                    <div key={l.letter} className="bg-blue-100 dark:bg-blue-900/40 rounded-xl p-4 flex flex-col items-center shadow-md">
                      <span className="text-3xl font-bold mb-2">{l.letter}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-200 mb-1">{l.sound}</span>
                      <span className="text-xs text-gray-500">{l.example} - {l.sinhala}</span>
                    </div>
                  ))}
                </div>
                <button className="btn-primary" onClick={() => setEnglishStep('words')}>ඊළඟ: මූලික වචන <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Words Step */}
            {englishStep === 'words' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">මූලික වචන සහ වාක්‍ය</h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {englishBasicWords.map((w, idx) => (
                    <div key={w.english} className="bg-green-100 dark:bg-green-900/40 rounded-xl p-4 flex flex-col items-center shadow-md">
                      <span className="text-xl font-bold mb-1">{w.english} - {w.sinhala}</span>
                      <span className="text-xs text-gray-500">{w.example}</span>
                    </div>
                  ))}
                </div>
                <button className="btn-primary" onClick={() => setEnglishStep('grammar')}>ඊළඟ: ව්‍යාකරණය <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Grammar Step */}
            {englishStep === 'grammar' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">මූලික ව්‍යාකරණය</h2>
                <div className="space-y-4 mb-6">
                  {englishGrammar.map((g, idx) => (
                    <div key={g.title} className="bg-yellow-100 dark:bg-yellow-900/40 rounded-xl p-4 shadow-md">
                      <h3 className="font-semibold text-lg mb-2">{g.title}</h3>
                      <p className="text-gray-700 dark:text-gray-200">{g.content}</p>
                    </div>
                  ))}
                </div>
                <button className="btn-primary" onClick={() => setEnglishStep('speaking')}>ඊළඟ: කතා කිරීම <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Speaking Test Step */}
            {englishStep === 'speaking' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Speaking Test</h2>
                <div className="mb-4 text-gray-600 dark:text-gray-300">Try saying these English words and phrases aloud. (මෙම ඉංග්‍රීසි වචන සහ වාක්‍ය උච්චාරණය කරන්න.)</div>
                <ul className="list-disc pl-6 mb-4">
                  <li>Hello</li>
                  <li>My name is ...</li>
                  <li>Thank you</li>
                  <li>How are you?</li>
                  <li>I am learning English</li>
                </ul>
                {/* Placeholder for speech recognition activity */}
                <button className="btn-primary" onClick={() => setEnglishStep('activities')}>Next: Interactive Activities <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Activities Step */}
            {englishStep === 'activities' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">ක්‍රියාකාරකම්</h2>
                <div className="mb-4 text-gray-600 dark:text-gray-300">ඉංග්‍රීසි වචන, වාක්‍ය, සහ අර්ථය හඳුනා ගැනීමට ක්‍රියාකාරකම් කරන්න.</div>
                {/* Matching Activity */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">1. {englishActivities[0].question}</h3>
                  <div className="text-xs mb-1 text-gray-500">ඉංග්‍රීසි වචනයට නිවැරදි සිංහල අර්ථය තෝරන්න.</div>
                  <div className="grid grid-cols-2 gap-4">
                    {englishActivities[0].pairs.map((pair, idx) => (
                      <div key={pair.english} className="flex items-center gap-2">
                        <span className="font-bold text-blue-700 dark:text-blue-300">{pair.english}</span>
                        <select
                          className="input-field text-sm"
                          value={engMatchAnswers[pair.english] || ''}
                          onChange={e => setEngMatchAnswers({ ...engMatchAnswers, [pair.english]: e.target.value })}
                        >
                          <option value="">තෝරන්න</option>
                          {englishActivities[0].pairs.map((p) => (
                            <option key={p.sinhala} value={p.sinhala}>{p.sinhala}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                  <button className="btn-secondary mt-2" onClick={checkEngMatch}>පරීක්ෂා කරන්න</button>
                  {engShowFeedback && engActivityResult !== null && (
                    <div className={`mt-2 p-2 rounded-xl ${engActivityResult ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {engActivityResult ? 'නිවැරදියි!' : 'නැවත උත්සාහ කරන්න!'}
                    </div>
                  )}
                </div>
                {/* Fill in the Blank Activity */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">2. {englishActivities[1].question}</h3>
                  <div className="text-xs mb-1 text-gray-500">සිංහල උපදෙස්: පොතක් කියවන්න = read a book</div>
                  <input
                    className="input-field text-sm mr-2"
                    value={engFillInput}
                    onChange={e => setEngFillInput(e.target.value)}
                    placeholder="ඉංග්‍රීසි වචනය ලියන්න"
                  />
                  <button className="btn-secondary" onClick={checkEngFill}>පරීක්ෂා කරන්න</button>
                  {engShowFeedback && engActivityResult !== null && (
                    <div className={`mt-2 p-2 rounded-xl ${engActivityResult ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {engActivityResult ? 'නිවැරදියි!' : 'නැවත උත්සාහ කරන්න!'}
                    </div>
                  )}
                </div>
                {/* Listening Comprehension Activity */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">3. {englishActivities[2].question}</h3>
                  <div className="text-xs mb-1 text-gray-500">ඉංග්‍රීසි වචනය ඇහුම්කන් දී නිවැරදි සිංහල අර්ථය තෝරන්න.</div>
                  {englishActivities[2].options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <button onClick={() => playAudio(opt.audio)} className="text-blue-600 dark:text-blue-300 hover:text-blue-800">
                        <Volume2 />
                      </button>
                      <span className="mr-2">Audio {idx + 1}</span>
                      {opt.choices.map(choice => (
                        <button
                          key={choice}
                          className={`btn-secondary ml-1 ${engListenAnswers[idx] === choice ? 'ring-2 ring-blue-400' : ''}`}
                          onClick={() => checkEngListen(idx, choice)}
                        >
                          {choice}
                        </button>
                      ))}
                      {engShowFeedback && engListenAnswers[idx] && (
                        <span className={`ml-2 font-semibold ${engListenAnswers[idx] === opt.correct ? 'text-green-700' : 'text-red-700'}`}>
                          {engListenAnswers[idx] === opt.correct ? 'නිවැරදියි!' : 'නැවත උත්සාහ කරන්න!'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <button className="btn-primary" onClick={() => setEnglishStep('advanced')}>ඊළඟ: උසස් <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Advanced Step */}
            {englishStep === 'advanced' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Advanced English</h2>
                <div className="mb-4 text-gray-600 dark:text-gray-300">Learn advanced grammar, vocabulary, and idioms. (ඉහළම ඉංග්‍රීසි ව්‍යාකරණය, වචන, ඉදියම්.)</div>
                {/* Placeholder for advanced content */}
                <button className="btn-primary" onClick={() => setEnglishStep('notes')}>Next: Notes <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Notes Step */}
            {englishStep === 'notes' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">සංස්කෘතික සහ භාෂා සටහන්</h2>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200">
                  {englishNotes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
                <button className="btn-primary mt-4" onClick={() => setEnglishStep('alphabet')}>පැමිණෙන්න: අකුරු</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 