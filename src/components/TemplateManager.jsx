import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || ''

export default function TemplateManager() {
  const [templates, setTemplates] = useState([])
  const [form, setForm] = useState({ title: '', body: '', category: '', type: 'request' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const res = await fetch(`${API}/api/templates`)
      const data = await res.json()
      setTemplates(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { load() }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/api/templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Ошибка при сохранении')
      setForm({ title: '', body: '', category: '', type: 'request' })
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Новый шаблон документа</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Название</label>
            <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} className="w-full border rounded px-3 py-2" placeholder="Запрос в банк по делу №..." required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Категория</label>
              <input value={form.category} onChange={e=>setForm({...form, category:e.target.value})} className="w-full border rounded px-3 py-2" placeholder="банк / оператор связи / иное" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Тип</label>
              <select value={form.type} onChange={e=>setForm({...form, type:e.target.value})} className="w-full border rounded px-3 py-2">
                <option value="request">Запрос</option>
                <option value="indictment">Обвинительное заключение</option>
                <option value="other">Иное</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Текст шаблона</label>
            <textarea value={form.body} onChange={e=>setForm({...form, body:e.target.value})} className="w-full border rounded px-3 py-2 h-48 font-mono" placeholder="Уважаемые ... Прошу предоставить сведения по делу № {{ case_number }} ..."></textarea>
            <p className="text-xs text-gray-500 mt-1">Используйте плейсхолдеры вида {{ field_name }}: они будут заменены на значения.</p>
          </div>
          <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">Сохранить шаблон</button>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </form>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Мои шаблоны</h2>
        <div className="grid gap-4">
          {templates.map(t => (
            <div key={t._id} className="border rounded p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{t.title}</h3>
                  <p className="text-sm text-gray-500">{t.category || 'Без категории'} • {t.type}</p>
                </div>
                <span className="text-xs text-gray-500">ID: {t._id}</span>
              </div>
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 rounded p-3 mt-3">{t.body}</pre>
            </div>
          ))}
          {templates.length === 0 && (
            <p className="text-gray-500">Пока нет шаблонов. Добавьте первый с помощью формы выше.</p>
          )}
        </div>
      </div>
    </div>
  )
}
