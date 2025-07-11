import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Volume2, 
  Brain, 
  Users, 
  Award, 
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Star,
  Lightbulb,
  Globe,
  Calendar
} from 'lucide-react';
import AnimatedButton from '../components/AnimatedButton';

const SinhalaLearning = () => {
  const [activeLesson, setActiveLesson] = useState(null);
  const [currentLevel, setCurrentLevel] = useState('beginner');
  const [progress, setProgress] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);

  const levels = [
    { id: 'beginner', name: 'Beginner', color: 'from-green-500 to-emerald-600' },
    { id: 'intermediate', name: 'Intermediate', color: 'from-blue-500 to-indigo-600' },
    { id: 'advanced', name: 'Advanced', color: 'from-purple-500 to-violet-600' },
    { id: 'cultural', name: 'Cultural Context', color: 'from-orange-500 to-red-500' }
  ];

  const sinhalaLessons = {
    beginner: [
      {
        id: 'alphabet',
        title: 'Sinhala Alphabet (අකුරු)',
        description: 'Master the 61 letters of Sinhala script',
        content: {
          vowels: [
            { sinhala: 'අ', romanized: 'a', sound: '/a/', example: 'අම්මා (amma) - mother' },
            { sinhala: 'ආ', romanized: 'ā', sound: '/aː/', example: 'ආයුර්වේදය (āyurvēdaya) - Ayurveda' },
            { sinhala: 'ඇ', romanized: 'æ', sound: '/æ/', example: 'ඇස (æsa) - eye' },
            { sinhala: 'ඈ', romanized: 'ǣ', sound: '/æː/', example: 'ඈත (ǣta) - distance' },
            { sinhala: 'ඉ', romanized: 'i', sound: '/i/', example: 'ඉගෙන (igen) - learn' },
            { sinhala: 'ඊ', romanized: 'ī', sound: '/iː/', example: 'ඊළඟ (īḷaṅa) - next' },
            { sinhala: 'උ', romanized: 'u', sound: '/u/', example: 'උයන (uyana) - garden' },
            { sinhala: 'ඌ', romanized: 'ū', sound: '/uː/', example: 'ඌරු (ūru) - pig' },
            { sinhala: 'එ', romanized: 'e', sound: '/e/', example: 'එළුව (eḷuva) - goat' },
            { sinhala: 'ඒ', romanized: 'ē', sound: '/eː/', example: 'ඒක (ēka) - that' },
            { sinhala: 'ඔ', romanized: 'o', sound: '/o/', example: 'ඔබ (oba) - you' },
            { sinhala: 'ඕ', romanized: 'ō', sound: '/oː/', example: 'ඕනෑම (ōnǣma) - any' }
          ],
          consonants: [
            { sinhala: 'ක', romanized: 'ka', sound: '/ka/', example: 'කමල (kamala) - lotus' },
            { sinhala: 'ඛ', romanized: 'kha', sound: '/kʰa/', example: 'ඛණ්ඩ (khaṇḍa) - piece' },
            { sinhala: 'ග', romanized: 'ga', sound: '/ga/', example: 'ගම (gama) - village' },
            { sinhala: 'ඝ', romanized: 'gha', sound: '/gʰa/', example: 'ඝන (ghana) - solid' },
            { sinhala: 'ච', romanized: 'ca', sound: '/t͡ʃa/', example: 'චන්ද්‍රයා (candraya) - moon' },
            { sinhala: 'ජ', romanized: 'ja', sound: '/d͡ʒa/', example: 'ජල (jala) - water' },
            { sinhala: 'ත', romanized: 'ta', sound: '/t̪a/', example: 'තරු (taru) - star' },
            { sinhala: 'ද', romanized: 'da', sound: '/d̪a/', example: 'දරුවා (daruva) - child' },
            { sinhala: 'න', romanized: 'na', sound: '/na/', example: 'නම (nama) - name' },
            { sinhala: 'ප', romanized: 'pa', sound: '/pa/', example: 'පතා (pata) - leaf' },
            { sinhala: 'බ', romanized: 'ba', sound: '/ba/', example: 'බල්ලා (balla) - dog' },
            { sinhala: 'ම', romanized: 'ma', sound: '/ma/', example: 'මල (mala) - flower' },
            { sinhala: 'ය', romanized: 'ya', sound: '/ja/', example: 'යකා (yaka) - demon' },
            { sinhala: 'ර', romanized: 'ra', sound: '/ra/', example: 'රටට (raṭaṭa) - to country' },
            { sinhala: 'ල', romanized: 'la', sound: '/la/', example: 'ලස්සන (lassana) - beautiful' },
            { sinhala: 'ව', romanized: 'va', sound: '/va/', example: 'වතුර (vatur) - water' },
            { sinhala: 'ස', romanized: 'sa', sound: '/sa/', example: 'සමය (samaya) - time' },
            { sinhala: 'හ', romanized: 'ha', sound: '/ha/', example: 'හදවත (hadavata) - heart' }
          ]
        }
      },
      {
        id: 'greetings',
        title: 'Daily Greetings (ආයුබෝවන්)',
        description: 'Essential greetings and polite expressions',
        content: {
          greetings: [
            { sinhala: 'ආයුබෝවන්', romanized: 'āyubōvan', english: 'Hello/Goodbye', cultural: 'Traditional Buddhist greeting meaning "may you live long"' },
            { sinhala: 'සුභ උදෑසනක්', romanized: 'subha udǣsanak', english: 'Good morning', cultural: 'Formal morning greeting' },
            { sinhala: 'සුභ සන්ධ්‍යාවක්', romanized: 'subha sandhyāvak', english: 'Good evening', cultural: 'Formal evening greeting' },
            { sinhala: 'ගිහින් එන්නම්', romanized: 'gihin ennam', english: 'I\'ll go and come back', cultural: 'Common way to say goodbye when leaving temporarily' }
          ],
          polite: [
            { sinhala: 'කරුණාකර', romanized: 'karuṇākara', english: 'Please', usage: 'Used when requesting something politely' },
            { sinhala: 'ස්තූතියි', romanized: 'stūtiyi', english: 'Thank you', usage: 'Standard thank you' },
            { sinhala: 'සමාවෙන්න', romanized: 'samāvenna', english: 'Sorry/Excuse me', usage: 'For apologies or getting attention' },
            { sinhala: 'කමක් නෑ', romanized: 'kamak nǣ', english: 'It\'s okay/No problem', usage: 'Response to apologies' }
          ]
        }
      }
    ],
    intermediate: [
      {
        id: 'grammar',
        title: 'Grammar Fundamentals (ව්‍යාකරණ)',
        description: 'Essential grammar patterns and sentence structure',
        content: {
          verbConjugation: [
            { 
              verb: 'කරනවා (karanava) - to do',
              present: 'මම කරනවා (mama karanava) - I do/am doing',
              past: 'මම කළා (mama kaḷā) - I did',
              future: 'මම කරන්නම් (mama karannam) - I will do'
            },
            {
              verb: 'යනවා (yanava) - to go',
              present: 'මම යනවා (mama yanava) - I go/am going',
              past: 'මම ගියා (mama giyā) - I went',
              future: 'මම යන්නම් (mama yannam) - I will go'
            }
          ],
          pronouns: [
            { sinhala: 'මම', romanized: 'mama', english: 'I', formal: false },
            { sinhala: 'ඔබ', romanized: 'oba', english: 'you', formal: true },
            { sinhala: 'ඔයා', romanized: 'oyā', english: 'you', formal: false },
            { sinhala: 'ඔහු', romanized: 'ohu', english: 'he', formal: true },
            { sinhala: 'ඇය', romanized: 'æya', english: 'she', formal: true }
          ]
        }
      },
      {
        id: 'culture',
        title: 'Cultural Context (සංස්කෘතික)',
        description: 'Understanding cultural nuances in language use',
        content: {
          honorifics: [
            { term: 'මහත්තයා (mahattayā)', meaning: 'Sir/Mr.', usage: 'Respectful address for men' },
            { term: 'මහත්මිය (mahattmiya)', meaning: 'Madam/Mrs.', usage: 'Respectful address for women' },
            { term: 'මිස් (mis)', meaning: 'Miss', usage: 'For unmarried women (modern usage)' }
          ],
          buddhist: [
            { phrase: 'සාධු සාධු', romanized: 'sādhu sādhu', meaning: 'Well done! (Buddhist approval)', context: 'Used after religious chanting or good deeds' },
            { phrase: 'බුදු සරණයි', romanized: 'budu saraṇayi', meaning: 'May Buddha protect', context: 'Common blessing or expression of faith' },
            { phrase: 'පින්', romanized: 'pin', meaning: 'Merit/Good karma', context: 'Central concept in Buddhist culture' }
          ]
        }
      }
    ],
    advanced: [
      {
        id: 'idioms',
        title: 'Idioms & Proverbs (පරිකථා)',
        description: 'Traditional sayings and their meanings',
        content: {
          idioms: [
            {
              sinhala: 'කුරුල්ලාගේ කටේ මාළුව',
              romanized: 'kurullāgē kaṭē māḷuva',
              literal: 'Fish in the bird\'s mouth',
              meaning: 'Something impossible or unlikely',
              usage: 'Used when describing impossible situations'
            },
            {
              sinhala: 'ගල් කන බල්ලා',
              romanized: 'gal kana ballā',
              literal: 'Dog that eats stones',
              meaning: 'Someone who is extremely poor or desperate',
              usage: 'Describes extreme poverty or desperation'
            }
          ],
          proverbs: [
            {
              sinhala: 'අප්පච්චි කෑවට වැදි අම්මච්චි අඬන්නේ',
              romanized: 'appacci kǣvaṭa vædi ammacci aḍannē',
              meaning: 'Grandmother cries more than grandfather who was beaten',
              lesson: 'Sometimes outsiders show more concern than those directly affected'
            }
          ]
        }
      }
    ],
    cultural: [
      {
        id: 'festivals',
        title: 'Sri Lankan Festivals (උත්සව)',
        description: 'Traditional celebrations and their significance',
        content: {
          buddhist: [
            {
              name: 'වෙසක් (Vesak)',
              significance: 'Buddha\'s birth, enlightenment, and passing away',
              traditions: 'Lanterns, free food stalls (dānsalas), religious observances',
              vocabulary: ['පන්සිල් (pansil) - Five precepts', 'දානසාලා (dānsālā) - Free food stall']
            },
            {
              name: 'පෝයදා (Pōyadā)',
              significance: 'Full moon day - monthly Buddhist observance',
              traditions: 'Temple visits, meditation, vegetarian meals',
              vocabulary: ['පන්සිල් (pansil) - Precepts', 'මෙදිතේශන (meditēśana) - Meditation']
            }
          ],
          cultural: [
            {
              name: 'අවුරුදු (Avurudu)',
              significance: 'Sinhala & Tamil New Year',
              traditions: 'Traditional games, special foods, family gatherings',
              vocabulary: ['කිරිබත් (kiribat) - Milk rice', 'කෝකිස් (kōkis) - Traditional sweet']
            }
          ]
        }
      }
    ]
  };

  const LessonCard = ({ lesson, level, isActive, onClick }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`card-premium p-6 cursor-pointer transition-all duration-300 ${
        isActive ? 'ring-2 ring-blue-500 shadow-glow' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${level.color} rounded-xl flex items-center justify-center`}>
          <BookOpen className="w-6 h-6 text-white" />
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        {lesson.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        {lesson.description}
      </p>
      
      {progress[lesson.id] && (
        <div className="mt-4 flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-600 dark:text-green-400">Completed</span>
        </div>
      )}
    </motion.div>
  );

  const AlphabetSection = ({ content }) => (
    <div className="space-y-8">
      <div>
        <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Vowels (ස්වර)
        </h4>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.vowels.map((vowel, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-4"
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {vowel.sinhala}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {vowel.romanized} {vowel.sound}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {vowel.example}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Consonants (ව්‍යඤ්ජන)
        </h4>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {content.consonants.map((consonant, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card p-4"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {consonant.sinhala}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {consonant.romanized}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {consonant.example}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const CulturalNote = ({ title, content }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6 mb-6"
    >
      <div className="flex items-center space-x-3 mb-4">
        <Globe className="w-6 h-6 text-orange-600" />
        <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-200">
          Cultural Insight: {title}
        </h4>
      </div>
      <p className="text-orange-700 dark:text-orange-300">
        {content}
      </p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">Learn Sinhala</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Master the beautiful Sinhala language with comprehensive lessons covering 
            script, grammar, culture, and traditional wisdom.
          </p>
        </motion.div>
      </div>
      {/* Level Selector */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {levels.map((level) => (
          <motion.button
            key={level.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentLevel(level.id)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              currentLevel === level.id
                ? `bg-gradient-to-r ${level.color} text-white shadow-glow`
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-lg'
            }`}
          >
            {level.name}
          </motion.button>
        ))}
      </div>

      {/* Lessons Grid */}
      {!activeLesson ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {sinhalaLessons[currentLevel]?.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              level={levels.find(l => l.id === currentLevel)}
              isActive={false}
              onClick={() => setActiveLesson(lesson)}
            />
          ))}
        </div>
      ) : (
        /* Lesson Content */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {activeLesson.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {activeLesson.description}
              </p>
            </div>
            <AnimatedButton
              onClick={() => setActiveLesson(null)}
              variant="outline"
              size="sm"
            >
              Back to Lessons
            </AnimatedButton>
          </div>

            {/* Render lesson content based on type */}
            {activeLesson.id === 'alphabet' && (
              <>
                <CulturalNote
                  title="Sinhala Script"
                  content="The Sinhala script is one of the most complex writing systems in the world, derived from ancient Brahmi script. It's characterized by its circular and curved letterforms, which were originally carved on palm leaves."
                />
                <AlphabetSection content={activeLesson.content} />
              </>
            )}

            {activeLesson.id === 'greetings' && (
              <div className="space-y-8">
                <CulturalNote
                  title="Greeting Etiquette"
                  content="Sinhala greetings often reflect Buddhist philosophy and social hierarchy. The traditional 'Āyubōvan' is more than just hello - it's a blessing for longevity and prosperity."
                />
                
                <div>
                  <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                    Essential Greetings
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {activeLesson.content.greetings.map((greeting, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card p-6"
                      >
                        <div className="text-2xl font-bold text-blue-600 mb-2">
                          {greeting.sinhala}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 mb-2">
                          {greeting.romanized}
                        </div>
                        <div className="text-gray-800 dark:text-gray-100 font-medium mb-3">
                          {greeting.english}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-500 italic">
                          {greeting.cultural}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                    Polite Expressions
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {activeLesson.content.polite.map((expression, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card p-6"
                      >
                        <div className="text-2xl font-bold text-blue-600 mb-2">
                          {expression.sinhala}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 mb-2">
                          {expression.romanized}
                        </div>
                        <div className="text-gray-800 dark:text-gray-100 font-medium mb-3">
                          {expression.english}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-500 italic">
                          {expression.usage}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeLesson.id === 'grammar' && (
              <div className="space-y-8">
                <CulturalNote
                  title="Understanding Grammar"
                  content="Sinhala grammar is essential for constructing meaningful sentences. It involves the use of particles, verb conjugations, and sentence structure that may differ significantly from English."
                />
                
                <div>
                  <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                    Verb Conjugation
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {activeLesson.content.verbConjugation.map((verb, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card p-6"
                      >
                        <div className="text-xl font-bold text-blue-600 mb-2">
                          {verb.verb}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 mb-2">
                          Present: {verb.present}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 mb-2">
                          Past: {verb.past}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 mb-2">
                          Future: {verb.future}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                    Pronouns
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {activeLesson.content.pronouns.map((pronoun, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card p-6"
                      >
                        <div className="text-xl font-bold text-blue-600 mb-2">
                          {pronoun.sinhala}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 mb-2">
                          Romanized: {pronoun.romanized}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 mb-2">
                          English: {pronoun.english}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-500 italic">
                          {pronoun.formal ? 'Formal' : 'Informal'}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeLesson.id === 'culture' && (
              <div className="space-y-8">
                <CulturalNote
                  title="Cultural Nuances"
                  content="Understanding the cultural context is crucial when learning Sinhala. It helps in grasping the subtleties of the language and using it appropriately in social situations."
                />
                
                <div>
                  <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                    Honorifics
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {activeLesson.content.honorifics.map((term, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card p-6"
                      >
                        <div className="text-xl font-bold text-blue-600 mb-2">
                          {term.term}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 mb-2">
                          Meaning: {term.meaning}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 mb-2">
                          Usage: {term.usage}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                    Buddhist Expressions
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {activeLesson.content.buddhist.map((phrase, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card p-6"
                      >
                        <div className="text-xl font-bold text-blue-600 mb-2">
                          {phrase.phrase}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 mb-2">
                          Romanized: {phrase.romanized}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 mb-2">
                          Meaning: {phrase.meaning}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-500 italic">
                          Context: {phrase.context}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeLesson.id === 'idioms' && (
              <div className="space-y-8">
                <CulturalNote
                  title="Idioms & Proverbs"
                  content="Sinhala idioms and proverbs are rich in metaphor and cultural significance. They offer deep insights into the values and beliefs of Sri Lankan society."
                />
                
                <div>
                  <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                    Common Idioms
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {activeLesson.content.idioms.map((idiom, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card p-6"
                      >
                        <div className="text-xl font-bold text-blue-600 mb-2">
                          {idiom.sinhala}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 mb-2">
                          Romanized: {idiom.romanized}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 mb-2">
                          Literal Meaning: {idiom.literal}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 mb-2">
                          Actual Meaning: {idiom.meaning}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-500 italic">
                          Usage: {idiom.usage}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                    Notable Proverbs
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {activeLesson.content.proverbs.map((proverb, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card p-6"
                      >
                        <div className="text-xl font-bold text-blue-600 mb-2">
                          {proverb.sinhala}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 mb-2">
                          Romanized: {proverb.romanized}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 mb-2">
                          Meaning: {proverb.meaning}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-500 italic">
                          Lesson: {proverb.lesson}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeLesson.id === 'festivals' && (
              <div className="space-y-8">
                <CulturalNote
                  title="Sri Lankan Festivals"
                  content="Festivals in Sri Lanka are vibrant and full of cultural significance, often linked to Buddhist traditions and the agricultural calendar."
                />
                
                <div>
                  <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                    Buddhist Festivals
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {activeLesson.content.buddhist.map((festival, index) => (
                      <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="card p-6"
                                      >
                                        <div className="text-xl font-bold text-blue-600 mb-2">
                                          {festival.name}
                                        </div>
                                        <div className="text-gray-600 dark:text-gray-400 mb-2">
                                          Significance: {festival.significance}
                                        </div>
                                        <div className="text-gray-600 dark:text-gray-400 mb-2">
                                          Traditions: {festival.traditions}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-500 italic">
                                          Vocabulary: {festival.vocabulary.join(', ')}
                                        </div>
                                                    </motion.div>
                                                  ))}
                                                </div>
                                              </div>
                                            </div>
                                          )}
                        </motion.div>
                      )}
                    </div>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                );
                
                export default SinhalaLearning;