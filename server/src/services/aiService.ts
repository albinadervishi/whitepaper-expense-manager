import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const VALID_CATEGORIES = [
  "travel",
  "food",
  "supplies",
  "equipment",
  "marketing",
  "subscriptions",
  "services",
  "rentals",
  "utilities",
  "entertainment",
  "other",
] as const;
type ExpenseCategory = (typeof VALID_CATEGORIES)[number];

interface CategorySuggestion {
  category: ExpenseCategory;
  confidence: number;
  reasoning: string;
}

export const aiService = {
  async suggestCategory(description: string): Promise<CategorySuggestion> {
    try {
      if (!description || description.trim().length < 3) {
        return {
          category: "other",
          confidence: 0,
          reasoning: "Description too short to analyze",
        };
      }

      const quickMatch = this.quickCategoryMatch(description);
      if (quickMatch) {
        return quickMatch;
      }

      const prompt = this.buildCategorizationPrompt(description);

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expense categorization assistant. Analyze expense descriptions and suggest the most appropriate category. Be concise and accurate.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 150,
      });

      const response = completion.choices[0]?.message?.content?.trim();

      if (!response) {
        throw new Error("No response from AI");
      }

      return this.parseAIResponse(response);
    } catch (error: any) {
      console.error("AI categorization error:", error.message);

      return {
        category: "other",
        confidence: 0,
        reasoning: "AI service temporarily unavailable",
      };
    }
  },

  buildCategorizationPrompt(description: string): string {
    return `
  Analyze this expense description carefully and categorize it into ONE category.
  
  Description: "${description}"
  
  Available categories:
  - travel: flights, hotels, car rentals, taxi, uber, parking, gas, train tickets
  - food: restaurants, meals, lunch, dinner, breakfast, coffee, snacks, catering
  - supplies: office supplies, paper, pens, notebooks, folders, stationery
  - equipment: computers, laptops, monitors, software, hardware, electronics
  - marketing: advertising, social media, content creation, SEO, PPC campaigns
  - subscriptions: software subscriptions, SaaS, streaming services, memberships
  - services: consulting, legal, accounting, professional services, freelancers
  - rentals: equipment rentals, vehicle rentals, storage units
  - utilities: electricity, water, internet, phone, gas bills
  - entertainment: movies, concerts, sports events, games
  - other: anything that doesn't clearly fit above categories
  
  Instructions:
  1. Look for keywords and context clues
  3. Be accurate, not overly confident
  
  Respond ONLY in this exact format:
  Category: [one word category]
  Confidence: [number 0-100]
  Reasoning: [one sentence explaining your choice]
  
  Example:
  Description: "Team lunch at Italian restaurant"
  Category: food
  Confidence: 95
  Reasoning: Explicitly mentions lunch at restaurant.
  `.trim();
  },
  parseAIResponse(response: string): CategorySuggestion {
    try {
      const lines = response.split("\n").map((line) => line.trim());

      let category: ExpenseCategory = "other";
      let confidence = 70;
      let reasoning = "Categorized by AI";

      for (const line of lines) {
        if (line.toLowerCase().startsWith("category:")) {
          const cat = line.split(":")[1].trim().toLowerCase();
          if (VALID_CATEGORIES.includes(cat as ExpenseCategory)) {
            category = cat as ExpenseCategory;
          }
        } else if (line.toLowerCase().startsWith("confidence:")) {
          const conf = parseInt(line.split(":")[1].trim());
          if (!isNaN(conf) && conf >= 0 && conf <= 100) {
            confidence = conf;
          }
        } else if (line.toLowerCase().startsWith("reasoning:")) {
          reasoning = line.substring(line.indexOf(":") + 1).trim();
        }
      }

      return { category, confidence, reasoning };
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      return {
        category: "other",
        confidence: 50,
        reasoning: "Could not parse AI response",
      };
    }
  },

  quickCategoryMatch(description: string): CategorySuggestion | null {
    const lowerDesc = description.toLowerCase();

    // travel keywords
    if (
      /(flight|airplane|airline|hotel|airbnb|uber|lyft|taxi|rental car|parking|gas station)/i.test(
        lowerDesc
      )
    ) {
      return {
        category: "travel",
        confidence: 90,
        reasoning: "Matched travel keywords",
      };
    }

    // food keywords
    if (
      /(restaurant|lunch|dinner|breakfast|coffee|cafe|food|meal|catering|pizza|burger)/i.test(
        lowerDesc
      )
    ) {
      return {
        category: "food",
        confidence: 90,
        reasoning: "Matched food keywords",
      };
    }

    // equipment keywords
    if (
      /(laptop|computer|monitor|keyboard|mouse|software|hardware|macbook|iphone|ipad)/i.test(
        lowerDesc
      )
    ) {
      return {
        category: "equipment",
        confidence: 90,
        reasoning: "Matched equipment keywords",
      };
    }

    // supplies keywords
    if (
      /(paper|pen|pencil|office supply|notebook|folder|stapler|printer)/i.test(
        lowerDesc
      )
    ) {
      return {
        category: "supplies",
        confidence: 90,
        reasoning: "Matched supplies keywords",
      };
    }

    // marketing keywords
    if (
      /(advertising|marketing|social media|content creation|branding|seo|ppc|email marketing|sms marketing)/i.test(
        lowerDesc
      )
    ) {
      return {
        category: "marketing",
        confidence: 90,
        reasoning: "Matched marketing keywords",
      };
    }

    // subscriptions keywords
    if (
      /(streaming service|subscription|membership fee|streaming service|subscription|membership fee)/i.test(
        lowerDesc
      )
    ) {
      return {
        category: "subscriptions",
        confidence: 90,
        reasoning: "Matched subscriptions keywords",
      };
    }

    // services keywords
    if (
      /(consulting|legal|accounting|professional service|consulting|legal|accounting|professional service)/i.test(
        lowerDesc
      )
    ) {
      return {
        category: "services",
        confidence: 90,
        reasoning: "Matched services keywords",
      };
    }

    // rentals keywords
    if (
      /(equipment rental|vehicle rental|storage unit|rental equipment|rental vehicle|rental storage unit)/i.test(
        lowerDesc
      )
    ) {
      return {
        category: "rentals",
        confidence: 90,
        reasoning: "Matched rentals keywords",
      };
    }

    // utilities keywords
    if (/(electricity|water|internet|phone|gas)/i.test(lowerDesc)) {
      return {
        category: "utilities",
        confidence: 90,
        reasoning: "Matched utilities keywords",
      };
    }

    // entertainment keywords
    if (/(movie|concert|sport|game|hobby)/i.test(lowerDesc)) {
      return {
        category: "entertainment",
        confidence: 90,
        reasoning: "Matched entertainment keywords",
      };
    }

    return null;
  },

  async batchSuggestCategories(
    descriptions: string[]
  ): Promise<CategorySuggestion[]> {
    const results: CategorySuggestion[] = [];

    const batchSize = 5;
    for (let i = 0; i < descriptions.length; i += batchSize) {
      const batch = descriptions.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map((desc) => this.suggestCategory(desc))
      );
      results.push(...batchResults);

      if (i + batchSize < descriptions.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return results;
  },
};
