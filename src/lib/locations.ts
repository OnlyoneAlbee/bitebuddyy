// Delivery areas covered by BiteBuddy in Ibadan, Oyo State.
// Lead City University is listed first as our primary campus coverage area.
export const STATE = "Oyo State";
export const CITY = "Ibadan";

export const IBADAN_AREAS = [
  "Lead City University (Campus)",
  "Toll Gate / Lead City Axis",
  "Bodija",
  "University of Ibadan (UI)",
  "Ring Road",
  "Challenge",
  "Dugbe",
  "Mokola",
  "Sango",
  "Apata",
  "Akobo",
  "Iwo Road",
  "Eleyele",
  "Jericho",
  "Agodi",
] as const;

export type IbadanArea = (typeof IBADAN_AREAS)[number];
