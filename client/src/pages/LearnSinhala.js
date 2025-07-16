import React, { useState, useEffect } from 'react';
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
  { sinhala: 'පොත', english: 'Book', audio: '/audio/sinhala/potha.mp3' },
  { sinhala: 'වතුර', english: 'Water', audio: '/audio/sinhala/wathura.mp3' },
  { sinhala: 'ගෙදර', english: 'Home', audio: '/audio/sinhala/gedara.mp3' },
  { sinhala: 'පාසල', english: 'School', audio: '/audio/sinhala/pasal.mp3' },
  { sinhala: 'රථය', english: 'Vehicle', audio: '/audio/sinhala/rathaya.mp3' },
  { sinhala: 'අහස', english: 'Sky', audio: '/audio/sinhala/ahas.mp3' },
  { sinhala: 'බිම', english: 'Ground', audio: '/audio/sinhala/bima.mp3' },
  { sinhala: 'හිරු', english: 'Sun', audio: '/audio/sinhala/hiru.mp3' },
  { sinhala: 'සඳ', english: 'Moon', audio: '/audio/sinhala/sanda.mp3' },
  { sinhala: 'තරා', english: 'Star', audio: '/audio/sinhala/thara.mp3' },
  { sinhala: 'මල', english: 'Flower', audio: '/audio/sinhala/mala.mp3' },
  { sinhala: 'ගස', english: 'Tree', audio: '/audio/sinhala/gasa.mp3' },
  { sinhala: 'මාළුව', english: 'Fish', audio: '/audio/sinhala/maluwa.mp3' },
  { sinhala: 'බල්ලා', english: 'Dog', audio: '/audio/sinhala/balla.mp3' },
  { sinhala: 'බළලා', english: 'Cat', audio: '/audio/sinhala/balala.mp3' },
  { sinhala: 'ඇතා', english: 'Elephant', audio: '/audio/sinhala/etha.mp3' },
  { sinhala: 'සිංහයා', english: 'Lion', audio: '/audio/sinhala/sinhaya.mp3' },
  { sinhala: 'කොටියා', english: 'Tiger', audio: '/audio/sinhala/kotiya.mp3' },
  { sinhala: 'එළුවා', english: 'Goat', audio: '/audio/sinhala/eluwa.mp3' },
  { sinhala: 'ගවයා', english: 'Cow', audio: '/audio/sinhala/gawaya.mp3' },
  { sinhala: 'අශ්වයා', english: 'Horse', audio: '/audio/sinhala/ashwaya.mp3' },
  { sinhala: 'කුකුළා', english: 'Chicken', audio: '/audio/sinhala/kukula.mp3' },
  { sinhala: 'හාවා', english: 'Rabbit', audio: '/audio/sinhala/hawa.mp3' },
  { sinhala: 'බල්ලා', english: 'Dog', audio: '/audio/sinhala/balla.mp3' },
  { sinhala: 'බළලා', english: 'Cat', audio: '/audio/sinhala/balala.mp3' },
  { sinhala: 'ඇතා', english: 'Elephant', audio: '/audio/sinhala/etha.mp3' },
  { sinhala: 'සිංහයා', english: 'Lion', audio: '/audio/sinhala/sinhaya.mp3' },
  { sinhala: 'කොටියා', english: 'Tiger', audio: '/audio/sinhala/kotiya.mp3' },
  { sinhala: 'එළුවා', english: 'Goat', audio: '/audio/sinhala/eluwa.mp3' },
  { sinhala: 'ගවයා', english: 'Cow', audio: '/audio/sinhala/gawaya.mp3' },
  { sinhala: 'අශ්වයා', english: 'Horse', audio: '/audio/sinhala/ashwaya.mp3' },
  { sinhala: 'කුකුළා', english: 'Chicken', audio: '/audio/sinhala/kukula.mp3' },
  { sinhala: 'හාවා', english: 'Rabbit', audio: '/audio/sinhala/hawa.mp3' },
];

const grammarLessons = [
  { title: 'Simple Sentences', content: 'In Sinhala, a simple sentence structure is: Subject + Verb + Object. Example: මම පොතක් කියවමි (I read a book).' },
  { title: 'Present Tense', content: 'Present tense verbs in Sinhala often end with "මි" (mi). Example: මම කෑම කමි (I eat food).' },
  { title: 'Past Tense', content: 'Past tense verbs often end with "ා" (aa) or "ො" (o). Example: මම කෑම කෑවා (I ate food).' },
  { title: 'Future Tense', content: 'Future tense verbs often end with "ෙම්" (em). Example: මම පොතක් කියවෙම් (I will read a book).' },
  { title: 'Questions', content: 'Questions use words like "ද?" (da?). Example: ඔයා කෑම කාලාද? (Did you eat?)' },
  { title: 'Negation', content: 'Negation uses "නෑ" (nae). Example: මම කෑම කාලා නෑ (I did not eat).' },
  { title: 'Honorifics', content: 'Use honorifics for respect. Example: ඔබ (Oba) is formal for "you"; ඔයා (Oyaa) is informal.' },
  { title: 'Pronouns', content: 'මම (I), ඔයා (you), ඔහු (he), ඇය (she), අපි (we), ඔබලා (you all), ඔවුන් (they).' },
  { title: 'Possessive', content: 'Add "ගේ" (ge) for possession. Example: මගේ පොත (my book), ඔයාගේ පොත (your book).' },
  { title: 'Numbers', content: 'එක (1), දෙක (2), තුන (3), හතර (4), පහ (5), හය (6), හත (7), අට (8), නවය (9), දහය (10).' },
  { title: 'Colors', content: 'රතු (red), නිල් (blue), කහ (yellow), කොළ (green), කළු (black), සුදු (white), තැඹිලි (orange), රෝස (pink).' },
  { title: 'Time', content: 'දැන් (now), ඊයේ (yesterday), අද (today), හෙට (tomorrow), උදේ (morning), සවස (evening), රෑ (night).' },
  { title: 'Directions', content: 'උතුර (north), දකුණ (south), නැගෙනහිර (east), බස්නාහිර (west), ඉහළ (up), පහළ (down).' },
  { title: 'Weather', content: 'උණුසුම් (hot), සීතල (cold), වැසි (rain), හිරු (sun), සඳ (moon), වලාකුළු (clouds).' },
  { title: 'Family', content: 'අම්මා (mother), තාත්තා (father), අයියා (elder brother), අක්කා (elder sister), මල්ලි (younger sibling).' },
  { title: 'Body Parts', content: 'හිස (head), ඇස (eye), කන් (ear), නාසය (nose), මුව (mouth), අත (hand), කකුල (leg).' },
  { title: 'Clothing', content: 'ඇඳුම (clothes), කමිසය (shirt), තොප්පිය (hat), සපත්තු (shoes), තොටි (socks).' },
  { title: 'Food & Drinks', content: 'බත් (rice), රොටි (bread), මස් (meat), එළවළු (vegetables), කිරි (milk), තේ (tea), කෝපි (coffee).' },
  { title: 'Emotions', content: 'සතුට (happy), දුක (sad), බය (fear), කෝපය (anger), ප්‍රීතිය (joy), විශ්වාසය (trust).' },
  { title: 'Professions', content: 'ගුරු (teacher), වෛද්‍ය (doctor), ඉංජිනේරු (engineer), වෙළෙන්දා (merchant), ගොවි (farmer).' },
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
  'The language has absorbed words from Pali, Sanskrit, Tamil, Portuguese, Dutch, and English due to Sri Lanka\'s long history of trade and colonization.',
  'Writing Sinhala requires mastering the combination of consonants and vowels, as well as special conjunct forms.',
  'Politeness and respect are very important in Sinhala culture, especially when addressing elders or strangers.',
];

const courseSteps = [
  { key: 'alphabet', label: 'Sinhala Alphabet', icon: BookOpen },
  { key: 'words', label: 'Basic Words', icon: Star },
  { key: 'grammar', label: 'Basic Grammar', icon: BookOpen },
  { key: 'speaking', label: 'Speaking Test', icon: Mic },
  { key: 'activities', label: 'Interactive Activities', icon: CheckCircle },
  { key: 'vocabulary', label: 'Advanced Vocabulary', icon: Star },
  { key: 'conversation', label: 'Conversation Practice', icon: Mic },
  { key: 'reading', label: 'Reading Comprehension', icon: BookOpen },
  { key: 'writing', label: 'Writing Practice', icon: CheckCircle },
  { key: 'culture', label: 'Cultural Context', icon: Star },
  { key: 'advanced', label: 'Advanced Grammar', icon: BookOpen },
  { key: 'literature', label: 'Literature & Poetry', icon: Star },
];

// English course structure for Sinhala speakers
const englishCourseSteps = [
  { key: 'alphabet', label: 'English Alphabet', icon: BookOpen },
  { key: 'words', label: 'Basic Words', icon: Star },
  { key: 'grammar', label: 'Basic Grammar', icon: BookOpen },
  { key: 'speaking', label: 'Speaking Test', icon: Mic },
  { key: 'activities', label: 'Interactive Activities', icon: CheckCircle },
  { key: 'vocabulary', label: 'Advanced Vocabulary', icon: Star },
  { key: 'conversation', label: 'Conversation Practice', icon: Mic },
  { key: 'reading', label: 'Reading Comprehension', icon: BookOpen },
  { key: 'writing', label: 'Writing Practice', icon: CheckCircle },
  { key: 'business', label: 'Business English', icon: Star },
  { key: 'academic', label: 'Academic English', icon: BookOpen },
  { key: 'advanced', label: 'Advanced Grammar', icon: Star },
  { key: 'literature', label: 'Literature & Poetry', icon: BookOpen },
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
  { english: 'House', sinhala: 'ගෙදර', example: 'This is my house. (මෙය මගේ ගෙදර)' },
  { english: 'School', sinhala: 'පාසල', example: 'I go to school. (මම පාසලට යනවා)' },
  { english: 'Car', sinhala: 'රථය', example: 'This is a car. (මෙය රථයක්)' },
  { english: 'Tree', sinhala: 'ගස', example: 'The tree is tall. (ගස උස්යි)' },
  { english: 'Sun', sinhala: 'හිරු', example: 'The sun is bright. (හිරු බැහැයි)' },
  { english: 'Moon', sinhala: 'සඳ', example: 'The moon is beautiful. (සඳ ලස්සනයි)' },
  { english: 'Star', sinhala: 'තරා', example: 'Stars are bright. (තරා බැහැයි)' },
  { english: 'Flower', sinhala: 'මල', example: 'The flower is red. (මල රතුයි)' },
  { english: 'Dog', sinhala: 'බල්ලා', example: 'The dog is friendly. (බල්ලා මිතුරු සුහදයි)' },
  { english: 'Cat', sinhala: 'බළලා', example: 'The cat is sleeping. (බළලා නිදනවා)' },
  { english: 'Bird', sinhala: 'පක්ෂියා', example: 'The bird is flying. (පක්ෂියා පියාඹනවා)' },
  { english: 'Fish', sinhala: 'මාළුව', example: 'The fish is swimming. (මාළුව පිහිනනවා)' },
  { english: 'Elephant', sinhala: 'ඇතා', example: 'The elephant is big. (ඇතා විශාලයි)' },
  { english: 'Lion', sinhala: 'සිංහයා', example: 'The lion is strong. (සිංහයා ශක්තිමත්යි)' },
  { english: 'Tiger', sinhala: 'කොටියා', example: 'The tiger is fast. (කොටියා වේගවත්යි)' },
  { english: 'Cow', sinhala: 'ගවයා', example: 'The cow gives milk. (ගවයා කිරි දෙනවා)' },
  { english: 'Horse', sinhala: 'අශ්වයා', example: 'The horse runs fast. (අශ්වයා වේගයෙන් දුවනවා)' },
  { english: 'Chicken', sinhala: 'කුකුළා', example: 'The chicken lays eggs. (කුකුළා බිත්තර දානවා)' },
  { english: 'Rabbit', sinhala: 'හාවා', example: 'The rabbit hops. (හාවා පනිනවා)' },
  { english: 'Apple', sinhala: 'ඇපල්', example: 'I eat an apple. (මම ඇපල් කනවා)' },
  { english: 'Banana', sinhala: 'කෙසෙල්', example: 'The banana is yellow. (කෙසෙල් කහයි)' },
  { english: 'Orange', sinhala: 'දොඩම්', example: 'The orange is sweet. (දොඩම් රසවත්යි)' },
  { english: 'Rice', sinhala: 'බත්', example: 'I eat rice. (මම බත් කනවා)' },
  { english: 'Bread', sinhala: 'රොටි', example: 'The bread is fresh. (රොටි නැවුම්යි)' },
  { english: 'Milk', sinhala: 'කිරි', example: 'I drink milk. (මම කිරි බොනවා)' },
  { english: 'Tea', sinhala: 'තේ', example: 'I drink tea. (මම තේ බොනවා)' },
  { english: 'Coffee', sinhala: 'කෝපි', example: 'I drink coffee. (මම කෝපි බොනවා)' },
  { english: 'Red', sinhala: 'රතු', example: 'The flower is red. (මල රතුයි)' },
  { english: 'Blue', sinhala: 'නිල්', example: 'The sky is blue. (අහස නිල්යි)' },
  { english: 'Green', sinhala: 'කොළ', example: 'The tree is green. (ගස කොළයි)' },
  { english: 'Yellow', sinhala: 'කහ', example: 'The sun is yellow. (හිරු කහයි)' },
  { english: 'Black', sinhala: 'කළු', example: 'The night is black. (රෑ කළුයි)' },
  { english: 'White', sinhala: 'සුදු', example: 'The cloud is white. (වලාකුළ සුදුයි)' },
  { english: 'Big', sinhala: 'විශාල', example: 'The elephant is big. (ඇතා විශාලයි)' },
  { english: 'Small', sinhala: 'කුඩා', example: 'The ant is small. (බොරුව කුඩායි)' },
  { english: 'Good', sinhala: 'හොඳ', example: 'This is good. (මෙය හොඳයි)' },
  { english: 'Bad', sinhala: 'නරක', example: 'This is bad. (මෙය නරකයි)' },
  { english: 'Hot', sinhala: 'උණුසුම්', example: 'The tea is hot. (තේ උණුසුම්යි)' },
  { english: 'Cold', sinhala: 'සීතල', example: 'The water is cold. (වතුර සීතලයි)' },
  { english: 'Happy', sinhala: 'සතුටු', example: 'I am happy. (මම සතුටුයි)' },
  { english: 'Sad', sinhala: 'දුක්', example: 'I am sad. (මම දුක්වෙනවා)' },
  { english: 'Fast', sinhala: 'වේගවත්', example: 'The car is fast. (රථය වේගවත්යි)' },
  { english: 'Slow', sinhala: 'මන්දගාමී', example: 'The turtle is slow. (කැස්බෑව මන්දගාමීයි)' },
  { english: 'New', sinhala: 'අලුත්', example: 'This is new. (මෙය අලුත්යි)' },
  { english: 'Old', sinhala: 'පරණ', example: 'This is old. (මෙය පරණයි)' },
  { english: 'Beautiful', sinhala: 'ලස්සන', example: 'The flower is beautiful. (මල ලස්සනයි)' },
  { english: 'Ugly', sinhala: 'අවලස්සන', example: 'This is ugly. (මෙය අවලස්සනයි)' },
  { english: 'One', sinhala: 'එක', example: 'I have one book. (මට පොතක් තියෙනවා)' },
  { english: 'Two', sinhala: 'දෙක', example: 'I have two books. (මට පොත් දෙකක් තියෙනවා)' },
  { english: 'Three', sinhala: 'තුන', example: 'I have three books. (මට පොත් තුනක් තියෙනවා)' },
  { english: 'Four', sinhala: 'හතර', example: 'I have four books. (මට පොත් හතරක් තියෙනවා)' },
  { english: 'Five', sinhala: 'පහ', example: 'I have five books. (මට පොත් පහක් තියෙනවා)' },
  { english: 'Ten', sinhala: 'දහය', example: 'I have ten books. (මට පොත් දහයක් තියෙනවා)' },
  { english: 'Hundred', sinhala: 'සියය', example: 'I have hundred books. (මට පොත් සියයක් තියෙනවා)' },
  { english: 'Thousand', sinhala: 'දහස', example: 'I have thousand books. (මට පොත් දහසක් තියෙනවා)' },
];

const englishGrammar = [
  { title: 'Simple Sentences', content: 'ඉංග්‍රීසි වාක්‍ය ව්‍යුහය: Subject + Verb + Object. උදා: I read a book. (මම පොතක් කියවමි)' },
  { title: 'Present Tense', content: 'වර්තමාන කාලය: I eat, you go, he runs. (මම කනවා, ඔයා යනවා, ඔහු දුවනවා)' },
  { title: 'Past Tense', content: 'අතීත කාලය: I ate, you went, he ran. (මම කෑවා, ඔයා ගියා, ඔහු දුව්වා)' },
  { title: 'Future Tense', content: 'අනාගත කාලය: I will eat, you will go, he will run. (මම කන්නම්, ඔයා යන්නම්, ඔහු දුවන්නම්)' },
  { title: 'Questions', content: 'ප්‍රශ්න: Do/Does යොදා ගන්න. Do you eat? (ඔයා කනවාද?)' },
  { title: 'Negation', content: 'නිෂේධනය: Don\'t/Doesn\'t යොදා ගන්න. I don\'t eat. (මම කනවා නෑ)' },
  { title: 'Pronouns', content: 'සර්වනාම: I (මම), you (ඔයා), he (ඔහු), she (ඇය), it (එය), we (අපි), they (ඔවුන්)' },
  { title: 'Possessive', content: 'අයිතිය: my (මගේ), your (ඔයාගේ), his (ඔහුගේ), her (ඇයගේ), its (එයගේ), our (අපගේ), their (ඔවුන්ගේ)' },
  { title: 'Articles', content: 'ආර්ටිකල්: a/an (එකක්), the (එම). A book (පොතක්), the book (එම පොත)' },
  { title: 'Plural', content: 'බහුවචන: Add -s to most words. Book → Books (පොත → පොත්)' },
  { title: 'Adjectives', content: 'විශේෂණ: big (විශාල), small (කුඩා), good (හොඳ), bad (නරක), beautiful (ලස්සන)' },
  { title: 'Adverbs', content: 'ක්‍රියා විශේෂණ: quickly (වේගයෙන්), slowly (මන්දගාමීව), well (හොඳින්), badly (නරකින්)' },
  { title: 'Prepositions', content: 'පූර්වපද: in (ඇතුළත), on (උඩ), at (වෙත), to (ට), from (වෙතින්), with (සමඟ), by (විසින්)' },
  { title: 'Conjunctions', content: 'සංයෝජක: and (හා), but (නමුත්), or (හෝ), because (මොකද), if (නම්), when (විට)' },
  { title: 'Numbers', content: 'අංක: one (1), two (2), three (3), four (4), five (5), ten (10), hundred (100), thousand (1000)' },
  { title: 'Colors', content: 'වර්ණ: red (රතු), blue (නිල්), green (කොළ), yellow (කහ), black (කළු), white (සුදු), orange (තැඹිලි), pink (රෝස)' },
  { title: 'Time', content: 'කාලය: now (දැන්), today (අද), yesterday (ඊයේ), tomorrow (හෙට), morning (උදේ), evening (සවස), night (රෑ)' },
  { title: 'Days', content: 'දින: Monday (සඳුදා), Tuesday (අඟහරුවාදා), Wednesday (බදාදා), Thursday (බ්‍රහස්පතින්දා), Friday (සිකුරාදා), Saturday (සෙනසුරාදා), Sunday (ඉරිදා)' },
  { title: 'Months', content: 'මාස: January (ජනවාරි), February (පෙබරවාරි), March (මාර්තු), April (අප්‍රේල්), May (මැයි), June (ජූනි), July (ජූලි), August (අගෝස්තු), September (සැප්තැම්බර්), October (ඔක්තෝබර්), November (නොවැම්බර්), December (දෙසැම්බර්)' },
  { title: 'Seasons', content: 'ඍතු: spring (වසන්ත), summer (ගිම්හාන), autumn (ශරත්), winter (ශීත)' },
  { title: 'Weather', content: 'කාලගුණ: sunny (හිරු), rainy (වැසි), cloudy (වලාකුළු), windy (සුළඟ), hot (උණුසුම්), cold (සීතල)' },
  { title: 'Family', content: 'පවුල: mother (අම්මා), father (තාත්තා), brother (සහෝදරයා), sister (සහෝදරිය), son (පුතා), daughter (දුව)' },
  { title: 'Body Parts', content: 'ශරීර අවයව: head (හිස), eye (ඇස), ear (කන්), nose (නාසය), mouth (මුව), hand (අත), leg (කකුල)' },
  { title: 'Clothing', content: 'ඇඳුම්: shirt (කමිසය), pants (කලිසම), dress (ඇඳුම), hat (තොප්පිය), shoes (සපත්තු), socks (තොටි)' },
  { title: 'Food & Drinks', content: 'ආහාර හා පාන: rice (බත්), bread (රොටි), meat (මස්), vegetables (එළවළු), milk (කිරි), tea (තේ), coffee (කෝපි)' },
  { title: 'Emotions', content: 'හැඟීම්: happy (සතුටු), sad (දුක්), angry (කෝප), afraid (බය), excited (උද්‍යෝග), tired (අවසර)' },
  { title: 'Professions', content: 'වෘත්තීන්: teacher (ගුරු), doctor (වෛද්‍ය), engineer (ඉංජිනේරු), farmer (ගොවි), driver (රියැදුර), cook (පාෂණික)' },
  { title: 'Transportation', content: 'ප්‍රවාහන: car (රථය), bus (බස්), train (දුම්රිය), plane (ගුවන් යානා), bicycle (පාපැදි), motorcycle (මෝටර් රථ)' },
  { title: 'Places', content: 'ස්ථාන: house (ගෙදර), school (පාසල), hospital (රෝහල), market (පාලම), park (උද්‍යාන), library (පුස්තකාල)' },
  { title: 'Actions', content: 'ක්‍රියා: eat (කනවා), drink (බොනවා), sleep (නිදනවා), walk (ඇවිදිනවා), run (දුවනවා), read (කියවනවා), write (ලියනවා)' },
  { title: 'Comparisons', content: 'සංසන්දන: big (විශාල) → bigger (වඩා විශාල) → biggest (වඩාත්ම විශාල), good (හොඳ) → better (වඩා හොඳ) → best (වඩාත්ම හොඳ)' },
  { title: 'Modal Verbs', content: 'මෝඩල් ක්‍රියා: can (හැකි), could (හැකි විය), will (වනු ඇත), would (වනු ඇත), should (යුතු), must (අනිවාර්‍ය)' },
  { title: 'Conditionals', content: 'කොන්දේසි: If it rains, I will stay home. (වැසි වුණොත් මම ගෙදර ඉන්නම්)' },
  { title: 'Passive Voice', content: 'කර්මකාරක: The book is read by me. (පොත මා විසින් කියවනු ලබනවා)' },
  { title: 'Reported Speech', content: 'වාර්තා කරන කථා: He said that he was tired. (ඔහු කිව්වා ඔහු අවසර බව)' },
  { title: 'Gerunds & Infinitives', content: 'ක්‍රියා නාම: I like reading. (මම කියවීම කැමතියි) I want to read. (මම කියවීමට අවශ්‍යයි)' },
  { title: 'Phrasal Verbs', content: 'ක්‍රියා වාක්‍ය: look up (සොයා බලනවා), give up (අත්හරිනවා), put on (ඇඳගන්නවා), take off (ඉවත් කරනවා)' },
  { title: 'Idioms', content: 'ඉදියම්: It\'s raining cats and dogs. (වැසි වැටෙනවා), Break a leg! (සුභ පැතුම්!), Piece of cake (පහසු)' },
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

// Add Tamil course structure and activities
const tamilCourseSteps = [
  { key: 'alphabet', label: 'Tamil Alphabet', icon: BookOpen },
  { key: 'words', label: 'Basic Words', icon: Star },
  { key: 'grammar', label: 'Basic Grammar', icon: BookOpen },
  { key: 'speaking', label: 'Speaking Test', icon: Mic },
  { key: 'activities', label: 'Interactive Activities', icon: CheckCircle },
  { key: 'vocabulary', label: 'Advanced Vocabulary', icon: Star },
  { key: 'conversation', label: 'Conversation Practice', icon: Mic },
  { key: 'reading', label: 'Reading Comprehension', icon: BookOpen },
  { key: 'writing', label: 'Writing Practice', icon: CheckCircle },
  { key: 'culture', label: 'Cultural Context', icon: Star },
  { key: 'advanced', label: 'Advanced Grammar', icon: BookOpen },
  { key: 'literature', label: 'Literature & Poetry', icon: Star },
];
const tamilAlphabet = [
  // Vowels (உயிரெழுத்துக்கள்)
  { letter: 'அ', sound: 'a', example: 'அம்மா (Mother)' },
  { letter: 'ஆ', sound: 'aa', example: 'ஆடு (Goat)' },
  { letter: 'இ', sound: 'i', example: 'இலை (Leaf)' },
  { letter: 'ஈ', sound: 'ii', example: 'ஈரம் (Wet)' },
  { letter: 'உ', sound: 'u', example: 'உப்பு (Salt)' },
  { letter: 'ஊ', sound: 'uu', example: 'ஊர்வலம் (Procession)' },
  { letter: 'எ', sound: 'e', example: 'எழுத்து (Letter)' },
  { letter: 'ஏ', sound: 'ee', example: 'ஏழு (Seven)' },
  { letter: 'ஐ', sound: 'ai', example: 'ஐந்து (Five)' },
  { letter: 'ஒ', sound: 'o', example: 'ஒன்று (One)' },
  { letter: 'ஓ', sound: 'oo', example: 'ஓடு (Run)' },
  { letter: 'ஔ', sound: 'au', example: 'ஔவையார் (Poetess)' },
  // Consonants (மெய்யெழுத்துக்கள்)
  { letter: 'க', sound: 'ka', example: 'கடல் (Sea)' },
  { letter: 'ங', sound: 'nga', example: 'ஙாபி (Crow)' },
  { letter: 'ச', sound: 'sa', example: 'சந்திரன் (Moon)' },
  { letter: 'ஞ', sound: 'nya', example: 'ஞாயிறு (Sun)' },
  { letter: 'ட', sound: 'ta', example: 'டப்பா (Box)' },
  { letter: 'ண', sound: 'na', example: 'ணாபி (Crow)' },
  { letter: 'த', sound: 'tha', example: 'தமிழ் (Tamil)' },
  { letter: 'ந', sound: 'na', example: 'நடை (Walk)' },
  { letter: 'ப', sound: 'pa', example: 'பழம் (Fruit)' },
  { letter: 'ம', sound: 'ma', example: 'மழை (Rain)' },
  { letter: 'ய', sound: 'ya', example: 'யானை (Elephant)' },
  { letter: 'ர', sound: 'ra', example: 'ராஜா (King)' },
  { letter: 'ல', sound: 'la', example: 'லட்சம் (Lakh)' },
  { letter: 'வ', sound: 'va', example: 'வானம் (Sky)' },
  { letter: 'ழ', sound: 'zha', example: 'ழகரம் (Letter)' },
  { letter: 'ள', sound: 'la', example: 'ளகரம் (Letter)' },
  { letter: 'ற', sound: 'ra', example: 'றகரம் (Letter)' },
  { letter: 'ன', sound: 'na', example: 'னகரம் (Letter)' },
];
const tamilBasicWords = [
  { tamil: 'அம்மா', english: 'Mother', example: 'அம்மா நல்லவள். (Mother is good.)' },
  { tamil: 'அப்பா', english: 'Father', example: 'அப்பா வந்தார். (Father came.)' },
  { tamil: 'நீர்', english: 'Water', example: 'நீர் முக்கியம். (Water is important.)' },
  { tamil: 'உணவு', english: 'Food', example: 'உணவு சாப்பிடுகிறேன். (I am eating food.)' },
  { tamil: 'நண்பர்', english: 'Friend', example: 'அவர் என் நண்பர். (He is my friend.)' },
  { tamil: 'புத்தகம்', english: 'Book', example: 'இது புத்தகம். (This is a book.)' },
  { tamil: 'வணக்கம்', english: 'Hello', example: 'வணக்கம்! (Hello!)' },
  { tamil: 'நன்றி', english: 'Thank you', example: 'நன்றி! (Thank you!)' },
  { tamil: 'வீடு', english: 'House', example: 'இது என் வீடு. (This is my house.)' },
  { tamil: 'பள்ளி', english: 'School', example: 'நான் பள்ளிக்கு செல்கிறேன். (I go to school.)' },
  { tamil: 'கார்', english: 'Car', example: 'இது கார். (This is a car.)' },
  { tamil: 'மரம்', english: 'Tree', example: 'மரம் உயரமாக உள்ளது. (The tree is tall.)' },
  { tamil: 'சூரியன்', english: 'Sun', example: 'சூரியன் பிரகாசமாக உள்ளது. (The sun is bright.)' },
  { tamil: 'நிலா', english: 'Moon', example: 'நிலா அழகாக உள்ளது. (The moon is beautiful.)' },
  { tamil: 'நட்சத்திரம்', english: 'Star', example: 'நட்சத்திரங்கள் பிரகாசமாக உள்ளன. (Stars are bright.)' },
  { tamil: 'மலர்', english: 'Flower', example: 'மலர் சிவப்பு நிறத்தில் உள்ளது. (The flower is red.)' },
  { tamil: 'நாய்', english: 'Dog', example: 'நாய் நட்பு உள்ளது. (The dog is friendly.)' },
  { tamil: 'பூனை', english: 'Cat', example: 'பூனை தூங்குகிறது. (The cat is sleeping.)' },
  { tamil: 'பறவை', english: 'Bird', example: 'பறவை பறக்கிறது. (The bird is flying.)' },
  { tamil: 'மீன்', english: 'Fish', example: 'மீன் நீந்துகிறது. (The fish is swimming.)' },
  { tamil: 'யானை', english: 'Elephant', example: 'யானை பெரியது. (The elephant is big.)' },
  { tamil: 'சிங்கம்', english: 'Lion', example: 'சிங்கம் வலிமையானது. (The lion is strong.)' },
  { tamil: 'புலி', english: 'Tiger', example: 'புலி வேகமாக ஓடுகிறது. (The tiger runs fast.)' },
  { tamil: 'பசு', english: 'Cow', example: 'பசு பால் தருகிறது. (The cow gives milk.)' },
  { tamil: 'குதிரை', english: 'Horse', example: 'குதிரை வேகமாக ஓடுகிறது. (The horse runs fast.)' },
  { tamil: 'கோழி', english: 'Chicken', example: 'கோழி முட்டை இடுகிறது. (The chicken lays eggs.)' },
  { tamil: 'முயல்', english: 'Rabbit', example: 'முயல் துள்ளுகிறது. (The rabbit hops.)' },
  { tamil: 'ஆப்பிள்', english: 'Apple', example: 'நான் ஆப்பிள் சாப்பிடுகிறேன். (I eat an apple.)' },
  { tamil: 'வாழை', english: 'Banana', example: 'வாழை மஞ்சள் நிறத்தில் உள்ளது. (The banana is yellow.)' },
  { tamil: 'ஆரஞ்சு', english: 'Orange', example: 'ஆரஞ்சு இனிப்பாக உள்ளது. (The orange is sweet.)' },
  { tamil: 'அரிசி', english: 'Rice', example: 'நான் அரிசி சாப்பிடுகிறேன். (I eat rice.)' },
  { tamil: 'ரொட்டி', english: 'Bread', example: 'ரொட்டி புதியது. (The bread is fresh.)' },
  { tamil: 'பால்', english: 'Milk', example: 'நான் பால் குடிக்கிறேன். (I drink milk.)' },
  { tamil: 'தேநீர்', english: 'Tea', example: 'நான் தேநீர் குடிக்கிறேன். (I drink tea.)' },
  { tamil: 'காபி', english: 'Coffee', example: 'நான் காபி குடிக்கிறேன். (I drink coffee.)' },
  { tamil: 'சிவப்பு', english: 'Red', example: 'மலர் சிவப்பு நிறத்தில் உள்ளது. (The flower is red.)' },
  { tamil: 'நீலம்', english: 'Blue', example: 'வானம் நீல நிறத்தில் உள்ளது. (The sky is blue.)' },
  { tamil: 'பச்சை', english: 'Green', example: 'மரம் பச்சை நிறத்தில் உள்ளது. (The tree is green.)' },
  { tamil: 'மஞ்சள்', english: 'Yellow', example: 'சூரியன் மஞ்சள் நிறத்தில் உள்ளது. (The sun is yellow.)' },
  { tamil: 'கருப்பு', english: 'Black', example: 'இரவு கருப்பு நிறத்தில் உள்ளது. (The night is black.)' },
  { tamil: 'வெள்ளை', english: 'White', example: 'மேகம் வெள்ளை நிறத்தில் உள்ளது. (The cloud is white.)' },
  { tamil: 'பெரியது', english: 'Big', example: 'யானை பெரியது. (The elephant is big.)' },
  { tamil: 'சிறியது', english: 'Small', example: 'எறும்பு சிறியது. (The ant is small.)' },
  { tamil: 'நல்லது', english: 'Good', example: 'இது நல்லது. (This is good.)' },
  { tamil: 'கெட்டது', english: 'Bad', example: 'இது கெட்டது. (This is bad.)' },
  { tamil: 'சூடானது', english: 'Hot', example: 'தேநீர் சூடானது. (The tea is hot.)' },
  { tamil: 'குளிர்ந்தது', english: 'Cold', example: 'தண்ணீர் குளிர்ந்தது. (The water is cold.)' },
  { tamil: 'மகிழ்ச்சி', english: 'Happy', example: 'நான் மகிழ்ச்சியாக இருக்கிறேன். (I am happy.)' },
  { tamil: 'துக்கம்', english: 'Sad', example: 'நான் துக்கமாக இருக்கிறேன். (I am sad.)' },
  { tamil: 'வேகமானது', english: 'Fast', example: 'கார் வேகமானது. (The car is fast.)' },
  { tamil: 'மெதுவானது', english: 'Slow', example: 'ஆமை மெதுவானது. (The turtle is slow.)' },
  { tamil: 'புதியது', english: 'New', example: 'இது புதியது. (This is new.)' },
  { tamil: 'பழையது', english: 'Old', example: 'இது பழையது. (This is old.)' },
  { tamil: 'அழகானது', english: 'Beautiful', example: 'மலர் அழகானது. (The flower is beautiful.)' },
  { tamil: 'அசிங்கமானது', english: 'Ugly', example: 'இது அசிங்கமானது. (This is ugly.)' },
  { tamil: 'ஒன்று', english: 'One', example: 'எனக்கு ஒரு புத்தகம் உள்ளது. (I have one book.)' },
  { tamil: 'இரண்டு', english: 'Two', example: 'எனக்கு இரண்டு புத்தகங்கள் உள்ளன. (I have two books.)' },
  { tamil: 'மூன்று', english: 'Three', example: 'எனக்கு மூன்று புத்தகங்கள் உள்ளன. (I have three books.)' },
  { tamil: 'நான்கு', english: 'Four', example: 'எனக்கு நான்கு புத்தகங்கள் உள்ளன. (I have four books.)' },
  { tamil: 'ஐந்து', english: 'Five', example: 'எனக்கு ஐந்து புத்தகங்கள் உள்ளன. (I have five books.)' },
  { tamil: 'பத்து', english: 'Ten', example: 'எனக்கு பத்து புத்தகங்கள் உள்ளன. (I have ten books.)' },
  { tamil: 'நூறு', english: 'Hundred', example: 'எனக்கு நூறு புத்தகங்கள் உள்ளன. (I have hundred books.)' },
  { tamil: 'ஆயிரம்', english: 'Thousand', example: 'எனக்கு ஆயிரம் புத்தகங்கள் உள்ளன. (I have thousand books.)' },
];
const tamilGrammar = [
  { title: 'Simple Sentences', content: 'Tamil: Subject + Object + Verb. Example: நான் புத்தகம் படிக்கிறேன் (I read a book).' },
  { title: 'Present Tense', content: 'Present: படிக்கிறேன் (am reading), Past: படித்தேன் (read), Future: படிப்பேன் (will read).' },
  { title: 'Past Tense', content: 'Past tense verbs often end with "த்தேன்" (then). Example: நான் புத்தகம் படித்தேன் (I read a book).' },
  { title: 'Future Tense', content: 'Future tense verbs often end with "ப்பேன்" (ppen). Example: நான் புத்தகம் படிப்பேன் (I will read a book).' },
  { title: 'Questions', content: 'Questions use words like "ஆ?" (aa?). Example: நீ புத்தகம் படித்தாயா? (Did you read a book?)' },
  { title: 'Negation', content: 'Negation uses "இல்லை" (illai). Example: நான் புத்தகம் படிக்கவில்லை (I did not read a book).' },
  { title: 'Pronouns', content: 'நான் (I), நீ (you), அவன் (he), அவள் (she), நாம் (we), நீங்கள் (you all), அவர்கள் (they).' },
  { title: 'Possessive', content: 'Add "உடைய" (udaiya) for possession. Example: என் புத்தகம் (my book), உன் புத்தகம் (your book).' },
  { title: 'Numbers', content: 'ஒன்று (1), இரண்டு (2), மூன்று (3), நான்கு (4), ஐந்து (5), ஆறு (6), ஏழு (7), எட்டு (8), ஒன்பது (9), பத்து (10).' },
  { title: 'Colors', content: 'சிவப்பு (red), நீலம் (blue), பச்சை (green), மஞ்சள் (yellow), கருப்பு (black), வெள்ளை (white), ஆரஞ்சு (orange), ரோஜா (pink).' },
  { title: 'Time', content: 'இப்போது (now), நேற்று (yesterday), இன்று (today), நாளை (tomorrow), காலை (morning), மாலை (evening), இரவு (night).' },
  { title: 'Directions', content: 'வடக்கு (north), தெற்கு (south), கிழக்கு (east), மேற்கு (west), மேலே (up), கீழே (down).' },
  { title: 'Weather', content: 'சூடான (hot), குளிர்ந்த (cold), மழை (rain), சூரியன் (sun), நிலா (moon), மேகம் (clouds).' },
  { title: 'Family', content: 'அம்மா (mother), அப்பா (father), அண்ணா (elder brother), அக்கா (elder sister), தம்பி (younger brother).' },
  { title: 'Body Parts', content: 'தலை (head), கண் (eye), காது (ear), மூக்கு (nose), வாய் (mouth), கை (hand), கால் (leg).' },
  { title: 'Clothing', content: 'ஆடை (clothes), சட்டை (shirt), தொப்பி (hat), காலணி (shoes), சராய் (socks).' },
  { title: 'Food & Drinks', content: 'சோறு (rice), ரொட்டி (bread), மாமிசம் (meat), காய்கறிகள் (vegetables), பால் (milk), தேநீர் (tea), காபி (coffee).' },
  { title: 'Emotions', content: 'மகிழ்ச்சி (happy), துக்கம் (sad), பயம் (fear), கோபம் (anger), மகிழ்ச்சி (joy), நம்பிக்கை (trust).' },
  { title: 'Professions', content: 'ஆசிரியர் (teacher), மருத்துவர் (doctor), பொறியாளர் (engineer), வணிகர் (merchant), விவசாயி (farmer).' },
  { title: 'Transportation', content: 'கார் (car), பஸ் (bus), ரயில் (train), விமானம் (plane), மிதிவண்டி (bicycle), மோட்டார் சைக்கிள் (motorcycle).' },
  { title: 'Places', content: 'வீடு (house), பள்ளி (school), மருத்துவமனை (hospital), சந்தை (market), பூங்கா (park), நூலகம் (library).' },
  { title: 'Actions', content: 'சாப்பிடு (eat), குடி (drink), தூங்கு (sleep), நட (walk), ஓடு (run), படி (read), எழுது (write).' },
  { title: 'Comparisons', content: 'பெரிய (big) → பெரியது (bigger) → பெரியது (biggest), நல்ல (good) → நல்லது (better) → நல்லது (best).' },
  { title: 'Modal Verbs', content: 'முடியும் (can), முடியும் (could), வேண்டும் (will), வேண்டும் (would), வேண்டும் (should), வேண்டும் (must).' },
  { title: 'Conditionals', content: 'மழை பெய்தால் நான் வீட்டில் இருப்பேன். (If it rains, I will stay home).' },
  { title: 'Passive Voice', content: 'புத்தகம் என்னால் படிக்கப்படுகிறது. (The book is read by me).' },
  { title: 'Reported Speech', content: 'அவன் சோர்வாக இருப்பதாகக் கூறினான். (He said that he was tired).' },
  { title: 'Gerunds & Infinitives', content: 'நான் படிப்பதை விரும்புகிறேன். (I like reading) நான் படிக்க விரும்புகிறேன். (I want to read).' },
  { title: 'Phrasal Verbs', content: 'தேடு (look up), விட்டுவிடு (give up), போடு (put on), எடு (take off).' },
  { title: 'Idioms', content: 'மழை பெய்கிறது. (It\'s raining), வெற்றி பெறு! (Break a leg!), எளிதானது (Piece of cake).' },
];
const tamilActivities = [
  { type: 'match', question: 'Match the Tamil word to its English meaning', pairs: [
    { tamil: 'அம்மா', english: 'Mother' },
    { tamil: 'நீர்', english: 'Water' },
    { tamil: 'புத்தகம்', english: 'Book' },
    { tamil: 'வணக்கம்', english: 'Hello' },
  ]},
  { type: 'fill', question: 'Fill in the blank: நான் ____ படிக்கிறேன் (I read ____)', answer: 'புத்தகம்' },
  { type: 'listen', question: 'Listen and select the correct meaning', options: [
    { audio: '/audio/tamil/amma.mp3', correct: 'Mother', choices: ['Mother', 'Water', 'Book'] },
    { audio: '/audio/tamil/neer.mp3', correct: 'Water', choices: ['Mother', 'Water', 'Book'] },
    { audio: '/audio/tamil/book.mp3', correct: 'Book', choices: ['Mother', 'Water', 'Book'] },
  ]},
];

// Place updateSkill helper here, after all imports and before export default function Learn
const updateSkill = async (skill, increment = 10) => {
  try {
    await apiClient.post('/api/progress/update', {
      skill,
      level: increment
    });
  } catch (error) {
    console.error('Failed to update skill progress:', error);
  }
};

// Advanced Vocabulary content and activities for Sinhala
const sinhalaAdvancedVocabulary = [
  { sinhala: 'සාර්ථකත්වය', english: 'Success', example: 'ඔබගේ සාර්ථකත්වය ගැන මම සතුටුයි.' },
  { sinhala: 'ඉදිරියට', english: 'Forward', example: 'ඔබ ඉදිරියට යන්න.' },
  { sinhala: 'අභියෝගය', english: 'Challenge', example: 'අභියෝගය ජයගන්න.' },
  { sinhala: 'ආරක්ෂාව', english: 'Safety', example: 'ආරක්ෂාව වැදගත්.' },
  { sinhala: 'අවශ්‍යතාව', english: 'Necessity', example: 'මෙය අවශ්‍යතාවක් වේ.' },
  { sinhala: 'අවස්ථාව', english: 'Opportunity', example: 'ඔබට අවස්ථාවක් ලැබුණා.' },
  { sinhala: 'ආදර්ශය', english: 'Ideal', example: 'ඔහු ආදර්ශයෙකි.' },
  { sinhala: 'ආරම්භය', english: 'Beginning', example: 'මෙය ආරම්භයකි.' },
  { sinhala: 'අවසන්', english: 'End', example: 'මෙය අවසන්ය.' },
  { sinhala: 'අවබෝධය', english: 'Understanding', example: 'අවබෝධය වැදගත්.' },
  { sinhala: 'බලවත්', english: 'Powerful', example: 'ඔහු බලවත්යි.' },
  { sinhala: 'භයානක', english: 'Dangerous', example: 'මෙය භයානකයි.' },
  { sinhala: 'භාෂාව', english: 'Language', example: 'සිංහල භාෂාව සුන්දරයි.' },
  { sinhala: 'භූගෝල', english: 'Geography', example: 'භූගෝල ඉගෙන ගන්න.' },
  { sinhala: 'භූමිකාව', english: 'Role', example: 'ඔබගේ භූමිකාව වැදගත්.' },
  { sinhala: 'භාවිතය', english: 'Usage', example: 'මෙය භාවිතය පහසුයි.' },
  { sinhala: 'භාවිතා', english: 'Use', example: 'මෙය භාවිතා කරන්න.' },
  { sinhala: 'භාෂාව', english: 'Language', example: 'භාෂාව ඉගෙන ගන්න.' },
  { sinhala: 'භාවිතය', english: 'Usage', example: 'භාවිතය පහසුයි.' },
  { sinhala: 'භාවිතා', english: 'Use', example: 'භාවිතා කරන්න.' },
];

const sinhalaAdvancedVocabActivities = [
  {
    type: 'match',
    question: 'Match the Sinhala advanced word to its English meaning',
    pairs: [
      { sinhala: 'සාර්ථකත්වය', english: 'Success' },
      { sinhala: 'අභියෝගය', english: 'Challenge' },
      { sinhala: 'අවස්ථාව', english: 'Opportunity' },
      { sinhala: 'අවබෝධය', english: 'Understanding' },
      { sinhala: 'භාෂාව', english: 'Language' },
      { sinhala: 'භූමිකාව', english: 'Role' },
    ]
  },
  {
    type: 'fill',
    question: 'Fill in the blank: "ඔබගේ _______ ගැන මම සතුටුයි." (I am happy about your _______.)',
    answer: 'සාර්ථකත්වය'
  },
  {
    type: 'translate',
    question: 'Translate to Sinhala: "This is a great opportunity"',
    answer: 'මෙය මහා අවස්ථාවකි'
  }
];

// Conversation Practice for Sinhala
const sinhalaConversationPractice = [
  {
    title: 'Daily Conversations',
    dialogues: [
      {
        scenario: 'Meeting someone for the first time',
        sinhala: 'ආයුබෝවන්! මම කමල්. ඔබේ නම මොනවාද?',
        english: 'Hello! I am Kamal. What is your name?',
        response: 'ආයුබෝවන්! මම සුනිල්. සතුටුයි ඔබව හඳුනා ගැනීමට.',
        responseEnglish: 'Hello! I am Sunil. Nice to meet you.'
      },
      {
        scenario: 'Asking for directions',
        sinhala: 'සමාවෙන්න, පාසල කොහෙද?',
        english: 'Excuse me, where is the school?',
        response: 'ඒක මෙතනින් ටිකක් ඈත. මම ඔබට පෙන්වන්නම්.',
        responseEnglish: 'It is a little far from here. I will show you.'
      },
      {
        scenario: 'Ordering food',
        sinhala: 'මට රොටි ටිකක් දෙන්න. කොපමණද?',
        english: 'Give me some bread. How much is it?',
        response: 'රුපියල් පහයි. මෙන්න ඔබට.',
        responseEnglish: 'It is five rupees. Here you are.'
      }
    ]
  },
  {
    title: 'Business Conversations',
    dialogues: [
      {
        scenario: 'Job interview',
        sinhala: 'ඔබේ අධ්‍යාපනය කොහොමද?',
        english: 'What is your education?',
        response: 'මම විශ්වවිද්‍යාලයෙන් උපාධිය ලබාගත්තා.',
        responseEnglish: 'I have a degree from university.'
      },
      {
        scenario: 'Making a business proposal',
        sinhala: 'මම ඔබට යෝජනාවක් කරන්න ඕනෑ.',
        english: 'I want to make a proposal to you.',
        response: 'හරි, කියන්න. මම ඇහුම්කන් දෙනවා.',
        responseEnglish: 'Okay, tell me. I am listening.'
      }
    ]
  }
];

const sinhalaConversationActivities = [
  {
    type: 'roleplay',
    scenario: 'Meeting a new friend',
    prompts: [
      'Introduce yourself in Sinhala',
      'Ask about their family',
      'Talk about your hobbies',
      'Make plans to meet again'
    ]
  },
  {
    type: 'fill',
    question: 'Complete the conversation: "ආයුබෝවන්! _____?" (Hello! _____?)',
    answer: 'ඔබේ නම මොනවාද'
  }
];

// Reading Comprehension for Sinhala
const sinhalaReadingComprehension = [
  {
    title: 'Short Stories',
    passages: [
      {
        title: 'The Clever Fox',
        content: 'එක් දවසක බල්ලෙක් වනයේ ගමන් කරමින් සිටියේය. ඔහුට බිම උඩ රතු රෙදි කැබැල්ලක් දැකගත්තේය. ඔහු එය ගෙන ගෙදර ගියේය. ඔහුගේ අම්මා එය දැක "මේ කොහෙන්ද?" කීවාය. "මම එය වනයේ හොයාගත්තා" ඔහු කීවේය.',
        questions: [
          {
            question: 'Where did the dog find the red cloth?',
            answer: 'In the forest',
            options: ['At home', 'In the forest', 'At school', 'In the market']
          },
          {
            question: 'What color was the cloth?',
            answer: 'Red',
            options: ['Blue', 'Red', 'Green', 'Yellow']
          }
        ]
      },
      {
        title: 'The Wise Teacher',
        content: 'ගුරුවරයෙක් සිසුන්ට කතා කරමින් සිටියේය. "ඔබලා හොඳින් ඉගෙන ගන්න ඕනෑ" ඔහු කීවේය. "ඉගෙනීම ජීවිතයේ වැදගත්ම දෙයයි." සිසුන් ඔහුගේ වචන ඇහුම්කන් දුන්හ.',
        questions: [
          {
            question: 'What did the teacher say about learning?',
            answer: 'It is the most important thing in life',
            options: ['It is difficult', 'It is the most important thing in life', 'It is not necessary', 'It is expensive']
          }
        ]
      }
    ]
  }
];

// Writing Practice for Sinhala
const sinhalaWritingPractice = [
  {
    title: 'Basic Writing',
    prompts: [
      {
        prompt: 'Write about your family in Sinhala (5 sentences)',
        example: 'මගේ පවුලේ මම, මගේ අම්මා, තාත්තා සහ මගේ සහෝදරයා සිටිනවා. මගේ අම්මා ගුරුවරියක්. මගේ තාත්තා ඉංජිනේරුවෙක්. මගේ සහෝදරයා පාසලට යනවා. අපි සතුටින් ජීවත් වෙනවා.',
        tips: ['Use present tense', 'Include family members', 'Describe their jobs', 'Express feelings']
      },
      {
        prompt: 'Describe your daily routine in Sinhala',
        example: 'මම උදේ 6ට අවදි වෙනවා. මම තේ බොනවා. මම පාසලට යනවා. මම හවසට ගෙදර එනවා. මම රෑට කෑම කනවා.',
        tips: ['Use time expressions', 'Use present tense', 'Include daily activities', 'Be specific']
      }
    ]
  },
  {
    title: 'Advanced Writing',
    prompts: [
      {
        prompt: 'Write a letter to a friend in Sinhala',
        example: 'ආදරනීය මිතුරා, ඔබට කොහොමද? මම හොඳින් සිටිනවා. මම ඔබව මතක් කරනවා. ඔබ කවදා එන්නේ? ඔබේ පවුල හොඳින්ද? ඔබේ මිතුරා, කමල්',
        tips: ['Start with a greeting', 'Ask about their well-being', 'Share your news', 'End with your name']
      }
    ]
  }
];

// Cultural Context for Sinhala
const sinhalaCulturalContext = [
  {
    title: 'Buddhist Culture',
    content: [
      {
        topic: 'Respect for Elders',
        description: 'In Sinhala culture, elders are highly respected. Always use honorifics when speaking to elders.',
        examples: ['ඔබ (formal you)', 'මහත්තයා (sir)', 'මහත්මිය (madam)'],
        vocabulary: ['සම්මානය (respect)', 'ගරුකාරී (respectful)', 'ආදරය (love)']
      },
      {
        topic: 'Buddhist Greetings',
        description: 'Traditional greetings often include Buddhist blessings and wishes for long life.',
        examples: ['ආයුබෝවන් (may you live long)', 'සුභ උදෑසනක් (good morning)', 'සුභ සන්ධ්‍යාවක් (good evening)'],
        vocabulary: ['ආයු (long life)', 'සුභ (good)', 'සන්ධ්‍යාව (evening)']
      }
    ]
  },
  {
    title: 'Traditional Customs',
    content: [
      {
        topic: 'Hospitality',
        description: 'Sri Lankans are known for their hospitality. Guests are always offered tea and refreshments.',
        examples: ['තේ බොන්න (have tea)', 'කෑම කන්න (have food)', 'වාඩි වෙන්න (sit down)'],
        vocabulary: ['ආගන්තුක (guest)', 'ආහාර (food)', 'පාන (drink)']
      },
      {
        topic: 'Festivals',
        description: 'Major festivals include Vesak, Poson, and the Sinhala New Year.',
        examples: ['වෙසක් (Vesak)', 'පෝසොන් (Poson)', 'අවුරුදු (New Year)'],
        vocabulary: ['උත්සව (festival)', 'සමරු (celebration)', 'පන්සිල් (precepts)']
      }
    ]
  }
];

// Advanced Grammar for Sinhala
const sinhalaAdvancedGrammar = [
  {
    title: 'Complex Sentence Structures',
    lessons: [
      {
        topic: 'Conditional Sentences',
        explanation: 'Use "නම්" (nam) for "if" in conditional sentences.',
        examples: [
          'ඔබ එන්නේ නම්, මම සතුටු වෙනවා. (If you come, I will be happy.)',
          'වැසි එන්නේ නම්, අපි ගෙදර යන්නම්. (If it rains, we will go home.)'
        ]
      },
      {
        topic: 'Passive Voice',
        explanation: 'Passive voice is formed using "කරනු ලැබේ" (karanu labē).',
        examples: [
          'මෙය කරනු ලැබේ. (This is done.)',
          'පොත කියවනු ලැබේ. (The book is read.)'
        ]
      },
      {
        topic: 'Reported Speech',
        explanation: 'Use "යි" (yi) or "ය" (ya) for reported speech.',
        examples: [
          'ඔහු කියනවා ඔහු යන්නේ යි. (He says he is going.)',
          'ඇය කීවා ඇය එන්නේ ය. (She said she is coming.)'
        ]
      }
    ]
  },
  {
    title: 'Advanced Verb Forms',
    lessons: [
      {
        topic: 'Causative Verbs',
        explanation: 'Add "වෙනවා" (venava) to make causative forms.',
        examples: [
          'කරවනවා (make someone do)',
          'කියවනවා (make someone read)'
        ]
      },
      {
        topic: 'Gerunds and Participles',
        explanation: 'Use "මින්" (min) for gerunds and "මි" (mi) for participles.',
        examples: [
          'කරමින් (while doing)',
          'කරමි (doing)'
        ]
      }
    ]
  }
];

// Literature & Poetry for Sinhala
const sinhalaLiteraturePoetry = [
  {
    title: 'Classical Poetry',
    content: [
      {
        poem: 'සිරි සඟබෝ සඟරාවෙහි\nසුර ගණ රජ සෙනඟ ගෙන\nසුර පුරයට ගිය කල\nසුර ගණ රජ සෙනඟ ගෙන',
        translation: 'In the Siri Sangabo Sangarawa\nTaking the divine army\nWhen going to the divine city\nTaking the divine army',
        analysis: 'This is a classical Sinhala poem showing the influence of Sanskrit and Pali on Sinhala literature.'
      }
    ]
  },
  {
    title: 'Modern Literature',
    content: [
      {
        author: 'Martin Wickramasinghe',
        work: 'Gamperaliya',
        excerpt: 'ගම්පෙරළිය යනු ශ්‍රී ලංකාවේ සමාජ වෙනස්වීම් පිළිබඳ කතාවකි.',
        translation: 'Gamperaliya is a story about social changes in Sri Lanka.',
        significance: 'This novel is considered a masterpiece of modern Sinhala literature.'
      }
    ]
  }
];

// English Advanced Vocabulary
const englishAdvancedVocabulary = [
  { english: 'Accomplishment', sinhala: 'සාර්ථකත්වය', example: 'Getting a degree is a great accomplishment.' },
  { english: 'Beneficial', sinhala: 'ඵලදායී', example: 'Exercise is beneficial for health.' },
  { english: 'Comprehensive', sinhala: 'විස්තරාත්මක', example: 'This is a comprehensive study.' },
  { english: 'Determination', sinhala: 'අධිෂ්ඨානය', example: 'Success requires determination.' },
  { english: 'Efficient', sinhala: 'කාර්යක්ෂම', example: 'This method is very efficient.' },
  { english: 'Fundamental', sinhala: 'මූලික', example: 'Reading is fundamental to learning.' },
  { english: 'Generous', sinhala: 'උදාර', example: 'She is very generous with her time.' },
  { english: 'Harmonious', sinhala: 'සමච්චල', example: 'They have a harmonious relationship.' },
  { english: 'Innovative', sinhala: 'නව නිර්මාණශීලී', example: 'This is an innovative solution.' },
  { english: 'Judicious', sinhala: 'විචක්ෂණ', example: 'He made a judicious decision.' }
];

const englishAdvancedVocabActivities = [
  {
    type: 'match',
    question: 'Match the English advanced word to its Sinhala meaning',
    pairs: [
      { english: 'Accomplishment', sinhala: 'සාර්ථකත්වය' },
      { english: 'Beneficial', sinhala: 'ඵලදායී' },
      { english: 'Determination', sinhala: 'අධිෂ්ඨානය' },
      { english: 'Efficient', sinhala: 'කාර්යක්ෂම' }
    ]
  },
  {
    type: 'fill',
    question: 'Fill in the blank: "This method is very _______." (මෙම ක්‍රමය ඉතා _______.)',
    answer: 'efficient'
  }
];

// English Conversation Practice
const englishConversationPractice = [
  {
    title: 'Business English',
    dialogues: [
      {
        scenario: 'Job Interview',
        english: 'Tell me about your experience.',
        sinhala: 'ඔබගේ අත්දැකීම් ගැන කියන්න.',
        response: 'I have worked in this field for five years.',
        responseSinhala: 'මම මෙම ක්ෂේත්‍රයේ වසර පහක් වැඩ කර ඇත.'
      },
      {
        scenario: 'Making a Presentation',
        english: 'Good morning, everyone. Today I will present our quarterly results.',
        sinhala: 'සුභ උදෑසනක්, සියල්ලන්ට. අද මම අපගේ කාර්තුමය ප්‍රතිඵල ඉදිරිපත් කරන්නම්.',
        response: 'Thank you for your attention.',
        responseSinhala: 'ඔබගේ අවධානයට ස්තූතියි.'
      }
    ]
  },
  {
    title: 'Social English',
    dialogues: [
      {
        scenario: 'Meeting at a Party',
        english: 'Hi! I don\'t think we\'ve met. I\'m Sarah.',
        sinhala: 'ආයුබෝවන්! මම හිතන්නේ අපි හඳුනන්නේ නැහැ. මම සාරා.',
        response: 'Nice to meet you, Sarah. I\'m John.',
        responseSinhala: 'සාරා, ඔබව හඳුනා ගැනීමට සතුටුයි. මම ජෝන්.'
      }
    ]
  }
];

// English Reading Comprehension
const englishReadingComprehension = [
  {
    title: 'Short Stories',
    passages: [
      {
        title: 'The Power of Education',
        content: 'Education is the most powerful weapon which you can use to change the world. Nelson Mandela understood this truth deeply. He spent 27 years in prison, but he never stopped learning. He studied law, history, and literature. When he was finally released, he used his knowledge to help bring peace to South Africa.',
        questions: [
          {
            question: 'What did Nelson Mandela study in prison?',
            answer: 'Law, history, and literature',
            options: ['Only law', 'Law, history, and literature', 'Only history', 'Only literature']
          },
          {
            question: 'How long was Mandela in prison?',
            answer: '27 years',
            options: ['20 years', '25 years', '27 years', '30 years']
          }
        ]
      }
    ]
  }
];

// English Writing Practice
const englishWritingPractice = [
  {
    title: 'Academic Writing',
    prompts: [
      {
        prompt: 'Write a paragraph about the importance of education (5-7 sentences)',
        example: 'Education is fundamental to personal and societal development. It provides individuals with the knowledge and skills needed to succeed in life. Through education, people learn critical thinking, problem-solving, and communication skills. It also promotes social mobility and reduces poverty. Furthermore, educated societies tend to be more peaceful and prosperous.',
        tips: ['Start with a topic sentence', 'Include supporting details', 'Use transition words', 'End with a conclusion']
      }
    ]
  },
  {
    title: 'Business Writing',
    prompts: [
      {
        prompt: 'Write a professional email requesting a meeting',
        example: 'Dear Mr. Smith, I hope this email finds you well. I would like to schedule a meeting to discuss our upcoming project. I am available on Tuesday and Thursday afternoon. Please let me know what time works best for you. Best regards, [Your name]',
        tips: ['Use formal language', 'Be specific about the purpose', 'Suggest times', 'End politely']
      }
    ]
  }
];

// English Business English
const englishBusinessEnglish = [
  {
    title: 'Business Vocabulary',
    words: [
      { english: 'Revenue', sinhala: 'ආදායම', example: 'Our revenue increased by 20% this year.' },
      { english: 'Stakeholder', sinhala: 'උනන්දුකරු', example: 'We need to consider all stakeholders.' },
      { english: 'Innovation', sinhala: 'නව නිර්මාණය', example: 'Innovation is key to success.' },
      { english: 'Sustainability', sinhala: 'ස්ථිරතාව', example: 'We focus on sustainability.' }
    ]
  },
  {
    title: 'Business Phrases',
    phrases: [
      { english: 'Let\'s touch base', sinhala: 'අපි සම්බන්ධ වෙමු', usage: 'To contact someone' },
      { english: 'Think outside the box', sinhala: 'වෙනස් ආකාරයකින් සිතන්න', usage: 'To be creative' },
      { english: 'Get the ball rolling', sinhala: 'කාර්යය ආරම්භ කරන්න', usage: 'To start something' }
    ]
  }
];

// English Academic English
const englishAcademicEnglish = [
  {
    title: 'Academic Vocabulary',
    words: [
      { english: 'Hypothesis', sinhala: 'උපකල්පනය', example: 'The researcher tested his hypothesis.' },
      { english: 'Methodology', sinhala: 'ක්‍රමවේදය', example: 'The methodology was clearly explained.' },
      { english: 'Analysis', sinhala: 'විශ්ලේෂණය', example: 'The analysis revealed important findings.' },
      { english: 'Conclusion', sinhala: 'නිගමනය', example: 'The conclusion supported the hypothesis.' }
    ]
  },
  {
    title: 'Academic Writing',
    tips: [
      'Use formal language',
      'Avoid contractions',
      'Use passive voice appropriately',
      'Include citations',
      'Be objective and precise'
    ]
  }
];

// English Advanced Grammar
const englishAdvancedGrammar = [
  {
    title: 'Complex Grammar Structures',
    lessons: [
      {
        topic: 'Conditional Sentences',
        explanation: 'Use different conditional forms for different situations.',
        examples: [
          'If I had money, I would buy a car. (Second conditional)',
          'If it rains tomorrow, I will stay home. (First conditional)',
          'If I had studied harder, I would have passed. (Third conditional)'
        ]
      },
      {
        topic: 'Passive Voice',
        explanation: 'Use passive voice when the focus is on the action, not the doer.',
        examples: [
          'The book was written by Shakespeare. (Passive)',
          'Shakespeare wrote the book. (Active)'
        ]
      },
      {
        topic: 'Reported Speech',
        explanation: 'Change tenses when reporting what someone said.',
        examples: [
          'He said, "I am tired." → He said he was tired.',
          'She said, "I will come." → She said she would come.'
        ]
      }
    ]
  }
];

// English Literature & Poetry
const englishLiteraturePoetry = [
  {
    title: 'Classic Poetry',
    content: [
      {
        poem: 'Shall I compare thee to a summer\'s day?\nThou art more lovely and more temperate:\nRough winds do shake the darling buds of May,\nAnd summer\'s lease hath all too short a date.',
        author: 'William Shakespeare',
        analysis: 'This sonnet compares the beloved to a summer day, suggesting that the beloved is more beautiful and constant than nature.'
      }
    ]
  },
  {
    title: 'Modern Literature',
    content: [
      {
        author: 'George Orwell',
        work: '1984',
        excerpt: 'Big Brother is watching you.',
        significance: 'This novel explores themes of totalitarianism and surveillance.'
      }
    ]
  }
];

// Tamil Advanced Vocabulary
const tamilAdvancedVocabulary = [
  { tamil: 'வெற்றி', english: 'Success', example: 'அவர் தனது வெற்றியை கொண்டாடினார்.' },
  { tamil: 'முன்னேற்றம்', english: 'Progress', example: 'நாட்டின் முன்னேற்றம் கண்கூடாக உள்ளது.' },
  { tamil: 'புதுமை', english: 'Innovation', example: 'புதுமை வளர்ச்சிக்கு தேவை.' },
  { tamil: 'நம்பிக்கை', english: 'Trust', example: 'நம்பிக்கை வாழ்க்கையின் அடிப்படை.' },
  { tamil: 'ஆர்வம்', english: 'Interest', example: 'அவருக்கு படிப்பில் ஆர்வம் உள்ளது.' },
  { tamil: 'பயிற்சி', english: 'Training', example: 'பயிற்சி திறமையை வளர்க்கும்.' },
  { tamil: 'அனுபவம்', english: 'Experience', example: 'அனுபவம் சிறந்த ஆசிரியர்.' },
  { tamil: 'திறமை', english: 'Skill', example: 'திறமை வளர்ச்சிக்கு பயிற்சி தேவை.' },
  { tamil: 'வளர்ச்சி', english: 'Development', example: 'வளர்ச்சி தொடர்ச்சியாக நடைபெறுகிறது.' },
  { tamil: 'முயற்சி', english: 'Effort', example: 'முயற்சி வெற்றிக்கு வழி.' }
];

const tamilAdvancedVocabActivities = [
  {
    type: 'match',
    question: 'Match the Tamil advanced word to its English meaning',
    pairs: [
      { tamil: 'வெற்றி', english: 'Success' },
      { tamil: 'முன்னேற்றம்', english: 'Progress' },
      { tamil: 'புதுமை', english: 'Innovation' },
      { tamil: 'நம்பிக்கை', english: 'Trust' }
    ]
  },
  {
    type: 'fill',
    question: 'Fill in the blank: "அவர் தனது _______ கொண்டாடினார்." (He celebrated his _______.)',
    answer: 'வெற்றி'
  }
];

// Tamil Conversation Practice
const tamilConversationPractice = [
  {
    title: 'Daily Conversations',
    dialogues: [
      {
        scenario: 'Meeting someone',
        tamil: 'வணக்கம்! நான் குமார். உங்கள் பெயர் என்ன?',
        english: 'Hello! I am Kumar. What is your name?',
        response: 'வணக்கம்! நான் ராஜா. உங்களை சந்தித்ததில் மகிழ்ச்சி.',
        responseEnglish: 'Hello! I am Raja. Nice to meet you.'
      },
      {
        scenario: 'Asking for help',
        tamil: 'தயவுசெய்து எனக்கு உதவுங்கள்.',
        english: 'Please help me.',
        response: 'நிச்சயமாக! என்ன உதவ வேண்டும்?',
        responseEnglish: 'Certainly! What help do you need?'
      }
    ]
  }
];

// Tamil Reading Comprehension
const tamilReadingComprehension = [
  {
    title: 'Short Stories',
    passages: [
      {
        title: 'The Wise Old Man',
        content: 'ஒரு கிராமத்தில் ஒரு முதியவர் வாழ்ந்தார். அவர் மிகவும் ஞானமுள்ளவர். கிராம மக்கள் எப்போதும் அவரிடம் ஆலோசனை கேட்பார்கள். அவர் எப்போதும் பொறுமையாக பதில் சொல்வார்.',
        questions: [
          {
            question: 'What was the old man like?',
            answer: 'Wise',
            options: ['Young', 'Wise', 'Poor', 'Rich']
          },
          {
            question: 'What did villagers do?',
            answer: 'Ask for advice',
            options: ['Avoid him', 'Ask for advice', 'Ignore him', 'Laugh at him']
          }
        ]
      }
    ]
  }
];

// Tamil Writing Practice
const tamilWritingPractice = [
  {
    title: 'Basic Writing',
    prompts: [
      {
        prompt: 'Write about your family in Tamil (5 sentences)',
        example: 'என் குடும்பத்தில் நான், என் அம்மா, அப்பா மற்றும் என் சகோதரன் உள்ளனர். என் அம்மா ஆசிரியை. என் அப்பா பொறியாளர். என் சகோதரன் பள்ளிக்கு செல்கிறான். நாங்கள் மகிழ்ச்சியாக வாழ்கிறோம்.',
        tips: ['Use present tense', 'Include family members', 'Describe their jobs', 'Express feelings']
      }
    ]
  }
];

// Tamil Cultural Context
const tamilCulturalContext = [
  {
    title: 'Tamil Culture',
    content: [
      {
        topic: 'Respect for Elders',
        description: 'In Tamil culture, elders are highly respected and addressed with honorifics.',
        examples: ['அப்பா (father)', 'அம்மா (mother)', 'அண்ணா (elder brother)', 'அக்கா (elder sister)'],
        vocabulary: ['மரியாதை (respect)', 'பெரியவர் (elder)', 'ஆசீர் (blessing)']
      },
      {
        topic: 'Traditional Greetings',
        description: 'Traditional Tamil greetings often include blessings and wishes for well-being.',
        examples: ['வணக்கம் (greeting)', 'நமஸ்காரம் (respectful greeting)', 'வாழ்க (long live)'],
        vocabulary: ['வணக்கம் (greeting)', 'நலம் (well-being)', 'மங்களம் (auspicious)']
      }
    ]
  }
];

// Tamil Advanced Grammar
const tamilAdvancedGrammar = [
  {
    title: 'Complex Grammar',
    lessons: [
      {
        topic: 'Conditional Sentences',
        explanation: 'Use "ஆனால்" (āṉāl) for "if" in conditional sentences.',
        examples: [
          'நீ வந்தால், நான் மகிழ்ச்சி அடைவேன். (If you come, I will be happy.)',
          'மழை பெய்தால், நாங்கள் வீட்டில் இருப்போம். (If it rains, we will stay at home.)'
        ]
      },
      {
        topic: 'Passive Voice',
        explanation: 'Passive voice is formed using "செய்யப்படுகிறது" (ceyyappaṭukiṟatu).',
        examples: [
          'இது செய்யப்படுகிறது. (This is done.)',
          'புத்தகம் படிக்கப்படுகிறது. (The book is read.)'
        ]
      }
    ]
  }
];

// Tamil Literature & Poetry
const tamilLiteraturePoetry = [
  {
    title: 'Classical Poetry',
    content: [
      {
        poem: 'யாதும் ஊரே யாவரும் கேளிர்\nகாதலர் அல்லது உவந்து வாழ்தல்\nஎப்பொருள் யார்யார்வாய்க் கேட்பினும்\nஅப்பொருள் மெய்ப்பொருள் காண்பதறிவு',
        translation: 'Every town is my town, everyone is my relative\nLiving with love and joy\nWhatever anyone says\nUnderstanding the true meaning is wisdom',
        analysis: 'This ancient Tamil poem emphasizes universal brotherhood and wisdom.'
      }
    ]
  },
  {
    title: 'Modern Literature',
    content: [
      {
        author: 'Subramania Bharati',
        work: 'Panchali Sabatham',
        excerpt: 'தமிழ் மொழி வாழ்க!',
        translation: 'Long live the Tamil language!',
        significance: 'Bharati is considered the father of modern Tamil poetry.'
      }
    ]
  }
];

// All content arrays have been defined above

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

  // Tamil state
  const [tamilStep, setTamilStep] = useState('alphabet');

  // Tamil activities state
  const [tamilMatchAnswers, setTamilMatchAnswers] = useState({});
  const [tamilFillInput, setTamilFillInput] = useState('');
  const [tamilListenAnswers, setTamilListenAnswers] = useState({});
  const [tamilActivityResult, setTamilActivityResult] = useState(null);
  const [tamilShowFeedback, setTamilShowFeedback] = useState(false);

  const [progress, setProgress] = useState(null);

  // Fetch progress on mount
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await apiClient.get('/api/progress');
        setProgress(response.data);
      } catch (error) {
        setProgress(null);
      }
    };
    fetchProgress();
  }, []);

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

  // Tamil activity handlers
  const checkTamilMatch = () => {
    const correct = tamilActivities[0].pairs.every(
      (pair) => tamilMatchAnswers[pair.tamil] === pair.english
    );
    setTamilShowFeedback(true);
    setTamilActivityResult(correct);
  };
  const checkTamilFill = () => {
    setTamilShowFeedback(true);
    setTamilActivityResult(tamilFillInput.trim().toLowerCase() === tamilActivities[1].answer.toLowerCase());
  };
  const checkTamilListen = (idx, choice) => {
    setTamilListenAnswers({ ...tamilListenAnswers, [idx]: choice });
    setTamilShowFeedback(true);
    setTamilActivityResult(choice === tamilActivities[2].options[idx].correct);
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
      // Fetch latest progress after update
      const response = await apiClient.get('/api/progress');
      setProgress(response.data);
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
      <button
        className={`px-4 py-2 rounded-t-lg font-semibold transition-all ${languageTab === 'tamil' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
        onClick={() => setLanguageTab('tamil')}
      >
        Learn Tamil
      </button>
    </div>
  );

  // Update the main container and step navigation for better alignment
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 flex justify-center">
      <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold mb-2 text-blue-700 dark:text-blue-200 text-center">Learn</h1>
        {renderTabs()}
        {/* Step Navigation */}
        <div className="flex flex-col items-center mb-8">
          {/* Step Navigation: language-specific */}
          <div className="flex flex-wrap justify-center gap-3 mb-4 w-full">
            {(languageTab === 'sinhala' ? courseSteps : languageTab === 'english' ? englishCourseSteps : tamilCourseSteps).map((s, idx) => (
              <button
                key={s.key}
                onClick={() => {
                  if (languageTab === 'sinhala') setStep(s.key);
                  else if (languageTab === 'english') setEnglishStep(s.key);
                  else setTamilStep(s.key);
                }}
                className={`flex flex-col items-center w-36 h-20 px-4 py-2 rounded-xl transition-all shadow-sm border border-transparent ${
                  (languageTab === 'sinhala' && step === s.key) ||
                  (languageTab === 'english' && englishStep === s.key) ||
                  (languageTab === 'tamil' && tamilStep === s.key)
                    ? 'bg-blue-500 text-white shadow-lg border-blue-600'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                }`}
                style={{ minWidth: '120px' }}
              >
                <s.icon className="mb-1 text-2xl" />
                <span className="text-xs font-semibold">{s.label}</span>
              </button>
            ))}
          </div>
          {/* Progress Indicator: language-specific */}
          <div className="flex items-center justify-center w-full max-w-2xl">
            {(languageTab === 'sinhala' ? courseSteps : languageTab === 'english' ? englishCourseSteps : tamilCourseSteps).map((s, idx, arr) => (
              <div key={s.key} className="flex items-center">
                <div className={`w-4 h-4 rounded-full ${
                  (languageTab === 'sinhala' && step === s.key) ||
                  (languageTab === 'english' && englishStep === s.key) ||
                  (languageTab === 'tamil' && tamilStep === s.key)
                    ? 'bg-blue-500 shadow-lg'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}></div>
                {idx < arr.length - 1 && <div className="w-8 h-1 bg-gray-300 dark:bg-gray-700 mx-1 rounded"></div>}
              </div>
            ))}
          </div>
        </div>
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
                <button className="btn-primary" onClick={() => setStep('vocabulary')}>Next: Advanced Vocabulary <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Advanced Vocabulary Step */}
            {step === 'vocabulary' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Advanced Vocabulary</h2>
                <div className="mb-4 p-2 bg-purple-50 dark:bg-purple-900/30 rounded text-sm text-purple-800 dark:text-purple-200">
                  Learn advanced Sinhala vocabulary with examples and practice activities.
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {sinhalaAdvancedVocabulary.map((word, idx) => (
                    <motion.div
                      key={word.sinhala}
                      whileHover={{ scale: 1.05 }}
                      className="bg-purple-100 dark:bg-purple-900/40 rounded-xl p-4 flex flex-col items-center shadow-md"
                    >
                      <span className="text-lg font-bold mb-1">{word.sinhala}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-200 mb-2">{word.english}</span>
                      <span className="text-xs text-gray-500 text-center">{word.example}</span>
                    </motion.div>
                  ))}
                </div>
                {/* Advanced Vocabulary Activities */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Practice Activities</h3>
                  {sinhalaAdvancedVocabActivities.map((activity, idx) => (
                    <div key={idx} className="mb-4">
                      <div className="mb-2 text-gray-600 dark:text-gray-300">{activity.question}</div>
                      {activity.type === 'match' && (
                        <div className="grid grid-cols-2 gap-4">
                          {activity.pairs.map((pair, pairIdx) => (
                            <div key={pairIdx} className="flex items-center gap-2">
                              <span className="font-bold text-purple-700 dark:text-purple-300">{pair.sinhala}</span>
                              <select className="input-field text-sm">
                                <option value="">Select</option>
                                {activity.pairs.map((p) => (
                                  <option key={p.english} value={p.english}>{p.english}</option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                      )}
                      {activity.type === 'fill' && (
                        <div>
                          <div className="mb-2 text-gray-600 dark:text-gray-300">{activity.question}</div>
                          <input className="input-field text-sm" placeholder="Type your answer" />
                          <button className="btn-secondary ml-2">Check</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <button className="btn-primary" onClick={() => setStep('conversation')}>Next: Conversation Practice <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Conversation Practice Step */}
            {step === 'conversation' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Conversation Practice</h2>
                <div className="mb-4 p-2 bg-green-50 dark:bg-green-900/30 rounded text-sm text-green-800 dark:text-green-200">
                  Practice real conversations in Sinhala with dialogues and role-playing activities.
                </div>
                {sinhalaConversationPractice.map((section, idx) => (
                  <div key={idx} className="mb-6">
                    <h3 className="font-semibold mb-3">{section.title}</h3>
                    <div className="space-y-4">
                      {section.dialogues.map((dialogue, dIdx) => (
                        <div key={dIdx} className="bg-green-100 dark:bg-green-900/40 rounded-xl p-4 shadow-md">
                          <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">{dialogue.scenario}</div>
                          <div className="mb-2">
                            <span className="font-bold text-green-700 dark:text-green-300">A: </span>
                            <span>{dialogue.sinhala}</span>
                            <div className="text-xs text-gray-500 mt-1">{dialogue.english}</div>
                          </div>
                          <div>
                            <span className="font-bold text-green-700 dark:text-green-300">B: </span>
                            <span>{dialogue.response}</span>
                            <div className="text-xs text-gray-500 mt-1">{dialogue.responseEnglish}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button className="btn-primary" onClick={() => setStep('reading')}>Next: Reading Comprehension <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Reading Comprehension Step */}
            {step === 'reading' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Reading Comprehension</h2>
                <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/30 rounded text-sm text-blue-800 dark:text-blue-200">
                  Read Sinhala passages and answer comprehension questions to improve your reading skills.
                </div>
                {sinhalaReadingComprehension.map((section, idx) => (
                  <div key={idx} className="mb-6">
                    <h3 className="font-semibold mb-3">{section.title}</h3>
                    {section.passages.map((passage, pIdx) => (
                      <div key={pIdx} className="bg-blue-100 dark:bg-blue-900/40 rounded-xl p-4 shadow-md mb-4">
                        <h4 className="font-semibold mb-2">{passage.title}</h4>
                        <div className="mb-4 text-gray-700 dark:text-gray-200 leading-relaxed">
                          {passage.content}
                        </div>
                        <div className="space-y-2">
                          {passage.questions.map((q, qIdx) => (
                            <div key={qIdx} className="bg-white dark:bg-gray-800 rounded p-3">
                              <div className="font-semibold mb-2">{q.question}</div>
                              <div className="space-y-1">
                                {q.options.map((option, oIdx) => (
                                  <button key={oIdx} className="block w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                                    {option}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                <button className="btn-primary" onClick={() => setStep('writing')}>Next: Writing Practice <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Writing Practice Step */}
            {step === 'writing' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Writing Practice</h2>
                <div className="mb-4 p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded text-sm text-yellow-800 dark:text-yellow-200">
                  Practice writing in Sinhala with guided prompts and examples.
                </div>
                {sinhalaWritingPractice.map((section, idx) => (
                  <div key={idx} className="mb-6">
                    <h3 className="font-semibold mb-3">{section.title}</h3>
                    <div className="space-y-4">
                      {section.prompts.map((prompt, pIdx) => (
                        <div key={pIdx} className="bg-yellow-100 dark:bg-yellow-900/40 rounded-xl p-4 shadow-md">
                          <div className="font-semibold mb-2">{prompt.prompt}</div>
                          <textarea className="w-full h-32 p-3 border rounded-lg resize-none" placeholder="Write your response here..."></textarea>
                          <div className="mt-2">
                            <details className="text-sm">
                              <summary className="cursor-pointer text-blue-600 dark:text-blue-300">Show Example</summary>
                              <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                                <div className="font-semibold mb-1">Example:</div>
                                <div className="text-gray-700 dark:text-gray-200">{prompt.example}</div>
                                <div className="mt-2">
                                  <div className="font-semibold mb-1">Tips:</div>
                                  <ul className="list-disc pl-4 text-sm">
                                    {prompt.tips.map((tip, tIdx) => (
                                      <li key={tIdx}>{tip}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </details>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button className="btn-primary" onClick={() => setStep('culture')}>Next: Cultural Context <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Cultural Context Step */}
            {step === 'culture' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Cultural Context</h2>
                <div className="mb-4 p-2 bg-orange-50 dark:bg-orange-900/30 rounded text-sm text-orange-800 dark:text-orange-200">
                  Learn about Sinhala culture, traditions, and how they influence language use.
                </div>
                {sinhalaCulturalContext.map((section, idx) => (
                  <div key={idx} className="mb-6">
                    <h3 className="font-semibold mb-3">{section.title}</h3>
                    <div className="space-y-4">
                      {section.content.map((item, iIdx) => (
                        <div key={iIdx} className="bg-orange-100 dark:bg-orange-900/40 rounded-xl p-4 shadow-md">
                          <h4 className="font-semibold mb-2">{item.topic}</h4>
                          <p className="text-gray-700 dark:text-gray-200 mb-3">{item.description}</p>
                          <div className="mb-3">
                            <div className="font-semibold text-sm mb-1">Examples:</div>
                            <div className="space-y-1">
                              {item.examples.map((example, eIdx) => (
                                <div key={eIdx} className="text-sm bg-white dark:bg-gray-800 rounded p-2">
                                  {example}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-sm mb-1">Vocabulary:</div>
                            <div className="flex flex-wrap gap-2">
                              {item.vocabulary.map((word, wIdx) => (
                                <span key={wIdx} className="text-xs bg-white dark:bg-gray-800 rounded px-2 py-1">
                                  {word}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button className="btn-primary" onClick={() => setStep('advanced')}>Next: Advanced Grammar <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Advanced Grammar Step */}
            {step === 'advanced' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Advanced Grammar</h2>
                <div className="mb-4 p-2 bg-purple-50 dark:bg-purple-900/30 rounded text-sm text-purple-800 dark:text-purple-200">
                  Master complex grammar structures and advanced language patterns.
                </div>
                {sinhalaAdvancedGrammar.map((section, idx) => (
                  <div key={idx} className="mb-6">
                    <h3 className="font-semibold mb-3">{section.title}</h3>
                    <div className="space-y-4">
                      {section.lessons.map((lesson, lIdx) => (
                        <div key={lIdx} className="bg-purple-100 dark:bg-purple-900/40 rounded-xl p-4 shadow-md">
                          <h4 className="font-semibold mb-2">{lesson.topic}</h4>
                          <p className="text-gray-700 dark:text-gray-200 mb-3">{lesson.explanation}</p>
                          <div className="space-y-2">
                            {lesson.examples.map((example, eIdx) => (
                              <div key={eIdx} className="text-sm bg-white dark:bg-gray-800 rounded p-2">
                                {example}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button className="btn-primary" onClick={() => setStep('literature')}>Next: Literature & Poetry <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Literature & Poetry Step */}
            {step === 'literature' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Literature & Poetry</h2>
                <div className="mb-4 p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded text-sm text-indigo-800 dark:text-indigo-200">
                  Explore classical and modern Sinhala literature and poetry.
                </div>
                {sinhalaLiteraturePoetry.map((section, idx) => (
                  <div key={idx} className="mb-6">
                    <h3 className="font-semibold mb-3">{section.title}</h3>
                    <div className="space-y-4">
                      {section.content.map((item, iIdx) => (
                        <div key={iIdx} className="bg-indigo-100 dark:bg-indigo-900/40 rounded-xl p-4 shadow-md">
                          {item.poem && (
                            <div className="mb-3">
                              <div className="font-semibold mb-2">Poem:</div>
                              <div className="text-sm bg-white dark:bg-gray-800 rounded p-3 whitespace-pre-line">
                                {item.poem}
                              </div>
                              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                <div className="font-semibold">Translation:</div>
                                {item.translation}
                              </div>
                              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                <div className="font-semibold">Analysis:</div>
                                {item.analysis}
                              </div>
                            </div>
                          )}
                          {item.author && (
                            <div>
                              <div className="font-semibold mb-2">{item.author} - {item.work}</div>
                              <div className="text-sm bg-white dark:bg-gray-800 rounded p-3 mb-2">
                                "{item.excerpt}"
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                <div className="font-semibold">Translation:</div>
                                {item.translation}
                              </div>
                              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                <div className="font-semibold">Significance:</div>
                                {item.significance}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
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
            {/* Advanced Vocabulary Step */}
            {step === 'vocabulary' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Advanced Vocabulary</h2>
                <div className="mb-4 text-blue-900 dark:text-blue-200 text-sm">Expand your Sinhala vocabulary with these advanced words and phrases. Practice their meanings and usage in context.</div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {sinhalaAdvancedVocabulary.map((w, idx) => (
                    <motion.div
                      key={w.sinhala}
                      whileHover={{ scale: 1.05 }}
                      className="bg-purple-100 dark:bg-purple-900/40 rounded-xl p-4 flex flex-col items-center shadow-md"
                    >
                      <span className="text-xl font-bold mb-1">{w.sinhala}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-200 mb-2">{w.english}</span>
                      <span className="text-xs text-gray-500">{w.example}</span>
                    </motion.div>
                  ))}
                </div>
                {/* Activities */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">1. {sinhalaAdvancedVocabActivities[0].question}</h3>
                  <div className="text-xs mb-1 text-gray-500">Select the correct English meaning for each Sinhala word.</div>
                  <div className="grid grid-cols-2 gap-4">
                    {sinhalaAdvancedVocabActivities[0].pairs.map((pair, idx) => (
                      <div key={pair.sinhala} className="flex items-center gap-2">
                        <span className="font-bold text-blue-700 dark:text-blue-300">{pair.sinhala}</span>
                        <select
                          className="input-field text-sm"
                          value={matchAnswers[pair.sinhala] || ''}
                          onChange={e => setMatchAnswers({ ...matchAnswers, [pair.sinhala]: e.target.value })}
                        >
                          <option value="">Select</option>
                          {sinhalaAdvancedVocabActivities[0].pairs.map((p) => (
                            <option key={p.english} value={p.english}>{p.english}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                  <button className="btn-secondary mt-2" onClick={checkMatch}>Check</button>
                  {showFeedback && activityResult !== null && (
                    <div className={`mt-2 p-2 rounded-xl ${activityResult ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{activityResult ? 'Correct!' : 'Try again!'}</div>
                  )}
                </div>
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">2. {sinhalaAdvancedVocabActivities[1].question}</h3>
                  <div className="text-xs mb-1 text-gray-500">Type the correct Sinhala word in the blank.</div>
                  <input
                    className="input-field text-sm mr-2"
                    value={fillInput}
                    onChange={e => setFillInput(e.target.value)}
                    placeholder="Type your answer"
                  />
                  <button className="btn-secondary" onClick={checkFill}>Check</button>
                  {showFeedback && activityResult !== null && (
                    <div className={`mt-2 p-2 rounded-xl ${activityResult ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{activityResult ? 'Correct!' : 'Try again!'}</div>
                  )}
                </div>
              </div>
            )}
            {/* Conversation Practice Step (placeholder) */}
            {step === 'conversation' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Conversation Practice</h2>
                <div className="mb-4 text-blue-900 dark:text-blue-200 text-sm">Coming soon: Practice real-world Sinhala dialogues and role-play scenarios here.</div>
              </div>
            )}
            {/* Reading Comprehension Step (placeholder) */}
            {step === 'reading' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Reading Comprehension</h2>
                <div className="mb-4 text-blue-900 dark:text-blue-200 text-sm">Coming soon: Read Sinhala passages and answer comprehension questions here.</div>
              </div>
            )}
            {/* Writing Practice Step (placeholder) */}
            {step === 'writing' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Writing Practice</h2>
                <div className="mb-4 text-blue-900 dark:text-blue-200 text-sm">Coming soon: Practice Sinhala writing with prompts and feedback here.</div>
              </div>
            )}
            {/* Cultural Context Step (placeholder) */}
            {step === 'culture' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Cultural Context</h2>
                <div className="mb-4 text-blue-900 dark:text-blue-200 text-sm">Coming soon: Learn about Sinhala culture, idioms, and traditions here.</div>
              </div>
            )}
            {/* Advanced Grammar Step (placeholder) */}
            {step === 'advanced' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Advanced Grammar</h2>
                <div className="mb-4 text-blue-900 dark:text-blue-200 text-sm">Coming soon: Master complex Sinhala grammar structures here.</div>
              </div>
            )}
            {/* Literature & Poetry Step (placeholder) */}
            {step === 'literature' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Literature & Poetry</h2>
                <div className="mb-4 text-blue-900 dark:text-blue-200 text-sm">Coming soon: Explore Sinhala literature and poetry here.</div>
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
            {/* Advanced Vocabulary Step */}
            {englishStep === 'vocabulary' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Advanced Vocabulary</h2>
                <div className="mb-4 p-2 bg-purple-50 dark:bg-purple-900/30 rounded text-sm text-purple-800 dark:text-purple-200">
                  Learn advanced English vocabulary with Sinhala translations and examples.
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {englishAdvancedVocabulary.map((word, idx) => (
                    <motion.div
                      key={word.english}
                      whileHover={{ scale: 1.05 }}
                      className="bg-purple-100 dark:bg-purple-900/40 rounded-xl p-4 flex flex-col items-center shadow-md"
                    >
                      <span className="text-lg font-bold mb-1">{word.english}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-200 mb-2">{word.sinhala}</span>
                      <span className="text-xs text-gray-500 text-center">{word.example}</span>
                    </motion.div>
                  ))}
                </div>
                <button className="btn-primary" onClick={() => setEnglishStep('conversation')}>Next: Conversation Practice <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Conversation Practice Step */}
            {englishStep === 'conversation' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Conversation Practice</h2>
                <div className="mb-4 p-2 bg-green-50 dark:bg-green-900/30 rounded text-sm text-green-800 dark:text-green-200">
                  Practice real conversations in English with Sinhala translations.
                </div>
                {englishConversationPractice.map((section, idx) => (
                  <div key={idx} className="mb-6">
                    <h3 className="font-semibold mb-3">{section.title}</h3>
                    <div className="space-y-4">
                      {section.dialogues.map((dialogue, dIdx) => (
                        <div key={dIdx} className="bg-green-100 dark:bg-green-900/40 rounded-xl p-4 shadow-md">
                          <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">{dialogue.scenario}</div>
                          <div className="mb-2">
                            <span className="font-bold text-green-700 dark:text-green-300">A: </span>
                            <span>{dialogue.english}</span>
                            <div className="text-xs text-gray-500 mt-1">{dialogue.sinhala}</div>
                          </div>
                          <div>
                            <span className="font-bold text-green-700 dark:text-green-300">B: </span>
                            <span>{dialogue.response}</span>
                            <div className="text-xs text-gray-500 mt-1">{dialogue.responseSinhala}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button className="btn-primary" onClick={() => setEnglishStep('reading')}>Next: Reading Comprehension <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Reading Comprehension Step */}
            {englishStep === 'reading' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Reading Comprehension</h2>
                <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/30 rounded text-sm text-blue-800 dark:text-blue-200">
                  Read English passages and answer comprehension questions.
                </div>
                {englishReadingComprehension.map((section, idx) => (
                  <div key={idx} className="mb-6">
                    <h3 className="font-semibold mb-3">{section.title}</h3>
                    {section.passages.map((passage, pIdx) => (
                      <div key={pIdx} className="bg-blue-100 dark:bg-blue-900/40 rounded-xl p-4 shadow-md mb-4">
                        <h4 className="font-semibold mb-2">{passage.title}</h4>
                        <div className="mb-4 text-gray-700 dark:text-gray-200 leading-relaxed">
                          {passage.content}
                        </div>
                        <div className="space-y-2">
                          {passage.questions.map((q, qIdx) => (
                            <div key={qIdx} className="bg-white dark:bg-gray-800 rounded p-3">
                              <div className="font-semibold mb-2">{q.question}</div>
                              <div className="space-y-1">
                                {q.options.map((option, oIdx) => (
                                  <button key={oIdx} className="block w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                                    {option}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                <button className="btn-primary" onClick={() => setEnglishStep('writing')}>Next: Writing Practice <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Writing Practice Step */}
            {englishStep === 'writing' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Writing Practice</h2>
                <div className="mb-4 p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded text-sm text-yellow-800 dark:text-yellow-200">
                  Practice writing in English with guided prompts and examples.
                </div>
                {englishWritingPractice.map((section, idx) => (
                  <div key={idx} className="mb-6">
                    <h3 className="font-semibold mb-3">{section.title}</h3>
                    <div className="space-y-4">
                      {section.prompts.map((prompt, pIdx) => (
                        <div key={pIdx} className="bg-yellow-100 dark:bg-yellow-900/40 rounded-xl p-4 shadow-md">
                          <div className="font-semibold mb-2">{prompt.prompt}</div>
                          <textarea className="w-full h-32 p-3 border rounded-lg resize-none" placeholder="Write your response here..."></textarea>
                          <div className="mt-2">
                            <details className="text-sm">
                              <summary className="cursor-pointer text-blue-600 dark:text-blue-300">Show Example</summary>
                              <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                                <div className="font-semibold mb-1">Example:</div>
                                <div className="text-gray-700 dark:text-gray-200">{prompt.example}</div>
                                <div className="mt-2">
                                  <div className="font-semibold mb-1">Tips:</div>
                                  <ul className="list-disc pl-4 text-sm">
                                    {prompt.tips.map((tip, tIdx) => (
                                      <li key={tIdx}>{tip}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </details>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button className="btn-primary" onClick={() => setEnglishStep('business')}>Next: Business English <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Business English Step */}
            {englishStep === 'business' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Business English</h2>
                <div className="mb-4 p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded text-sm text-indigo-800 dark:text-indigo-200">
                  Learn business vocabulary and phrases for professional communication.
                </div>
                {englishBusinessEnglish.map((section, idx) => (
                  <div key={idx} className="mb-6">
                    <h3 className="font-semibold mb-3">{section.title}</h3>
                    <div className="space-y-4">
                      {section.words && (
                        <div className="grid grid-cols-2 gap-4">
                          {section.words.map((word, wIdx) => (
                            <div key={wIdx} className="bg-indigo-100 dark:bg-indigo-900/40 rounded-xl p-4 shadow-md">
                              <div className="font-semibold mb-1">{word.english}</div>
                              <div className="text-sm text-gray-700 dark:text-gray-200 mb-2">{word.sinhala}</div>
                              <div className="text-xs text-gray-500">{word.example}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      {section.phrases && (
                        <div className="space-y-2">
                          {section.phrases.map((phrase, pIdx) => (
                            <div key={pIdx} className="bg-indigo-100 dark:bg-indigo-900/40 rounded-xl p-4 shadow-md">
                              <div className="font-semibold mb-1">{phrase.english}</div>
                              <div className="text-sm text-gray-700 dark:text-gray-200 mb-2">{phrase.sinhala}</div>
                              <div className="text-xs text-gray-500">{phrase.usage}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <button className="btn-primary" onClick={() => setEnglishStep('academic')}>Next: Academic English <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Academic English Step */}
            {englishStep === 'academic' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Academic English</h2>
                <div className="mb-4 p-2 bg-teal-50 dark:bg-teal-900/30 rounded text-sm text-teal-800 dark:text-teal-200">
                  Learn academic vocabulary and writing skills for educational contexts.
                </div>
                {englishAcademicEnglish.map((section, idx) => (
                  <div key={idx} className="mb-6">
                    <h3 className="font-semibold mb-3">{section.title}</h3>
                    <div className="space-y-4">
                      {section.words && (
                        <div className="grid grid-cols-2 gap-4">
                          {section.words.map((word, wIdx) => (
                            <div key={wIdx} className="bg-teal-100 dark:bg-teal-900/40 rounded-xl p-4 shadow-md">
                              <div className="font-semibold mb-1">{word.english}</div>
                              <div className="text-sm text-gray-700 dark:text-gray-200 mb-2">{word.sinhala}</div>
                              <div className="text-xs text-gray-500">{word.example}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      {section.tips && (
                        <div className="bg-teal-100 dark:bg-teal-900/40 rounded-xl p-4 shadow-md">
                          <div className="font-semibold mb-2">Academic Writing Tips:</div>
                          <ul className="list-disc pl-4 text-sm">
                            {section.tips.map((tip, tIdx) => (
                              <li key={tIdx}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <button className="btn-primary" onClick={() => setEnglishStep('advanced')}>Next: Advanced Grammar <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Advanced Grammar Step */}
            {englishStep === 'advanced' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Advanced Grammar</h2>
                <div className="mb-4 p-2 bg-purple-50 dark:bg-purple-900/30 rounded text-sm text-purple-800 dark:text-purple-200">
                  Master complex English grammar structures and advanced language patterns.
                </div>
                {englishAdvancedGrammar.map((section, idx) => (
                  <div key={idx} className="mb-6">
                    <h3 className="font-semibold mb-3">{section.title}</h3>
                    <div className="space-y-4">
                      {section.lessons.map((lesson, lIdx) => (
                        <div key={lIdx} className="bg-purple-100 dark:bg-purple-900/40 rounded-xl p-4 shadow-md">
                          <h4 className="font-semibold mb-2">{lesson.topic}</h4>
                          <p className="text-gray-700 dark:text-gray-200 mb-3">{lesson.explanation}</p>
                          <div className="space-y-2">
                            {lesson.examples.map((example, eIdx) => (
                              <div key={eIdx} className="text-sm bg-white dark:bg-gray-800 rounded p-2">
                                {example}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button className="btn-primary" onClick={() => setEnglishStep('literature')}>Next: Literature & Poetry <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Literature & Poetry Step */}
            {englishStep === 'literature' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Literature & Poetry</h2>
                <div className="mb-4 p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded text-sm text-indigo-800 dark:text-indigo-200">
                  Explore classic and modern English literature and poetry.
                </div>
                {englishLiteraturePoetry.map((section, idx) => (
                  <div key={idx} className="mb-6">
                    <h3 className="font-semibold mb-3">{section.title}</h3>
                    <div className="space-y-4">
                      {section.content.map((item, iIdx) => (
                        <div key={iIdx} className="bg-indigo-100 dark:bg-indigo-900/40 rounded-xl p-4 shadow-md">
                          {item.poem && (
                            <div className="mb-3">
                              <div className="font-semibold mb-2">Poem by {item.author}:</div>
                              <div className="text-sm bg-white dark:bg-gray-800 rounded p-3 whitespace-pre-line">
                                {item.poem}
                              </div>
                              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                <div className="font-semibold">Analysis:</div>
                                {item.analysis}
                              </div>
                            </div>
                          )}
                          {item.author && !item.poem && (
                            <div>
                              <div className="font-semibold mb-2">{item.author} - {item.work}</div>
                              <div className="text-sm bg-white dark:bg-gray-800 rounded p-3 mb-2">
                                "{item.excerpt}"
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                <div className="font-semibold">Significance:</div>
                                {item.significance}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button className="btn-primary" onClick={() => setEnglishStep('alphabet')}>Restart Course</button>
              </div>
            )}
            {/* Advanced Step */}
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
        {languageTab === 'tamil' && (
          <>
            <div className="mb-6 text-gray-600 dark:text-gray-300">
              <p className="mb-2">Welcome to a complete Tamil course! Tamil (தமிழ்) is one of the oldest living languages in the world, with a rich literary tradition spanning over 2000 years. This course covers the alphabet, pronunciation, grammar, vocabulary, and cultural context.</p>
              <ul className="list-disc pl-6 text-sm">
                <li><b>Script:</b> Tamil uses its own script, which is syllabic and written left-to-right. It has 12 vowels and 18 consonants, with many combined forms.</li>
                <li><b>Alphabet:</b> The Tamil alphabet is phonetic and each letter represents a distinct sound. Vowels can stand alone or combine with consonants.</li>
                <li><b>Pronunciation:</b> Tamil has unique sounds and pronunciation rules. Listen to the audio for each letter and practice writing.</li>
                <li><b>Culture:</b> Tamil language and culture are deeply intertwined, with rich traditions in literature, music, and philosophy.</li>
              </ul>
            </div>
            {/* Alphabet Step */}
            {tamilStep === 'alphabet' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Tamil Alphabet (தமிழ் எழுத்துக்கள்)</h2>
                <div className="mb-4 text-blue-900 dark:text-blue-200 text-sm">The Tamil alphabet consists of vowels (உயிரெழுத்துக்கள்) and consonants (மெய்யெழுத்துக்கள்). Practice each letter, listen to its sound, and try writing it.</div>
                <h3 className="text-xl font-semibold mb-2 mt-4">Vowels (உயிரெழுத்துக்கள்)</h3>
                <div className="grid grid-cols-6 gap-4 mb-6">
                  {tamilAlphabet.slice(0, 12).map((l, idx) => (
                    <motion.div
                      key={l.letter}
                      whileHover={{ scale: 1.1 }}
                      className="bg-blue-100 dark:bg-blue-900/40 rounded-xl p-4 flex flex-col items-center shadow-md"
                    >
                      <span className="text-3xl font-bold mb-2">{l.letter}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-200 mb-2">{l.sound}</span>
                      <span className="text-xs text-gray-500">{l.example}</span>
                      <span className="mt-2 text-xs text-gray-400">(Trace on paper)</span>
                    </motion.div>
                  ))}
                </div>
                <h3 className="text-xl font-semibold mb-2 mt-4">Consonants (மெய்யெழுத்துக்கள்)</h3>
                <div className="grid grid-cols-6 gap-4 mb-6">
                  {tamilAlphabet.slice(12).map((l, idx) => (
                    <motion.div
                      key={l.letter}
                      whileHover={{ scale: 1.1 }}
                      className="bg-green-100 dark:bg-green-900/40 rounded-xl p-4 flex flex-col items-center shadow-md"
                    >
                      <span className="text-3xl font-bold mb-2">{l.letter}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-200 mb-2">{l.sound}</span>
                      <span className="text-xs text-gray-500">{l.example}</span>
                      <span className="mt-2 text-xs text-gray-400">(Trace on paper)</span>
                    </motion.div>
                  ))}
                </div>
                <div className="mb-4 text-xs text-gray-500 dark:text-gray-400">Note: Each consonant can combine with vowels to form syllables. Mastering these combinations is key to reading and writing Tamil.</div>
                <button className="btn-primary" onClick={() => setTamilStep('words')}>Next: Basic Words <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Words Step */}
            {tamilStep === 'words' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Basic Words & Phrases (அடிப்படை வார்த்தைகள்)</h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {tamilBasicWords.map((w, idx) => (
                    <motion.div
                      key={w.tamil}
                      whileHover={{ scale: 1.05 }}
                      className="bg-green-100 dark:bg-green-900/40 rounded-xl p-4 flex flex-col items-center shadow-md"
                    >
                      <span className="text-xl font-bold mb-1">{w.tamil}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-200 mb-2">{w.english}</span>
                      <span className="text-xs text-gray-500">{w.example}</span>
                    </motion.div>
                  ))}
                </div>
                <button className="btn-primary" onClick={() => setTamilStep('grammar')}>Next: Basic Grammar <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Grammar Step */}
            {tamilStep === 'grammar' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Basic Grammar (அடிப்படை இலக்கணம்)</h2>
                <div className="space-y-4 mb-6">
                  {tamilGrammar.map((g, idx) => (
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
                <button className="btn-primary" onClick={() => setTamilStep('speaking')}>Next: Speaking Test <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Speaking Test Step */}
            {tamilStep === 'speaking' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Speaking Test (பேச்சு சோதனை)</h2>
                <div className="mb-4">
                  <p className="mb-2 text-gray-600 dark:text-gray-300">Try saying the following in Tamil:</p>
                  <ul className="list-disc pl-6 mb-4">
                    <li>வணக்கம் (Hello)</li>
                    <li>நன்றி (Thank you)</li>
                    <li>எப்படி இருக்கிறீர்கள்? (How are you?)</li>
                    <li>நான் தமிழ் கற்கிறேன் (I am learning Tamil)</li>
                  </ul>
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700">
                    <span className="font-semibold">Practice:</span> <span className="text-blue-700 dark:text-blue-200">Try speaking these phrases aloud and record yourself for practice.</span>
                  </div>
                </div>
                <button className="btn-primary" onClick={() => setTamilStep('activities')}>Next: Interactive Activities <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Activities Step */}
            {tamilStep === 'activities' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Interactive Activities (உரையாடல் செயல்பாடுகள்)</h2>
                <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/30 rounded text-sm text-blue-800 dark:text-blue-200">Try the activities below! Match words, fill in blanks, and test your Tamil skills.</div>
                {/* Matching Activity */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">1. {tamilActivities[0].question}</h3>
                  <div className="text-xs mb-1 text-gray-500">Select the correct English meaning for each Tamil word.</div>
                  <div className="grid grid-cols-2 gap-4">
                    {tamilActivities[0].pairs.map((pair, idx) => (
                      <div key={pair.tamil} className="flex items-center gap-2">
                        <span className="font-bold text-blue-700 dark:text-blue-300">{pair.tamil}</span>
                        <select
                          className="input-field text-sm"
                          value={tamilMatchAnswers[pair.tamil] || ''}
                          onChange={e => setTamilMatchAnswers({ ...tamilMatchAnswers, [pair.tamil]: e.target.value })}
                        >
                          <option value="">Select</option>
                          {tamilActivities[0].pairs.map((p) => (
                            <option key={p.english} value={p.english}>{p.english}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                  <button className="btn-secondary mt-2" onClick={checkTamilMatch}>Check</button>
                  {tamilShowFeedback && tamilActivityResult !== null && (
                    <div className={`mt-2 p-2 rounded-xl ${tamilActivityResult ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {tamilActivityResult ? 'Correct!' : 'Try again!'}
                    </div>
                  )}
                </div>
                {/* Fill in the Blank Activity */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">2. {tamilActivities[1].question}</h3>
                  <div className="text-xs mb-1 text-gray-500">Fill in the blank with the correct Tamil word.</div>
                  <input
                    className="input-field text-sm mr-2"
                    value={tamilFillInput}
                    onChange={e => setTamilFillInput(e.target.value)}
                    placeholder="Enter Tamil word"
                  />
                  <button className="btn-secondary" onClick={checkTamilFill}>Check</button>
                  {tamilShowFeedback && tamilActivityResult !== null && (
                    <div className={`mt-2 p-2 rounded-xl ${tamilActivityResult ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {tamilActivityResult ? 'Correct!' : 'Try again!'}
                    </div>
                  )}
                </div>
                {/* Listening Comprehension Activity */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">3. {tamilActivities[2].question}</h3>
                  <div className="text-xs mb-1 text-gray-500">Listen to the Tamil word and select the correct English meaning.</div>
                  {tamilActivities[2].options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <button onClick={() => playAudio(opt.audio)} className="text-blue-600 dark:text-blue-300 hover:text-blue-800">
                        <Volume2 />
                      </button>
                      <span className="mr-2">Audio {idx + 1}</span>
                      {opt.choices.map(choice => (
                        <button
                          key={choice}
                          className={`btn-secondary ml-1 ${tamilListenAnswers[idx] === choice ? 'ring-2 ring-blue-400' : ''}`}
                          onClick={() => checkTamilListen(idx, choice)}
                        >
                          {choice}
                        </button>
                      ))}
                      {tamilShowFeedback && tamilListenAnswers[idx] && (
                        <span className={`ml-2 font-semibold ${tamilListenAnswers[idx] === opt.correct ? 'text-green-700' : 'text-red-700'}`}>
                          {tamilListenAnswers[idx] === opt.correct ? 'Correct!' : 'Try again!'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <button className="btn-primary" onClick={() => setTamilStep('advanced')}>Next: Advanced <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
            {/* Advanced Step */}
            {tamilStep === 'advanced' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Advanced Tamil (உயர்ந்த தமிழ்)</h2>
                <div className="mb-4 text-gray-600 dark:text-gray-300">Learn advanced grammar, vocabulary, and cultural expressions. Explore the rich literary tradition and modern usage.</div>
                <div className="space-y-4 mb-6">
                  <div className="bg-purple-100 dark:bg-purple-900/40 rounded-xl p-4 shadow-md">
                    <h3 className="font-semibold text-lg mb-2">Literary Tamil</h3>
                    <p className="text-gray-700 dark:text-gray-200">Tamil has a rich literary tradition with classical and modern forms. Classical Tamil literature dates back over 2000 years.</p>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/40 rounded-xl p-4 shadow-md">
                    <h3 className="font-semibold text-lg mb-2">Cultural Expressions</h3>
                    <p className="text-gray-700 dark:text-gray-200">Tamil culture emphasizes respect, family values, and community. Language reflects these cultural values.</p>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/40 rounded-xl p-4 shadow-md">
                    <h3 className="font-semibold text-lg mb-2">Modern Usage</h3>
                    <p className="text-gray-700 dark:text-gray-200">Contemporary Tamil incorporates new vocabulary while preserving traditional grammar and structure.</p>
                  </div>
                </div>
                <button className="btn-primary" onClick={() => setTamilStep('alphabet')}>Back to Alphabet <ArrowRight className="inline ml-1" /></button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}