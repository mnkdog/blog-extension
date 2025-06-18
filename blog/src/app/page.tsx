import Link from 'next/link'

// For now, let's hard-code some test data
const mockPosts = [
  {
    slug: '2025-06-17-test-post',
    title: 'Test Post',
    date: '2025-06-17',
    excerpt: 'This is a test post...'
  }
]

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">My Blog</h1>
      
      <div className="space-y-6">
        {mockPosts.map((post) => (
          <article key={post.slug} className="border-b pb-6">
            <h2 className="text-2xl font-semibold mb-2">
              <Link href={`/posts/${post.slug}`} className="hover:text-blue-600">
                {post.title}
              </Link>
            </h2>
            <p className="text-gray-600 mb-2">{post.date}</p>
            <p className="text-gray-800">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </main>
  )
}
