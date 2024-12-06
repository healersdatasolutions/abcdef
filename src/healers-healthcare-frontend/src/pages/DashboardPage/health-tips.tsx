import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

const healthTips = [
  { disease: "Common Cold", tips: ["Rest and stay hydrated", "Use over-the-counter pain relievers", "Gargle with salt water"] },
  { disease: "Flu", tips: ["Get plenty of rest", "Stay home to avoid spreading", "Take antiviral medications if prescribed"] },
  { disease: "Allergies", tips: ["Identify and avoid triggers", "Use air purifiers", "Take antihistamines as recommended"] },
  { disease: "Hypertension", tips: ["Reduce salt intake", "Exercise regularly", "Manage stress"] },
  { disease: "Diabetes", tips: ["Monitor blood sugar levels", "Follow a balanced diet", "Take medications as prescribed"] },
  { disease: "Asthma", tips: ["Identify and avoid triggers", "Use inhalers as prescribed", "Create an asthma action plan"] },
  { disease: "Migraine", tips: ["Identify and avoid triggers", "Practice relaxation techniques", "Take preventive medications if recommended"] },
  { disease: "Arthritis", tips: ["Exercise regularly", "Apply hot or cold packs", "Maintain a healthy weight"] },
]

export function HealthTips() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const filteredTips = healthTips.filter(tip => 
    tip.disease.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <Input
        type="search"
        placeholder="Search diseases..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTips.map((tip, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:bg-accent">
                <CardHeader>
                  <CardTitle>{tip.disease}</CardTitle>
                </CardHeader>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{tip.disease} - Quick Tips</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[300px] w-full">
                <ul className="list-disc pl-6">
                  {tip.tips.map((item, idx) => (
                    <li key={idx} className="mb-2">{item}</li>
                  ))}
                </ul>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  )
}

