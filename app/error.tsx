'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-danger">Er is iets misgegaan</h2>
        <p className="text-muted">Er is een fout opgetreden bij het laden van de pagina.</p>
        <button
          onClick={reset}
          className="btn-primary"
        >
          Probeer opnieuw
        </button>
      </div>
    </div>
  )
} 