import { useState, useRef, useEffect } from 'react'
import OpenAI from 'openai'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const SYSTEM_PROMPT = `Eres un experto meteorólogo y analista de datos climáticos. Tu función es analizar los datos de temperatura y humedad de un sensor IoT, compararlos con el clima real de Santa Marta (ciudad en la que se ubica el sensor) y proporcionar información útil, recomendaciones y observaciones sobre las condiciones actuales. Responde siempre en español de forma clara y concisa.`

const openai = new OpenAI({
  baseURL: import.meta.env.VITE_OPENAI_BASE_URL,
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

export default function WeatherAI({ temperature, humidity }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function buildContext() {
    const parts = ['Datos actuales del sensor:']
    if (temperature != null) parts.push(`- Temperatura: ${temperature.toFixed(1)}°C`)
    if (humidity != null) parts.push(`- Humedad: ${humidity.toFixed(1)}%`)
    return parts.join('\n')
  }

  async function analyzeWeather() {
    const context = buildContext()
    const userMsg = `${context}\n\nAnaliza los datos del sensor, comparalos con el clima actual de Santa Marta y proporciona un resumen con recomendaciones.`
    setMessages([{ role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const completion = await openai.chat.completions.create({
        model: 'openai/gpt-oss-120b:free',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMsg },
        ],
      })
      const reply = completion.choices[0].message.content
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error al conectar con la IA: ${err.message}` }])
    } finally {
      setLoading(false)
    }
  }

  async function sendMessage() {
    if (!input.trim()) return
    const userMsg = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    const history = messages.map(m => ({ role: m.role, content: m.content }))

    try {
      const completion = await openai.chat.completions.create({
        model: 'openai/gpt-oss-120b:free',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildContext() },
          ...history,
          { role: 'user', content: userMsg },
        ],
      })
      const reply = completion.choices[0].message.content
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error al conectar con la IA: ${err.message}` }])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const dataAvailable = temperature != null || humidity != null

  return (
    <div className="rounded-2xl bg-white shadow-md border border-slate-200 p-6">
      <h2 className="text-lg font-bold text-slate-800 mb-1">Asistente Meteorológico IA</h2>
      <p className="text-xs text-slate-400 mb-4">
        Analiza los datos del sensor con inteligencia artificial
      </p>

      <div className="space-y-3 max-h-80 overflow-y-auto mb-4 pr-1">
        {messages.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-sm">
            <p>Presiona el botón para obtener un análisis del clima actual</p>
            <p className="text-xs mt-1">o escribe una pregunta personalizada.</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'user'
                  ? 'bg-blue-500 text-white rounded-br-sm whitespace-pre-wrap'
                  : 'bg-slate-100 text-slate-700 rounded-bl-sm prose prose-sm max-w-none'
                  }`}
              >
                {msg.role === 'user' ? msg.content : (
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      code: ({ children }) => (
                        <code className="bg-slate-200 rounded px-1 py-0.5 text-xs font-mono">{children}</code>
                      ),
                      ul: ({ children }) => <ul className="list-disc pl-5 my-1 space-y-0.5">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-5 my-1 space-y-0.5">{children}</ol>,
                      li: ({ children }) => <li>{children}</li>,
                      p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                      h1: ({ children }) => <h1 className="text-base font-bold my-2">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-sm font-bold my-1.5">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-semibold my-1">{children}</h3>,
                      hr: () => <hr className="my-2 border-slate-300" />,
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-slate-400 pl-3 my-1 text-slate-600 italic">{children}</blockquote>
                      ),
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-2">
                          <table className="min-w-full text-xs border-collapse border border-slate-300">{children}</table>
                        </div>
                      ),
                      th: ({ children }) => <th className="border border-slate-300 px-2 py-1 bg-slate-200 font-semibold">{children}</th>,
                      td: ({ children }) => <td className="border border-slate-300 px-2 py-1">{children}</td>,
                      a: ({ href, children }) => (
                        <a href={href} className="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">{children}</a>
                      ),
                    }}
                  >
                    {msg.content}
                  </Markdown>
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-xl rounded-bl-sm px-4 py-2.5 text-sm text-slate-500">
              <span className="animate-pulse">Analizando...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="space-y-2">
        {messages.length === 0 && (
          <button
            onClick={analyzeWeather}
            disabled={loading || !dataAvailable}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 transition text-sm"
          >
            {loading ? 'Analizando...' : 'Analizar clima actual con IA'}
          </button>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pregunta sobre el clima..."
            disabled={loading || !dataAvailable}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim() || !dataAvailable}
            className="px-4 py-2.5 bg-slate-700 text-white font-medium rounded-xl hover:bg-slate-800 disabled:opacity-50 transition text-sm"
          >
            Enviar
          </button>
        </div>

        {messages.length > 0 && (
          <button
            onClick={() => { setMessages([]); setInput('') }}
            className="text-xs text-slate-400 hover:text-slate-600 transition"
          >
            Nueva consulta
          </button>
        )}
      </div>
    </div>
  )
}
