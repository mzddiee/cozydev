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

type Commit = {
  sha: string
  message: string
  url: string
  date: string
  author: string
}

export default function ProjectDetailPage() {
  const { projectId } = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [commits, setCommits] = useState<Commit[]>([])

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

    const loadCommits = async () => {
    const repo = prompt('Enter GitHub repo (owner/repo)')
    if (!repo) return
    try {
      const res = await fetch(
        `https://api.github.com/repos/${repo}/commits?per_page=5`
      )
      if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
      const data = await res.json()
      setCommits(
        data.map((c: any) => ({
          sha: c.sha,
          message: c.commit.message,
          url: c.html_url,
          date: c.commit.author.date,
          author: c.commit.author.name,
        }))
      )
    } catch (err: any) {
      console.error(err)
      alert('Failed to load commits: ' + err.message)
    }
  }

  // Delete the entire project
  const deleteProject = async () => {
    if (!confirm('Are you sure you want to delete this project?')) return
    await supabase.from('projects').delete().eq('id', projectId)
    router.push('/protected/projects')
  }

    const statusColor: Record<string,string> = {
      idea:         'bg-[#7632bf]',
      'in-progress': 'bg-[#d25d23]',
      complete:     'bg-[#219b2d]',
    }

  if (!project) return <p className="font-pixel p-6">Loading project…</p>

  return (
    <main className="font-pixel p-6 space-y-8 -mt-32">
      {/*Back Button*/}
      <button
        onClick={() => router.back()}
        className="text-sm text-white] hover:underline"
        >
        </button>
      <h1 className="text-6xl">{project.title}</h1>
      <p className="text-muted bg-[#6ab4da] rounded-lg p-2">{project.description}</p>
      <span
      className={`inline-block text-xs italic px-2 py-1 rounded
        ${statusColor[project.status] ?? 'bg-gray-500'}
  `}
>
  {project.status.replace('-', ' ')}
</span>

{/* Settings Panel */}
<section className="font-pixel p-4 rounded space-x-4">
  {editingProject?.id === project.id ? (
    <>
      {/* Save */}
      <button
        onClick={saveProjectEdits}
        className="
          py-2 px-4 
          bg-[url('/icons/save-bg.png')] bg-cover bg-center bg-no-repeat 
          text-white font-pixel rounded-lg
        "
      >
        Save
      </button>

      {/* Cancel */}
      <button
        onClick={() => setEditingProject(null)}
        className="
          py-2 px-4 
          bg-[url('/icons/cancel-bg.png')] bg-cover bg-center bg-no-repeat 
          text-white font-pixel rounded-lg
        "
      >
        Cancel
      </button>
    </>
  ) : (
    <>
      {/* Edit Project */}
      <button
        onClick={() => {
          setEditingProject(project)
          setEditedProject({
            title: project.title,
            description: project.description,
            status: project.status,
          })
        }}
        className="
          py-8 px-8 
          bg-[url('/images/buttonstyle4.png')] bg-cover bg-center bg-no-repeat 
          text-black font-bold font-pixel rounded-lg
        "
      >
        Edit Project
      </button>

      {/* Delete Project */}
      <button
        onClick={deleteProject}
        className="
          py-8 px-6 
          bg-[url('/images/buttonstyle3.png')] bg-cover bg-center bg-no-repeat 
          text-black font-bold font-pixel rounded-lg
        "
      >
        Delete Project
      </button>
    </>
  )}
</section>



{/* Task Manager */}
<section
  className="
    relative
    rounded-lg
    bg-[url('/images/blankback.png')] w-[571px] h-[310px]
    bg-cover bg-no-repeat bg-center
  "
>
  <div className="relative p-4 space-y-2">
    <h2 className="text-2xl font-semibold">Tasks</h2>
    <div className="flex gap-1 mb-2">
      <input
        className="border p-1 text-sm rounded flex-1"
        placeholder="Task title"
        value={newTask.title}
        onChange={e => setNewTask({ ...newTask, title: e.target.value })}
      />
      <input
        type="date"
        className="border p-1 text-sm rounded w-24"
        value={newTask.due_date}
        onChange={e => setNewTask({ ...newTask, due_date: e.target.value })}
      />
      <select
        className="border p-1 text-sm rounded w-24"
        value={newTask.status}
        onChange={e => setNewTask({ ...newTask, status: e.target.value })}
      >
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <button
        className="bg-green-600 text-white px-2 py-1 text-sm rounded"
        onClick={addTask}
      >
        Add
      </button>
    </div>

    <ul className="space-y-2">
      {tasks.map(t => (
        <li key={t.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={t.status === 'done'}
            onChange={async () => {
              const newStatus = t.status === 'done' ? 'todo' : 'done'
              await supabase
                .from('tasks')
                .update({ status: newStatus })
                .eq('id', t.id)
              setTasks(tasks.map(x =>
                x.id === t.id ? { ...x, status: newStatus } : x
              ))
            }}
          />
          <span
            className={`flex-1 font-pixel ${
              t.status === 'done'
                ? 'line-through text-gray-500'
                : 'text-black'
            }`}
          >
            {t.title} (due {t.due_date})
          </span>
        </li>
      ))}
    </ul>
  </div>
</section>

      {/* GitHub Commits */}
      <section className="space-y-2">
        <h2 className="text-2xl font-pixel">GitHub Activity</h2>
        <button
          className="bg-gray-800 text-white px-3 py-1 rounded font-pixel"
          onClick={loadCommits}
        >
          Load Commits
        </button>

        {commits.length > 0 && (
          <ul className="mt-4 space-y-2 font-pixel">
            {commits.map((c) => (
              <li key={c.sha}>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-500 text-base font-bold underline"
                >
                  {c.message}
                </a>
                <div className="text-black font-bold text-base">
                  by {c.author} on{' '}
                  {new Date(c.date).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

{/* Timeline & Sticky Notes Side‑by‑Side */}
<div className="flex flex-col md:flex-row gap-8">
  {/* --- Vertical Timeline (Left) --- */}
  <section className="flex-1 bg-sky-200/50 p-4 rounded-lg">
    <h2 className="text-2xl text-[#1a2242] font-semibold mb-4">Timeline</h2>
    <div className="relative border-l-2 border-[#1a2242] pl-6 space-y-6">
      {tasks.map(t => (
        <div key={t.id} className="relative">
          {/* dot */}
          <div className="absolute -left-4 top-1.5 w-3 h-3 bg-purple-500 p-1 rounded-full"></div>
          <p className="font-semibold text-[#1a2242]">{t.title}</p>
          <p className="text-sm text-[#1a2242]">Due: {t.due_date}</p>
        </div>
      ))}
    </div>
  </section>

  {/* --- Sticky Notes (Right) --- */}
  <section
    className="
      w-full md:w-80
      relative 
      bg-[url('/images/blankback.png')] bg-cover bg-center 
      rounded-lg overflow-hidden 
      p-4
      space-y-4
      font-pixel
    "
  >
    <h2 className="text-2xl">Notes</h2>
    {/* Add Note */}
    <div className="flex gap-2">
      <textarea
        className="flex-1 border p-2 rounded bg-white/80"
        placeholder="Write a note..."
        value={newNote}
        onChange={e => setNewNote(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-3 py-1 rounded"
        onClick={addNote}
      >
        Add Note
      </button>
    </div>
    {/* Note List */}
    <ul className="space-y-2">
      {notes.map(n => (
        <li
          key={n.id}
          className="relative border p-2 rounded text-black bg-purple-100"
        >
          <button
            onClick={() => deleteNote(n.id)}
            className="absolute top-1 right-1 text-gray-600 hover:text-gray-900"
          >
            <X size={16} />
          </button>
          <div className="whitespace-pre-wrap">
            {n.content}
          </div>
        </li>
      ))}
    </ul>
  </section>
</div>

    </main>
  )
}
