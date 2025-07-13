"use client"

import type React from "react"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Heart, Target, Sparkles, Users, Landmark } from "lucide-react"
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
    id: "relationship-intentions",
    title: "Relationship Intentions",
    icon: <Heart className="w-5 h-5" />, 
    questions: [
      {
        id: "relationship-type",
        question: "What type of relationship are you looking for?",
        type: "preference-cards",
        cards: [
          {
            id: "Serious long-term relationship",
            title: "Serious Long-term",
            description: "Building a deep, committed relationship",
            icon: "💕"
          },
          {
            id: "Marriage and family",
            title: "Marriage & Family",
            description: "Ready for marriage and starting a family",
            icon: "👨‍👩‍👧‍👦"
          },
          {
            id: "Casual dating",
            title: "Casual Dating",
            description: "Keep things fun and light",
            icon: "😊"
          },
          {
            id: "Open to exploring anything",
            title: "Open to Anything",
            description: "Let's see where things go naturally",
            icon: "🌟"
          }
        ]
      },
      {
        id: "settle-down-time",
        question: "When do you ideally want to settle down (marriage/long-term)?",
        type: "single",
        options: [
          "Within 1 year",
          "In 1–3 years",
          "After 3 years",
          "Not sure / not planning",
        ],
      },
      {
        id: "children",
        question: "Do you want to have children in the future?",
        type: "single",
        options: [
          "Definitely yes",
          "Open to having children",
          "Don’t want children",
          "Undecided",
        ],
      },
      {
        id: "relocation",
        question: "Are you open to relocating for a relationship?",
        type: "single",
        options: [
          "Yes, I’m very open",
          "Maybe, depends on the situation",
          "Only within my country/city",
          "Not at all",
        ],
      },
      {
        id: "quality-time",
        question: "How much quality time do you expect from your partner?",
        type: "single",
        options: [
          "Daily time together",
          "A few days per week",
          "Once a week is fine",
          "I value personal time more",
        ],
      },
    ],
  },
  {
    id: "lifestyle-habits",
    title: "Lifestyle & Habits",
    icon: <Sparkles className="w-5 h-5" />, 
    questions: [
      {
        id: "activity-level",
        question: "How active should your partner's lifestyle be?",
        type: "preference-cards",
        cards: [
          {
            id: "Very active (daily workouts)",
            title: "Very Active",
            description: "Daily workouts and fitness focused",
            icon: "🏃‍♂️"
          },
          {
            id: "Moderately active (3–4 times/week)",
            title: "Moderately Active",
            description: "Regular exercise 3-4 times per week",
            icon: "🚴‍♀️"
          },
          {
            id: "Occasionally active (light activities)",
            title: "Occasionally Active",
            description: "Light activities and casual fitness",
            icon: "🚶‍♂️"
          },
          {
            id: "Mostly inactive",
            title: "Mostly Inactive",
            description: "Prefers relaxed lifestyle",
            icon: "🛋️"
          }
        ]
      },
      {
        id: "alcohol",
        question: "What drinking habits do you prefer in a partner?",
        type: "single",
        options: [
          "Never",
          "Occasionally (social events)",
          "Weekly",
          "Frequently",
        ],
      },
      {
        id: "smoking",
        question: "What smoking habits do you prefer in a partner?",
        type: "single",
        options: [
          "Prefer non-smoker",
          "Okay with occasional smoking",
          "Smoke regularly",
          "Smoking doesn't matter",
        ],
      },
      {
        id: "healthy-lifestyle",
        question: "How important is a healthy lifestyle in your routine?",
        type: "single",
        options: [
          "Very important",
          "Somewhat important",
          "Not very important",
          "Not important at all",
        ],
      },
      {
        id: "independence",
        question: "How important is personal space and independence in a relationship?",
        type: "single",
        options: [
          "Extremely important",
          "Important but balanced",
          "Not very important",
          "I prefer constant connection",
        ],
      },
    ],
  },
  {
    id: "personality-communication",
    title: "Personality & Communication",
    icon: <Target className="w-5 h-5" />, 
    questions: [
      {
        id: "conflict-style",
        question: "Which communication style do you prefer during conflict?",
        type: "preference-cards",
        cards: [
          {
            id: "Direct and open",
            title: "Direct & Open",
            description: "Honest and straightforward discussion",
            icon: "🗣️"
          },
          {
            id: "Calm and thoughtful",
            title: "Calm & Thoughtful",
            description: "Patient and considerate approach",
            icon: "🧘‍♀️"
          },
          {
            id: "Avoid conflict entirely",
            title: "Avoid Conflict",
            description: "Prefer harmony and peace",
            icon: "🕊️"
          },
          {
            id: "Need time before talking",
            title: "Need Time",
            description: "Process first, then discuss",
            icon: "⏰"
          }
        ]
      },
      {
        id: "emotional-expression",
        question: "How emotionally expressive do you want your partner to be?",
        type: "preference-cards",
        cards: [
          {
            id: "Very open with feelings",
            title: "Very Open",
            description: "Shares feelings openly and frequently",
            icon: "💝"
          },
          {
            id: "Balanced emotional sharing",
            title: "Balanced",
            description: "Healthy mix of sharing and privacy",
            icon: "⚖️"
          },
          {
            id: "Reserved but caring",
            title: "Reserved",
            description: "Shows care through actions",
            icon: "🤗"
          },
          {
            id: "Not expressive at all",
            title: "Not Expressive",
            description: "Prefers to keep emotions private",
            icon: "🤐"
          }
        ]
      },
      {
        id: "conversation-depth",
        question: "Do you prefer deep conversations or lighthearted interactions?",
        type: "single",
        options: [
          "Deep and meaningful conversations",
          "A healthy mix of both",
          "Mostly fun/light chats",
          "I don’t like long conversations",
        ],
      },
      {
        id: "humor-importance",
        question: "How important is humor in a partner?",
        type: "preference-cards",
        cards: [
          {
            id: "Extremely important – must be funny",
            title: "Must Be Funny",
            description: "Humor is essential for compatibility",
            icon: "😂"
          },
          {
            id: "Very important – keeps it fun",
            title: "Very Important",
            description: "Keeps the relationship light and fun",
            icon: "😄"
          },
          {
            id: "Somewhat important",
            title: "Somewhat Important",
            description: "Nice to have but not essential",
            icon: "🙂"
          },
          {
            id: "Not important",
            title: "Not Important",
            description: "Other qualities matter more",
            icon: "😐"
          }
        ]
      },
      {
        id: "ambition",
        question: "Do you want your partner to be ambitious in career/personal goals?",
        type: "single",
        options: [
          "Yes – very driven",
          "Somewhat motivated",
          "Doesn’t matter",
          "Prefer someone laid back",
        ],
      },
    ],
  },
  {
    id: "values-beliefs",
    title: "Values & Beliefs",
    icon: <Landmark className="w-5 h-5" />, 
    questions: [
      {
        id: "religion",
        question: "How important is religion or spirituality in your life?",
        type: "preference-cards",
        cards: [
          {
            id: "Very important – must share beliefs",
            title: "Very Important",
            description: "Must share similar beliefs",
            icon: "🙏"
          },
          {
            id: "Somewhat important",
            title: "Somewhat Important",
            description: "Prefer similar values",
            icon: "✨"
          },
          {
            id: "Not important, but open-minded",
            title: "Open-Minded",
            description: "Not important but respectful",
            icon: "🤝"
          },
          {
            id: "Prefer non-religious partner",
            title: "Prefer Non-Religious",
            description: "Secular lifestyle preferred",
            icon: "🌿"
          }
        ]
      },
      {
        id: "cultural-background",
        question: "Would you prefer a partner with similar cultural values/background?",
        type: "single",
        options: [
          "Must be culturally similar",
          "Preferably similar",
          "Doesn’t matter much",
          "I prefer diversity",
        ],
      },
      {
        id: "gender-roles",
        question: "Do you believe in traditional gender roles in a relationship?",
        type: "single",
        options: [
          "Strongly believe in them",
          "Prefer them to some extent",
          "Believe in equal roles",
          "Don’t care about gender roles",
        ],
      },
      {
        id: "politics",
        question: "How politically aligned should your partner be?",
        type: "single",
        options: [
          "Must match my views",
          "Prefer similar views",
          "Open to respectful differences",
          "Politics don’t matter at all",
        ],
      },
      {
        id: "finance-importance",
        question: "How important is financial stability in a partner?",
        type: "single",
        options: [
          "Very important",
          "Somewhat important",
          "Not very important",
          "Doesn't matter",
        ],
      },
    ],
  },
];


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
      <CardContent className="p-6">
        {/* Progress Section */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 ">
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
