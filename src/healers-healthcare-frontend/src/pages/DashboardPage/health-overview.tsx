import * as React from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const bmiData = [
  { name: 'Underweight', value: 10 },
  { name: 'Normal', value: 50 },
  { name: 'Overweight', value: 30 },
  { name: 'Obese', value: 10 },
]

const bloodPressureData = [
  { date: '2023-01', systolic: 120, diastolic: 80 },
  { date: '2023-02', systolic: 118, diastolic: 78 },
  { date: '2023-03', systolic: 122, diastolic: 82 },
  { date: '2023-04', systolic: 116, diastolic: 76 },
  { date: '2023-05', systolic: 120, diastolic: 80 },
]

const glucoseData = [
  { date: '2023-01', level: 95 },
  { date: '2023-02', level: 100 },
  { date: '2023-03', level: 92 },
  { date: '2023-04', level: 98 },
  { date: '2023-05', level: 96 },
]

interface HealthOverviewProps {
  height: number;
  weight: number;
}

export function HealthOverview({ height, weight }: HealthOverviewProps) {
  const bmi = weight / ((height / 100) * (height / 100))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>BMI Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bmiData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {bmiData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-center">Your BMI: {bmi.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Blood Pressure History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bloodPressureData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="systolic" stroke="#8884d8" />
                <Line type="monotone" dataKey="diastolic" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Glucose Level History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={glucoseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="level" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wearable Device Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Connect your wearable device to sync your health data:</p>
          <div className="flex space-x-4">
            <Button>Connect Fitbit</Button>
            <Button>Connect Apple Watch</Button>
            <Button>Connect Google Fit</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
