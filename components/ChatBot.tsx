'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Car } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getCars } from '@/lib/carsApi'
import { Car as CarType } from '@/types/car'

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{
    id: number
    text: string
    sender: 'user' | 'bot'
    timestamp: Date
    cars?: CarType[]
    moreCount?: number
  }>>([
    {
      id: 1,
      text: 'Ciao! Sono l\'assistente virtuale di AUTOCAMB.IT. Dimmi quale auto stai cercando (marca, modello) e ti mostrerò le disponibilità!',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [cars, setCars] = useState<CarType[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Carica le auto dal database
    const loadCars = async () => {
      try {
        const loadedCars = await getCars()
        setCars(loadedCars)
        console.log('ChatBot: Caricate', loadedCars.length, 'auto dal database')
      } catch (error) {
        console.error('Error loading cars:', error)
      }
    }
    
    loadCars()
    
    // Ricarica ogni 30 secondi per avere dati aggiornati
    const interval = setInterval(loadCars, 30000)
    
    return () => clearInterval(interval)
  }, [])

  // Ricarica le auto quando si apre la chat per avere dati freschi
  useEffect(() => {
    if (isOpen) {
      const loadCars = async () => {
        try {
          const loadedCars = await getCars()
          setCars(loadedCars)
        } catch (error) {
          console.error('Error loading cars:', error)
        }
      }
      loadCars()
    }
  }, [isOpen])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSend = async () => {
    if (!inputMessage.trim()) return

    const userMessage: {
      id: number
      text: string
      sender: 'user' | 'bot'
      timestamp: Date
      cars?: CarType[]
      moreCount?: number
    } = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages([...messages, userMessage])
    const currentInput = inputMessage
    setInputMessage('')

    // Simula risposta del bot
    setTimeout(() => {
      const response = getBotResponse(currentInput)
      const botResponse: {
        id: number
        text: string
        sender: 'user' | 'bot'
        timestamp: Date
        cars?: CarType[]
        moreCount?: number
      } = {
        id: messages.length + 2,
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        cars: response.cars,
        moreCount: response.moreCount
      }
      setMessages(prev => [...prev, botResponse])
    }, 1000)
  }

  const searchCars = (query: string): CarType[] => {
    const lowerQuery = query.toLowerCase().trim()
    if (!lowerQuery || lowerQuery.length < 2) return []
    
    const queryWords = lowerQuery.split(/\s+/).filter(word => word.length >= 2)
    if (queryWords.length === 0) return []
    
    return cars.filter(car => {
      const searchableText = `${car.brand} ${car.model} ${car.version} ${car.fuel} ${car.category}`.toLowerCase()
      
      // Cerca corrispondenze esatte o parziali per ogni parola della query
      const matches = queryWords.every(word => {
        return searchableText.includes(word) || 
               car.brand.toLowerCase().includes(word) ||
               car.model.toLowerCase().includes(word) ||
               car.version.toLowerCase().includes(word)
      })
      
      // Mostra tutte le auto (Disponibile, Prossimamente, Venduto)
      return matches
    })
  }

  const containsCarKeywords = (message: string): boolean => {
    const lowerMessage = message.toLowerCase().trim()
    
    // Se il messaggio è molto corto (1-3 parole), probabilmente è una marca/modello
    const words = lowerMessage.split(/\s+/).filter(w => w.length > 0)
    if (words.length <= 3 && words.length > 0) {
      // Controlla se sembra una marca/modello (non contiene parole comuni)
      const commonWords = ['ciao', 'salve', 'grazie', 'prezzo', 'costo', 'finanziamento', 'rata', 'garanzia']
      const isCommonWord = words.some(word => commonWords.includes(word))
      if (!isCommonWord) {
        return true // Probabilmente è una ricerca auto
      }
    }
    
    // Lista estesa di marche e modelli
    const carKeywords = [
      'fiat', 'opel', 'volkswagen', 'seat', 'citroen', 'peugeot', 'renault', 'ford',
      'panda', 'corsa', 'polo', 'ibiza', 'c3', 'leon', 'golf', 'punto', 'ypsilon',
      'porsche', 'ferrari', 'lamborghini', 'bmw', 'mercedes', 'audi', 'alfa romeo',
      'lancia', 'mazda', 'toyota', 'honda', 'nissan', 'hyundai', 'kia', 'suzuki',
      'auto', 'macchina', 'vettura', 'veicolo', 'cerco', 'cercando', 'cerchi',
      'disponibile', 'disponibilità', 'modello', 'marca'
    ]
    return carKeywords.some(keyword => lowerMessage.includes(keyword))
  }

  const getBotResponse = (message: string): { text: string; cars?: CarType[]; moreCount?: number } => {
    const lowerMessage = message.toLowerCase()
    
    // Cerca auto nel messaggio
    const foundCars = searchCars(message)
    
    if (foundCars.length > 0) {
      const carList = foundCars.slice(0, 3) // Mostra max 3 auto
      const moreCount = foundCars.length - carList.length
      
      // Controlla se ci sono auto con status "Prossimamente"
      const prossimamenteCars = foundCars.filter(car => car.status === 'Prossimamente')
      const disponibileCars = foundCars.filter(car => car.status === 'Disponibile')
      
      let responseText = `Ho trovato ${foundCars.length} auto${foundCars.length > 1 ? '' : ''} che potrebbero interessarti:\n\n`
      
      // Aggiungi avviso se ci sono auto "Prossimamente"
      if (prossimamenteCars.length > 0) {
        if (disponibileCars.length > 0) {
          responseText += `⚠️ Nota: ${prossimamenteCars.length} di queste auto saranno disponibili prossimamente.\n\n`
        } else {
          responseText += `⚠️ Attenzione: ${prossimamenteCars.length === 1 ? 'Questa auto sarà disponibile' : 'Queste auto saranno disponibili'} prossimamente.\n\n`
        }
      }
      
      return {
        text: responseText,
        cars: carList,
        moreCount: moreCount > 0 ? moreCount : 0
      }
    }
    
    // Se il messaggio sembra essere una ricerca auto ma non ha trovato risultati
    // Cerca sempre nel database prima di decidere se è una ricerca auto
    const seemsLikeCarSearch = containsCarKeywords(message) || 
                                message.trim().split(/\s+/).length <= 3
    
    if (seemsLikeCarSearch) {
      return { 
        text: `Mi dispiace, al momento non abbiamo l'auto che stai cercando nel nostro parco.\n\nNon ti preoccupare! Possiamo aiutarti a trovarla:\n\n📞 Chiamaci al 079 2638300\n📧 Scrivici a autocambss@gmail.com\n\nIl nostro team può cercare l'auto che desideri e contattarti non appena sarà disponibile. Offriamo anche il servizio "Cerca un'auto" per trovare modelli specifici!` 
      }
    }
    
    // Risposte standard
    if (lowerMessage.includes('prezzo') || lowerMessage.includes('costo')) {
      return { text: 'I nostri prezzi sono competitivi e trasparenti. Puoi vedere tutti i prezzi direttamente sul sito. Vuoi informazioni su un modello specifico? Dimmi quale auto ti interessa!' }
    }
    if (lowerMessage.includes('finanziamento') || lowerMessage.includes('rata')) {
      return { text: 'Offriamo diverse soluzioni di finanziamento. Contattaci al 079 2638300 per una consulenza personalizzata!' }
    }
    if (lowerMessage.includes('garanzia') || lowerMessage.includes('garantit')) {
      return { text: 'Tutte le nostre auto usate sono garantite e controllate. Ogni veicolo passa un\'ispezione completa prima della vendita.' }
    }
    if (lowerMessage.includes('permuta') || lowerMessage.includes('permut')) {
      return { text: 'Sì! Permutiamo la tua auto usata. Possiamo valutarla e darti un\'offerta. Vuoi maggiori informazioni?' }
    }
    if (lowerMessage.includes('ciao') || lowerMessage.includes('salve') || lowerMessage.includes('buongiorno')) {
      return { text: 'Ciao! Sono qui per aiutarti a trovare l\'auto perfetta. Dimmi quale marca o modello stai cercando!' }
    }
    
    return { text: 'Grazie per il tuo messaggio! Dimmi quale auto stai cercando (marca, modello) e ti mostrerò le disponibilità. Oppure chiamaci al 079 2638300 per informazioni dettagliate!' }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 bg-primary-600 text-white rounded-full p-4 shadow-2xl hover:bg-primary-700 hover:scale-110 transition-all duration-300 ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100 animate-float'
        }`}
        aria-label="Apri chat"
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col transition-all duration-300 ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-primary-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
              <Image
                src="/ai-bot.png"
                alt="Assistente Virtuale"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold">Assistente Virtuale</h3>
              <p className="text-xs text-primary-100">Siamo online</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 rounded-full p-1 transition"
            aria-label="Chiudi chat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-primary-900 shadow-md'
                }`}
              >
                <div className="text-sm whitespace-pre-line">
                  {message.text.split('"Cerca un\'auto"').map((part, index, array) => {
                    if (index === array.length - 1) {
                      return <span key={index}>{part}</span>
                    }
                    return (
                      <span key={index}>
                        {part}
                        <Link
                          href="/servizi/cerca-auto"
                          className="text-primary-600 hover:text-primary-700 underline font-medium"
                        >
                          "Cerca un'auto"
                        </Link>
                      </span>
                    )
                  })}
                </div>
                
                {/* Auto cards se presenti */}
                {message.cars && message.cars.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.cars.map((car) => (
                      <Link
                        key={car.id}
                        href={`/auto/${car.id}`}
                        className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-3 border border-gray-200 transition"
                      >
                        <div className="flex items-start gap-3">
                          <Car className="text-primary-600 flex-shrink-0 mt-0.5" size={20} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-primary-900 text-sm">
                                {car.brand} {car.model}
                              </p>
                              {car.status === 'Prossimamente' && (
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">
                                  Prossimamente
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 truncate">{car.version}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">{car.km.toLocaleString('it-IT')} km</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-xs text-gray-500">{car.year}</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-xs font-semibold text-primary-600">
                                € {car.price.toLocaleString('it-IT')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {message.moreCount && message.moreCount > 0 && (
                      <Link
                        href="/auto"
                        className="block text-center text-sm text-primary-600 hover:text-primary-700 font-medium mt-2"
                      >
                        Vedi altre {message.moreCount} auto disponibili →
                      </Link>
                    )}
                  </div>
                )}
                
                <p className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Scrivi un messaggio..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              disabled={!inputMessage.trim()}
              className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Invia messaggio"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Risposta automatica • Per assistenza chiama 079 2638300
          </p>
        </div>
      </div>
    </>
  )
}

