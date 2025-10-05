'use client'

import { useState } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps'
import { prefectureInfo } from '@/lib/map-data/prefecture-info'

interface JapanMapProps {
  onPrefectureClick?: (prefectureName: string) => void
  selectedPrefecture?: string
  instructorCounts?: Record<string, number>
}

export default function JapanMap({
  onPrefectureClick,
  selectedPrefecture,
  instructorCounts = {},
}: JapanMapProps) {
  const [tooltipContent, setTooltipContent] = useState('')
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  const handleMouseEnter = (geo: any, event: React.MouseEvent) => {
    const prefName = geo.properties.nam_ja || geo.properties.name_ja || geo.properties.name
    setTooltipContent(prefName)
    setTooltipPosition({ x: event.clientX, y: event.clientY })
  }

  const handleMouseLeave = () => {
    setTooltipContent('')
  }

  const handleClick = (geo: any) => {
    const prefName = geo.properties.nam_ja || geo.properties.name_ja || geo.properties.name
    if (onPrefectureClick && prefName) {
      onPrefectureClick(prefName)
    }
  }

  const getFillColor = (geo: any) => {
    const prefName = geo.properties.nam_ja || geo.properties.name_ja || geo.properties.name

    if (prefName === selectedPrefecture) {
      return '#ec4899' // pink-500 for selected
    }

    const count = instructorCounts[prefName] || 0
    if (count > 0) {
      return '#fda4af' // pink-300 for prefectures with instructors
    }

    return '#e5e7eb' // gray-200 for prefectures without instructors
  }

  return (
    <div className="relative w-full h-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1400,
          center: [138, 38],
        }}
        width={800}
        height={600}
        className="w-full h-auto"
      >
        <ZoomableGroup center={[138, 38]} zoom={1}>
          <Geographies geography="/data/japan-prefectures.json">
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={(event) => handleMouseEnter(geo, event)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(geo)}
                  style={{
                    default: {
                      fill: getFillColor(geo),
                      stroke: '#ffffff',
                      strokeWidth: 0.75,
                      outline: 'none',
                    },
                    hover: {
                      fill: '#f472b6', // pink-400
                      stroke: '#ffffff',
                      strokeWidth: 1,
                      outline: 'none',
                      cursor: 'pointer',
                    },
                    pressed: {
                      fill: '#ec4899', // pink-500
                      stroke: '#ffffff',
                      strokeWidth: 1,
                      outline: 'none',
                    },
                  }}
                />
              ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      {tooltipContent && (
        <div
          className="fixed z-50 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm pointer-events-none"
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y + 10}px`,
          }}
        >
          {tooltipContent}
          {instructorCounts[tooltipContent] && (
            <span className="ml-2 text-pink-300">
              ({instructorCounts[tooltipContent]}名)
            </span>
          )}
        </div>
      )}
    </div>
  )
}
