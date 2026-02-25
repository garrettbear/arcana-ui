import { source } from '@/lib/source'
import { createSearchAPI } from 'fumadocs-core/search/server'

export const { GET } = createSearchAPI('simple', {
  indexes: source.getPages().map((page) => {
    const data = page.data as any
    return {
      title: data.title as string,
      description: data.description as string | undefined,
      url: page.url,
      content: '',
    }
  }),
})
