// Dashboard Page
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { InfoIcon } from "lucide-react";

export default function ProtectedPage() {
  const [user, setUser] = useState<any | null>(null)
  const [projects, setProjects] = useState<any[] | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login') // Redirects to login if not signed in
        return
      }

      setUser(user) // Saves user if they log in

      const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_on', { ascending: false })

      if (projectError) {
        console.error('Error fetching projects:', projectError)
      } else {
        setProjects(projectData)
      }
    }

    fetchUser()
  }, [])


  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
      </div>
      {/* User Details */}
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      {/* Project List */}
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your Projects</h2>
        {!projects ?(
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p>No projects to show yet! Create one!</p>
        ) : (
          <ul className="space-y-3">
            {projects.map((project) => (
              <li key={project.id} className="bg-muted p-4 rounded-md">
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="text-sm text-muted-foreground">{project.description}</p>
                <p className="text-xs italic">Status: {project.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
