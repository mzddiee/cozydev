// Projects Page
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { InfoIcon } from "lucide-react";

export default function ProtectedPage() {
  const [user, setUser] = useState<any | null>(null)
  const [newProject, setNewProject] = useState({
  title: '',
  description: '',
  status: 'idea',})
  const [showForm, setShowForm] = useState(false)

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

  const handleCreateProject = async () => {
    if (!user) return
    const { data, error } = await supabase.from('projects').insert([
        {
            title: newProject.title,
            description: newProject.description,
            status: newProject.status,
            user_id: user.id,
        },
    ])

    if (error) {
        console.error('Failed to create:', error)
    } else {
        setNewProject({ title: '', description: '', status: 'idea' })

        const { data: updated } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        setProjects(updated)
    }
  }


return (
  <div>
    {/* Toggle Button */}
    <button
      className="mb-4 px-4 py-2 bg-muted text-white rounded font-semibold"
      onClick={() => setShowForm(!showForm)}
    >
      {showForm ? 'Cancel' : 'New Project'}
    </button>

    {/* Add Project Form (conditionally rendered) */}
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

    {/* Project List */}
    <div className="flex flex-col gap-2 items-start mt-8">
      <h2 className="font-bold text-2xl mb-4">Your Projects</h2>
      {!projects ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p>No projects to show yet! Create one!</p>
      ) : (
        <ul className="space-y-3">
          {projects.map((project) => (
            <li key={project.id} className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
              <p className="text-xs italic">Status: {project.status}</p>

              <button
                onClick={async () => {
                  const { error } = await supabase
                    .from('projects')
                    .delete()
                    .eq('id', project.id);

                  if (error) {
                    console.error(error);
                  } else {
                    const { data: updated } = await supabase
                      .from('projects')
                      .select('*')
                      .eq('user_id', user.id);
                    setProjects(updated);
                  }
                }}
                className="text-sm text-red-500 mt-2"
              >
                Delete
              </button>

              <button
                onClick={async () => {
                  const newTitle = prompt(
                    'New project title:',
                    project.title
                  );
                  if (!newTitle) return;

                  const { error } = await supabase
                    .from('projects')
                    .update({ title: newTitle })
                    .eq('id', project.id);

                  if (error) {
                    console.error(error);
                  } else {
                    const { data: updated } = await supabase
                      .from('projects')
                      .select('*')
                      .eq('user_id', user.id);
                    setProjects(updated);
                  }
                }}
                className="text-sm text-blue-500 ml-4"
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
)}
