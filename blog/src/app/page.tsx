import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export default function Home() {
  const posts = getAllPosts()

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">My Blog</h1>
        
      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.slug} className="border-b pb-6">
            <h2 className="text-2xl font-semibold mb-2">
              <Link href={`/posts/${post.slug}`} className="hover:text-blue-600">
                {post.title}
              </Link>
            </h2>
            <p className="text-gray-600 mb-2">{post.date}</p>
            <p className="text-gray-800">{post.content.substring(0, 150)}...</p>
          </article>
        ))}
      </div>
    </main>
  )
}
