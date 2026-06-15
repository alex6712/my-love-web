import { useState } from 'react';
import { Gamepad2, Brain, Puzzle, Heart, Trophy, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface Game {
  id: string;
  title: string;
  description: string;
  icon: typeof Gamepad2;
  color: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function GamesSection() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [score, setScore] = useState(0);

  const games: Game[] = [
    {
      id: 'quiz',
      title: 'Викторина для пары',
      description: 'Проверьте, как хорошо вы знаете друг друга',
      icon: Brain,
      color: 'from-purple-400 to-pink-400',
      difficulty: 'easy',
    },
    {
      id: 'puzzle',
      title: 'Парные головоломки',
      description: 'Решайте головоломки вместе',
      icon: Puzzle,
      color: 'from-blue-400 to-cyan-400',
      difficulty: 'medium',
    },
    {
      id: 'associations',
      title: 'Игра в ассоциации',
      description: 'Создавайте новые воспоминания вместе',
      icon: Heart,
      color: 'from-red-400 to-pink-400',
      difficulty: 'easy',
    },
  ];

  const quizQuestions = [
    {
      question: 'Какой любимый цвет у твоего партнера?',
      options: ['Синий', 'Розовый', 'Зеленый', 'Фиолетовый'],
      correct: 0,
    },
    {
      question: 'Где вы впервые встретились?',
      options: ['Кафе', 'Университет', 'Онлайн', 'Через друзей'],
      correct: 2,
    },
    {
      question: 'Какое любимое блюдо вашего партнера?',
      options: ['Паста', 'Суши', 'Пицца', 'Стейк'],
      correct: 1,
    },
  ];

  const handlePlayGame = (game: Game) => {
    setSelectedGame(game);
    setQuizStep(0);
    setScore(0);
  };

  const handleQuizAnswer = (answerIndex: number) => {
    if (answerIndex === quizQuestions[quizStep].correct) {
      setScore(score + 1);
    }

    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Quiz complete
      setTimeout(() => {
        setQuizStep(-1); // Results screen
      }, 500);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Легко';
      case 'medium':
        return 'Средне';
      case 'hard':
        return 'Сложно';
      default:
        return difficulty;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl mb-1">Мини-игры 🎮</h1>
        <p className="text-gray-600 dark:text-gray-400">Веселые игры для укрепления отношений</p>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <Card key={game.id} className="hover:shadow-lg transition-shadow group">
              <CardHeader>
                <div
                  className={`w-full h-32 rounded-lg bg-gradient-to-br ${game.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-16 h-16 text-white" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle>{game.title}</CardTitle>
                  <Badge className={getDifficultyColor(game.difficulty)}>
                    {getDifficultyLabel(game.difficulty)}
                  </Badge>
                </div>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-red-500 hover:bg-red-600"
                  onClick={() => handlePlayGame(game)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Играть
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Game Dialog */}
      <Dialog open={!!selectedGame} onOpenChange={() => setSelectedGame(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedGame?.title}</DialogTitle>
            <DialogDescription>{selectedGame?.description}</DialogDescription>
          </DialogHeader>

          {selectedGame?.id === 'quiz' && (
            <div className="space-y-6">
              {quizStep >= 0 && quizStep < quizQuestions.length ? (
                <>
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>
                        Вопрос {quizStep + 1} из {quizQuestions.length}
                      </span>
                      <span>Счет: {score}</span>
                    </div>
                    <Progress value={((quizStep + 1) / quizQuestions.length) * 100} />
                  </div>

                  {/* Question */}
                  <div>
                    <h3 className="text-lg mb-4">{quizQuestions[quizStep].question}</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {quizQuestions[quizStep].options.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="justify-start h-auto py-3 text-left hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-950/30 dark:hover:border-red-700"
                          onClick={() => handleQuizAnswer(index)}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              ) : quizStep === -1 ? (
                /* Results */
                <div className="text-center py-8">
                  <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-2xl mb-2">Викторина завершена!</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Ваш результат: {score} из {quizQuestions.length}
                  </p>
                  <div className="mb-6">
                    {score === quizQuestions.length ? (
                      <p className="text-lg text-green-600 dark:text-green-400">
                        🎉 Идеально! Вы отлично знаете друг друга!
                      </p>
                    ) : score >= quizQuestions.length / 2 ? (
                      <p className="text-lg text-blue-600 dark:text-blue-400">
                        👏 Хороший результат! Продолжайте узнавать друг друга
                      </p>
                    ) : (
                      <p className="text-lg text-orange-600 dark:text-orange-400">
                        💡 Есть над чем поработать! Проводите больше времени вместе
                      </p>
                    )}
                  </div>
                  <Button
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() => {
                      setQuizStep(0);
                      setScore(0);
                    }}
                  >
                    Играть снова
                  </Button>
                </div>
              ) : null}
            </div>
          )}

          {selectedGame?.id === 'puzzle' && (
            <div className="text-center py-8">
              <Puzzle className="w-16 h-16 text-gray-400 dark:text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Эта игра находится в разработке 🎯</p>
            </div>
          )}

          {selectedGame?.id === 'associations' && (
            <div className="text-center py-8">
              <Heart className="w-16 h-16 text-gray-400 dark:text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Эта игра находится в разработке 🎯</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
