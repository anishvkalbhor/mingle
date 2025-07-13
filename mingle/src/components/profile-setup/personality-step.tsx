"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Sparkles, Plus, X } from "lucide-react"

interface PersonalityStepProps {
  data: any
  onUpdate: (data: any) => void
}

export default function PersonalityStep({ data, onUpdate }: PersonalityStepProps) {
  const availablePrompts = [
    "My most irrational fear is…",
    "I'm known for…",
    "Dating me is like…",
    "The one thing I won't shut up about…",
    "Let's make a plan to…",
    "My perfect Sunday involves…",
    "I'm weirdly attracted to…",
    "My biggest flex is…",
    "I'm looking for someone who…",
    "My love language is…",
    "I geek out about…",
    "My guilty pleasure is…",
  ]

  const selectedPrompts = data.personalityPrompts || []

  const addPrompt = (prompt: string) => {
    if (selectedPrompts.length < 3 && !selectedPrompts.find((p: any) => p.prompt === prompt)) {
      const updated = [...selectedPrompts, { prompt, answer: "" }]
      onUpdate({ personalityPrompts: updated })
    }
  }

  const removePrompt = (index: number) => {
    const updated = selectedPrompts.filter((_: any, i: number) => i !== index)
    onUpdate({ personalityPrompts: updated })
  }

  const updateAnswer = (index: number, answer: string) => {
    const updated = selectedPrompts.map((prompt: any, i: number) => (i === index ? { ...prompt, answer } : prompt))
    onUpdate({ personalityPrompts: updated })
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800">
            <Sparkles className="w-5 h-5 mr-2 text-pink-500" />
            Personality Prompts
          </CardTitle>
          <p className="text-sm text-gray-600">
            Choose 2-3 prompts to showcase your personality. These help start conversations!
          </p>
          <p className="text-xs text-gray-500">Selected: {selectedPrompts.length}/3 prompts</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selected Prompts */}
          {selectedPrompts.map((promptData: any, index: number) => (
            <div key={index} className="space-y-3 p-4 border border-pink-200 rounded-lg bg-pink-50/50">
              <div className="flex items-center justify-between">
                <Label className="text-gray-700 font-medium text-sm">{promptData.prompt}</Label>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removePrompt(index)}
                  className="text-gray-400 hover:text-red-500 p-1 h-auto"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <Textarea
                placeholder="Your answer here..."
                value={promptData.answer}
                onChange={(e) => updateAnswer(index, e.target.value)}
                className="min-h-[80px] border-gray-200 focus:border-pink-400 focus:ring-pink-400 resize-none bg-white"
                maxLength={200}
              />
              <p className="text-xs text-gray-500 text-right">{promptData.answer.length}/200 characters</p>
            </div>
          ))}

          {/* Available Prompts */}
          {selectedPrompts.length < 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Choose a Prompt</h3>
              <div className="grid gap-3">
                {availablePrompts
                  .filter((prompt) => !selectedPrompts.find((p: any) => p.prompt === prompt))
                  .map((prompt) => (
                    <div
                      key={prompt}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-pink-300 hover:bg-pink-50/30 transition-all cursor-pointer"
                      onClick={() => addPrompt(prompt)}
                    >
                      <span className="text-gray-700 font-medium">{prompt}</span>
                      <Button size="sm" variant="ghost" className="text-pink-500 hover:text-pink-600 p-1 h-auto">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {selectedPrompts.length === 3 && (
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-medium">
                Great! You've selected all 3 prompts. Your personality is shining through! ✨
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
