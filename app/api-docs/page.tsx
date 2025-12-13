'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { getSwaggerSpec } from '@/lib/swagger'

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })
import 'swagger-ui-react/swagger-ui.css'

export default function ApiDocs() {
  const [spec, setSpec] = useState<ReturnType<typeof getSwaggerSpec> | null>(null)

  useEffect(() => {
    // Get spec with current origin (client-side)
    setSpec(getSwaggerSpec())
  }, [])

  if (!spec) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading API documentation...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <SwaggerUI spec={spec} />
    </div>
  )
}


