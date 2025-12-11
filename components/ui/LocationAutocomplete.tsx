'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, ChevronDown, X } from 'lucide-react'
import localidades from '@/data/localidades-amba.json'

interface LocationAutocompleteProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: boolean
  required?: boolean
  className?: string
}

export default function LocationAutocomplete({
  value,
  onChange,
  placeholder = "Escriba su localidad...",
  error = false,
  required = false,
  className = ""
}: LocationAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value || '')
  const [isOpen, setIsOpen] = useState(false)
  const [filteredLocalidades, setFilteredLocalidades] = useState<string[]>([])
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filtrar localidades cuando cambia el input
  useEffect(() => {
    if (inputValue.length >= 3) {
      const filtered = localidades.filter(localidad =>
        localidad.toLowerCase().includes(inputValue.toLowerCase())
      )
      setFilteredLocalidades(filtered)
      setIsOpen(filtered.length > 0)
      setHighlightedIndex(-1)
    } else {
      setFilteredLocalidades([])
      setIsOpen(false)
    }
  }, [inputValue])

  // Sincronizar con el valor externo
  useEffect(() => {
    setInputValue(value || '')
  }, [value])

  // Manejar clics fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase()
    setInputValue(newValue)
    
    // Si el valor no coincide exactamente con una localidad válida, no actualizar el valor principal
    if (localidades.includes(newValue)) {
      onChange(newValue)
    } else {
      onChange('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredLocalidades.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < filteredLocalidades.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredLocalidades.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0) {
          selectLocalidad(filteredLocalidades[highlightedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
    }
  }

  const selectLocalidad = (localidad: string) => {
    setInputValue(localidad)
    onChange(localidad)
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  const clearSelection = () => {
    setInputValue('')
    onChange('')
    inputRef.current?.focus()
  }

  const isValidSelection = localidades.includes(inputValue)

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-orange-500 z-10" />
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (filteredLocalidades.length > 0) setIsOpen(true)
          }}
          className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 transition-colors text-sm placeholder:text-gray-500 text-gray-900 ${
            error || (required && !isValidSelection && inputValue.length > 0)
              ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-200 bg-gray-50 hover:bg-white focus:ring-orange-500 focus:border-orange-500'
          }`}
          placeholder={placeholder}
          autoComplete="off"
        />

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
          {inputValue && (
            <button
              type="button"
              onClick={clearSelection}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors mr-1"
            >
              <X className="w-3 h-3 text-gray-400" />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && filteredLocalidades.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredLocalidades.map((localidad, index) => (
            <button
              key={localidad}
              type="button"
              className={`w-full px-4 py-2.5 text-left hover:bg-orange-50 transition-colors border-none text-sm ${
                index === highlightedIndex 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'text-gray-700'
              } ${index === 0 ? 'rounded-t-lg' : ''} ${
                index === filteredLocalidades.length - 1 ? 'rounded-b-lg' : ''
              }`}
              onClick={() => selectLocalidad(localidad)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <span className="font-medium">{localidad}</span>
            </button>
          ))}
        </div>
      )}

      {/* Mensaje de error/validación */}
      {required && !isValidSelection && inputValue.length > 0 && (
        <p className="text-xs text-red-500 mt-2 font-medium flex items-center">
          <span className="w-1 h-1 bg-red-500 rounded-full mr-1"></span>
          Debe seleccionar una localidad de nuestra área de cobertura
        </p>
      )}

      {/* Mensaje de ayuda */}
      {inputValue.length > 0 && inputValue.length < 3 && (
        <p className="text-xs text-gray-500 mt-2">
          Escriba al menos 3 caracteres para buscar localidades
        </p>
      )}
    </div>
  )
}