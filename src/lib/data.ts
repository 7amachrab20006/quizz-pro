export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizLevel {
  id: string; // e.g., 'geography-l1'
  levelNumber: number;
  questions: Question[];
}

export interface QuizCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  requiredLevel?: number;
  levels: QuizLevel[];
}

export const CATEGORIES: QuizCategory[] = [
  {
    id: 'geography',
    name: 'Geography',
    icon: 'Globe',
    description: 'Countries, capitals, and the wonders of our planet.',
    difficulty: 'Easy',
    requiredLevel: 1,
    levels: [
      {
        id: 'geography-l1',
        levelNumber: 1,
        questions: [
          { id: 'g1', text: 'What is the largest continent by area?', options: ['Africa', 'Europe', 'Asia', 'North America'], correctAnswer: 2 },
          { id: 'g2', text: 'Which country has the largest population?', options: ['India', 'China', 'USA', 'Indonesia'], correctAnswer: 1 },
          { id: 'g3', text: 'What is the capital city of France?', options: ['Lyon', 'Marseille', 'Paris', 'Bordeaux'], correctAnswer: 2 },
          { id: 'g4', text: 'Which ocean is the largest?', options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], correctAnswer: 2 },
          { id: 'g5', text: 'Which river is the longest in the world?', options: ['Amazon', 'Nile', 'Mississippi', 'Yangtze'], correctAnswer: 1 },
        ]
      },
      {
        id: 'geography-l2',
        levelNumber: 2,
        questions: [
          { id: 'g6', text: 'Which desert is the largest in the world?', options: ['Gobi', 'Sahara', 'Antarctic', 'Arabian'], correctAnswer: 2 },
          { id: 'g7', text: 'What is the capital of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], correctAnswer: 2 },
          { id: 'g8', text: 'Which country is also known as the Land of the Rising Sun?', options: ['China', 'Japan', 'Thailand', 'South Korea'], correctAnswer: 1 },
          { id: 'g9', text: 'Mount Everest is located in which mountain range?', options: ['Andes', 'Alps', 'Himalayas', 'Rockies'], correctAnswer: 2 },
          { id: 'g10', text: 'What is the smallest country in the world?', options: ['Monaco', 'Vatican City', 'Nauru', 'Tuvalu'], correctAnswer: 1 },
        ]
      }
    ]
  },
  {
    id: 'history',
    name: 'History',
    icon: 'History',
    description: 'Fun questions about the past.',
    difficulty: 'Easy',
    requiredLevel: 1,
    levels: [
      {
        id: 'history-l1',
        levelNumber: 1,
        questions: [
          { id: 'h1', text: 'Who was the first President of the USA?', options: ['George Washington', 'Abraham Lincoln', 'John F. Kennedy', 'Barack Obama'], correctAnswer: 0 },
          { id: 'h2', text: 'In which country are the Great Pyramids located?', options: ['Mexico', 'Egypt', 'China', 'Greece'], correctAnswer: 1 },
          { id: 'h3', text: 'What was the titanic?', options: ['A plane', 'A car', 'A ship', 'A train'], correctAnswer: 2 },
          { id: 'h4', text: 'Which ancient people built the Colosseum?', options: ['Greeks', 'Romans', 'Egyptians', 'Mayans'], correctAnswer: 1 },
          { id: 'h5', text: 'Who discovered America in 1492?', options: ['Christopher Columbus', 'Marco Polo', 'Neil Armstrong', 'Albert Einstein'], correctAnswer: 0 },
        ]
      },
      {
        id: 'history-l2',
        levelNumber: 2,
        questions: [
          { id: 'h6', text: 'In which year did World War II end?', options: ['1943', '1944', '1945', '1946'], correctAnswer: 2 },
          { id: 'h7', text: 'Who was the lead singer of Queen?', options: ['Elvis Presley', 'Freddie Mercury', 'David Bowie', 'Mick Jagger'], correctAnswer: 1 },
          { id: 'h8', text: 'Who was known as the Maid of Orléans?', options: ['Marie Antoinette', 'Joan of Arc', 'Catherine the Great', 'Victoria'], correctAnswer: 1 },
          { id: 'h9', text: 'What was the name of the first artificial satellite?', options: ['Apollo 11', 'Sputnik 1', 'Voyager 1', 'Explorer 1'], correctAnswer: 1 },
          { id: 'h10', text: 'Which empire was ruled by Julius Caesar?', options: ['Greek', 'Roman', 'Ottoman', 'Persian'], correctAnswer: 1 },
        ]
      }
    ]
  },
  {
    id: 'tech',
    name: 'Technology',
    icon: 'Cpu',
    description: 'Easy questions about computers and gadgets.',
    difficulty: 'Easy',
    requiredLevel: 1,
    levels: [
      {
        id: 'tech-l1',
        levelNumber: 1,
        questions: [
          { id: 't1', text: 'Which company makes the iPhone?', options: ['Google', 'Samsung', 'Apple', 'Nokia'], correctAnswer: 2 },
          { id: 't2', text: 'What does WWW stand for?', options: ['World Wide Web', 'World Wide Word', 'World Wide Work', 'Web World Wide'], correctAnswer: 0 },
          { id: 't3', text: 'Which of these is used to type on a computer?', options: ['Mouse', 'Keyboard', 'Monitor', 'Printer'], correctAnswer: 1 },
          { id: 't4', text: 'What do you use to search for things on the internet?', options: ['Facebook', 'Google', 'WhatsApp', 'Netflix'], correctAnswer: 1 },
          { id: 't5', text: 'What is a "laptop"?', options: ['A type of car', 'A portable computer', 'A kitchen tool', 'A musical instrument'], correctAnswer: 1 },
        ]
      },
      {
        id: 'tech-l2',
        levelNumber: 2,
        questions: [
          { id: 't6', text: 'Who is the co-founder of Microsoft?', options: ['Steve Jobs', 'Bill Gates', 'Elon Musk', 'Mark Zuckerberg'], correctAnswer: 1 },
          { id: 't7', text: 'What does CPU stand for?', options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Power Unit', 'Core Processing Utility'], correctAnswer: 0 },
          { id: 't8', text: 'Which of these is an operating system?', options: ['Chrome', 'Windows', 'Google', 'Facebook'], correctAnswer: 1 },
          { id: 't9', text: 'What is the main function of a router?', options: ['Printing', 'Connecting to the internet', 'Storing files', 'Playing music'], correctAnswer: 1 },
          { id: 't10', text: 'What does PDF stand for?', options: ['Personal Data File', 'Portable Document Format', 'Printable Digital Folder', 'Public Data Form'], correctAnswer: 1 },
        ]
      }
    ]
  },
  {
    id: 'art-culture',
    name: 'Art & Culture',
    description: 'Explore masterpieces, creative eras, and cultural movements from around the world.',
    icon: 'Palette',
    difficulty: 'Medium',
    levels: [
      {
        id: 'art-l1',
        levelNumber: 1,
        questions: [
          {
            id: 'art-q1',
            text: 'Who painted the "Mona Lisa"?',
            options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Claude Monet'],
            correctAnswer: 2,
            explanation: 'Leonardo da Vinci painted the Mona Lisa between 1503 and 1506.'
          },
          {
            id: 'art-q2',
            text: 'Which art movement is Salvador Dali associated with?',
            options: ['Impressionism', 'Cubism', 'Surrealism', 'Pop Art'],
            correctAnswer: 2,
            explanation: 'Dali was a leading figure in the Surrealist movement.'
          }
        ]
      },
      {
        id: 'art-l2',
        levelNumber: 2,
        questions: [
          {
            id: 'art-q3',
            text: 'In which city is the Louvre Museum located?',
            options: ['London', 'Paris', 'Rome', 'Madrid'],
            correctAnswer: 1,
            explanation: 'The Louvre is the world\'s largest art museum and is located in Paris, France.'
          }
        ]
      }
    ]
  },
  {
    id: 'science',
    name: 'Science & Nature',
    description: 'From quantum physics to the animal kingdom.',
    icon: 'Microscope',
    difficulty: 'Medium',
    levels: [
      {
        id: 'science-l1',
        levelNumber: 1,
        questions: [
          { id: 's1', text: 'What is the chemical symbol for water?', options: ['CO2', 'O2', 'H2O', 'NaCl'], correctAnswer: 2 },
          { id: 's2', text: 'What is the largest animal in the world?', options: ['African Elephant', 'Blue Whale', 'Colossal Squid', 'Giraffe'], correctAnswer: 1 }
        ]
      }
    ]
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Athletes, records, and the thrill of the game.',
    icon: 'Trophy',
    difficulty: 'Easy',
    levels: [
      {
        id: 'sports-l1',
        levelNumber: 1,
        questions: [
          { id: 'sp1', text: 'How many players are there on a standard soccer team?', options: ['9', '10', '11', '12'], correctAnswer: 2 },
          { id: 'sp2', text: 'Which sport is known as the "king of sports"?', options: ['Basketball', 'Tennis', 'Soccer', 'Cricket'], correctAnswer: 2 }
        ]
      }
    ]
  },
  {
    id: 'pop-culture',
    name: 'Pop Culture & Movies',
    description: 'Cinema, music, and celebrity trivia.',
    icon: 'Film',
    difficulty: 'Easy',
    levels: [
      {
        id: 'pop-l1',
        levelNumber: 1,
        questions: [
          { id: 'p1', text: 'Which movie features the line "May the Force be with you"?', options: ['Star Trek', 'Star Wars', 'The Matrix', 'Inception'], correctAnswer: 1 },
          { id: 'p2', text: 'Who played Jack in the movie "Titanic"?', options: ['Brad Pitt', 'Leonardo DiCaprio', 'Tom Cruise', 'Johnny Depp'], correctAnswer: 1 }
        ]
      }
    ]
  },
  {
    id: 'logic',
    name: 'Logic & IQ',
    icon: 'Brain',
    description: 'Fun riddles and simple puzzles.',
    difficulty: 'Medium',
    levels: [
      {
        id: 'logic-l1',
        levelNumber: 1,
        questions: [
          { id: 'l1', text: 'What has a face and two hands but no arms or legs?', options: ['A clock', 'A person', 'A ghost', 'A chair'], correctAnswer: 0 },
          { id: 'l2', text: 'What has keys but can’t open any locks?', options: ['A door', 'A piano', 'A chest', 'A safe'], correctAnswer: 1 }
        ]
      }
    ]
  },
  {
    id: 'biology',
    name: 'Biology (SVT)',
    icon: 'Microscope',
    description: 'Learn about animals, plants, and your body.',
    difficulty: 'Easy',
    levels: [
      {
        id: 'bio-l1',
        levelNumber: 1,
        questions: [
          { id: 'b1', text: 'What do plants need to grow?', options: ['Water and Sun', 'Soda', 'Pizza', 'Sand'], correctAnswer: 0 },
          { id: 'b2', text: 'How many legs does a spider have?', options: ['4', '6', '8', '10'], correctAnswer: 2 }
        ]
      }
    ]
  },
  {
    id: 'math',
    name: 'Mathematics',
    icon: 'Calculator',
    description: 'Challenge your mental arithmetic and logic.',
    difficulty: 'Medium',
    levels: [
      {
        id: 'math-l1',
        levelNumber: 1,
        questions: [
          { id: 'm1', text: 'What is the sum of 15 + 27?', options: ['32', '42', '52', '41'], correctAnswer: 1 },
          { id: 'm2', text: 'What is 8 times 7?', options: ['54', '56', '58', '60'], correctAnswer: 1 }
        ]
      }
    ]
  },
  {
    id: 'philosophy',
    name: 'Philosophy',
    icon: 'BookOpen',
    description: 'Deep thoughts and historical ideas.',
    difficulty: 'Hard',
    levels: [
      {
        id: 'phil-l1',
        levelNumber: 1,
        questions: [
          { id: 'ph1', text: 'Who said "I think, therefore I am"?', options: ['Socrates', 'Plato', 'Descartes', 'Nietzsche'], correctAnswer: 2 },
          { id: 'ph2', text: 'Which ancient Greek philosopher was a student of Socrates?', options: ['Aristotle', 'Plato', 'Homer', 'Epicurus'], correctAnswer: 1 }
        ]
      }
    ]
  },
  {
    id: 'religion',
    name: 'Religion & Faith',
    icon: 'Church',
    description: 'Understanding global beliefs and traditions.',
    difficulty: 'Medium',
    levels: [
      {
        id: 'rel-l1',
        levelNumber: 1,
        questions: [
          { id: 're1', text: 'Which book is the central religious text of Islam?', options: ['Bible', 'Torah', 'Quran', 'Vedas'], correctAnswer: 2 },
          { id: 're2', text: 'In which religion is Christmas a major holiday?', options: ['Judaism', 'Buddhism', 'Christianity', 'Hinduism'], correctAnswer: 2 }
        ]
      }
    ]
  },
  {
    id: 'business',
    name: 'Business',
    icon: 'Briefcase',
    description: 'Foundations of economics and commerce.',
    difficulty: 'Medium',
    levels: [
      {
        id: 'biz-l1',
        levelNumber: 1,
        questions: [
          { id: 'bz1', text: 'What does "CEO" stand for?', options: ['Chief Executive Officer', 'Chief Energy Officer', 'Central Executive Office', 'Chief Electric Officer'], correctAnswer: 0 },
          { id: 'bz2', text: 'Which company was founded by Bill Gates?', options: ['Apple', 'Microsoft', 'Amazon', 'Facebook'], correctAnswer: 1 }
        ]
      }
    ]
  }
];
