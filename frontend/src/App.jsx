function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-extrabold text-indigo-600 mb-2">Tailwind CSS Test</h1>
        <p className="text-gray-600 mb-4">If this text is styled (colors, spacing, rounded corners), Tailwind is configured correctly.</p>

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">Primary</button>
          <button className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50 transition">Secondary</button>
        </div>

        <div className="mt-6">
          <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Success badge</div>
        </div>
      </div>
    </div>
  )
}

export default App