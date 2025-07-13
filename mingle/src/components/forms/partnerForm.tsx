"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Users, Sparkles, Heart, Target } from "lucide-react"

interface PartnerPreferenceFormProps {
  onComplete?: () => void
}

const partnerPreferenceSections = [
  {
    id: "basic-expectations",
    title: "Basic Expectations",
    icon: <Users className="w-5 h-5" />,
    questions: [
      {
        id: "preferred-age",
        question: "What age range do you prefer in a partner?",
        options: ["18–25", "26–30", "31–35", "36–40", "41+"],
        multiple: false,
      },
      {
        id: "preferred-location",
        question: "Where should your partner ideally live?",
        options: ["Urban city", "Suburban", "Small town", "Rural", "No preference"],
        multiple: true,
      },
      {
        id: "preferred-education",
        question: "Minimum education level you expect in a partner?",
        options: ["High school", "Bachelor's", "Master's", "PhD", "No preference"],
        multiple: false,
      },
      {
        id: "preferred-occupation",
        question: "Preferred work status for your partner?",
        options: ["Full-time", "Self-employed", "Student", "Doesn't matter"],
        multiple: true,
      },
      {
        id: "relationship-history-comfort",
        question: "Are you okay with someone who's been in a past relationship?",
        options: ["Yes, absolutely", "Prefer someone single", "No preference"],
        multiple: false,
      },
    ],
  },
  {
    id: "lifestyle-preferences",
    title: "Lifestyle Preferences",
    icon: <Sparkles className="w-5 h-5" />,
    questions: [
      {
        id: "partner-exercise",
        question: "How active should your partner be?",
        options: ["Daily exercise", "A few times a week", "Not important"],
        multiple: false,
      },
      {
        id: "social-alignment",
        question: "What social lifestyle should your partner have?",
        options: ["Very outgoing", "Balanced", "Prefer introverts", "No preference"],
        multiple: false,
      },
      {
        id: "shared-hobbies",
        question: "What kind of hobbies should your partner enjoy?",
        options: [
          "Outdoor adventures",
          "Creative pursuits",
          "Fitness and sports",
          "Reading or learning",
          "Tech/Gaming",
        ],
        multiple: true,
      },
      {
        id: "travel-alignment",
        question: "How important is travel compatibility to you?",
        options: ["Very important – love travelers", "Somewhat important", "Not important"],
        multiple: false,
      },
      {
        id: "work-life-alignment",
        question: "Preferred work-life balance in a partner?",
        options: ["Career-driven", "Balanced approach", "Personal-life focused", "No preference"],
        multiple: false,
      },
    ],
  },
  {
    id: "value-alignment",
    title: "Core Values",
    icon: <Heart className="w-5 h-5" />,
    questions: [
      {
        id: "importance-of-family",
        question: "How important should family be to your partner?",
        options: ["Extremely", "Somewhat", "Not important"],
        multiple: false,
      },
      {
        id: "career-attitude",
        question: "What career mindset do you prefer in a partner?",
        options: ["Highly ambitious", "Balanced", "Stable but not focused", "No strong opinion"],
        multiple: false,
      },
      {
        id: "financial-habits",
        question: "Preferred financial attitude in a partner?",
        options: ["Saver/Investor", "Spends on experience", "Balanced", "No preference"],
        multiple: false,
      },
      {
        id: "growth-mindset",
        question: "Should your partner prioritize personal growth?",
        options: ["Always learning & growing", "Occasional self-improvement", "Growth isn't a priority"],
        multiple: false,
      },
      {
        id: "communication-style-expectation",
        question: "Ideal communication style in your partner?",
        options: ["Direct & expressive", "Gentle & patient", "Action-based", "Flexible/adaptive"],
        multiple: true,
      },
    ],
  },
  {
    id: "relationship-preferences",
    title: "Relationship Compatibility",
    icon: <Target className="w-5 h-5" />,
    questions: [
      {
        id: "relationship-goals-expectation",
        question: "What should your partner be seeking?",
        options: ["Marriage & family", "Long-term relationship", "Casual dating", "Open to exploring"],
        multiple: true,
      },
      {
        id: "conflict-handling-style",
        question: "How should your partner handle conflicts?",
        options: ["Discuss immediately", "Take time to reflect", "Avoid confrontation", "Seek compromise"],
        multiple: true,
      },
      {
        id: "future-planning-compatibility",
        question: "How aligned should your long-term goals be?",
        options: ["Very aligned — same life path", "Roughly compatible goals", "We'll figure it out"],
        multiple: false,
      },
      {
        id: "top-dealbreaker",
        question: "What's a dealbreaker for you in a partner?",
        options: ["Dishonesty", "Lack of emotional intelligence", "No ambition", "Different values", "No dealbreakers"],
        multiple: true,
      },
      {
        id: "preferred-love-language",
        question: "Which love language should your partner resonate with?",
        options: ["Words of affirmation", "Quality time", "Physical touch", "Acts of service", "Gifts"],
        multiple: true,
      },
    ],
  },
]

export default function PartnerPreferenceForm({ onComplete }: PartnerPreferenceFormProps) {
  const [sectionIndex, setSectionIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [completed, setCompleted] = useState(false)

  const currentSection = partnerPreferenceSections[sectionIndex]
  const currentQuestion = currentSection.questions[questionIndex]
  const totalQuestions = partnerPreferenceSections.reduce((a, s) => a + s.questions.length, 0)
  const progress = (Object.keys(answers).length / totalQuestions) * 100

  const handleSingleAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))
  }

  const handleMultiAnswer = (option: string) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[currentQuestion.id]) ? (prev[currentQuestion.id] as string[]) : []
      return {
        ...prev,
        [currentQuestion.id]: current.includes(option) ? current.filter((o) => o !== option) : [...current, option],
      }
    })
  }

  const canNext = currentQuestion.multiple
    ? Array.isArray(answers[currentQuestion.id]) && answers[currentQuestion.id].length > 0
    : typeof answers[currentQuestion.id] === "string"

  const next = () => {
    if (questionIndex < currentSection.questions.length - 1) {
      setQuestionIndex(questionIndex + 1)
    } else if (sectionIndex < partnerPreferenceSections.length - 1) {
      setSectionIndex(sectionIndex + 1)
      setQuestionIndex(0)
    } else {
      setCompleted(true)
      if (onComplete) {
        onComplete()
      }
    }
  }

  const back = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1)
    } else if (sectionIndex > 0) {
      const prevSection = partnerPreferenceSections[sectionIndex - 1]
      setSectionIndex(sectionIndex - 1)
      setQuestionIndex(prevSection.questions.length - 1)
    }
  }

  if (completed) {
    return (
      <div className="p-8 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Partner Preferences Saved! 🎉</h2>
          <p className="text-muted-foreground">Thank you for completing your partner preference form.</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <Progress value={progress} className="mb-6" />
      <div className="flex items-center gap-2 mb-6">
        {currentSection.icon}
        <span className="font-medium">{currentSection.title}</span>
        <span className="text-sm text-muted-foreground">
          ({questionIndex + 1}/{currentSection.questions.length})
        </span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent>
              {currentQuestion.multiple ? (
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <div
                      key={option}
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleMultiAnswer(option)}
                    >
                      <Checkbox
                        checked={
                          Array.isArray(answers[currentQuestion.id]) && answers[currentQuestion.id].includes(option)
                        }
                        onCheckedChange={() => handleMultiAnswer(option)}
                        id={option}
                      />
                      <Label htmlFor={option}>{option}</Label>
                    </div>
                  ))}
                </div>
              ) : (
                <RadioGroup
                  value={typeof answers[currentQuestion.id] === "string" ? (answers[currentQuestion.id] as string) : ""}
                  onValueChange={handleSingleAnswer}
                >
                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => (
                      <div
                        key={option}
                        className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      >
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option}>{option}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-between">
        <Button onClick={back} disabled={sectionIndex === 0 && questionIndex === 0} variant="outline">
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button onClick={next} disabled={!canNext}>
          {sectionIndex === partnerPreferenceSections.length - 1 &&
          questionIndex === currentSection.questions.length - 1
            ? "Finish"
            : "Next"}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
