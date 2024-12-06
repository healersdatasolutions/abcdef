import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { ArrowUp, ArrowDown, MessageSquare } from 'lucide-react'

const forumThreads = [
  {
    id: 1,
    title: "Managing Diabetes: Tips and Tricks",
    latestComment: "I've found that keeping a food diary really helps...",
    upvotes: 15,
    downvotes: 2,
    comments: [
      { user: "DiabetesFighter", content: "I've found that keeping a food diary really helps me manage my blood sugar levels. Anyone else tried this?" },
      { user: "HealthyLiving101", content: "I combine that with regular exercise and it's made a huge difference." },
    ]
  },
  {
    id: 2,
    title: "Coping with Chronic Pain",
    latestComment: "Meditation has been a game-changer for me...",
    upvotes: 20,
    downvotes: 3,
    comments: [
      { user: "PainWarrior", content: "Meditation has been a game-changer for me in managing chronic pain. It helps me relax and reduces stress." },
      { user: "ActiveLife", content: "I combine meditation with gentle yoga. The two together have significantly improved my quality of life." },
    ]
  },
  {
    id: 3,
    title: "Healthy Eating on a Budget",
    latestComment: "Meal prepping has saved me so much money...",
    upvotes: 18,
    downvotes: 1,
    comments: [
      { user: "FrugalFoodie", content: "Meal prepping has saved me so much money and helps me stick to a healthy diet. Any favorite recipes?" },
      { user: "NutritionNerd", content: "I love making big batches of vegetable soup. It's cheap, nutritious, and freezes well!" },
    ]
  },
  {
    id: 4,
    title: "Overcoming Insomnia",
    latestComment: "Creating a bedtime routine has helped me immensely...",
    upvotes: 25,
    downvotes: 2,
    comments: [
      { user: "SleepSeeker", content: "Creating a bedtime routine has helped me immensely. I start winding down an hour before bed with some light reading." },
      { user: "NightOwl", content: "I've found that limiting screen time before bed and using a white noise machine has improved my sleep quality." },
    ]
  },
]

export function HealthCommunity() {
  const [threads, setThreads] = React.useState(forumThreads)

  const handleVote = (threadId: number, isUpvote: boolean) => {
    setThreads(prevThreads => 
      prevThreads.map(thread => 
        thread.id === threadId
          ? { 
              ...thread, 
              upvotes: isUpvote ? thread.upvotes + 1 : thread.upvotes,
              downvotes: !isUpvote ? thread.downvotes + 1 : thread.downvotes
            }
          : thread
      )
    )
  }

  return (
    <div className="space-y-6">
      {threads.map((thread) => (
        <Card key={thread.id}>
          <CardHeader>
            <CardTitle>{thread.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{thread.latestComment}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleVote(thread.id, true)}>
                  <ArrowUp className="mr-1 h-4 w-4" />
                  {thread.upvotes}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleVote(thread.id, false)}>
                  <ArrowDown className="mr-1 h-4 w-4" />
                  {thread.downvotes}
                </Button>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    View Discussion
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{thread.title}</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[300px] w-full">
                    {thread.comments.map((comment, index) => (
                      <div key={index} className="mb-4">
                        <p className="font-semibold">{comment.user}</p>
                        <p>{comment.content}</p>
                      </div>
                    ))}
                  </ScrollArea>
                  <div className="mt-4">
                    <Input placeholder="Add your comment..." />
                    <Button className="mt-2">Send</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

