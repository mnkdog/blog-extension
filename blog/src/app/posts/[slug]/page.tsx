import { getPostBySlug, markdownToHtml } from '@/lib/posts'
import { notFound } from 'next/navigation'

interface PostPageProps {
  params: { slug: string }
}

export default function PostPage({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    notFound()
  }

  // Convert markdown to HTML
  const contentHtml = markdownToHtml(post.content)

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <time className="text-gray-600">{post.date}</time>
        </header>
        
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>
    </main>
  )
}
