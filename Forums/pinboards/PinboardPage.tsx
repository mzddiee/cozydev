'use client';

import React, { useState } from 'react';
// import { Button } from "./ui/button";
const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className={
      "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 " +
      (props.className || "")
    }
  >
    {props.children}
  </button>
);
import Link from 'next/link';

// Post type definition removed for JavaScript compatibility

type Post = {
  id: number;
  title: string;
  content: string;
  likes: number;
  comments: string[];
};

export default function PinboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  const handlePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;
  const newEntry = {
    title: newPost.title,
    content: newPost.content,
    likes: 0,
    comments: [],
    id: Date.now(),
  };
    setPosts([newEntry, ...posts]);
    setNewPost({ title: '', content: '' });
  };

  const addLike = (id: number) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  const addComment = (id: number, comment: string) => {
    setPosts(posts.map(p =>
      p.id === id ? { ...p, comments: [...p.comments, comment] } : p
    ));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">📌 Community Pinboard</h1>

      {/* New Post Form */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 space-y-3 border border-gray-200">
        <input
          type="text"
          placeholder="Project title"
          className="w-full p-2 border rounded"
          value={newPost.title}
          onChange={e => setNewPost({ ...newPost, title: e.target.value })}
        />
        <textarea
          placeholder="What’s this about?"
          className="w-full p-2 border rounded"
          value={newPost.content}
          onChange={e => setNewPost({ ...newPost, content: e.target.value })}
        />
        <Button onClick={handlePost}>Post</Button>
      </div>

      {/* Post Feed */}
      {posts.length === 0 && (
        <p className="text-center text-gray-500">No posts yet. Be the first to share something!</p>
      )}
      {posts.map(post => (
        <div key={post.id} className="bg-white p-4 rounded-xl shadow mb-4 border border-gray-100">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="text-gray-700 mt-1">{post.content}</p>

          <div className="mt-3 flex items-center gap-4">
            <button
              onClick={() => addLike(post.id)}
              className="text-sm text-blue-600 hover:underline"
            >
              ❤️ {post.likes} {post.likes === 1 ? 'like' : 'likes'}
            </button>
          </div>

          {/* Comments */}
          <div className="mt-3">
            <p className="font-medium">Comments:</p>
            {post.comments.length === 0 ? (
              <p className="text-sm text-gray-500">No comments yet.</p>
            ) : (
              <ul className="space-y-1 text-sm mt-1">
                {post.comments.map((c, i) => (
                  <li key={i} className="bg-gray-100 rounded p-2">{c}</li>
                ))}
              </ul>
            )}

            <form
              onSubmit={e => {
                e.preventDefault();
                const inputEl = e.currentTarget.elements.namedItem('comment');
                const input = inputEl instanceof HTMLInputElement ? inputEl : null;
                const value = input?.value.trim() || '';
                if (value) {
                  addComment(post.id, value);
                  if (input) input.value = '';
                }
              }}
              className="mt-2 flex flex-col sm:flex-row gap-2"
            >
              <input
                name="comment"
                placeholder="Write a comment..."
                className="w-full p-2 border rounded"
              />
              <div className="flex gap-2">
                <Button>
                  <Link href="/auth/login">Sign in</Link>
                </Button>
                <Button>
                  <Link href="/auth/sign-up">Sign up</Link>
                </Button>
              </div>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}