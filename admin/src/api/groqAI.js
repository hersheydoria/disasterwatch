// Groq AI Service - Using Llama model for disaster management recommendations
// API Documentation: https://console.groq.com/docs/api-reference

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const DEFAULT_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct'
const FALLBACK_MODEL = 'llama-3.3-70b-versatile'

// Get API key from environment
function getApiKey() {
  return import.meta.env.VITE_GROQ_API_KEY
}

/**
 * Generate AI recommendations based on shelter and earthquake data
 * @param {Object} data - Contains shelters, earthquakes, and alerts data
 * @returns {Promise<Object>} - AI generated recommendations
 */
export async function generateAIRecommendations(data) {
  const apiKey = getApiKey()
  
  if (!apiKey) {
    throw new Error('GROQ API key not configured. Please add VITE_GROQ_API_KEY to your .env file.')
  }

  const { shelters = [], earthquakes = [], alerts = [], stats = {} } = data

  // Build context for AI
  const shelterSummary = shelters.slice(0, 10).map(s => 
    `- ${s.name}: Status=${s.status}, Capacity=${s.capacity}, Occupancy=${s.current_occupancy || 0}, Location=${s.address || 'N/A'}`
  ).join('\n')

  const earthquakeSummary = earthquakes.slice(0, 5).map(eq => 
    `- Magnitude ${eq.magnitude} at ${eq.latitude}, ${eq.longitude} on ${eq.triggered_at || 'recent'}`
  ).join('\n')

  const alertSummary = alerts.slice(0, 5).map(a => 
    `- ${a.title || 'Alert'}: ${a.message || a.description || 'No details'} (Status: ${a.status})`
  ).join('\n')

  const systemPrompt = `You are an AI disaster management assistant for the Caraga Region in the Philippines. 
Your role is to analyze shelter data, earthquake activity, and alerts to provide actionable safety recommendations.
Always respond in JSON format with the following structure:
{
  "mostRecommendedShelter": { "name": "string", "reason": "string", "region": "string" },
  "mostAffectedArea": { "name": "string", "reason": "string", "riskLevel": "high|medium|low" },
  "accuracyRate": number (0-100),
  "recommendations": [
    { "shelter": "string", "region": "string", "recommendation": "string", "priority": "high|medium|low", "confidence": "string" }
  ],
  "summary": "string"
}`

  const userPrompt = `Analyze the following disaster management data for Caraga Region and provide AI-powered safety recommendations:

## Current Statistics
- Total Shelters: ${stats.totalShelters || 'Unknown'}
- Active Shelters: ${stats.activeShelters || 'Unknown'}
- Full Capacity Shelters: ${stats.fullCapacityShelters || 'Unknown'}
- Under Maintenance: ${stats.maintenanceShelters || 'Unknown'}
- Active Alerts: ${stats.activeAlerts || 'Unknown'}
- Total Evacuees: ${stats.totalEvacuees || 'Unknown'}

## Shelter Data
${shelterSummary || 'No shelter data available'}

## Recent Earthquake Activity
${earthquakeSummary || 'No recent earthquake data'}

## Active Alerts
${alertSummary || 'No active alerts'}

Based on this data, provide:
1. The most recommended shelter for evacuation
2. The most affected area that needs attention
3. Your confidence/accuracy rate for these recommendations
4. 3-5 specific actionable recommendations for shelter management
5. A brief summary of the current situation

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
        temperature: 0.7,
        max_tokens: 2000,
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
      // Clean the response - remove markdown code blocks if present
      let cleanContent = content.trim()
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.slice(7)
      }
      if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.slice(3)
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(0, -3)
      }
      
      return JSON.parse(cleanContent.trim())
    } catch (parseError) {
      console.error('Failed to parse AI response:', content)
      // Return a structured fallback based on the raw response
      return {
        mostRecommendedShelter: { name: 'Analysis in progress', reason: content.substring(0, 200), region: 'Caraga' },
        mostAffectedArea: { name: 'See details', reason: 'AI analysis completed', riskLevel: 'medium' },
        accuracyRate: 75,
        recommendations: [{ shelter: 'General', region: 'Caraga', recommendation: content.substring(0, 300), priority: 'medium', confidence: '75%' }],
        summary: content.substring(0, 500),
        rawResponse: content
      }
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
      max_tokens: 2000,
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

  // Parse JSON response
  let cleanContent = content.trim()
  if (cleanContent.startsWith('```json')) cleanContent = cleanContent.slice(7)
  if (cleanContent.startsWith('```')) cleanContent = cleanContent.slice(3)
  if (cleanContent.endsWith('```')) cleanContent = cleanContent.slice(0, -3)
  
  return JSON.parse(cleanContent.trim())
}

/**
 * Generate a quick safety tip based on current conditions
 * @param {string} context - Brief context about current situation
 * @returns {Promise<string>} - AI generated safety tip
 */
export async function generateQuickSafetyTip(context) {
  const apiKey = getApiKey()
  
  if (!apiKey) {
    throw new Error('GROQ API key not configured')
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
            content: 'You are a disaster safety expert. Provide brief, actionable safety tips (1-2 sentences max).' 
          },
          { 
            role: 'user', 
            content: `Given this situation: ${context}. Provide one quick safety tip.` 
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
    return 'Stay alert and follow official evacuation instructions.'
  }
}

/**
 * Analyze risk level for a specific area
 * @param {Object} areaData - Data about the area including coordinates and recent events
 * @returns {Promise<Object>} - Risk analysis
 */
export async function analyzeAreaRisk(areaData) {
  const apiKey = getApiKey()
  
  if (!apiKey) {
    throw new Error('GROQ API key not configured')
  }

  const { name, latitude, longitude, recentEarthquakes = [], sheltersNearby = [] } = areaData

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
            content: 'You are a seismic risk analyst. Analyze area risk and respond in JSON format: { "riskLevel": "high|medium|low", "score": 0-100, "factors": ["string"], "recommendation": "string" }' 
          },
          { 
            role: 'user', 
            content: `Analyze risk for ${name} at coordinates (${latitude}, ${longitude}). Recent earthquakes: ${recentEarthquakes.length}. Nearby shelters: ${sheltersNearby.length}. Provide risk assessment.` 
          }
        ],
        temperature: 0.3,
        max_tokens: 500
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
    console.error('Risk analysis error:', error)
    return {
      riskLevel: 'unknown',
      score: 50,
      factors: ['Unable to complete analysis'],
      recommendation: 'Please try again later'
    }
  }
}

export default {
  generateAIRecommendations,
  generateQuickSafetyTip,
  analyzeAreaRisk
}
