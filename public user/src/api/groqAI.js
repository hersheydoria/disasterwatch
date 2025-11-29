// Groq AI Service - Using Llama model for public user safety recommendations
// API Documentation: https://console.groq.com/docs/api-reference

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const DEFAULT_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct'
const FALLBACK_MODEL = 'llama-3.3-70b-versatile'

// Caraga Region geographic and hazard data for location-specific recommendations
const CARAGA_LOCATION_DATA = {
  'Agusan del Norte': {
    terrain: 'Mountainous with river valleys, prone to flooding along Agusan River',
    faultLines: 'Near Philippine Fault Zone, moderate seismic risk',
    commonHazards: ['Flooding from Agusan River', 'Landslides in mountainous areas', 'Liquefaction in low-lying areas'],
    emergencyContacts: {
      pdrrmo: '(085) 342-5068',
      hospital: 'Manuel J. Santos Hospital - (085) 225-4631'
    },
    cities: {
      'Butuan City': {
        characteristics: 'Highly urbanized city, regional center, along Agusan River delta',
        specificHazards: ['Urban flooding', 'Building collapse risk in old structures', 'Traffic congestion during evacuation'],
        keyLandmarks: ['Robinsons Place Butuan', 'Butuan City Hall', 'Father Saturnino Urios University'],
        evacuationNotes: 'Head to higher ground areas like Libertad or designated evacuation centers'
      },
      'Cabadbaran City': {
        characteristics: 'Coastal city with fishing communities',
        specificHazards: ['Coastal flooding', 'Tsunami risk', 'Storm surge'],
        keyLandmarks: ['Cabadbaran City Hall', 'Public Market', 'Cabadbaran Port'],
        evacuationNotes: 'Move inland and to higher elevations away from coast'
      },
      'Nasipit': {
        characteristics: 'Port town with industrial areas',
        specificHazards: ['Industrial accidents', 'Coastal hazards', 'Port area congestion'],
        keyLandmarks: ['Nasipit Port', 'Municipal Hall', 'Nasipit National High School'],
        evacuationNotes: 'Avoid port area during emergencies, head to inland evacuation centers'
      }
    }
  },
  'Agusan del Sur': {
    terrain: 'Heavily forested with Agusan Marsh, mountainous eastern portion',
    faultLines: 'Philippine Fault Zone traverses the province',
    commonHazards: ['Flash floods', 'Landslides', 'River flooding from Agusan River'],
    emergencyContacts: {
      pdrrmo: '(085) 839-3280',
      hospital: 'Agusan del Sur Provincial Hospital'
    },
    cities: {
      'Bayugan City': {
        characteristics: 'Landlocked city, commercial center of the province',
        specificHazards: ['Flash floods from mountains', 'Road blockages during disasters'],
        keyLandmarks: ['Bayugan City Hall', 'Bayugan Public Market', 'AMA Computer College'],
        evacuationNotes: 'Use main highways for evacuation, avoid riverside areas'
      },
      'Prosperidad': {
        characteristics: 'Provincial capital, government center',
        specificHazards: ['Flooding', 'Limited road access during disasters'],
        keyLandmarks: ['Provincial Capitol', 'Prosperidad Public Market'],
        evacuationNotes: 'Head to provincial government evacuation centers'
      },
      'San Francisco': {
        characteristics: 'Near Agusan Marsh wildlife sanctuary',
        specificHazards: ['Marsh flooding', 'Limited evacuation routes'],
        keyLandmarks: ['Municipal Hall', 'San Francisco Central School'],
        evacuationNotes: 'Evacuate early due to limited road access'
      }
    }
  },
  'Surigao del Norte': {
    terrain: 'Coastal with islands, mountainous interior',
    faultLines: 'Philippine Fault Zone, high seismic activity (2017 earthquake epicenter)',
    commonHazards: ['Earthquakes (historically significant)', 'Tsunami', 'Coastal flooding', 'Landslides'],
    emergencyContacts: {
      pdrrmo: '(086) 826-2994',
      hospital: 'Caraga Regional Hospital - (086) 826-2083'
    },
    cities: {
      'Surigao City': {
        characteristics: 'Provincial capital, major port city, heavily affected by 2017 earthquake',
        specificHazards: ['Earthquake damage to old structures', 'Tsunami risk', 'Liquefaction'],
        keyLandmarks: ['Surigao City Hall', 'Luneta Park', 'Surigao Port', 'Gateway Mall'],
        evacuationNotes: 'Move to designated evacuation centers on higher ground, avoid coastal areas'
      },
      'General Luna': {
        characteristics: 'Tourist destination (Siargao Island), surfing capital',
        specificHazards: ['Tsunami', 'Storm surge', 'Limited medical facilities'],
        keyLandmarks: ['Cloud 9 Surfing Area', 'General Luna Municipal Hall'],
        evacuationNotes: 'Head to higher ground immediately, limited evacuation options on island'
      },
      'Dapa': {
        characteristics: 'Gateway to Siargao Island, port town',
        specificHazards: ['Coastal flooding', 'Ferry disruptions during disasters'],
        keyLandmarks: ['Dapa Port', 'Municipal Hall'],
        evacuationNotes: 'Evacuate to inland areas, ferry services may be suspended'
      }
    }
  },
  'Surigao del Sur': {
    terrain: 'Mountainous with narrow coastal plains, mining areas',
    faultLines: 'Near Philippine Fault Zone',
    commonHazards: ['Landslides (especially in mining areas)', 'Coastal flooding', 'Flash floods'],
    emergencyContacts: {
      pdrrmo: '(086) 211-3706',
      hospital: 'Adela Serra Ty Memorial Medical Center'
    },
    cities: {
      'Tandag City': {
        characteristics: 'Provincial capital, coastal city',
        specificHazards: ['Coastal flooding', 'Storm surge', 'Building damage'],
        keyLandmarks: ['Tandag City Hall', 'Provincial Capitol', 'Tandag Public Market'],
        evacuationNotes: 'Move inland to evacuation centers, avoid coastal barangays'
      },
      'Bislig City': {
        characteristics: 'Paper mill city, industrial area',
        specificHazards: ['Industrial hazards', 'Flash floods', 'Coastal flooding'],
        keyLandmarks: ['PICOP Paper Mill', 'Bislig City Hall', 'Tinuy-an Falls area'],
        evacuationNotes: 'Evacuate away from industrial areas and coastal zones'
      },
      'Hinatuan': {
        characteristics: 'Known for Enchanted River, tourism area',
        specificHazards: ['Flash floods', 'Coastal hazards', 'Limited road access'],
        keyLandmarks: ['Enchanted River', 'Municipal Hall'],
        evacuationNotes: 'Use main highway for evacuation, avoid river areas'
      }
    }
  },
  'Dinagat Islands': {
    terrain: 'Island province, mountainous with mining areas',
    faultLines: 'Moderate seismic risk',
    commonHazards: ['Typhoons', 'Storm surge', 'Landslides in mining areas', 'Limited evacuation options'],
    emergencyContacts: {
      pdrrmo: '(086) 826-8112',
      hospital: 'Dinagat District Hospital'
    },
    cities: {
      'San Jose': {
        characteristics: 'Provincial capital, main town',
        specificHazards: ['Storm surge', 'Limited medical facilities', 'Isolation during disasters'],
        keyLandmarks: ['Provincial Capitol', 'San Jose Port'],
        evacuationNotes: 'Head to evacuation centers on higher ground, boat evacuation may be needed'
      },
      'Dinagat': {
        characteristics: 'Coastal municipality',
        specificHazards: ['Coastal flooding', 'Isolation', 'Limited resources'],
        keyLandmarks: ['Municipal Hall', 'Public Market'],
        evacuationNotes: 'Evacuate to designated centers early, coordinate with barangay officials'
      }
    }
  }
}

// Get location-specific context for AI prompts
function getLocationContext(province, city) {
  const provinceData = CARAGA_LOCATION_DATA[province] || {}
  const cityData = provinceData.cities?.[city] || {}
  
  return {
    terrain: provinceData.terrain || 'Varied terrain in Caraga Region',
    faultLines: provinceData.faultLines || 'Near Philippine Fault Zone',
    commonHazards: provinceData.commonHazards || ['Earthquakes', 'Flooding', 'Landslides'],
    emergencyContacts: provinceData.emergencyContacts || { pdrrmo: '911', hospital: 'Nearest hospital' },
    cityCharacteristics: cityData.characteristics || 'Urban/rural area',
    specificHazards: cityData.specificHazards || [],
    keyLandmarks: cityData.keyLandmarks || [],
    evacuationNotes: cityData.evacuationNotes || 'Follow local authority guidance'
  }
}

// Get API key from environment
function getApiKey() {
  return import.meta.env.VITE_GROQ_API_KEY
}

/**
 * Generate AI safety recommendations based on location and earthquake data
 * @param {Object} data - Contains location, shelters, earthquakes data
 * @returns {Promise<Object>} - AI generated safety recommendations
 */
export async function generateSafetyRecommendations(data) {
  const apiKey = getApiKey()
  
  if (!apiKey) {
    throw new Error('GROQ API key not configured. Please add VITE_GROQ_API_KEY to your .env file.')
  }

  const { 
    location = {}, 
    shelters = [], 
    earthquakes = [], 
    currentRisk = {},
    evacuationRoutes = []
  } = data

  // Get location-specific context
  const locationContext = getLocationContext(location.province, location.city)

  // Build context for AI
  const locationInfo = `${location.city || 'Unknown City'}, ${location.province || 'Unknown Province'}${location.barangay ? ', Barangay ' + location.barangay : ''}`
  
  const shelterSummary = shelters.slice(0, 5).map(s => 
    `- ${s.name}: ${s.capacity} capacity, ${s.distance} away, ${s.walkTime}`
  ).join('\n')

  const earthquakeSummary = earthquakes.slice(0, 5).map(eq => 
    `- Magnitude ${eq.magnitude || 'N/A'} at ${eq.location || 'nearby'}`
  ).join('\n')

  const riskInfo = `Current Risk Level: ${currentRisk.level || 'Unknown'}, Seismic Activity: ${currentRisk.seismicActivity || 'Unknown'}`

  // Location-specific hazard information
  const locationHazards = `
## Location-Specific Information for ${location.city}, ${location.province}
- Terrain: ${locationContext.terrain}
- Fault Line Proximity: ${locationContext.faultLines}
- City Characteristics: ${locationContext.cityCharacteristics}
- Common Hazards in Area: ${locationContext.commonHazards.join(', ')}
- Specific Local Hazards: ${locationContext.specificHazards.join(', ') || 'Standard earthquake risks'}
- Key Landmarks: ${locationContext.keyLandmarks.join(', ') || 'Local landmarks'}
- Evacuation Notes: ${locationContext.evacuationNotes}
- Local Emergency Contacts: PDRRMO: ${locationContext.emergencyContacts.pdrrmo}, Hospital: ${locationContext.emergencyContacts.hospital}`

  const systemPrompt = `You are an AI disaster safety advisor specializing in the Caraga Region, Philippines. 
You have detailed knowledge of each province and city/municipality in Caraga, including:
- Local terrain and geography
- Proximity to fault lines (especially the Philippine Fault Zone)
- Historical earthquake data (including the 2017 Surigao earthquake)
- Local infrastructure and road networks
- Common hazards specific to each area

Your role is to provide HIGHLY PERSONALIZED earthquake safety recommendations based on the user's SPECIFIC location.
Tailor all advice to the particular characteristics and risks of their city/municipality.

Always respond in JSON format with the following structure:
{
  "riskAssessment": {
    "level": "HIGH|MODERATE|LOW",
    "description": "string - specific to this location",
    "immediateActions": ["string - location-specific actions"]
  },
  "shelterRecommendations": [
    { "name": "string", "reason": "string - why this shelter is good for this area", "priority": 1-5, "safetyScore": 1-100, "distance": "string", "capacity": "string" }
  ],
  "evacuationAdvice": {
    "shouldEvacuate": boolean,
    "urgency": "immediate|soon|monitor",
    "bestRoute": "string - specific route based on local geography",
    "alternativeRoute": "string",
    "areasToAvoid": ["string - specific local areas to avoid"],
    "safetyTips": ["string"]
  },
  "preparednessChecklist": [
    { "item": "string", "importance": "critical|important|recommended", "reason": "string - why important for this location" }
  ],
  "localizedTips": ["string - tips specific to this city/province"],
  "emergencyContacts": {
    "pdrrmo": "string - local PDRRMO number",
    "hospital": "string - nearest hospital",
    "hotline": "911"
  },
  "nearbyLandmarks": ["string - landmarks to use for navigation"],
  "summary": "string - personalized summary for this location"
}`

  const userPrompt = `Generate LOCATION-SPECIFIC earthquake safety recommendations for a citizen located in:

## Exact Location
${locationInfo}

${locationHazards}

## Current Risk Status
${riskInfo}
Fault Line Distance: ${currentRisk.faultLineDistance || 'Unknown'}
Building Density: ${currentRisk.buildingDensity || 'Unknown'}

## Nearby Evacuation Shelters
${shelterSummary || 'No shelter data available - recommend based on local knowledge'}

## Recent Seismic Activity
${earthquakeSummary || 'No recent earthquake data'}

IMPORTANT: Your recommendations must be SPECIFIC to ${location.city}, ${location.province}. 
Consider:
1. The unique terrain and geography of this specific location
2. Local road networks and evacuation routes known in this area
3. Historical earthquake patterns in ${location.province}
4. Specific buildings, landmarks, and infrastructure in ${location.city}
5. Local emergency services and hospitals
6. Areas in this city that are particularly vulnerable

Do NOT give generic advice. Every recommendation should mention specific local details.
Respond ONLY with valid JSON.`

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt + `\n\n[Request ID: ${Date.now()}-${Math.random().toString(36).substr(2, 9)}]` }
        ],
        temperature: 0.7,
        max_tokens: 2500,
        top_p: 1,
        stream: false
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      // Try fallback model if primary fails
      if (response.status === 404 || response.status === 400) {
        console.warn('Primary model failed, trying fallback model...')
        return await generateWithFallbackModel(systemPrompt, userPrompt, apiKey)
      }
      
      throw new Error(errorData.error?.message || `Groq API error: ${response.status}`)
    }

    const result = await response.json()
    const content = result.choices?.[0]?.message?.content

    if (!content) {
      throw new Error('No response content from AI')
    }

    // Parse JSON response
    try {
      let cleanContent = content.trim()
      if (cleanContent.startsWith('```json')) cleanContent = cleanContent.slice(7)
      if (cleanContent.startsWith('```')) cleanContent = cleanContent.slice(3)
      if (cleanContent.endsWith('```')) cleanContent = cleanContent.slice(0, -3)
      
      return JSON.parse(cleanContent.trim())
    } catch (parseError) {
      console.error('Failed to parse AI response:', content)
      return createFallbackResponse(content, location)
    }
  } catch (error) {
    console.error('Groq AI Error:', error)
    throw error
  }
}

/**
 * Fallback function using alternative model
 */
async function generateWithFallbackModel(systemPrompt, userPrompt, apiKey) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: FALLBACK_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2500,
      top_p: 1,
      stream: false
    })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error?.message || `Groq API error: ${response.status}`)
  }

  const result = await response.json()
  const content = result.choices?.[0]?.message?.content

  if (!content) {
    throw new Error('No response content from AI')
  }

  let cleanContent = content.trim()
  if (cleanContent.startsWith('```json')) cleanContent = cleanContent.slice(7)
  if (cleanContent.startsWith('```')) cleanContent = cleanContent.slice(3)
  if (cleanContent.endsWith('```')) cleanContent = cleanContent.slice(0, -3)
  
  return JSON.parse(cleanContent.trim())
}

/**
 * Create a fallback response when JSON parsing fails
 */
function createFallbackResponse(rawContent, location) {
  return {
    riskAssessment: {
      level: 'MODERATE',
      description: rawContent.substring(0, 300),
      immediateActions: ['Stay alert', 'Know your nearest evacuation shelter', 'Keep emergency kit ready']
    },
    shelterRecommendations: [],
    evacuationAdvice: {
      shouldEvacuate: false,
      urgency: 'monitor',
      bestRoute: 'Follow local authority guidance',
      safetyTips: ['Stay informed through official channels']
    },
    preparednessChecklist: [
      { item: 'Emergency water supply', importance: 'critical', reason: 'Essential for survival' },
      { item: 'First aid kit', importance: 'critical', reason: 'Medical emergencies' },
      { item: 'Flashlight and batteries', importance: 'important', reason: 'Power outages' }
    ],
    personalizedTips: ['Follow Drop, Cover, and Hold during earthquakes'],
    emergencyContacts: {
      primary: 'Emergency Hotline: 911',
      secondary: 'Philippine Red Cross: 143'
    },
    summary: 'AI analysis completed. Please review recommendations carefully.',
    rawResponse: rawContent
  }
}

/**
 * Generate quick safety tip for current conditions
 * @param {Object} context - Current situation context
 * @returns {Promise<string>} - Quick safety tip
 */
export async function generateQuickSafetyTip(context) {
  const apiKey = getApiKey()
  
  if (!apiKey) {
    return 'Stay alert and follow local emergency guidelines.'
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: FALLBACK_MODEL,
        messages: [
          { 
            role: 'system', 
            content: 'You are a disaster safety expert. Provide brief, actionable safety tips (1-2 sentences max) for earthquake preparedness.' 
          },
          { 
            role: 'user', 
            content: `Current situation: ${context.riskLevel || 'moderate'} risk in ${context.location || 'Caraga Region'}. Give one specific safety tip.` 
          }
        ],
        temperature: 0.5,
        max_tokens: 100
      })
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const result = await response.json()
    return result.choices?.[0]?.message?.content || 'Stay safe and follow local emergency guidelines.'
  } catch (error) {
    console.error('Quick tip generation error:', error)
    return 'Remember: Drop, Cover, and Hold during an earthquake.'
  }
}

/**
 * Analyze evacuation route safety
 * @param {Object} routeData - Route information
 * @returns {Promise<Object>} - Route safety analysis
 */
export async function analyzeEvacuationRoute(routeData) {
  const apiKey = getApiKey()
  
  if (!apiKey) {
    return {
      safety: 'unknown',
      score: 50,
      recommendations: ['Unable to analyze - please follow official guidance']
    }
  }

  const { fromLocation, toShelter, currentConditions } = routeData

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: FALLBACK_MODEL,
        messages: [
          { 
            role: 'system', 
            content: 'Analyze evacuation routes and respond in JSON: { "safety": "safe|moderate|risky", "score": 0-100, "hazards": ["string"], "recommendations": ["string"] }' 
          },
          { 
            role: 'user', 
            content: `Analyze route from "${fromLocation}" to shelter "${toShelter}". Conditions: ${currentConditions || 'normal'}. Provide safety assessment.` 
          }
        ],
        temperature: 0.3,
        max_tokens: 400
      })
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const result = await response.json()
    const content = result.choices?.[0]?.message?.content
    
    let cleanContent = content.trim()
    if (cleanContent.startsWith('```json')) cleanContent = cleanContent.slice(7)
    if (cleanContent.startsWith('```')) cleanContent = cleanContent.slice(3)
    if (cleanContent.endsWith('```')) cleanContent = cleanContent.slice(0, -3)
    
    return JSON.parse(cleanContent.trim())
  } catch (error) {
    console.error('Route analysis error:', error)
    return {
      safety: 'moderate',
      score: 60,
      hazards: ['Unable to fully analyze'],
      recommendations: ['Follow main roads', 'Avoid damaged structures']
    }
  }
}

/**
 * Generate AI-powered safety routes to evacuation centers
 * @param {Object} data - Contains location and shelter data
 * @returns {Promise<Object>} - AI generated safety routes
 */
export async function generateSafetyRoutes(data) {
  const apiKey = getApiKey()
  
  if (!apiKey) {
    throw new Error('GROQ API key not configured. Please add VITE_GROQ_API_KEY to your .env file.')
  }

  const { 
    location = {}, 
    shelters = [], 
    currentRisk = {},
    barangay = ''
  } = data

  // Get location-specific context
  const locationContext = getLocationContext(location.province, location.city)

  const locationInfo = `${barangay ? 'Barangay ' + barangay + ', ' : ''}${location.city || 'Unknown City'}, ${location.province || 'Unknown Province'}`
  
  const shelterDetails = shelters.slice(0, 5).map((s, idx) => 
    `${idx + 1}. ${s.name}
   - Address: ${s.address || 'N/A'}
   - Capacity: ${s.capacity || 'Unknown'}
   - Distance: ${s.distance || 'Unknown'}
   - Coordinates: ${s.latitude ? `${s.latitude}, ${s.longitude}` : 'N/A'}`
  ).join('\n\n')

  // Location-specific information for route planning
  const locationSpecificInfo = `
## Location-Specific Context for ${location.city}, ${location.province}
- Terrain: ${locationContext.terrain}
- City Characteristics: ${locationContext.cityCharacteristics}
- Local Hazards to Consider: ${[...locationContext.commonHazards, ...locationContext.specificHazards].join(', ')}
- Key Landmarks for Navigation: ${locationContext.keyLandmarks.join(', ') || 'Use local landmarks'}
- Evacuation Notes: ${locationContext.evacuationNotes}
- Local Emergency Contacts: PDRRMO: ${locationContext.emergencyContacts.pdrrmo}, Hospital: ${locationContext.emergencyContacts.hospital}`

  const systemPrompt = `You are an AI emergency evacuation route advisor specializing in the Caraga Region, Philippines. 
You have detailed knowledge of:
- Local road networks and infrastructure in each city/municipality
- Terrain and geography (coastal areas, rivers, mountains, urban centers)
- Historical disaster patterns and vulnerable areas
- Key landmarks and navigation points
- Local emergency services

Your task is to recommend the SAFEST evacuation routes specific to the user's exact location.
All recommendations must reference actual local roads, landmarks, and areas in ${location.city}, ${location.province}.

Always respond in JSON format:
{
  "recommendedShelter": {
    "name": "string",
    "reason": "string - specific to this location",
    "safetyScore": 1-100,
    "distance": "string",
    "capacity": "string"
  },
  "routes": [
    {
      "shelterName": "string",
      "routeName": "string",
      "description": "string",
      "estimatedTime": "string",
      "distance": "string",
      "safetyLevel": "SAFEST|SAFE|MODERATE|USE_WITH_CAUTION",
      "directions": ["step 1", "step 2", "..."],
      "hazardsToAvoid": ["string"],
      "landmarks": ["string"],
      "tips": ["string"]
    }
  ],
  "generalAdvice": {
    "beforeLeaving": ["string"],
    "duringEvacuation": ["string"],
    "onArrival": ["string"]
  },
  "emergencyAlternatives": {
    "ifMainRouteBlocked": "string",
    "ifShelterFull": "string"
  },
  "importantReminders": ["string"]
}`

  const userPrompt = `Generate LOCATION-SPECIFIC safe evacuation routes for a person located in:
${locationInfo}

${locationSpecificInfo}

## Current Situation
Risk Level: ${currentRisk.level || 'MODERATE'}
Seismic Activity: ${currentRisk.seismicActivity || 'Unknown'}

## Available Evacuation Shelters
${shelterDetails || 'No specific shelter data available - please recommend based on local knowledge of ' + location.city}

IMPORTANT: Generate routes SPECIFIC to ${location.city}, ${location.province}. Include:
1. The most recommended shelter with reasons specific to this location
2. Detailed safe routes using actual local roads and landmarks in ${location.city}
3. Step-by-step directions referencing real places in the area
4. Location-specific hazards to avoid (consider: ${locationContext.specificHazards.join(', ') || 'local terrain hazards'})
5. General evacuation advice tailored to ${location.province}
6. Emergency alternatives if routes are blocked

Reference these local landmarks when possible: ${locationContext.keyLandmarks.join(', ') || 'local landmarks'}

Focus on SAFETY as the top priority. Be specific about:
- Which roads/paths to take in ${location.city}
- Local landmarks to look for
- Areas in ${location.city} to avoid
- What to do based on local terrain (${locationContext.terrain})

Respond ONLY with valid JSON.`

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.6,
        max_tokens: 3000,
        top_p: 1,
        stream: false
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      // Try fallback model if primary fails
      if (response.status === 404 || response.status === 400) {
        console.warn('Primary model failed for routes, trying fallback model...')
        return await generateRoutesWithFallbackModel(systemPrompt, userPrompt, apiKey)
      }
      
      throw new Error(errorData.error?.message || `Groq API error: ${response.status}`)
    }

    const result = await response.json()
    const content = result.choices?.[0]?.message?.content

    if (!content) {
      throw new Error('No response content from AI')
    }

    // Parse JSON response
    try {
      let cleanContent = content.trim()
      if (cleanContent.startsWith('```json')) cleanContent = cleanContent.slice(7)
      if (cleanContent.startsWith('```')) cleanContent = cleanContent.slice(3)
      if (cleanContent.endsWith('```')) cleanContent = cleanContent.slice(0, -3)
      
      return JSON.parse(cleanContent.trim())
    } catch (parseError) {
      console.error('Failed to parse AI route response:', content)
      return createFallbackRouteResponse(shelters, location)
    }
  } catch (error) {
    console.error('Groq AI Route Error:', error)
    throw error
  }
}

/**
 * Fallback function for routes using alternative model
 */
async function generateRoutesWithFallbackModel(systemPrompt, userPrompt, apiKey) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: FALLBACK_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.6,
      max_tokens: 3000,
      top_p: 1,
      stream: false
    })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error?.message || `Groq API error: ${response.status}`)
  }

  const result = await response.json()
  const content = result.choices?.[0]?.message?.content

  if (!content) {
    throw new Error('No response content from AI')
  }

  let cleanContent = content.trim()
  if (cleanContent.startsWith('```json')) cleanContent = cleanContent.slice(7)
  if (cleanContent.startsWith('```')) cleanContent = cleanContent.slice(3)
  if (cleanContent.endsWith('```')) cleanContent = cleanContent.slice(0, -3)
  
  return JSON.parse(cleanContent.trim())
}

/**
 * Create a fallback route response when API fails
 */
function createFallbackRouteResponse(shelters, location) {
  const routes = shelters.slice(0, 3).map((shelter, idx) => ({
    shelterName: shelter.name || `Shelter ${idx + 1}`,
    routeName: `Route ${idx + 1}`,
    description: `Direct route to ${shelter.name || 'evacuation center'}`,
    estimatedTime: `${5 + idx * 3} minutes`,
    distance: shelter.distance || `${0.5 + idx * 0.3} km`,
    safetyLevel: idx === 0 ? 'SAFEST' : idx === 1 ? 'SAFE' : 'MODERATE',
    directions: [
      'Exit your building through the main entrance',
      'Walk towards the main road',
      `Head towards ${shelter.name || 'the evacuation center'}`,
      'Follow evacuation signs if available',
      'Arrive at the shelter and check in with authorities'
    ],
    hazardsToAvoid: [
      'Damaged buildings and falling debris',
      'Downed power lines',
      'Cracked roads or bridges'
    ],
    landmarks: ['Main road intersection', 'Local barangay hall', 'School or church'],
    tips: [
      'Walk, do not run',
      'Stay in open areas away from buildings',
      'Help others if safe to do so'
    ]
  }))

  return {
    recommendedShelter: {
      name: shelters[0]?.name || 'Nearest evacuation center',
      reason: 'Closest shelter with adequate capacity',
      safetyScore: 85
    },
    routes,
    generalAdvice: {
      beforeLeaving: [
        'Turn off gas and electricity if safe',
        'Grab your emergency kit',
        'Wear sturdy shoes'
      ],
      duringEvacuation: [
        'Stay calm and walk carefully',
        'Avoid elevators',
        'Stay away from damaged structures'
      ],
      onArrival: [
        'Register with shelter staff',
        'Report any injuries',
        'Stay until cleared by authorities'
      ]
    },
    emergencyAlternatives: {
      ifMainRouteBlocked: 'Use alternate roads or seek guidance from local authorities',
      ifShelterFull: 'Proceed to the next nearest shelter or contact emergency services'
    },
    importantReminders: [
      'Call 911 for emergencies',
      'Keep your phone charged',
      'Stay with your family or group'
    ]
  }
}

export default {
  generateSafetyRecommendations,
  generateQuickSafetyTip,
  analyzeEvacuationRoute,
  generateSafetyRoutes
}
