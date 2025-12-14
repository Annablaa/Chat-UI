import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Chatio Backend</h1>
        <p className="text-lg text-gray-600 mb-8">
          Next.js backend with Supabase integration
        </p>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            API routes are available at /api/*
          </p>
          <Link 
            href="/api-docs" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View API Documentation (Swagger)
          </Link>
        </div>
      </div>
    </main>
  );
}

