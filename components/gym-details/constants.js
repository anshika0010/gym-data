export const MEMBER_OPTIONS = [
  "1–50",
  "51–100",
  "101–200",
  "201–500",
  "500+",
];

export const VISIT_OPTIONS = [
  "< 20",
  "20–50",
  "51–100",
  "101–200",
  "200+",
];

export const AGE_OPTIONS = [
  "Under 18",
  "18–25",
  "26–35",
  "36–50",
  "50+",
  "Mixed",
];

export const GENDER_OPTIONS = [
  {
    id: "male",
    label: "Mostly male",
    icon: "♂",
  },
  {
    id: "female",
    label: "Mostly female",
    icon: "♀",
  },
  {
    id: "equally",
    label: "Equally",
    icon: "⚥",
  },
];

export const GYM_TYPE_OPTIONS = [
  "General fitness",
  "Crossfit",
  "Yoga / wellness",
  "Martial arts",
  "Bodybuilding",
  "Multi-sport",
];

export const PHOTO_CATEGORIES = [
  {
    id: "exterior",
    label: "Exterior / Front",
    icon: "🏢",
    desc: "Outside building photo",
    required: true,
  },
  {
    id: "floor",
    label: "Gym Floor",
    icon: "🏋️",
    desc: "Main workout area",
    required: true,
  },
  {
    id: "cardio",
    label: "Cardio Area",
    icon: "🏃",
    desc: "Cardio equipment area",
    required: false,
  },
  
];