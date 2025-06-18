import fs from 'fs'
import path from 'path'

const postsDirectory = path.join(process.cwd(), '..', 'posts')

export interface Post {
  slug: string
  title: string
  content: string
  date: string
}

export function getAllPosts(): Post[] {
  // Check if posts directory exists
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      
      // Extract title from content (first # line)
      const lines = fileContents.trim().split('\n')
      const titleLine = lines.find(line => line.startsWith('# '))
      const title = titleLine ? titleLine.replace('# ', '') : 'Untitled'
      
      // Extract date from filename
      const dateMatch = fileName.match(/^(\d{4}-\d{2}-\d{2})/)
      const date = dateMatch ? dateMatch[1] : '2025-01-01'

      return {
        slug,
        title,
        content: fileContents,
        date,
      }
    })

  // Sort posts by date (newest first)
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  
  if (!fs.existsSync(fullPath)) {
    return null
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const lines = fileContents.trim().split('\n')
  const titleLine = lines.find(line => line.startsWith('# '))
  const title = titleLine ? titleLine.replace('# ', '') : 'Untitled'
  
  const dateMatch = slug.match(/^(\d{4}-\d{2}-\d{2})/)
  const date = dateMatch ? dateMatch[1] : '2025-01-01'

  return {
    slug,
    title,
    content: fileContents,
    date,
  }
}
