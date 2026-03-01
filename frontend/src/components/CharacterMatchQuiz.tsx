import { useState } from 'react';
import { Button } from './ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { animeSiteConfig } from '../content/animeSiteConfig';

type QuizAnswer = {
  text: string;
  traits: string[];
};

type QuizQuestion = {
  question: string;
  answers: QuizAnswer[];
};

const quizQuestions: QuizQuestion[] = [
  {
    question: 'What drives you most in life?',
    answers: [
      { text: 'Protecting those I care about', traits: ['protective', 'loyal', 'moon'] },
      { text: 'Proving my strength and power', traits: ['ambitious', 'fire', 'sun'] },
      { text: 'Seeking knowledge and wisdom', traits: ['wise', 'calm', 'moon'] },
      { text: 'Supporting and helping others', traits: ['kind', 'supportive', 'earth'] }
    ]
  },
  {
    question: 'How do you handle challenges?',
    answers: [
      { text: 'Face them head-on with determination', traits: ['energetic', 'fire', 'sun'] },
      { text: 'Think carefully before acting', traits: ['wise', 'calm', 'moon'] },
      { text: 'Endure quietly and persist', traits: ['quiet', 'enduring', 'moon'] },
      { text: 'Work together with others', traits: ['supportive', 'kind', 'earth'] }
    ]
  },
  {
    question: 'What describes your personality best?',
    answers: [
      { text: 'Quiet and introspective', traits: ['quiet', 'lonely', 'moon'] },
      { text: 'Energetic and outgoing', traits: ['energetic', 'fire'] },
      { text: 'Kind and compassionate', traits: ['kind', 'supportive', 'earth'] },
      { text: 'Ruthless and powerful', traits: ['ruthless', 'sun'] }
    ]
  },
  {
    question: 'What role do you take in a group?',
    answers: [
      { text: 'The quiet one who observes', traits: ['quiet', 'moon'] },
      { text: 'The energetic leader', traits: ['energetic', 'fire'] },
      { text: 'The supportive friend', traits: ['kind', 'supportive', 'earth'] },
      { text: 'The wise mentor', traits: ['wise', 'calm', 'moon'] }
    ]
  },
  {
    question: 'What element resonates with you?',
    answers: [
      { text: 'Moon - Mystery and hidden power', traits: ['moon', 'quiet'] },
      { text: 'Fire - Passion and energy', traits: ['fire', 'energetic'] },
      { text: 'Earth - Stability and support', traits: ['earth', 'supportive'] },
      { text: 'Sun - Power and dominance', traits: ['sun', 'ruthless'] }
    ]
  },
  {
    question: 'What is your greatest strength?',
    answers: [
      { text: 'My ability to endure hardship', traits: ['enduring', 'moon'] },
      { text: 'My determination and willpower', traits: ['energetic', 'fire'] },
      { text: 'My kindness and empathy', traits: ['kind', 'earth'] },
      { text: 'My wisdom and knowledge', traits: ['wise', 'moon'] }
    ]
  },
  {
    question: 'How do you view your destiny?',
    answers: [
      { text: 'I carry a hidden potential I must discover', traits: ['moon', 'quiet'] },
      { text: 'I will become the strongest through effort', traits: ['fire', 'energetic'] },
      { text: 'I will support others on their journey', traits: ['earth', 'supportive'] },
      { text: 'I am destined for ultimate power', traits: ['sun', 'ruthless'] }
    ]
  }
];

type CharacterMatch = {
  character: typeof animeSiteConfig.characters[0];
  score: number;
  percentage: number;
};

interface CharacterMatchQuizProps {
  onComplete: (match: CharacterMatch) => void;
}

export function CharacterMatchQuiz({ onComplete }: CharacterMatchQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[][]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = quizQuestions[currentQuestion].answers[selectedAnswer].traits;
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Calculate match
      calculateMatch(newAnswers);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
    }
  };

  const calculateMatch = (userAnswers: string[][]) => {
    const allTraits = userAnswers.flat();
    
    // Define character trait profiles
    const characterProfiles: Record<string, string[]> = {
      'Kazeyori Shiranagi': ['quiet', 'lonely', 'enduring', 'moon', 'protective'],
      'Sankei Enshiro': ['energetic', 'fire', 'ambitious', 'loyal'],
      'Haruna Hishigawa': ['kind', 'supportive', 'earth', 'loyal'],
      'Iwagami Sekien': ['wise', 'calm', 'moon', 'protective'],
      'Aurelian': ['ruthless', 'sun', 'ambitious', 'powerful'],
      'Suma': ['ruthless', 'sun', 'ambitious', 'fire']
    };

    const scores = animeSiteConfig.characters.map(character => {
      const profile = characterProfiles[character.name] || [];
      const matchCount = allTraits.filter(trait => profile.includes(trait)).length;
      return {
        character,
        score: matchCount,
        percentage: Math.round((matchCount / allTraits.length) * 100)
      };
    });

    // Find the best match
    const bestMatch = scores.reduce((best, current) => 
      current.score > best.score ? current : best
    );

    onComplete(bestMatch);
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-foreground/70 mb-2">
          <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-card border-2 border-foreground/20 rounded-lg p-8 mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-6">
          {quizQuestions[currentQuestion].question}
        </h3>

        <div className="space-y-3">
          {quizQuestions[currentQuestion].answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedAnswer === index
                  ? 'border-accent bg-accent/10 shadow-md'
                  : 'border-foreground/20 hover:border-accent/50 hover:bg-accent/5'
              }`}
            >
              <span className="text-foreground font-medium">{answer.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          onClick={handleBack}
          disabled={currentQuestion === 0}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ChevronLeft size={20} />
          Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className="flex items-center gap-2"
        >
          {currentQuestion === quizQuestions.length - 1 ? 'See Results' : 'Next'}
          <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
}
