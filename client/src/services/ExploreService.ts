import { CategoryModel } from "../models/CategoryModel";
import { ExploreCardModel } from "../models/ExploreCardModel";
import { SocialPreferenceModel } from "../models/SocialPreferenceModel";
import { TransportationModel } from "../models/TransporationModel";
import User from "../models/UserModel";
import { getAge } from "../utils/RandomUtils";

// Constants
const DEFAULT_TRANSPORTATION_MESSAGE = "No transportation preferences selected.";
const API_ENDPOINT = "http://localhost:5000/generate-content";

export const getTransportationString = (
  transportationData: TransportationModel[]
): string => {
  const selected = transportationData
    .filter((t) => t.selected)
    .sort((a, b) => a.radius - b.radius);

  if (selected.length === 0) return DEFAULT_TRANSPORTATION_MESSAGE;

  const formatted = selected.map(
    (t) => `${t.method} (${t.radius} miles)`
  );

  return formatted.length > 1
    ? `${formatted.slice(0, -1).join(", ")}, and ${formatted.at(-1)}`
    : formatted[0];
};

export const getUserProfileData = (
  user: User,
  addressParts: string[],
  transportationPreferences: TransportationModel[],
  lifestylePreferences: string,
  additionalInfo: string,
  socialPreferences: SocialPreferenceModel[]
): string => {
  const age = user?.birthday ? getAge(user.birthday) : "";
  const gender = user?.gender ?? "";
  const city = addressParts?.[1] ?? "";
  const address = addressParts?.[0] ?? "";
  const transportation = getTransportationString(transportationPreferences);
  const routines = lifestylePreferences || "";
  const additional = additionalInfo || "";
  const priorities = socialPreferences
    .filter((pref) => pref.selected)
    .map((pref) => pref.name)
    .join(", ");

  return `I am a ${age} year old ${gender}, and I am moving to ${city}. My address is ${address}, and I prefer to travel by ${transportation}. I have the following routines and preferences in my locations: ${routines}. Additional information: ${additional}. When deciding on the places I go frequently, I care about the following priorities: ${priorities}.`;
};

export const getCategoryPrompt = (
  category: CategoryModel,
  categoryTitle: string = category.title
): string => {
  const cost = category.costPreference
    ? `in the ${category.costPreference} price range`
    : "";
  const vibe =
    category.environmentDescriptors?.length > 0
      ? `with a vibe of ${category.environmentDescriptors.join(", ")}`
      : "";
  const userPrefs = category.userPreferences
    ? `keeping in mind your preference for ${category.userPreferences}`
    : "";

  return `We will specifically look for ${categoryTitle} ${cost} ${vibe}. ${userPrefs}`;
};

export const exploreInstruction = (): string => `
Generate and output an array of at least three JSON objects that follow this JSON structure with results of your search based on analysis using Google Maps and Google Places API. The output should strictly adhere to this JSON format without additional commentary:  
{
  "title": "string",
  "place": "string",
  "address": "string",
  "personalizedSummary": "string",
  "recommendationReasoning": "string",
  "confidence": "number",
  "category": "string"
}
`;

export const generateAPIRequest = async (
  user: User,
  addressParts: string[],
  transportationPreferences: TransportationModel[],
  lifestylePreferences: string,
  additionalInfo: string,
  socialPreferences: SocialPreferenceModel[],
  category: CategoryModel,
  categoryTitle: string
): Promise<ExploreCardModel[]> => {
  const systemInstruction = getUserProfileData(
    user,
    addressParts,
    transportationPreferences,
    lifestylePreferences,
    additionalInfo,
    socialPreferences
  ) + exploreInstruction();

  const searchPrompt = getCategoryPrompt(category, categoryTitle);

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system_instruction: systemInstruction, search_prompt: searchPrompt }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return data.map((result: any): ExploreCardModel => ({
      title: result.title,
      place: result.place,
      address: result.address,
      personalizedSummary: result.personalizedSummary,
      reccomendationReasoning: result.recommendationReasoning, 
      confidence: result.confidence,
      category: category.title,
    }));
  } catch (error) {
    console.error("Failed to fetch recommendations:", error);
    return [];
  }
};


