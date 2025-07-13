"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Heart, Users, Target, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface Question {
  id: string
  question: string
  options: string[]
}

interface QuestionnaireFormProps {
  onComplete?: () => void
}

interface Section {
  id: string
  title: string
  icon: React.ReactNode
  questions: Question[]
}

const sections: Section[] = [
  {
    id: "basic-info",
    title: "Basic Information",
    icon: <Users className="w-5 h-5" />,
    questions: [
      {
        id: "age",
        question: "What's your age range?",
        options: ["18-25", "26-30", "31-35", "36-40", "41+"],
      },
      {
        id: "location",
        question: "Where are you located?",
        options: ["Urban city", "Suburban area", "Small town", "Rural area", "Prefer not to say"],
      },
      {
        id: "education",
        question: "What's your highest level of education?",
        options: ["High school", "Some college", "Bachelor's degree", "Master's degree", "PhD or higher"],
      },
      {
        id: "occupation",
        question: "What best describes your work situation?",
        options: ["Full-time employed", "Part-time employed", "Self-employed", "Student", "Between jobs"],
      },
      {
        id: "relationship-status",
        question: "What's your current relationship status?",
        options: ["Single", "Divorced", "Widowed", "It's complicated", "Never been in a relationship"],
      },
    ],
  },
  {
    id: "lifestyle",
    title: "Lifestyle Preferences",
    icon: <Sparkles className="w-5 h-5" />,
    questions: [
      {
        id: "exercise",
        question: "How often do you exercise?",
        options: ["Daily", "3-4 times a week", "1-2 times a week", "Occasionally", "Rarely or never"],
      },
      {
        id: "social-life",
        question: "How would you describe your social life?",
        options: [
          "Very active - always out",
          "Moderately social",
          "Selective with events",
          "Prefer small gatherings",
          "Mostly stay home",
        ],
      },
      {
        id: "hobbies",
        question: "What type of activities do you enjoy most?",
        options: [
          "Outdoor adventures",
          "Creative pursuits",
          "Sports and fitness",
          "Reading and learning",
          "Gaming and tech",
        ],
      },
      {
        id: "travel",
        question: "How important is travel to you?",
        options: [
          "Essential - I travel frequently",
          "Important - few times a year",
          "Moderate - occasionally",
          "Not very important",
          "I prefer staying local",
        ],
      },
      {
        id: "work-life",
        question: "How do you balance work and personal life?",
        options: [
          "Work comes first",
          "Balanced approach",
          "Personal life priority",
          "Flexible depending on situation",
          "Still figuring it out",
        ],
      },
    ],
  },
  {
    id: "values",
    title: "Personal Values",
    icon: <Heart className="w-5 h-5" />,
    questions: [
      {
        id: "family",
        question: "How important is family to you?",
        options: [
          "Extremely important",
          "Very important",
          "Moderately important",
          "Somewhat important",
          "Not very important",
        ],
      },
      {
        id: "career",
        question: "How ambitious are you about your career?",
        options: [
          "Highly ambitious",
          "Moderately ambitious",
          "Balanced approach",
          "Career is just a job",
          "Still exploring options",
        ],
      },
      {
        id: "finances",
        question: "What's your approach to money?",
        options: [
          "Save and invest",
          "Spend on experiences",
          "Live paycheck to paycheck",
          "Balanced saver/spender",
          "Money isn't everything",
        ],
      },
      {
        id: "growth",
        question: "How important is personal development?",
        options: [
          "Constantly working on myself",
          "Regular self-improvement",
          "Occasional focus",
          "When needed",
          "I'm happy as I am",
        ],
      },
      {
        id: "communication",
        question: "How do you prefer to communicate?",
        options: [
          "Direct and honest",
          "Gentle and considerate",
          "Depends on the situation",
          "Through actions more than words",
          "I'm still learning",
        ],
      },
    ],
  },
  {
    id: "compatibility",
    title: "Relationship Compatibility",
    icon: <Target className="w-5 h-5" />,
    questions: [
      {
        id: "relationship-goals",
        question: "What are you looking for in a relationship?",
        options: [
          "Long-term commitment",
          "Marriage and family",
          "Casual dating",
          "Companionship",
          "Still figuring it out",
        ],
      },
      {
        id: "conflict-resolution",
        question: "How do you handle disagreements?",
        options: [
          "Talk it out immediately",
          "Take time to cool down first",
          "Avoid conflict when possible",
          "Seek compromise",
          "Depends on the issue",
        ],
      },
      {
        id: "future-plans",
        question: "How do you approach future planning?",
        options: [
          "Detailed long-term plans",
          "General direction with flexibility",
          "Short-term focus",
          "Go with the flow",
          "Plans change too much to plan",
        ],
      },
      {
        id: "deal-breakers",
        question: "What's most important in a partner?",
        options: [
          "Emotional intelligence",
          "Shared values",
          "Physical attraction",
          "Sense of humor",
          "Ambition and drive",
        ],
      },
      {
        id: "love-language",
        question: "How do you prefer to show and receive love?",
        options: [
          "Quality time together",
          "Physical touch and affection",
          "Words of affirmation",
          "Acts of service",
          "Thoughtful gifts",
        ],
      },
    ],
  },
]

const motivationalMessages = [
  "Great start! You're doing amazing! 🌟",
  "Keep going! Your perfect match is getting closer! 💫",
  "Fantastic progress! You're halfway there! 🎉",
  "Almost done! Your answers are painting a beautiful picture! 🎨",
  "Final stretch! You're about to complete something amazing! 🚀",
]

export default function QuestionnaireForm({ onComplete }: QuestionnaireFormProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isCompleted, setIsCompleted] = useState(false)

  const totalQuestions = sections.reduce((acc, section) => acc + section.questions.length, 0)
  const answeredQuestions = Object.keys(answers).length
  const progress = (answeredQuestions / totalQuestions) * 100
  const questionsLeft = totalQuestions - answeredQuestions

  const currentSectionData = sections[currentSection]
  const currentQuestionData = currentSectionData.questions[currentQuestion]

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionData.id]: value,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < currentSectionData.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else if (currentSection < sections.length - 1) {
      setCurrentSection((prev) => prev + 1)
      setCurrentQuestion(0)
    } else {
      setIsCompleted(true)
      if (onComplete) {
        onComplete()
      }
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

  const canGoNext = answers[currentQuestionData.id] !== undefined
  const canGoPrevious = currentSection > 0 || currentQuestion > 0

  const getMotivationalMessage = () => {
    const progressIndex = Math.min(Math.floor(progress / 20), motivationalMessages.length - 1)
    return motivationalMessages[progressIndex]
  }

  if (isCompleted) {
    return (
      <div className="p-8">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Heart className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-4">Questionnaire Complete! 🎉</h2>
          <p className="text-muted-foreground mb-6">
            You've completed all 20 questions! Your compatibility profile has been updated.
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="p-6">
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
            <CardContent>
              <RadioGroup
                value={answers[currentQuestionData.id] || ""}
                onValueChange={handleAnswer}
                className="space-y-3"
              >
                {currentQuestionData.options.map((option, index) => (
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
            </CardContent>
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
          <span>
            {currentSection === sections.length - 1 && currentQuestion === currentSectionData.questions.length - 1
              ? "Complete"
              : "Next"}
          </span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  )
}
