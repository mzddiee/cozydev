// app/protected/projects/[projectId]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { X } from 'lucide-react'

type Project = {
  id: number
  title: string
  description: string
  status: string
  user_id: string
}

type Task = {
  id: number
  title: string
  due_date: string
  status: string
}

type Note = {
  id: number
  content: string
}

export default function ProjectDetailPage() {
  const { projectId } = useParams()
  const router = useRouter()
  const supabase = createClient()

  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [newTask, setNewTask] = useState({ title: '', due_date: '', status: 'todo' })
  const [newNote, setNewNote] = useState('')
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editedProject, setEditedProject] = useState({ title: '', description: '', status: 'idea' })

  // Fetch project, tasks, notes
  useEffect(() => {
    if (!projectId) return
    const fetchAll = async () => {
      // project info
      const { data: p } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()
      setProject(p || null)

      // tasks
      const { data: t } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('due_date', { ascending: true })
      setTasks(t || [])

      // notes
      const { data: n } = await supabase
        .from('notes')
        .select('*')
        .eq('project_id', projectId)
      setNotes(n || [])
    }
    fetchAll()
  }, [projectId, supabase])

  const refreshTasks = async () => {
    const { data: t } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('due_date', { ascending: true })
    setTasks(t || [])
  }

  const refreshNotes = async () => {
    const { data: n } = await supabase
      .from('notes')
      .select('*')
      .eq('project_id', projectId)
    setNotes(n || [])
  }

  const deleteNote = async (noteId: number) => {
  const { error } = await supabase.from('notes').delete().eq('id', noteId)
  if (error) console.error('Error deleting note:', error)
  else {
    refreshNotes()
    }
  }

  // Add a new task
  const addTask = async () => {
    if (!projectId) return
    await supabase.from('tasks').insert([{ ...newTask, project_id: projectId }])
    setNewTask({ title: '', due_date: '', status: 'todo' })
    refreshTasks()
  }

  // Add a new note
  const addNote = async () => {
    if (!projectId || !newNote) return
    await supabase.from('notes').insert([{ content: newNote, project_id: projectId }])
    setNewNote('')
    refreshNotes()
  }

  // Save project edits
  const saveProjectEdits = async () => {
    if (!editingProject) return
    await supabase
      .from('projects')
      .update({
        title: editedProject.title,
        description: editedProject.description,
        status: editedProject.status,
      })
      .eq('id', editingProject.id)
    setEditingProject(null)
    // refetch project
    const { data: p } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()
    setProject(p || null)
  }

  // Delete the entire project
  const deleteProject = async () => {
    if (!confirm('Are you sure you want to delete this project?')) return
    await supabase.from('projects').delete().eq('id', projectId)
    router.push('/protected/projects')
  }

  if (!project) return <p className="font-pixel p-6">Loading project…</p>

  return (
    <main className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">{project.title}</h1>
      <p className="text-muted-foreground">{project.description}</p>
      <span className="inline-block text-xs italic bg-accent px-2 py-1 rounded">
        {project.status}
      </span>

      {/* Settings Panel */}
      <section className="border p-4 rounded space-x-4">
        {editingProject?.id === project.id ? (
          <>
            <input
              className="p-2 border rounded"
              value={editedProject.title}
              onChange={e => setEditedProject({ ...editedProject, title: e.target.value })}
            />
            <textarea
              className="p-2 border rounded"
              value={editedProject.description}
              onChange={e => setEditedProject({ ...editedProject, description: e.target.value })}
            />
            <select
              className="p-2 border rounded"
              value={editedProject.status}
              onChange={e => setEditedProject({ ...editedProject, status: e.target.value })}
            >
              <option value="idea">Idea</option>
              <option value="in-progress">In Progress</option>
              <option value="complete">Complete</option>
            </select>
            <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={saveProjectEdits}>
              Save
            </button>
            <button className="px-3 py-1 bg-gray-400 text-white rounded" onClick={() => setEditingProject(null)}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => {
              setEditingProject(project)
              setEditedProject({
                title: project.title,
                description: project.description,
                status: project.status,
              })
            }}>
              Edit Project
            </button>
            <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={deleteProject}>
              Delete Project
            </button>
          </>
        )}
      </section>

      {/* Task Manager */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Tasks</h2>
        <div className="flex gap-2">
          <input
            className="border p-2 rounded flex-1"
            placeholder="Task title"
            value={newTask.title}
            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
          />
          <input
            type="date"
            className="border p-2 rounded"
            value={newTask.due_date}
            onChange={e => setNewTask({ ...newTask, due_date: e.target.value })}
          />
          <select
            className="border p-2 rounded"
            value={newTask.status}
            onChange={e => setNewTask({ ...newTask, status: e.target.value })}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={addTask}>
            Add
          </button>
        </div>
        <ul className="space-y-2">
          {tasks.map(t => (
            <li key={t.id} className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={t.status === 'done'}
                onChange={async () => {
                  const newStatus = t.status === 'done' ? 'todo' : 'done'
                  await supabase.from('tasks').update({ status: newStatus }).eq('id', t.id)
                  setTasks(tasks.map(x => x.id === t.id ? { ...x, status: newStatus } : x))
                }}
              />
              <span>{t.title} (due {t.due_date})</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Timeline */}
      <section>
        <h2 className="text-2xl font-semibold">Timeline</h2>
        <ul className="space-y-1">
          {tasks.map(t => (
            <li key={t.id} className="flex justify-between">
              <span>{t.title}</span>
              <span>{t.due_date}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* GitHub Commits */}
      <section>
        <h2 className="font-pixel text-2xl">GitHub Activity</h2>
        <button
          className="font-pixel bg-gray-800 text-white px-3 py-1 rounded"
          onClick={async () => {
            const repo = prompt('Enter GitHub repo (user/repo)')
            if (!repo) return
            const res = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=5`)
            const commits = await res.json()
            console.log('Recent commits:', commits)
          }}
        >
          Load Commits
        </button>
      </section>

      {/* Sticky Notes */}
      <section className="space-y-4">
        <h2 className="font-pixel text-2xl">Notes</h2>
        {/* Add Note */}
        <div className="flex gap-2">
          <textarea
            className="font-pixel border p-2 rounded flex-1"
            placeholder="Write a note..."
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
          />
          <button className="font-pixel bg-blue-600 text-white px-3 py-1 rounded" onClick={addNote}>
            Add Note
          </button>
        </div>

        {/* Note List */}
        <ul className="space-y-2">
          {notes.map(n => (
            <li key={n.id} className="relative border p-2 rounded text-black bg-purple-100">
              
              {/* Delete Button */}
              <button
              onClick={() => deleteNote(n.id)}
              className="absolute top-1 right-1 text-gray-600 hover:text-gray-900">
                <X size={16} />
                </button>

              {/* Note Content */}
              <div className = "whitespace-pre-wrap">
                {n.content}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
