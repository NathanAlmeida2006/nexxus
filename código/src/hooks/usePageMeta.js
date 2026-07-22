import { useEffect } from 'react'

/*
 * Título e description por rota, sem biblioteca de head. Restaura os valores
 * anteriores ao desmontar, então a Home volta ao que está no index.html.
 */
export default function usePageMeta({ title, description }) {
  useEffect(() => {
    const tituloAnterior = document.title
    const tag = document.querySelector('meta[name="description"]')
    const descAnterior = tag?.getAttribute('content')

    if (title) document.title = title
    if (tag && description) tag.setAttribute('content', description)

    return () => {
      document.title = tituloAnterior
      if (tag && descAnterior) tag.setAttribute('content', descAnterior)
    }
  }, [title, description])
}
