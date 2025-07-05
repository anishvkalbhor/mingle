"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Heart, Target, Sparkles, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

interface Question {
  id: string
  question: string
  type: "multiselect" | "range" | "single" | "preference-cards"
  options?: string[]
  min?: number
  max?: number
  step?: number
  defaultValue?: number | number[]
  cards?: Array<{
    id: string
    title: string
    description: string
    icon: string
  }>
}

interface QuestionnaireStepProps {
  data: any
  onUpdate: (data: any) => void
}

interface Section {
  id: string
  title: string
  icon: React.ReactNode
  questions: Question[]
}

const sections: Section[] = [
  {
    id: "basic-preferences",
    title: "Basic Partner Preferences",
    icon: <Users className="w-5 h-5" />,
    questions: [
      {
        id: "age-range",
        question: "What age range would you prefer in a partner?",
        type: "range",
        min: 18,
        max: 60,
        step: 1,
        defaultValue: [25, 35],
      },
      {
        id: "distance-range",
        question: "How far are you willing to travel to meet someone?",
        type: "range",
        min: 1,
        max: 100,
        step: 1,
        defaultValue: [25],
      },
      {
        id: "relationship-type",
        question: "What type of relationship is your partner seeking?",
        type: "multiselect",
        options: [
          "Serious long-term relationship",
          "Marriage and family",
          "Casual dating",
          "Friendship first",
          "Open to exploring",
        ],
      },
      {
        id: "education-level",
        question: "What education level do you prefer in a partner?",
        type: "single",
        options: [
          "High school or equivalent",
          "Bachelor's degree",
          "Master's degree",
          "PhD or professional degree",
          "Trade school or certification",
          "Education level doesn't matter",
        ],
      },
    ],
  },
  {
    id: "lifestyle-preferences",
    title: "Lifestyle & Habits",
    icon: <Sparkles className="w-5 h-5" />,
    questions: [
      {
        id: "fitness-lifestyle",
        question: "How active would you like your partner to be?",
        type: "preference-cards",
        cards: [
          {
            id: "very-active",
            title: "Very Active",
            description: "Daily workouts, loves sports and fitness",
            icon: "🏃‍♂️",
          },
          {
            id: "moderately-active",
            title: "Moderately Active",
            description: "Regular exercise, enjoys outdoor activities",
            icon: "🚴‍♀️",
          },
          {
            id: "occasionally-active",
            title: "Occasionally Active",
            description: "Some exercise, prefers lighter activities",
            icon: "🚶‍♂️",
          },
          {
            id: "not-important",
            title: "Activity Level Not Important",
            description: "Fitness level doesn't matter to me",
            icon: "🤷‍♂️",
          },
        ],
      },
      {
        id: "social-lifestyle",
        question: "What kind of social life do you prefer in a partner?",
        type: "preference-cards",
        cards: [
          {
            id: "very-social",
            title: "Very Social",
            description: "Loves parties, big groups, always out",
            icon: "🎉",
          },
          {
            id: "moderately-social",
            title: "Balanced Social Life",
            description: "Enjoys social events but also quiet time",
            icon: "👥",
          },
          {
            id: "selective-social",
            title: "Selective Social",
            description: "Prefers small groups, close friends",
            icon: "👫",
          },
          {
            id: "homebody",
            title: "Homebody",
            description: "Prefers staying in, quiet evenings",
            icon: "🏠",
          },
        ],
      },
      {
        id: "drinking-habits",
        question: "What are your preferences regarding your partner's drinking habits?",
        type: "single",
        options: [
          "Social drinker is fine",
          "Occasional drinker is fine",
          "Regular drinker is fine",
          "Prefer non-drinker",
          "Drinking habits don't matter",
        ],
      },
      {
        id: "smoking-habits",
        question: "What are your preferences regarding smoking?",
        type: "single",
        options: [
          "Non-smoker only",
          "Occasional smoker is okay",
          "Social smoker is okay",
          "Smoking habits don't matter",
        ],
      },
      {
        id: "career-ambition",
        question: "How important is career ambition in your ideal partner?",
        type: "single",
        options: [
          "Very important - must be career-focused",
          "Somewhat important - balanced approach",
          "Not very important - other qualities matter more",
          "Career ambition doesn't matter",
        ],
      },
    ],
  },
  {
    id: "values-compatibility",
    title: "Values & Life Goals",
    icon: <Heart className="w-5 h-5" />,
    questions: [
      {
        id: "family-importance",
        question: "How important should family be to your partner?",
        type: "single",
        options: [
          "Extremely important - family comes first",
          "Very important - close family ties",
          "Moderately important - balanced approach",
          "Not very important - independence is key",
        ],
      },
      {
        id: "future-children",
        question: "What are your preferences about having children with your partner?",
        type: "single",
        options: [
          "Definitely want children together",
          "Open to having children",
          "Don't want children",
          "Partner already has children is fine",
          "Undecided about children",
        ],
      },
      {
        id: "religion-spirituality",
        question: "How important is religious or spiritual compatibility?",
        type: "single",
        options: [
          "Very important - must share similar beliefs",
          "Somewhat important - similar values preferred",
          "Not important - respect for differences is enough",
          "Prefer non-religious partner",
        ],
      },
      {
        id: "financial-compatibility",
        question: "What financial approach do you prefer in a partner?",
        type: "single",
        options: [
          "Good with money and saves regularly",
          "Balanced spender and saver",
          "Enjoys spending on experiences",
          "Financial habits don't matter much",
        ],
      },
    ],
  },
  {
    id: "personality-compatibility",
    title: "Personality & Communication",
    icon: <Target className="w-5 h-5" />,
    questions: [
      {
        id: "communication-style",
        question: "What communication style do you prefer in a partner?",
        type: "preference-cards",
        cards: [
          {
            id: "direct-honest",
            title: "Direct & Honest",
            description: "Says what they mean, straightforward",
            icon: "💬",
          },
          {
            id: "gentle-diplomatic",
            title: "Gentle & Diplomatic",
            description: "Thoughtful and considerate in communication",
            icon: "🤝",
          },
          {
            id: "humorous-light",
            title: "Humorous & Light",
            description: "Uses humor, keeps things fun",
            icon: "😄",
          },
          {
            id: "deep-meaningful",
            title: "Deep & Meaningful",
            description: "Enjoys profound conversations",
            icon: "🧠",
          },
        ],
      },
      {
        id: "conflict-resolution",
        question: "How should your ideal partner handle disagreements?",
        type: "preference-cards",
        cards: [
          {
            id: "talk-immediately",
            title: "Talk It Out",
            description: "Address issues immediately and directly",
            icon: "💬",
          },
          {
            id: "cool-down-first",
            title: "Cool Down First",
            description: "Take time to process, then discuss calmly",
            icon: "⏰",
          },
          {
            id: "seek-compromise",
            title: "Seek Compromise",
            description: "Focus on finding middle ground together",
            icon: "🤝",
          },
          {
            id: "avoid-conflict",
            title: "Keep Peace",
            description: "Prefer to avoid conflict when possible",
            icon: "☮️",
          },
        ],
      },
      {
        id: "emotional-expression",
        question: "How emotionally expressive should your partner be?",
        type: "single",
        options: [
          "Very expressive - shares feelings openly",
          "Moderately expressive - balanced emotional sharing",
          "Reserved but caring - shows love through actions",
          "Emotional expression style doesn't matter",
        ],
      },
      {
        id: "sense-of-humor",
        question: "How important is a good sense of humor in your partner?",
        type: "single",
        options: [
          "Extremely important - must make me laugh",
          "Very important - humor makes everything better",
          "Somewhat important - nice to have",
          "Not very important - other qualities matter more",
        ],
      },
      {
        id: "personal-growth",
        question: "How important is personal development and growth in your partner?",
        type: "single",
        options: [
          "Very important - constantly working on self-improvement",
          "Moderately important - open to growth when needed",
          "Not very important - happy with who they are",
          "Personal growth approach doesn't matter",
        ],
      },
    ],
  },
]

const motivationalMessages = [
  "Great choices! Your ideal partner is taking shape! 💫",
  "Excellent preferences! We're learning what makes you happy! ✨",
  "Perfect! Your compatibility profile is looking amazing! 🌟",
  "Almost there! Your dream partner preferences are nearly complete! 💖",
  "Final touches! You're about to unlock amazing matches! 🚀",
]

export default function QuestionnaireStep({ data, onUpdate }: QuestionnaireStepProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const totalQuestions = sections.reduce((acc, section) => acc + section.questions.length, 0)
  const answeredQuestions = Object.keys(data.partnerPreferences || {}).length
  const progress = (answeredQuestions / totalQuestions) * 100
  const questionsLeft = totalQuestions - answeredQuestions

  const currentSectionData = sections[currentSection]
  const currentQuestionData = currentSectionData.questions[currentQuestion]

  const handleAnswer = (value: any) => {
    const updatedPreferences = {
      ...data.partnerPreferences,
      [currentQuestionData.id]: value,
    }
    onUpdate({ partnerPreferences: updatedPreferences })
  }

  const handleMultiAnswer = (option: string) => {
    const currentAnswers = data.partnerPreferences?.[currentQuestionData.id] || []
    const current = Array.isArray(currentAnswers) ? currentAnswers : []
    const newAnswers = current.includes(option) ? current.filter((o) => o !== option) : [...current, option]
    handleAnswer(newAnswers)
  }

  const getCurrentAnswer = () => {
    return data.partnerPreferences?.[currentQuestionData.id]
  }

  const handleNext = () => {
    if (currentQuestion < currentSectionData.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else if (currentSection < sections.length - 1) {
      setCurrentSection((prev) => prev + 1)
      setCurrentQuestion(0)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    } else if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1)
      setCurrentQuestion(sections[currentSection - 1].questions.length - 1)
    }
  }

  const currentAnswer = getCurrentAnswer()
  const canGoNext = currentAnswer !== undefined && currentAnswer !== null && currentAnswer !== ""
  const canGoPrevious = currentSection > 0 || currentQuestion > 0

  const getMotivationalMessage = () => {
    const progressIndex = Math.min(Math.floor(progress / 20), motivationalMessages.length - 1)
    return motivationalMessages[progressIndex]
  }

  const isLastQuestion =
    currentSection === sections.length - 1 && currentQuestion === currentSectionData.questions.length - 1

  const renderQuestion = () => {
    switch (currentQuestionData.type) {
      case "range":
        return (
          <div className="space-y-6">
            <div className="px-4">
              <Slider
                value={
                  Array.isArray(currentAnswer)
                    ? currentAnswer
                    : [
                        Array.isArray(currentQuestionData.defaultValue)
                          ? currentQuestionData.defaultValue[0]
                          : currentQuestionData.defaultValue ?? 25
                      ]
                }
                onValueChange={handleAnswer}
                min={currentQuestionData.min}
                max={currentQuestionData.max}
                step={currentQuestionData.step}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>{currentQuestionData.min}</span>
                <span className="font-medium text-pink-600">
                  {Array.isArray(currentAnswer) && currentAnswer.length === 2
                    ? `${currentAnswer[0]} - ${currentAnswer[1]}`
                    : Array.isArray(currentAnswer)
                      ? `${currentAnswer[0]}`
                      : currentQuestionData.defaultValue}
                  {currentQuestionData.id === "distance-range"
                    ? " km"
                    : currentQuestionData.id === "age-range"
                      ? " years"
                      : ""}
                </span>
                <span>{currentQuestionData.max}</span>
              </div>
            </div>
          </div>
        )

      case "multiselect":
        return (
          <div className="space-y-3">
            {currentQuestionData.options?.map((option, index) => (
              <motion.div
                key={option}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => handleMultiAnswer(option)}
              >
                <Checkbox
                  checked={Array.isArray(currentAnswer) && currentAnswer.includes(option)}
                  onCheckedChange={() => handleMultiAnswer(option)}
                  id={option}
                />
                <Label htmlFor={option} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </motion.div>
            ))}
          </div>
        )

      case "single":
        return (
          <RadioGroup
            value={typeof currentAnswer === "string" ? currentAnswer : ""}
            onValueChange={handleAnswer}
            className="space-y-3"
          >
            {currentQuestionData.options?.map((option, index) => (
              <motion.div
                key={option}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => handleAnswer(option)}
              >
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </motion.div>
            ))}
          </RadioGroup>
        )

      case "preference-cards":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestionData.cards?.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  currentAnswer === card.id
                    ? "border-pink-500 bg-gradient-to-br from-pink-50 to-purple-50 shadow-lg"
                    : "border-gray-200 hover:border-pink-300 hover:shadow-md"
                }`}
                onClick={() => handleAnswer(card.id)}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{card.icon}</div>
                  <h3 className="font-semibold text-gray-800 mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-600">{card.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-800">
          <Users className="w-5 h-5 mr-2 text-pink-500" />
          Partner Preferences <span className="text-pink-500">*</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Tell us about your ideal partner preferences. This helps us find the best matches for you!
        </p>
      </CardHeader>
      <CardContent className="p-6">
        {/* Progress Section */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{questionsLeft} questions left!</span>
          </div>
          <Progress value={progress} className="h-2 mb-4" />

          {progress > 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <p className="text-sm font-medium text-purple-600">{getMotivationalMessage()}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Section Indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border">
            {currentSectionData.icon}
            <span className="font-medium">{currentSectionData.title}</span>
            <span className="text-sm text-muted-foreground">
              ({currentQuestion + 1}/{currentSectionData.questions.length})
            </span>
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentSection}-${currentQuestion}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl">{currentQuestionData.question}</CardTitle>
              </CardHeader>
              <CardContent>{renderQuestion()}</CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            className="flex items-center space-x-2 bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <div className="flex space-x-2">
            {sections.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSection ? "bg-purple-500" : index < currentSection ? "bg-purple-300" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          <Button onClick={handleNext} disabled={!canGoNext} className="flex items-center space-x-2">
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Completion Status */}
        {answeredQuestions === totalQuestions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center"
          >
            <Heart className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-green-700 font-medium">Perfect! You've completed all partner preference questions! 🌟</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
