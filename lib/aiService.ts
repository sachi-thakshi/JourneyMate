const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY

export interface AIPlaceDetails {
  description: string;
  importance: string;
  howToGo: string;
  bestTime: string;
  budgetLevel: string;
  topActivities: string;
}

export const getPlaceDetails = async (placeName: string): Promise<AIPlaceDetails> => {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a travel expert. Return only pure JSON." },
          {
            role: "user",
            content: `Provide a travel guide for ${placeName} in pure JSON. 
                    Keys: "description", "importance", "howToGo", "bestTime", "budgetLevel", "topActivities".
                    IMPORTANT: All values must be STRINGS. Do not use nested objects or arrays.`
          }
        ],
        response_format: { type: "json_object" }
      })
    })

    const result = await response.json();
    if (result.choices && result.choices[0].message.content) {
      return JSON.parse(result.choices[0].message.content)
    }
    throw new Error("Invalid response format")
  } catch (error) {
    console.error("Service Error:", error)
    return {
      description: `${placeName} is a remarkable destination with a rich history.`,
      importance: "A key landmark that is essential for any traveler.",
      howToGo: "Accessible via local trains and bus routes.",
      bestTime: "March to October",
      budgetLevel: "Moderate",
      topActivities: "Sightseeing, Local Food, Photography"
    }
  }
}