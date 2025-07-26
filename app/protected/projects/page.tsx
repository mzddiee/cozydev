'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

// --- Types ---
type Project = {
  id: number
  title: string
  description: string
  status: string
  user_id: string
}

type NewProject = Omit<Project, 'id' | 'user_id'>

// --- Component ---
export default function ProjectsPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [newProject, setNewProject] = useState<NewProject>({
    title: '',
    description: '',
    status: 'idea',
  })
  const [projects, setProjects] = useState<Project[] | null>(null)
  const [showForm, setShowForm] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  // Fetch user & their projects
  useEffect(() => {
    const fetch = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUserId(user.id)

      const { data: projectData, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_on', { ascending: false })

      if (error) {
        console.error('Error fetching projects:', error)
      } else {
        setProjects(projectData)
      }
    }

    fetch()
  }, [router, supabase])

  // Refresh list helper
  const refreshProjects = async () => {
    if (!userId) return
    const { data: updated } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_on', { ascending: false })
    setProjects(updated)
  }

  // Create new project
  const handleCreateProject = async () => {
    if (!userId) return
    const { error } = await supabase.from('projects').insert([
      { ...newProject, user_id: userId },
    ])
    if (error) console.error('Failed to create:', error)
    else {
      setNewProject({ title: '', description: '', status: 'idea' })
      refreshProjects()
    }
  }

  return (
    <div className="p-6">
      {/* New Project Toggle */}
      <button
        className="mb-6 px-4 py-2 bg-muted text-white rounded"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancel' : '+ New Project'}
      </button>

      {/* New Project Form */}
      {showForm && (
        <div className="mb-8 p-4 border rounded max-w-xl">
          <h3 className="font-semibold mb-3">Create a New Project</h3>
          <input
            className="w-full p-2 mb-2 border rounded"
            placeholder="Title"
            value={newProject.title}
            onChange={e =>
              setNewProject({ ...newProject, title: e.target.value })
            }
          />
          <textarea
            className="w-full p-2 mb-2 border rounded"
            placeholder="Description"
            value={newProject.description}
            onChange={e =>
              setNewProject({ ...newProject, description: e.target.value })
            }
          />
          <select
            className="w-full p-2 mb-4 border rounded"
            value={newProject.status}
            onChange={e =>
              setNewProject({ ...newProject, status: e.target.value })
            }
          >
            <option value="idea">Idea</option>
            <option value="in-progress">In Progress</option>
            <option value="complete">Complete</option>
          </select>
          <button
            onClick={handleCreateProject}
            className="px-4 py-2 bg-secondary text-white rounded"
          >
            Create Project
          </button>
        </div>
      )}

      {/* Projects Grid */}
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects?.map(project => (
          <li key={project.id}>
            <Link
              href={`/protected/projects/${project.id}`}
              className="block p-6 bg-muted rounded-lg hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
              <p className="text-sm mb-4 line-clamp-3">{project.description}</p>
              <span className="inline-block text-xs italic bg-accent px-2 py-1 rounded">
                {project.status}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Loading / Empty states */}
      {!projects && <p className="mt-4">Loading projects…</p>}
      {projects && projects.length === 0 && (
        <p className="mt-4 italic">No projects yet. Create one!</p>
      )}
    </div>
  )
}
