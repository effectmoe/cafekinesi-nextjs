export default function EnvDebugPage() {
  const envVars = {
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    NEXT_PUBLIC_SANITY_USE_CDN: process.env.NEXT_PUBLIC_SANITY_USE_CDN,
    NEXT_PUBLIC_SANITY_API_TOKEN: process.env.NEXT_PUBLIC_SANITY_API_TOKEN ? '***EXISTS***' : 'NOT_SET',
    NODE_ENV: process.env.NODE_ENV,
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Debug</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(envVars, null, 2)}
      </pre>
    </div>
  )
}