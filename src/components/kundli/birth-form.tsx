'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, MapPin, Calculator, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface BirthData {
  dateString: string
  timeString: string
  lat: number
  lng: number
  timezone: number
  placeName: string
}

interface BirthFormProps {
  onSubmit: (data: BirthData) => void
  isLoading?: boolean
}

export function BirthForm({ onSubmit, isLoading = false }: BirthFormProps) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    place: '',
    latitude: '',
    longitude: '',
    timezone: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const popularTimezones = [
    { value: '-12', label: 'UTC-12:00 (Baker Island)' },
    { value: '-11', label: 'UTC-11:00 (American Samoa)' },
    { value: '-10', label: 'UTC-10:00 (Hawaii)' },
    { value: '-9', label: 'UTC-09:00 (Alaska)' },
    { value: '-8', label: 'UTC-08:00 (Pacific Time)' },
    { value: '-7', label: 'UTC-07:00 (Mountain Time)' },
    { value: '-6', label: 'UTC-06:00 (Central Time)' },
    { value: '-5', label: 'UTC-05:00 (Eastern Time)' },
    { value: '-4', label: 'UTC-04:00 (Atlantic Time)' },
    { value: '-3', label: 'UTC-03:00 (Buenos Aires)' },
    { value: '0', label: 'UTC±00:00 (London)' },
    { value: '1', label: 'UTC+01:00 (Berlin)' },
    { value: '2', label: 'UTC+02:00 (Cairo)' },
    { value: '3', label: 'UTC+03:00 (Moscow)' },
    { value: '4', label: 'UTC+04:00 (Dubai)' },
    { value: '5', label: 'UTC+05:00 (Karachi)' },
    { value: '5.5', label: 'UTC+05:30 (India)' },
    { value: '6', label: 'UTC+06:00 (Dhaka)' },
    { value: '7', label: 'UTC+07:00 (Bangkok)' },
    { value: '8', label: 'UTC+08:00 (Beijing)' },
    { value: '9', label: 'UTC+09:00 (Tokyo)' },
    { value: '10', label: 'UTC+10:00 (Sydney)' },
    { value: '11', label: 'UTC+11:00 (Solomon Islands)' },
    { value: '12', label: 'UTC+12:00 (New Zealand)' }
  ]

  const popularPlaces = [
    { name: 'New Delhi, India', lat: 28.6139, lng: 77.2090, timezone: 5.5 },
    { name: 'Mumbai, India', lat: 19.0760, lng: 72.8777, timezone: 5.5 },
    { name: 'London, UK', lat: 51.5074, lng: -0.1278, timezone: 0 },
    { name: 'New York, USA', lat: 40.7128, lng: -74.0060, timezone: -5 },
    { name: 'Los Angeles, USA', lat: 34.0522, lng: -118.2437, timezone: -8 },
    { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, timezone: 9 },
    { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093, timezone: 10 }
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    if (!formData.time) {
      newErrors.time = 'Time is required'
    }

    if (!formData.place) {
      newErrors.place = 'Place is required'
    }

    if (!formData.latitude) {
      newErrors.latitude = 'Latitude is required'
    } else {
      const lat = parseFloat(formData.latitude)
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.latitude = 'Latitude must be between -90 and 90'
      }
    }

    if (!formData.longitude) {
      newErrors.longitude = 'Longitude is required'
    } else {
      const lng = parseFloat(formData.longitude)
      if (isNaN(lng) || lng < -180 || lng > 180) {
        newErrors.longitude = 'Longitude must be between -180 and 180'
      }
    }

    if (!formData.timezone) {
      newErrors.timezone = 'Timezone is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly')
      return
    }

    const birthData: BirthData = {
      dateString: formData.date,
      timeString: formData.time + ':00',
      lat: parseFloat(formData.latitude),
      lng: parseFloat(formData.longitude),
      timezone: parseFloat(formData.timezone),
      placeName: formData.place
    }

    try {
      onSubmit(birthData)
    } catch (error) {
      toast.error('Failed to calculate Kundli. Please try again.')
    }
  }

  const handlePlaceSelect = (place: typeof popularPlaces[0]) => {
    setFormData(prev => ({
      ...prev,
      place: place.name,
      latitude: place.lat.toString(),
      longitude: place.lng.toString(),
      timezone: place.timezone.toString()
    }))
    setErrors(prev => ({
      ...prev,
      place: '',
      latitude: '',
      longitude: '',
      timezone: ''
    }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Calculator className="h-6 w-6" />
          Generate Your Kundli
        </CardTitle>
        <CardDescription>
          Enter your birth details to generate your authentic Vedic astrology chart
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Popular Places */}
          <div>
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
              Quick Select - Popular Places
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {popularPlaces.map((place, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handlePlaceSelect(place)}
                  className="text-left justify-start"
                >
                  <MapPin className="h-3 w-3 mr-2 flex-shrink-0" />
                  <span className="truncate">{place.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date of Birth *
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className={errors.date ? 'border-red-500' : ''}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label htmlFor="time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time of Birth *
            </Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              className={errors.time ? 'border-red-500' : ''}
            />
            {errors.time && <p className="text-sm text-red-500">{errors.time}</p>}
          </div>

          {/* Place */}
          <div className="space-y-2">
            <Label htmlFor="place" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Place of Birth *
            </Label>
            <Input
              id="place"
              type="text"
              placeholder="e.g., New Delhi, India"
              value={formData.place}
              onChange={(e) => setFormData(prev => ({ ...prev, place: e.target.value }))}
              className={errors.place ? 'border-red-500' : ''}
            />
            {errors.place && <p className="text-sm text-red-500">{errors.place}</p>}
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude *</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="e.g., 28.6139"
                value={formData.latitude}
                onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                className={errors.latitude ? 'border-red-500' : ''}
              />
              {errors.latitude && <p className="text-sm text-red-500">{errors.latitude}</p>}
              <p className="text-xs text-slate-500">Range: -90 to 90</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude *</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="e.g., 77.2090"
                value={formData.longitude}
                onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                className={errors.longitude ? 'border-red-500' : ''}
              />
              {errors.longitude && <p className="text-sm text-red-500">{errors.longitude}</p>}
              <p className="text-xs text-slate-500">Range: -180 to 180</p>
            </div>
          </div>

          {/* Timezone */}
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone *</Label>
            <Select value={formData.timezone} onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}>
              <SelectTrigger className={errors.timezone ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {popularTimezones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.timezone && <p className="text-sm text-red-500">{errors.timezone}</p>}
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calculating Kundli...
              </>
            ) : (
              <>
                <Calculator className="mr-2 h-4 w-4" />
                Generate Kundli
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}