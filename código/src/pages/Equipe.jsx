import useReveal from '../hooks/useReveal'

export default function Equipe() {
  const ref = useReveal()

  return (
    <section className="section" data-theme="navy" ref={ref}>
      <div className="container">
        <h1 className="reveal">As Nozes.</h1>
      </div>
    </section>
  )
}
