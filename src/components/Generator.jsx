import { useEffect, useMemo, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || ''

export default function Generator() {
  const [templates, setTemplates] = useState([])
  const [selected, setSelected] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [data, setData] = useState('{}')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const res = await fetch(`${API}/api/templates`)
      const json = await res.json()
      setTemplates(Array.isArray(json) ? json : [])
    } catch (e) {
      console.error(e)
    }
  }
  useEffect(() => { load() }, [])

  useEffect(() => {
    if (!selected) return
    const t = templates.find(x => x._id === selected)
    if (t) {
      setTitle(t.title)
      setBody(t.body)
    }
  }, [selected, templates])

  const pretty = useMemo(() => {
    try { return JSON.stringify(JSON.parse(data), null, 2) } catch { return data }
  }, [data])

  const render = async () => {
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch(`${API}/api/render`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template_id: selected || undefined, title, body, data: JSON.parse(data || '{}') })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.detail || 'Ошибка рендеринга')
      setResult(json)
    } catch (e) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Генератор документов</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Выберите шаблон</label>
              <select value={selected} onChange={e=>setSelected(e.target.value)} className="w-full border rounded px-3 py-2">
                <option value="">— Не выбран —</option>
                {templates.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Название документа</label>
              <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Запрос в ..."/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Данные (JSON)</label>
              <textarea value={pretty} onChange={e=>setData(e.target.value)} className="w-full border rounded px-3 py-2 h-48 font-mono" placeholder='{"case_number":"123/2025","investigator":"И.И. Иванов"}' />
              <p className="text-xs text-gray-500 mt-1">Поля заменят плейсхолдеры {{ field }} в тексте.</p>
            </div>
            <button onClick={render} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50">Сгенерировать</button>
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Текст</label>
            <textarea value={body} onChange={e=>setBody(e.target.value)} className="w-full border rounded px-3 py-2 h-[28rem] font-mono whitespace-pre" placeholder="Текст шаблона" />
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-2">Результат</h3>
          <pre className="whitespace-pre-wrap bg-gray-50 rounded p-3 text-sm">{result.rendered}</pre>
        </div>
      )}
    </div>
  )
}
