import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

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
      const matterResult = matter(fileContents)

      // Extract date from filename (YYYY-MM-DD format)
      const dateMatch = fileName.match(/^(\d{4}-\d{2}-\d{2})/)
      const date = dateMatch ? dateMatch[1] : '2025-01-01'

      return {
        slug,
        title: matterResult.data.title || extractTitleFromContent(matterResult.content),
        content: matterResult.content,
        date,
      }
    })

  // Sort posts by date (newest first)
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
}

function extractTitleFromContent(content: string): string {
  const lines = content.trim().split('\n')
  const titleLine = lines.find(line => line.startsWith('# '))
  return titleLine ? titleLine.replace('# ', '') : 'Untitled'
}

export async function getPostBySlug(slug: string): Promise<Post & { contentHtml: string }> {
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)

  // Process markdown
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  const dateMatch = slug.match(/^(\d{4}-\d{2}-\d{2})/)
  const date = dateMatch ? dateMatch[1] : '2025-01-01'

  return {
    slug,
    title: matterResult.data.title || extractTitleFromContent(matterResult.content),
    content: matterResult.content,
    contentHtml,
    date,
  }
}