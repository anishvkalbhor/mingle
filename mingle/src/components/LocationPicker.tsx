"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiMapPin, FiX } from 'react-icons/fi';
import LocationService from '@/services/LocationService';

interface SearchableSelectProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  onSearch?: (query: string) => string[];
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function SearchableSelect({
  label,
  placeholder,
  value,
  onChange,
  options,
  onSearch,
  disabled = false,
  icon
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (onSearch && searchQuery) {
      setFilteredOptions(onSearch(searchQuery));
    } else {
      setFilteredOptions(options.filter(option => 
        option.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    }
  }, [searchQuery, options, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchQuery('');
  };

  const clearSelection = () => {
    onChange('');
    setSearchQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {icon && <span className="mr-1">{icon}</span>}
        {label}
      </label>
      
      <div className={`relative ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <div
          className={`flex items-center w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-800 cursor-pointer transition-all ${
            disabled ? 'cursor-not-allowed' : 'hover:border-purple-400 focus-within:ring-2 focus-within:ring-purple-400'
          }`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <FiSearch className="mr-2 text-gray-400" size={16} />
          
          <input
            ref={inputRef}
            type="text"
            value={isOpen ? searchQuery : value}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={value || placeholder}
            className="flex-1 outline-none bg-transparent"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              if (!disabled) setIsOpen(true);
            }}
          />
          
          {value && !disabled && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <FiX size={16} />
            </button>
          )}
        </div>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              <div className="py-1">
                {filteredOptions.slice(0, 50).map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelect(option)}
                    className="w-full px-4 py-2 text-left hover:bg-purple-50 hover:text-purple-700 transition-colors"
                  >
                    <FiMapPin className="inline mr-2" size={14} />
                    {option}
                  </button>
                ))}
                {filteredOptions.length > 50 && (
                  <div className="px-4 py-2 text-sm text-gray-500 border-t">
                    Showing first 50 results. Keep typing to refine...
                  </div>
                )}
              </div>
            ) : (
              <div className="px-4 py-3 text-gray-500 text-center">
                No results found for "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface LocationPickerProps {
  selectedState: string;
  selectedCity: string;
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
  className?: string;
}

export function LocationPicker({
  selectedState,
  selectedCity,
  onStateChange,
  onCityChange,
  className = ""
}: LocationPickerProps) {
  const [locationService, setLocationService] = useState<LocationService | null>(null);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeLocationService = async () => {
      setLoading(true);
      const service = LocationService.getInstance();
      await service.fetchLocationData();
      setLocationService(service);
      setStates(service.getAllStates());
      setLoading(false);
    };

    initializeLocationService();
  }, []);

  useEffect(() => {
    if (locationService && selectedState) {
      setCities(locationService.getCitiesForState(selectedState));
      const stateCities = locationService.getCitiesForState(selectedState);
      if (selectedCity && !stateCities.includes(selectedCity)) {
        onCityChange('');
      }
    } else {
      setCities([]);
    }
  }, [selectedState, locationService, selectedCity, onCityChange]);

  const handleStateSearch = (query: string): string[] => {
    return locationService?.searchStates(query) || [];
  };

  const handleCitySearch = (query: string): string[] => {
    if (!selectedState) return [];
    const stateCities = locationService?.getCitiesForState(selectedState) || [];
    return stateCities.filter(city => 
      city.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <div className={`grid sm:grid-cols-2 gap-4 ${className}`}>
      <SearchableSelect
        label="🏠 State"
        placeholder="Search for a state..."
        value={selectedState}
        onChange={(state) => {
          onStateChange(state);
          onCityChange('');
        }}
        options={states}
        onSearch={handleStateSearch}
        icon={<FiMapPin />}
      />
      
      <SearchableSelect
        label="📍 City"
        placeholder="Search for a city..."
        value={selectedCity}
        onChange={onCityChange}
        options={cities}
        onSearch={handleCitySearch}
        disabled={!selectedState}
        icon={<FiMapPin />}
      />
    </div>
  );
}
