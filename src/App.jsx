import TemplateManager from './components/TemplateManager'
import Generator from './components/Generator'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="sticky top-0 backdrop-blur bg-white/70 border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">ЮрАссистент: шаблоны запросов и документов</h1>
          <div className="text-sm text-gray-500">База шаблонов • Генерация документов</div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <TemplateManager />
          <Generator />
        </div>
      </main>
      <footer className="text-center text-xs text-gray-500 py-6">Сделано для автоматизации рутины следователя и юриста</footer>
    </div>
  )
}

export default App
