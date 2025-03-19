"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ISystemRequirement } from "@/libs/models/systemRequirement"
// Interface based on the provided data structure

// Interface for activity items
interface ActivityItem {
  id: string
  projectId: string
  projectName: string
  activityType: "created" | "updated" | "completed"
  date: string
}

// Helper function to format date to "time ago"
const timeAgo = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  let interval = seconds / 31536000 // seconds in a year

  if (interval > 1) {
    return `Hace ${Math.floor(interval)} años`
  }
  interval = seconds / 2592000 // seconds in a month
  if (interval > 1) {
    return `Hace ${Math.floor(interval)} meses`
  }
  interval = seconds / 86400 // seconds in a day
  if (interval > 1) {
    return `Hace ${Math.floor(interval)} días`
  }
  interval = seconds / 3600 // seconds in an hour
  if (interval > 1) {
    return `Hace ${Math.floor(interval)} horas`
  }
  interval = seconds / 60 // seconds in a minute
  if (interval > 1) {
    return `Hace ${Math.floor(interval)} minutos`
  }
  return `Hace ${Math.floor(seconds)} segundos`
}

// Helper function to get icon and style based on activity type
const getActivityDetails = (activityType: "created" | "updated" | "completed") => {
  switch (activityType) {
    case "created":
      return {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        ),
        bgColor: "bg-info",
        textColor: "text-info",
        action: "Proyecto creado",
      }
    case "updated":
      return {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        ),
        bgColor: "bg-warning",
        textColor: "text-warning",
        action: "Proyecto actualizado",
      }
    case "completed":
      return {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        ),
        bgColor: "bg-success",
        textColor: "text-success",
        action: "Proyecto completado",
      }
  }
}

// Function to generate activity items from requirements
const generateActivityItems = (requirements: ISystemRequirement[]): ActivityItem[] => {
  const activities: ActivityItem[] = []

  requirements.forEach((req) => {
    // Add creation activity
    activities.push({
      id: `${req._id}-created`,
      projectId: req._id || '',
      projectName: req.name || '',
      activityType: "created",
      date: new Date(req.created || '').toISOString(),
    })

    // Add update activity if updated date is different from created date
    const createdDate = new Date(req.created || '').getTime()
    const updatedDate = new Date(req.updated || '').getTime()

    if (updatedDate > createdDate) {
      activities.push({
        id: `${req._id}-updated`,
        projectId: req._id || '',
        projectName: req.name || '',
        activityType: "updated",
        date: new Date(req.updated || '').toISOString(),
      })
    }

    // Add completion activity if status is completed
    if (req.status === "completed") {
      activities.push({
        id: `${req._id}-completed`,
        projectId: req._id || '',
        projectName: req.name || '',
        activityType: "completed",
        date: new Date(req.updated || '').toISOString(), // Assuming completion date is the updated date
      })
    }
  })

  return activities
}

export default function RecentActivityCard() {
  const [requirements, setRequirements] = useState<ISystemRequirement[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRequirements()
  }, [])

  const fetchRequirements = async () => {
    try {
      setLoading(true)
      const response = await fetch("api/requirements")
      const data = await response.json()
      setRequirements(data)
      setLoading(false)
    } catch (error) {
      console.error("Hubo un error al recuperar los datos de los requerimientos.", error)
      setError("No se pudieron cargar los datos. Intente nuevamente más tarde.")
      setLoading(false)
    }
  }

  // Generate and sort activities by date (most recent first)
  const activities = generateActivityItems(requirements).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  // Take only the most recent 3 activities
  const recentActivities = activities.slice(0, 3)

  return (
    <div className="card text-base-content bg-base-100 shadow-md h-full">
      <div className="card-body">
        <h2 className="card-title text-xl mb-4">Actividad Reciente</h2>

        {loading ? (
          <div className="flex justify-center py-4">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : error ? (
          <div className="alert alert-error text-sm">{error}</div>
        ) : recentActivities.length === 0 ? (
          <p className="text-sm text-center py-4">No hay actividad reciente</p>
        ) : (
          <ul className="space-y-3">
            {recentActivities.map((activity) => {
              const { icon, bgColor, textColor, action } = getActivityDetails(activity.activityType)
              return (
                <li key={activity.id} className="flex items-start">
                  <div className={`${bgColor} bg-opacity-20 ${textColor} p-2 rounded-full mr-3`}>{icon}</div>
                  <div>
                    <p className="text-sm font-semibold">{action}</p>
                    <p className="text-xs text-base-content/70">{activity.projectName}</p>
                    <p className="text-xs text-base-content/50">{timeAgo(activity.date)}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        <div className="card-actions justify-end mt-4 hidden">
          <Link href="/dashboard/activity" className="btn btn-sm btn-ghost">
            Ver todo →
          </Link>
        </div>
      </div>
    </div>
  )
}

