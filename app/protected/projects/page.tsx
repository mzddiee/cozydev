'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// Define types
type Project = {
  id: number
  title: string
  description: string
  status: string
  user_id: string
}

type NewProject = Omit<Project, 'id' | 'user_id'>

export default function ProtectedPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [newProject, setNewProject] = useState<NewProject>({
    title: '',
    description: '',
    status: 'idea',
  })
  const [projects, setProjects] = useState<Project[] | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchUserAndProjects = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user

      if (!user) {
        router.push('/auth/login')
        return
      }

      setUserId(user.id)

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

    fetchUserAndProjects()
  }, [router, supabase])

  const refreshProjects = async () => {
    if (!userId) return

    const { data: updated } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
    setProjects(updated)
  }

  const handleCreateProject = async () => {
    if (!userId) return

    const { error } = await supabase.from('projects').insert([{
      ...newProject,
      user_id: userId,
    }])

    if (error) {
      console.error('Failed to create:', error)
    } else {
      setNewProject({ title: '', description: '', status: 'idea' })
      refreshProjects()
    }
  }

  const handleUpdateProject = async () => {
    if (!editingProject) return

    const { error } = await supabase
      .from('projects')
      .update({
        title: editingProject.title,
        description: editingProject.description,
        status: editingProject.status,
      })
      .eq('id', editingProject.id)

    if (error) {
      console.error('Error updating project:', error)
    } else {
      setEditingProject(null)
      refreshProjects()
    }
  }

  return (
    <div>
      <button
        className="mb-4 px-4 py-2 bg-muted text-white rounded font-semibold"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancel' : 'New Project'}
      </button>

      {showForm && (
        <div className="mt-4 w-full max-w-xl border rounded p-4">
          <h3 className="font-bold text-xl mb-3">Add New Project</h3>
          <input
            className="w-full p-2 mb-2 border rounded"
            placeholder="Title"
            value={newProject.title}
            onChange={(e) =>
              setNewProject({ ...newProject, title: e.target.value })
            }
          />
          <textarea
            className="w-full p-2 mb-2 border rounded"
            placeholder="Description"
            value={newProject.description}
            onChange={(e) =>
              setNewProject({ ...newProject, description: e.target.value })
            }
          />
          <select
            className="w-full p-2 mb-4 border rounded"
            value={newProject.status}
            onChange={(e) =>
              setNewProject({ ...newProject, status: e.target.value })
            }
          >
            <option value="idea">Idea</option>
            <option value="in-progress">In Progress</option>
            <option value="complete">Complete</option>
          </select>
          <button
            onClick={handleCreateProject}
            className="px-4 py-2 bg-muted text-white font-semibold rounded"
          >
            Create Project
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2 items-start mt-8">
        <h2 className="font-bold text-2xl mb-4">Your Projects</h2>
        {!projects ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p>No projects to show yet! Create one!</p>
        ) : (
          <ul className="space-y-3 w-full">
            {projects.map((project) => (
              <li key={project.id} className="bg-muted p-4 rounded-md">
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="text-sm text-muted-foreground">{project.description}</p>
                <p className="text-xs italic">Status: {project.status}</p>

                {confirmingDeleteId === project.id ? (
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={async () => {
                        const { error } = await supabase
                          .from('projects')
                          .delete()
                          .eq('id', project.id)

                        if (error) {
                          console.error(error)
                        } else {
                          refreshProjects()
                          setConfirmingDeleteId(null)
                        }
                      }}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded"
                    >
                      Confirm Delete
                    </button>
                    <button
                      onClick={() => setConfirmingDeleteId(null)}
                      className="px-3 py-1 text-sm bg-gray-400 text-white rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmingDeleteId(project.id)}
                    className="text-sm text-red-500 mt-2"
                  >
                    Delete
                  </button>
                )}

                <button
                  onClick={() => setEditingProject(project)}
                  className="text-sm text-blue-500 ml-4"
                >
                  Edit
                </button>

                {editingProject?.id === project.id && (
                  <div className="mt-3 p-3 border rounded bg-background space-y-2">
                    <input
                      className="w-full p-2 border rounded"
                      value={editingProject.title}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, title: e.target.value })
                      }
                    />
                    <textarea
                      className="w-full p-2 border rounded"
                      value={editingProject.description}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, description: e.target.value })
                      }
                    />
                    <select
                      className="w-full p-2 border rounded"
                      value={editingProject.status}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, status: e.target.value })
                      }
                    >
                      <option value="idea">Idea</option>
                      <option value="in-progress">In Progress</option>
                      <option value="complete">Complete</option>
                    </select>
                    <div className="flex gap-3">
                      <button
                        onClick={handleUpdateProject}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingProject(null)}
                        className="px-3 py-1 bg-gray-400 text-white rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
