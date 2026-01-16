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
    const lowerMessage = message.toLowerCase().trim()
    
    // PRIMA: Controlla le parole chiave specifiche per servizi e supporto
    // (questi devono essere controllati PRIMA della ricerca auto)
    
    // Permuta
    if (lowerMessage.includes('permuta') || lowerMessage.includes('permut') || 
        lowerMessage.includes('scambio') || lowerMessage.includes('cambio auto')) {
      return { 
        text: 'Sì! Permutiamo la tua auto usata. Possiamo valutarla e darti un\'offerta.\n\nVuoi maggiori informazioni? Vai al servizio "Permutiamo la tua auto" per compilare il form e richiedere una valutazione!' 
      }
    }
    
    // Contatto, supporto, assistenza
    if (lowerMessage.includes('contatto') || lowerMessage.includes('supporto') || 
        lowerMessage.includes('aiuto') || lowerMessage.includes('help') ||
        lowerMessage.includes('assistenza') || lowerMessage.includes('info') ||
        lowerMessage.includes('contattar') || lowerMessage.includes('contattaci') ||
        lowerMessage === 'aiuto' || lowerMessage === 'supporto' || lowerMessage === 'assistenza') {
      return { 
        text: 'Siamo qui per aiutarti! Puoi contattarci:\n\n📞 Telefono: 079 2638300\n📧 Email: autocambss@gmail.com\n\nOppure visita le nostre pagine servizi per compilare i form online!' 
      }
    }
    
    // Compriamo auto / Vendita
    if (lowerMessage.includes('vendo') || lowerMessage.includes('vendere') || 
        lowerMessage.includes('compro') || lowerMessage.includes('comprare') ||
        lowerMessage.includes('valutazione') || lowerMessage.includes('valutare') ||
        lowerMessage.includes('acquisto auto')) {
      return { 
        text: 'Vuoi vendere la tua auto? Offriamo un servizio di valutazione e acquisto!\n\nVai al servizio "Compriamo la tua auto" per richiedere una valutazione gratuita!' 
      }
    }
    
    // Servizi
    if (lowerMessage.includes('servizi') || lowerMessage.includes('servizio') ||
        lowerMessage.includes('cosa offrite') || lowerMessage.includes('cosa fate')) {
      return { 
        text: 'Offriamo diversi servizi:\n\n🔍 "Cerca un\'auto" - Cerchiamo l\'auto che desideri\n💰 "Compriamo la tua auto" - Valutazione e acquisto\n🔄 "Permutiamo la tua auto" - Permuta con una delle nostre auto\n🚗 "Auto a domicilio" - Test drive a domicilio\n🚐 "Servizio Navetta" - Navetta gratuita verso il centro\n\nClicca sui link per accedere ai form!' 
      }
    }
    
    // Navetta
    if (lowerMessage.includes('navetta') || lowerMessage.includes('trasporto') ||
        lowerMessage.includes('portare in città')) {
      return {
        text: 'Offriamo il servizio navetta gratuito verso il centro città!\n\nLascia la tua auto ai nostri esperti e torna subito in città. Vai al servizio "Servizio Navetta" per richiedere informazioni!'
      }
    }
    
    // Auto a domicilio
    if (lowerMessage.includes('domicilio') || lowerMessage.includes('a casa') ||
        lowerMessage.includes('test drive') || lowerMessage.includes('prova a casa')) {
      return {
        text: 'Offriamo test drive a domicilio! Ti portiamo l\'auto a casa per la prova.\n\nVai al servizio "Auto a domicilio" per prenotare un appuntamento!'
      }
    }
    
    // Orari e ubicazione
    if (lowerMessage.includes('orari') || lowerMessage.includes('aperto') || 
        lowerMessage.includes('chiuso') || lowerMessage.includes('dove') ||
        lowerMessage.includes('sede') || lowerMessage.includes('indirizzo') ||
        lowerMessage.includes('ubicazione') || lowerMessage.includes('posizione')) {
      return { 
        text: 'Per informazioni su orari, ubicazione e visite, contattaci:\n\n📞 079 2638300\n📧 autocambss@gmail.com\n\nSaremo felici di darti tutte le informazioni!' 
      }
    }
    
    // Prezzo
    if (lowerMessage.includes('prezzo') || lowerMessage.includes('costo') ||
        lowerMessage.includes('quanto costa') || lowerMessage.includes('prezzi')) {
      return { text: 'I nostri prezzi sono competitivi e trasparenti. Puoi vedere tutti i prezzi direttamente sul sito. Vuoi informazioni su un modello specifico? Dimmi quale auto ti interessa!' }
    }
    
    // Finanziamento
    if (lowerMessage.includes('finanziamento') || lowerMessage.includes('rata') ||
        lowerMessage.includes('rate') || lowerMessage.includes('pagamento rateale')) {
      return { text: 'Offriamo diverse soluzioni di finanziamento. Contattaci al 079 2638300 per una consulenza personalizzata!' }
    }
    
    // Garanzia
    if (lowerMessage.includes('garanzia') || lowerMessage.includes('garantit') ||
        lowerMessage.includes('garant')) {
      return { text: 'Tutte le nostre auto usate sono garantite e controllate. Ogni veicolo passa un\'ispezione completa prima della vendita.' }
    }
    
    // Saluti
    if (lowerMessage.includes('ciao') || lowerMessage.includes('salve') || 
        lowerMessage.includes('buongiorno') || lowerMessage.includes('buonasera') ||
        lowerMessage.includes('buon pomeriggio') || lowerMessage === 'ciao' || lowerMessage === 'salve') {
      return { text: 'Ciao! Sono qui per aiutarti a trovare l\'auto perfetta. Dimmi quale marca o modello stai cercando, oppure chiedimi informazioni sui nostri servizi!' }
    }
    
    // POI: Cerca auto nel database (solo se non è una richiesta di servizio)
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
        moreCount: moreCount > 0 ? moreCount : undefined
      }
    }
    
    // Se il messaggio sembra essere una ricerca auto ma non ha trovato risultati
    const seemsLikeCarSearch = containsCarKeywords(message) || 
                                (message.trim().split(/\s+/).length <= 3 && 
                                 !lowerMessage.includes('servizio') && 
                                 !lowerMessage.includes('aiuto') &&
                                 !lowerMessage.includes('info'))
    
    if (seemsLikeCarSearch) {
      return { 
        text: `Mi dispiace, al momento non abbiamo l'auto che stai cercando nel nostro parco.\n\nNon ti preoccupare! Possiamo aiutarti a trovarla:\n\n📞 Chiamaci al 079 2638300\n📧 Scrivici a autocambss@gmail.com\n\nIl nostro team può cercare l'auto che desideri e contattarti non appena sarà disponibile. Offriamo anche il servizio "Cerca un'auto" per trovare modelli specifici!` 
      }
    }
    
    // Risposta generica
    return { text: 'Grazie per il tuo messaggio! Dimmi quale auto stai cercando (marca, modello) e ti mostrerò le disponibilità. Oppure chiamaci al 079 2638300 o scrivi a autocambss@gmail.com per informazioni dettagliate!' }
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
                  {(() => {
                    let text = message.text
                    const parts: (string | JSX.Element)[] = []
                    let lastIndex = 0
                    
                    // Pattern per link ai servizi
                    const serviceLinks = [
                      { pattern: /"Cerca un'auto"/g, href: '/servizi/cerca-auto', text: '"Cerca un\'auto"' },
                      { pattern: /"Permutiamo la tua auto"/g, href: '/servizi/permuta', text: '"Permutiamo la tua auto"' },
                      { pattern: /"Compriamo la tua auto"/g, href: '/servizi/compra', text: '"Compriamo la tua auto"' },
                      { pattern: /Permutiamo la tua auto/g, href: '/servizi/permuta', text: 'Permutiamo la tua auto' },
                      { pattern: /Compriamo la tua auto/g, href: '/servizi/compra', text: 'Compriamo la tua auto' },
                    ]
                    
                    // Pattern per email
                    const emailPattern = /autocambss@gmail\.com/g
                    
                    // Pattern per telefono
                    const phonePattern = /079\s*2638300/g
                    
                    // Trova tutte le occorrenze
                    const matches: Array<{ index: number; length: number; type: 'service' | 'email' | 'phone'; href?: string; text: string }> = []
                    
                    serviceLinks.forEach(link => {
                      let match
                      while ((match = link.pattern.exec(text)) !== null) {
                        matches.push({
                          index: match.index,
                          length: match[0].length,
                          type: 'service',
                          href: link.href,
                          text: link.text
                        })
                      }
                    })
                    
                    let emailMatch
                    while ((emailMatch = emailPattern.exec(text)) !== null) {
                      matches.push({
                        index: emailMatch.index,
                        length: emailMatch[0].length,
                        type: 'email',
                        href: `mailto:${emailMatch[0]}`,
                        text: emailMatch[0]
                      })
                    }
                    
                    let phoneMatch
                    while ((phoneMatch = phonePattern.exec(text)) !== null) {
                      matches.push({
                        index: phoneMatch.index,
                        length: phoneMatch[0].length,
                        type: 'phone',
                        href: `tel:0792638300`,
                        text: phoneMatch[0]
                      })
                    }
                    
                    // Ordina per indice
                    matches.sort((a, b) => a.index - b.index)
                    
                    // Costruisci il risultato
                    matches.forEach((match, i) => {
                      // Aggiungi testo prima del match
                      if (match.index > lastIndex) {
                        parts.push(text.substring(lastIndex, match.index))
                      }
                      
                      // Aggiungi il link
                      if (match.href) {
                        if (match.type === 'email' || match.type === 'phone') {
                          parts.push(
                            <a
                              key={`link-${i}`}
                              href={match.href}
                              className="text-primary-600 hover:text-primary-700 underline font-medium"
                            >
                              {match.text}
                            </a>
                          )
                        } else {
                          parts.push(
                            <Link
                              key={`link-${i}`}
                              href={match.href}
                              className="text-primary-600 hover:text-primary-700 underline font-medium"
                            >
                              {match.text}
                            </Link>
                          )
                        }
                      }
                      
                      lastIndex = match.index + match.length
                    })
                    
                    // Aggiungi testo finale
                    if (lastIndex < text.length) {
                      parts.push(text.substring(lastIndex))
                    }
                    
                    return parts.length > 0 ? parts : [text]
                  })()}
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
                    {message.moreCount !== undefined && message.moreCount > 0 && (
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

