import { getPostBySlug } from '@/lib/posts'
import { notFound } from 'next/navigation'

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    notFound()
  }

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <time className="text-gray-600">{post.date}</time>
        </header>
        
        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap">{post.content}</div>
        </div>
      </article>
    </main>
  )
}
