/**
 * Hook para manejar la extracción de datos desde chats
 */
import { useState } from 'react'
import { ChatParseResult } from '@/app/etiquetas/types'
import { extractoRegex } from '@/app/etiquetas/constants'

export function useChatExtraction() {
  const [isExtracting, setIsExtracting] = useState(false)
  const [chatText, setChatText] = useState('')

  const parseChatText = (text: string): ChatParseResult => {
    const data: ChatParseResult = {
      nombreDestinatario: '',
      telefonoDestinatario: '',
      direccionDestinatario: '',
      cpDestinatario: '',
      chat: '',
      producto: '',
      totalACobrar: '',
      nroVenta: '',
      localidad: 'La Plata'
    }

    // Extraer teléfono
    const phoneMatch = text.match(extractoRegex.phone)
    if (phoneMatch) {
      data.telefonoDestinatario = phoneMatch[0].replace(/\s/g, '')
      data.chat = phoneMatch[0].replace(/\s/g, '')
    }

    // Extraer nombre
    const nameMatch = text.match(extractoRegex.name)
    if (nameMatch) {
      data.nombreDestinatario = nameMatch[1]
    }

    // Extraer dirección
    for (const pattern of extractoRegex.address) {
      const match = text.match(pattern)
      if (match) {
        data.direccionDestinatario = match[0]
        break
      }
    }

    // Extraer código postal
    const cpMatch = text.match(extractoRegex.cp)
    if (cpMatch) {
      const cp = cpMatch[0]
      if (cp.length >= 4 && cp.length <= 7) {
        data.cpDestinatario = cp
      }
    }

    // Extraer producto
    for (const pattern of extractoRegex.product) {
      const match = text.match(pattern)
      if (match) {
        data.producto = match[1].trim().substring(0, 50)
        break
      }
    }

    // Extraer precio
    const priceMatch = text.match(extractoRegex.price)
    if (priceMatch) {
      data.montoCobrar = priceMatch[1]
      data.totalACobrar = '1' // Marcar como a cobrar
    }

    return data
  }

  const extractDataFromChat = async (): Promise<ChatParseResult> => {
    setIsExtracting(true)
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const extractedData = parseChatText(chatText)
        setIsExtracting(false)
        resolve(extractedData)
      }, 1500)
    })
  }

  const extractMultipleDataFromChat = async (text: string): Promise<ChatParseResult[]> => {
    setIsExtracting(true)
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const chats = text.split('\n\n').filter(chat => chat.trim())
        const extractedLabels: ChatParseResult[] = []
        
        chats.forEach((chat, index) => {
          const extractedData = parseChatText(chat)
          extractedData.chat = extractedData.chat || `${Date.now()}-${index}`
          extractedLabels.push(extractedData)
        })
        
        setIsExtracting(false)
        resolve(extractedLabels)
      }, 2000)
    })
  }

  return {
    isExtracting,
    chatText,
    setChatText,
    parseChatText,
    extractDataFromChat,
    extractMultipleDataFromChat
  }
}