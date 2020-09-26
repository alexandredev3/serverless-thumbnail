import matter from 'gray-matter' // transformar os front matters em javascript.
import { request } from 'http'
import marked from 'marked' // transformar Markdown em HTML

export async function getAllPosts() {
  const context = require.context('../../_posts', false, /\.md$/)
  const posts = []

  for (const key of context.keys()){
    const post = key.slice(2)
    const content = await import(`../../_posts/${post}`)
    const meta = matter(content.default)

    posts.push({
      slug: post.replace('.md', ''),
      title: meta.data.title
    })
  }

  return posts
}

export async function getPostBySlug(slug: string | string[]) {
  const fileContent = await import(`../../_posts/${slug}.md`)

  const meta = matter(fileContent.default)
  const content = marked(meta.content)   

  // jeito gambiarra de resolver o problema da url.(o melhor jeito era fazer um request na url)
  // faça o deploy da aplicação, ver a url e coloca aqui. se você tiver um dominio certamente você sabe o dominio :D
  const baseUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://serverless-thum.vercel.app';

  const thumbnailUrl = `${baseUrl}/api/thumbnail.png?title=${meta.data.title}`

  return {
    title: meta.data.title, 
    description: meta.data.description,
    thumbnailUrl,
    content,
  }
}