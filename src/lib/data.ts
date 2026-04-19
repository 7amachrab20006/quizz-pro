export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: Question[];
}

export const CATEGORIES: QuizCategory[] = [
  {
    id: 'math',
    name: 'Mathematics',
    icon: 'Calculator',
    description: 'Challenge your mental arithmetic and logic.',
    difficulty: 'Medium',
    questions: [
      { id: 'm1', text: 'What is the value of Pi to 2 decimal places?', options: ['3.14', '3.16', '3.12', '3.18'], correctAnswer: 0 },
      { id: 'm2', text: 'What is 15% of 200?', options: ['20', '30', '40', '50'], correctAnswer: 1 },
      { id: 'm3', text: 'Solve for x: 2x + 10 = 20', options: ['5', '10', '15', '20'], correctAnswer: 0 },
      { id: 'm4', text: 'What is the square root of 144?', options: ['10', '11', '12', '13'], correctAnswer: 2 },
      { id: 'm5', text: 'What follows 1, 1, 2, 3, 5, 8...?', options: ['12', '13', '14', '15'], correctAnswer: 1 },
    ]
  },
  {
    id: 'tech',
    name: 'Technology',
    icon: 'Cpu',
    description: 'Hardware, software, and the future of computation.',
    difficulty: 'Hard',
    questions: [
      { id: 't1', text: 'Which language is used for web rendering?', options: ['Python', 'HTML', 'Java', 'C++'], correctAnswer: 1 },
      { id: 't2', text: 'What does CPU stand for?', options: ['Central Process Unit', 'Central Processing Unit', 'Computer Personal Unit', 'Core Processing Unit'], correctAnswer: 1 },
      { id: 't3', text: 'Which company developed the React library?', options: ['Google', 'Apple', 'Meta', 'Microsoft'], correctAnswer: 2 },
      { id: 't4', text: 'What is the main purpose of a database?', options: ['Styling', 'Storage', 'Logic', 'Networking'], correctAnswer: 1 },
      { id: 't5', text: 'Which protocol is used for secure web browsing?', options: ['HTTP', 'FTP', 'HTTPS', 'SSH'], correctAnswer: 2 },
    ]
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: 'Trophy',
    description: 'From the pitch to the court, how much do you know?',
    difficulty: 'Easy',
    questions: [
      { id: 's1', text: 'How many players are on a standard football team?', options: ['9', '10', '11', '12'], correctAnswer: 2 },
      { id: 's2', text: 'Which country won the 2022 World Cup?', options: ['France', 'Brazil', 'Argentina', 'Germany'], correctAnswer: 2 },
      { id: 's3', text: 'How long is a marathon in kilometers?', options: ['21.1', '42.2', '50', '100'], correctAnswer: 1 },
      { id: 's4', text: 'In which sport is "Love" used as a score?', options: ['Badminton', 'Tennis', 'Squash', 'Golf'], correctAnswer: 1 },
      { id: 's5', text: 'Who has won the most Ballon d\'Or awards?', options: ['Cristiano Ronaldo', 'Lionel Messi', 'Pele', 'Zidane'], correctAnswer: 1 },
    ]
  },
  {
    id: 'logic',
    name: 'Logic & IQ',
    icon: 'Brain',
    description: 'Test your reasoning with these riddles.',
    difficulty: 'Hard',
    questions: [
      { id: 'l1', text: 'What comes once in a minute, twice in a moment, but never in a thousand years?', options: ['The letter M', 'A breath', 'A second', 'An eye-blink'], correctAnswer: 0 },
      { id: 'l2', text: 'If you have me, you want to share me. If you share me, you haven\'t got me. What am I?', options: ['Money', 'A Secret', 'Love', 'Time'], correctAnswer: 1 },
      { id: 'l3', text: 'Which word becomes shorter when you add two letters to it?', options: ['Long', 'Small', 'Short', 'Brief'], correctAnswer: 2 },
      { id: 'l4', text: 'If 3 people can bake 3 cakes in 3 hours, how many hours does it take 1 person to bake 1 cake?', options: ['1', '3', '9', '2'], correctAnswer: 1 },
      { id: 'l5', text: 'What has keys but can\'t open locks?', options: ['A piano', 'A door', 'A map', 'A safe'], correctAnswer: 0 },
    ]
  },
  {
    id: 'physics',
    name: 'Physics',
    icon: 'Zap',
    description: 'Energy, matter, and the fundamental laws of nature.',
    difficulty: 'Hard',
    questions: [
      { id: 'p1', text: 'What is the speed of light in vacuum?', options: ['300,000 km/s', '150,000 km/s', '400,000 km/s', '200,000 km/s'], correctAnswer: 0 },
      { id: 'p2', text: 'Which scientist proposed the theory of relativity?', options: ['Isaac Newton', 'Albert Einstein', 'Nikola Tesla', 'Galileo Galilei'], correctAnswer: 1 },
      { id: 'p3', text: 'What is the unit of electrical resistance?', options: ['Volt', 'Ampere', 'Ohm', 'Watt'], correctAnswer: 2 },
      { id: 'p4', text: 'What is the force that pulls objects toward the core of the Earth?', options: ['Magnetism', 'Friction', 'Gravity', 'Inertia'], correctAnswer: 2 },
      { id: 'p5', text: 'Which state of matter has a definite volume but no definite shape?', options: ['Solid', 'Liquid', 'Gas', 'Plasma'], correctAnswer: 1 },
    ]
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    icon: 'FlaskConical',
    description: 'Explore the elements, reactions, and the composition of atoms.',
    difficulty: 'Medium',
    questions: [
      { id: 'c1', text: 'What is the chemical symbol for Gold?', options: ['Ag', 'Fe', 'Au', 'Pb'], correctAnswer: 2 },
      { id: 'c2', text: 'Which gas do plants absorb from the atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correctAnswer: 2 },
      { id: 'c3', text: 'What is the pH value of pure water?', options: ['1', '7', '14', '10'], correctAnswer: 1 },
      { id: 'c4', text: 'Which element is the primary constituent of diamonds?', options: ['Carbon', 'Silicon', 'Oxygen', 'Nitrogen'], correctAnswer: 0 },
      { id: 'c5', text: 'What is the lightest element in the periodic table?', options: ['Helium', 'Oxygen', 'Hydrogen', 'Lithium'], correctAnswer: 2 },
    ]
  },
  {
    id: 'biology',
    name: 'Biology (SVT)',
    icon: 'Microscope',
    description: 'The study of life, organisms, and ecosystems.',
    difficulty: 'Medium',
    questions: [
      { id: 'b1', text: 'What is the "powerhouse" of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Vacuole'], correctAnswer: 1 },
      { id: 'b2', text: 'How many chambers does the human heart have?', options: ['2', '3', '4', '5'], correctAnswer: 2 },
      { id: 'b3', text: 'What is the process by which plants make their food?', options: ['Respiration', 'Photosynthesis', 'Digestion', 'Fermentation'], correctAnswer: 1 },
      { id: 'b4', text: 'Which organ is responsible for filtering blood in the human body?', options: ['Heart', 'Lungs', 'Kidneys', 'Liver'], correctAnswer: 2 },
      { id: 'b5', text: 'What is the genetic material of life?', options: ['RNA', 'DNA', 'Proteins', 'Lipids'], correctAnswer: 1 },
    ]
  },
  {
    id: 'history',
    name: 'History',
    icon: 'History',
    description: 'Journey through time and the milestones of humanity.',
    difficulty: 'Hard',
    questions: [
      { id: 'h1', text: 'In which year did World War II end?', options: ['1943', '1944', '1945', '1946'], correctAnswer: 2 },
      { id: 'h2', text: 'Who was the first emperor of Rome?', options: ['Julius Caesar', 'Augustus', 'Nero', 'Trajan'], correctAnswer: 1 },
      { id: 'h3', text: 'Which ancient civilization built the Great Pyramids?', options: ['Romans', 'Greeks', 'Egyptians', 'Mayans'], correctAnswer: 2 },
      { id: 'h4', text: 'The French Revolution began in which year?', options: ['1776', '1789', '1804', '1812'], correctAnswer: 1 },
      { id: 'h5', text: 'Who discovered America in 1492?', options: ['Marco Polo', 'Vasco da Gama', 'Christopher Columbus', 'Magellan'], correctAnswer: 2 },
    ]
  },
  {
    id: 'geography',
    name: 'Geography',
    icon: 'Globe',
    description: 'Countries, capitals, and the wonders of our planet.',
    difficulty: 'Easy',
    questions: [
      { id: 'g1', text: 'What is the largest continent by area?', options: ['Africa', 'Europe', 'Asia', 'North America'], correctAnswer: 2 },
      { id: 'g2', text: 'Which country has the largest population?', options: ['India', 'China', 'USA', 'Indonesia'], correctAnswer: 1 },
      { id: 'g3', text: 'What is the capital city of France?', options: ['Lyon', 'Marseille', 'Paris', 'Bordeaux'], correctAnswer: 2 },
      { id: 'g4', text: 'Which ocean is the largest?', options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], correctAnswer: 2 },
      { id: 'g5', text: 'Which river is the longest in the world?', options: ['Amazon', 'Nile', 'Mississippi', 'Yangtze'], correctAnswer: 1 },
    ]
  },
  {
    id: 'philosophy',
    name: 'Philosophy',
    icon: 'BookOpen',
    description: 'Deep questions about existence, knowledge, and ethics.',
    difficulty: 'Hard',
    questions: [
      { id: 'ph1', text: 'Who said "I think, therefore I am"?', options: ['Socrates', 'Plato', 'René Descartes', 'Aristotle'], correctAnswer: 2 },
      { id: 'ph2', text: 'Which philosopher is known as the "Father of Western Philosophy"?', options: ['Socrates', 'Thales', 'Augustine', 'Kant'], correctAnswer: 1 },
      { id: 'ph3', text: 'What is the main branch of philosophy that studies beauty?', options: ['Ethics', 'Logics', 'Meta-physics', 'Aesthetics'], correctAnswer: 3 },
      { id: 'ph4', text: 'Who wrote "The Republic"?', options: ['Aristotle', 'Plato', 'Epicurus', 'Zeno'], correctAnswer: 1 },
      { id: 'ph5', text: 'The concept of "The Cave" allegory belongs to which philosopher?', options: ['Nietzsche', 'Hume', 'Plato', 'Locke'], correctAnswer: 2 },
    ]
  }
];
