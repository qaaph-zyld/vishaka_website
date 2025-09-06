import { BirthChart, PlanetPosition, KundliData } from './kundli-engine'

interface ReportSection {
  title: string
  content: string
  importance: 'high' | 'medium' | 'low'
}

interface KundliReport {
  summary: string
  sections: ReportSection[]
  recommendations: string[]
}

// Vedic astrology interpretations and descriptions
const PLANETARY_MEANINGS = {
  'Sun': {
    naturalSignificance: 'Soul, ego, father, authority, vitality, self-expression',
    generalInfluence: 'Represents the core self, leadership qualities, and life force. Strong Sun placement indicates confidence and leadership potential.',
    challenges: 'Weak Sun may indicate low self-esteem, difficulties with authority figures, or health issues related to vitality.'
  },
  'Moon': {
    naturalSignificance: 'Mind, emotions, mother, intuition, nurturing, public',
    generalInfluence: 'Governs emotional nature, intuition, and subconscious patterns. Strong Moon indicates emotional stability and strong intuition.',
    challenges: 'Afflicted Moon may lead to emotional instability, anxiety, or difficulties in relationships with mother figures.'
  },
  'Mars': {
    naturalSignificance: 'Energy, courage, action, conflict, siblings, land',
    generalInfluence: 'Represents drive, ambition, and physical energy. Well-placed Mars gives courage and initiative.',
    challenges: 'Difficult Mars placement may indicate aggression, impulsiveness, or conflicts with siblings.'
  },
  'Mercury': {
    naturalSignificance: 'Intelligence, communication, learning, business, skills',
    generalInfluence: 'Rules intellect, communication abilities, and learning capacity. Strong Mercury indicates analytical mind and good communication skills.',
    challenges: 'Weak Mercury may lead to learning difficulties, communication problems, or nervousness.'
  },
  'Jupiter': {
    naturalSignificance: 'Wisdom, expansion, fortune, teacher, children, spirituality',
    generalInfluence: 'Represents growth, wisdom, and prosperity. Well-placed Jupiter brings luck, wisdom, and spiritual inclination.',
    challenges: 'Afflicted Jupiter may indicate over-optimism, lack of discipline, or spiritual confusion.'
  },
  'Venus': {
    naturalSignificance: 'Love, beauty, relationships, arts, luxury, spouse',
    generalInfluence: 'Governs love, relationships, and aesthetic sense. Strong Venus indicates harmonious relationships and artistic abilities.',
    challenges: 'Difficult Venus placement may lead to relationship problems, indulgence, or lack of emotional fulfillment.'
  },
  'Saturn': {
    naturalSignificance: 'Discipline, karma, limitations, longevity, service',
    generalInfluence: 'Represents discipline, responsibility, and karmic lessons. Well-placed Saturn gives patience and perseverance.',
    challenges: 'Afflicted Saturn may indicate delays, restrictions, or feelings of limitation and depression.'
  },
  'Rahu': {
    naturalSignificance: 'Material desires, illusion, foreign lands, technology, obsession',
    generalInfluence: 'Represents worldly desires and material ambitions. Can give success in unconventional fields.',
    challenges: 'May lead to obsession, confusion, or involvement with questionable activities.'
  },
  'Ketu': {
    naturalSignificance: 'Spirituality, detachment, liberation, past life, occult',
    generalInfluence: 'Represents spiritual liberation and detachment. Can give spiritual insights and psychic abilities.',
    challenges: 'May lead to confusion, lack of direction, or difficulty in material world integration.'
  }
}

const RASHI_MEANINGS = {
  'Aries': 'Initiative, courage, pioneering spirit, leadership',
  'Taurus': 'Stability, patience, practicality, appreciation of beauty',
  'Gemini': 'Communication, adaptability, intellect, versatility',
  'Cancer': 'Nurturing, emotional sensitivity, protection, intuition',
  'Leo': 'Creativity, self-expression, leadership, generosity',
  'Virgo': 'Analytical ability, service, attention to detail, healing',
  'Libra': 'Balance, harmony, relationships, justice',
  'Scorpio': 'Transformation, intensity, research, occult knowledge',
  'Sagittarius': 'Wisdom, expansion, philosophy, teaching',
  'Capricorn': 'Discipline, structure, ambition, responsibility',
  'Aquarius': 'Innovation, humanitarianism, independence, originality',
  'Pisces': 'Spirituality, compassion, imagination, artistic ability'
}

const NAKSHATRA_MEANINGS = {
  'Ashwini': 'Speed, healing, initiation, new beginnings',
  'Bharani': 'Struggle, restraint, transformation, death and rebirth',
  'Krittika': 'Fire, purification, criticism, protection',
  'Rohini': 'Growth, creativity, fertility, beauty',
  'Mrigashira': 'Searching, curiosity, gentleness, healing',
  'Ardra': 'Tears, destruction, renewal, intense emotions',
  'Punarvasu': 'Renewal, return, prosperity, abundance',
  'Pushya': 'Nourishment, spiritual growth, discipline, service',
  'Ashlesha': 'Entanglement, kundalini, occult knowledge, transformation',
  'Magha': 'Power, authority, tradition, ancestral connections',
  'Purva Phalguni': 'Creativity, procreation, luxury, enjoyment',
  'Uttara Phalguni': 'Marriage, partnerships, responsibility, healing',
  'Hasta': 'Skill, craftsmanship, healing, dexterity',
  'Chitra': 'Artistry, beauty, illusion, magic',
  'Swati': 'Independence, flexibility, movement, commerce',
  'Vishakha': 'Focus, determination, achievement, spiritual growth',
  'Anuradha': 'Devotion, friendship, balance, spiritual discipline',
  'Jyeshtha': 'Power, protection, courage, wisdom',
  'Mula': 'Roots, destruction, transformation, spiritual seeking',
  'Purva Ashadha': 'Invincibility, early victory, purification',
  'Uttara Ashadha': 'Universal values, leadership, integrity',
  'Shravana': 'Learning, listening, wisdom, tradition',
  'Dhanishta': 'Wealth, fame, music, organization',
  'Shatabhisha': 'Healing, mysticism, isolation, unconventional thinking',
  'Purva Bhadrapada': 'Spiritual fire, austerities, transformation',
  'Uttara Bhadrapada': 'Wisdom, universal knowledge, stability',
  'Revati': 'Nourishment, prosperity, completion, spiritual liberation'
}

function generatePlanetAnalysis(planet: PlanetPosition, rashiLord: string): string {
  const meanings = PLANETARY_MEANINGS[planet.graha as keyof typeof PLANETARY_MEANINGS]
  const rashiMeaning = RASHI_MEANINGS[planet.rashi as keyof typeof RASHI_MEANINGS]
  const nakshatraMeaning = NAKSHATRA_MEANINGS[planet.nakshatra as keyof typeof NAKSHATRA_MEANINGS]
  
  let analysis = `**${planet.graha} in ${planet.rashi}**\n\n`
  analysis += `**Natural Significance:** ${meanings.naturalSignificance}\n\n`
  analysis += `**House Influence:** ${planet.graha} in ${planet.rashi} combines the energy of ${meanings.generalInfluence.toLowerCase()} with ${rashiMeaning.toLowerCase()}. `
  
  if (planet.isRetrograde) {
    analysis += `Since ${planet.graha} is retrograde, its energy is internalized and may manifest differently than usual. `
  }
  
  analysis += `\n**Nakshatra Influence:** Born in ${planet.nakshatra} nakshatra, which indicates ${nakshatraMeaning.toLowerCase()}. `
  
  // Add specific interpretations based on planet and rashi combinations
  if (planet.graha === 'Sun' && planet.rashi === 'Aries') {
    analysis += `This is an exalted position for the Sun, indicating strong leadership abilities and confidence.`
  } else if (planet.graha === 'Moon' && planet.rashi === 'Taurus') {
    analysis += `This is an exalted position for the Moon, suggesting emotional stability and strong intuition.`
  } else if (planet.graha === 'Jupiter' && planet.rashi === 'Cancer') {
    analysis += `This is an exalted position for Jupiter, indicating wisdom, spiritual growth, and prosperity.`
  }
  
  analysis += `\n\n**Potential Strengths:** ${meanings.generalInfluence}\n`
  analysis += `**Areas for Growth:** ${meanings.challenges}`
  
  return analysis
}

function generateHouseAnalysis(birthChart: BirthChart): string {
  const rashis = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces']
  const houseSignificators = [
    'Self, personality, physical body, appearance',
    'Wealth, family, speech, accumulated resources',
    'Courage, siblings, communication, short travels',
    'Home, mother, emotions, property, vehicles',
    'Children, creativity, intelligence, romance',
    'Enemies, health, service, competition',
    'Partnership, spouse, business, relationships',
    'Longevity, inheritance, occult, transformation',
    'Fortune, father, higher knowledge, spirituality',
    'Career, status, authority, achievements',
    'Gains, income, elder siblings, aspirations',
    'Losses, expenses, foreign travel, liberation'
  ]
  
  let analysis = '**House Analysis (Whole Sign System)**\n\n'
  
  rashis.forEach((rashi, index) => {
    const houseNumber = index + 1
    const rashiData = birthChart[rashi]
    const planets = rashiData?.signs || []
    
    analysis += `### House ${houseNumber} (${rashiData.rashi})\n`
    analysis += `**Significator:** ${houseSignificators[index]}\n`
    
    if (planets.length > 0) {
      analysis += `**Planets in this house:** ${planets.map(p => p.graha).join(', ')}\n`
      
      planets.forEach(planet => {
        const meanings = PLANETARY_MEANINGS[planet.graha as keyof typeof PLANETARY_MEANINGS]
        analysis += `- ${planet.graha} influences this area of life through ${meanings.naturalSignificance.toLowerCase()}\n`
      })
    } else {
      analysis += `**No planets in this house** - This house operates primarily through its natural ruler and any aspects it receives.\n`
    }
    
    analysis += '\n'
  })
  
  return analysis
}

function generateOverallSummary(birthChart: BirthChart): string {
  const planets = Object.values(birthChart.meta)
  const rashis = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces']
  
  // Count planets in elements
  const elementCounts = { fire: 0, earth: 0, air: 0, water: 0 }
  const modeCounts = { cardinal: 0, fixed: 0, mutable: 0 }
  
  planets.forEach(planet => {
    const rashiIndex = rashis.indexOf(planet.rashi.toLowerCase())
    if (rashiIndex !== -1) {
      // Element classification
      if ([0, 3, 6, 9].includes(rashiIndex)) elementCounts.fire++
      else if ([1, 4, 7, 10].includes(rashiIndex)) elementCounts.earth++
      else if ([2, 5, 8, 11].includes(rashiIndex)) elementCounts.air++
      else elementCounts.water++
      
      // Mode classification
      if ([0, 4, 8].includes(rashiIndex)) modeCounts.cardinal++
      else if ([1, 5, 9].includes(rashiIndex)) modeCounts.fixed++
      else modeCounts.mutable++
    }
  })
  
  let summary = '**Overall Life Pattern Analysis**\n\n'
  
  // Dominant element
  const dominantElement = Object.entries(elementCounts).reduce((a, b) => elementCounts[a[0] as keyof typeof elementCounts] > elementCounts[b[0] as keyof typeof elementCounts] ? a : b)[0]
  summary += `**Dominant Element:** ${dominantElement.charAt(0).toUpperCase() + dominantElement.slice(1)} - `
  
  switch (dominantElement) {
    case 'fire':
      summary += `You have a strong fire element in your chart, indicating enthusiasm, leadership qualities, and a dynamic approach to life. You are likely to be action-oriented and passionate about your pursuits.\n\n`
      break
    case 'earth':
      summary += `Your chart shows a strong earth element, suggesting practicality, stability, and a grounded approach to life. You are likely to be reliable, hardworking, and focused on tangible results.\n\n`
      break
    case 'air':
      summary += `Air is dominant in your chart, indicating intellectual curiosity, communication skills, and social adaptability. You are likely to be mentally active and enjoy learning and sharing ideas.\n\n`
      break
    case 'water':
      summary += `Your chart emphasizes the water element, suggesting emotional sensitivity, intuition, and nurturing qualities. You are likely to be empathetic, imaginative, and deeply connected to your feelings.\n\n`
      break
  }
  
  // Dominant mode
  const dominantMode = Object.entries(modeCounts).reduce((a, b) => modeCounts[a[0] as keyof typeof modeCounts] > modeCounts[b[0] as keyof typeof modeCounts] ? a : b)[0]
  summary += `**Dominant Mode:** ${dominantMode.charAt(0).toUpperCase() + dominantMode.slice(1)} - `
  
  switch (dominantMode) {
    case 'cardinal':
      summary += `You show strong cardinal energy, indicating initiative, leadership, and the ability to start new projects. You are likely to be proactive and comfortable taking charge.\n\n`
      break
    case 'fixed':
      summary += `Fixed energy is prominent in your chart, suggesting determination, persistence, and stability. You are likely to be reliable and focused on maintaining what you value.\n\n`
      break
    case 'mutable':
      summary += `Your chart shows strong mutable energy, indicating adaptability, flexibility, and versatility. You are likely to be resourceful and comfortable with change.\n\n`
      break
  }
  
  // Lagna (Ascendant) analysis - assuming first house has significance
  const lagnaRashi = birthChart.aries?.rashi || 'Aries'
  summary += `**Ascendant Influence:** With ${lagnaRashi} rising, you approach life with ${RASHI_MEANINGS[lagnaRashi as keyof typeof RASHI_MEANINGS].toLowerCase()}. This colors your entire personality and life approach.\n\n`
  
  return summary
}

function generateRecommendations(birthChart: BirthChart): string[] {
  const planets = Object.values(birthChart.meta)
  const recommendations: string[] = []
  
  // General recommendations based on planetary positions
  const hasBenefics = planets.some(p => ['Jupiter', 'Venus', 'Mercury'].includes(p.graha))
  const hasMalefics = planets.some(p => ['Saturn', 'Mars', 'Rahu', 'Ketu'].includes(p.graha))
  
  if (hasBenefics) {
    recommendations.push('Focus on developing your natural talents and abilities indicated by benefic planets in your chart.')
  }
  
  if (hasMalefics) {
    recommendations.push('Work consciously with challenging energies through spiritual practices, discipline, and self-awareness.')
  }
  
  // Check for specific combinations
  const jupiterPosition = planets.find(p => p.graha === 'Jupiter')
  if (jupiterPosition && ['Cancer', 'Sagittarius', 'Pisces'].includes(jupiterPosition.rashi)) {
    recommendations.push('You have strong spiritual potential. Consider regular meditation, study of scriptures, or service activities.')
  }
  
  const saturnPosition = planets.find(p => p.graha === 'Saturn')
  if (saturnPosition) {
    recommendations.push('Embrace discipline and patience in your endeavors. Saturn teaches through time and consistent effort.')
  }
  
  // General life recommendations
  recommendations.push('Regular self-reflection and meditation can help you understand and work with your planetary energies.')
  recommendations.push('Consider consulting with experienced Vedic astrologers for personalized guidance and timing of important life events.')
  recommendations.push('Use this knowledge for self-improvement and helping others, rather than for fatalistic predictions.')
  
  return recommendations
}

export function generateKundliReport(kundliData: KundliData): KundliReport {
  const { birthChart, navamsaChart, birthData } = kundliData
  
  const sections: ReportSection[] = []
  
  // Overall Summary
  sections.push({
    title: 'Life Overview and Personality Analysis',
    content: generateOverallSummary(birthChart),
    importance: 'high'
  })
  
  // Planet-wise Analysis
  const planets = Object.values(birthChart.meta)
  const planetAnalysis = planets.map(planet => 
    generatePlanetAnalysis(planet, birthChart[planet.rashi.toLowerCase()]?.rashi || planet.rashi)
  ).join('\n\n')
  
  sections.push({
    title: 'Planetary Positions and Influences',
    content: planetAnalysis,
    importance: 'high'
  })
  
  // House Analysis
  sections.push({
    title: 'House Analysis and Life Areas',
    content: generateHouseAnalysis(birthChart),
    importance: 'high'
  })
  
  // Navamsa Chart Analysis
  sections.push({
    title: 'Navamsa Chart (D-9) - Marriage and Destiny',
    content: 'The Navamsa chart, also known as the D-9 chart, is crucial for understanding marriage, relationships, and overall destiny. It shows the true strength of planets and indicates the quality of married life and spiritual evolution. A strong Navamsa chart often indicates a harmonious married life and spiritual growth.',
    importance: 'medium'
  })
  
  const recommendations = generateRecommendations(birthChart)
  
  return {
    summary: `This Vedic astrology report is based on your birth details: ${birthData.dateString} at ${birthData.timeString} in ${birthData.placeName}. The analysis uses the whole sign house system and sidereal zodiac with Lahiri Ayanamsa, providing insights into your personality, life patterns, and potential areas for growth.`,
    sections,
    recommendations
  }
}