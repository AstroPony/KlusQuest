import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold">Pagina niet gevonden</h2>
        <p className="text-muted">De pagina die je zoekt bestaat niet.</p>
        <Link href="/" className="btn-primary">
          Terug naar home
        </Link>
      </div>
    </div>
  )
} 