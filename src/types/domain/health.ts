/**
 * Health and wellness domain types for the Pulse Raycast extension
 */

/**
 * Represents a physical exercise activity
 */
export interface Exercise {
  /** Unique identifier */
  id: string;
  /** Name of the exercise */
  name: string;
  /** Type of exercise activity */
  type: ExerciseType;
  /** Duration in minutes */
  duration: number;
  /** Date and time when exercise was performed */
  startTime: Date;
  /** Date and time when exercise ended */
  endTime: Date;
  /** Calories burned (estimated) */
  caloriesBurned?: number;
  /** Distance covered (for applicable exercises) */
  distance?: Distance;
  /** Heart rate data */
  heartRate?: HeartRateData;
  /** Exercise intensity level */
  intensity: IntensityLevel;
  /** Notes about the exercise session */
  notes?: string;
  /** Location where exercise was performed */
  location?: string;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Types of exercise activities
 */
export enum ExerciseType {
  RUNNING = "running",
  WALKING = "walking",
  CYCLING = "cycling",
  SWIMMING = "swimming",
  WEIGHT_TRAINING = "weight_training",
  YOGA = "yoga",
  HIIT = "hiit",
  SPORTS = "sports",
  CARDIO = "cardio",
  FLEXIBILITY = "flexibility",
  OTHER = "other",
}

/**
 * Exercise intensity levels
 */
export enum IntensityLevel {
  LOW = "low",
  MODERATE = "moderate",
  HIGH = "high",
  VERY_HIGH = "very_high",
}

/**
 * Distance measurement
 */
export interface Distance {
  /** Numeric value */
  value: number;
  /** Unit of measurement */
  unit: DistanceUnit;
}

/**
 * Distance units
 */
export enum DistanceUnit {
  METERS = "meters",
  KILOMETERS = "kilometers",
  MILES = "miles",
  YARDS = "yards",
}

/**
 * Heart rate data during exercise
 */
export interface HeartRateData {
  /** Average heart rate in BPM */
  average: number;
  /** Maximum heart rate in BPM */
  max: number;
  /** Minimum heart rate in BPM */
  min: number;
  /** Resting heart rate in BPM */
  resting?: number;
  /** Heart rate zones breakdown */
  zones?: HeartRateZone[];
}

/**
 * Heart rate training zone
 */
export interface HeartRateZone {
  /** Zone name */
  name: string;
  /** Lower bound BPM */
  minBpm: number;
  /** Upper bound BPM */
  maxBpm: number;
  /** Time spent in this zone (minutes) */
  duration: number;
  /** Percentage of total exercise time */
  percentage: number;
}

/**
 * Represents nutritional intake
 */
export interface Nutrition {
  /** Unique identifier */
  id: string;
  /** Date of the nutrition entry */
  date: Date;
  /** Meal type */
  mealType: MealType;
  /** List of food items consumed */
  foods: FoodItem[];
  /** Total nutritional values */
  totals: NutritionalValues;
  /** Water intake in milliliters */
  waterIntake?: number;
  /** Notes about the meal */
  notes?: string;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Types of meals
 */
export enum MealType {
  BREAKFAST = "breakfast",
  LUNCH = "lunch",
  DINNER = "dinner",
  SNACK = "snack",
  OTHER = "other",
}

/**
 * Individual food item
 */
export interface FoodItem {
  /** Food name */
  name: string;
  /** Brand name (if applicable) */
  brand?: string;
  /** Quantity consumed */
  quantity: number;
  /** Unit of measurement */
  unit: string;
  /** Nutritional values for this item */
  nutrition: NutritionalValues;
  /** Barcode (if scanned) */
  barcode?: string;
}

/**
 * Nutritional values breakdown
 */
export interface NutritionalValues {
  /** Calories (kcal) */
  calories: number;
  /** Protein in grams */
  protein: number;
  /** Carbohydrates in grams */
  carbs: number;
  /** Fat in grams */
  fat: number;
  /** Fiber in grams */
  fiber?: number;
  /** Sugar in grams */
  sugar?: number;
  /** Sodium in milligrams */
  sodium?: number;
  /** Cholesterol in milligrams */
  cholesterol?: number;
  /** Saturated fat in grams */
  saturatedFat?: number;
  /** Unsaturated fat in grams */
  unsaturatedFat?: number;
  /** Vitamins and minerals */
  micronutrients?: Micronutrient[];
}

/**
 * Vitamin or mineral information
 */
export interface Micronutrient {
  /** Name of the micronutrient */
  name: string;
  /** Amount */
  amount: number;
  /** Unit of measurement */
  unit: string;
  /** Percentage of daily value */
  dailyValuePercentage?: number;
}

/**
 * Health metrics and vitals
 */
export interface HealthMetrics {
  /** Unique identifier */
  id: string;
  /** Date when metrics were recorded */
  date: Date;
  /** Body measurements */
  body?: BodyMetrics;
  /** Vital signs */
  vitals?: VitalSigns;
  /** Sleep data */
  sleep?: SleepData;
  /** Mental health indicators */
  mentalHealth?: MentalHealthMetrics;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Body measurements
 */
export interface BodyMetrics {
  /** Weight in kilograms */
  weight?: number;
  /** Height in centimeters */
  height?: number;
  /** Body Mass Index */
  bmi?: number;
  /** Body fat percentage */
  bodyFatPercentage?: number;
  /** Muscle mass in kilograms */
  muscleMass?: number;
  /** Waist circumference in centimeters */
  waistCircumference?: number;
  /** Hip circumference in centimeters */
  hipCircumference?: number;
}

/**
 * Vital signs measurements
 */
export interface VitalSigns {
  /** Blood pressure reading */
  bloodPressure?: BloodPressure;
  /** Heart rate in BPM */
  heartRate?: number;
  /** Body temperature in Celsius */
  temperature?: number;
  /** Respiratory rate per minute */
  respiratoryRate?: number;
  /** Blood oxygen saturation percentage */
  oxygenSaturation?: number;
  /** Blood glucose level */
  bloodGlucose?: BloodGlucose;
}

/**
 * Blood pressure reading
 */
export interface BloodPressure {
  /** Systolic pressure (top number) */
  systolic: number;
  /** Diastolic pressure (bottom number) */
  diastolic: number;
  /** Measurement time */
  measuredAt: Date;
}

/**
 * Blood glucose reading
 */
export interface BloodGlucose {
  /** Glucose level */
  level: number;
  /** Unit of measurement */
  unit: GlucoseUnit;
  /** When the measurement was taken relative to meals */
  timing: GlucoseTiming;
  /** Measurement time */
  measuredAt: Date;
}

/**
 * Glucose measurement units
 */
export enum GlucoseUnit {
  MG_DL = "mg/dL",
  MMOL_L = "mmol/L",
}

/**
 * Glucose measurement timing
 */
export enum GlucoseTiming {
  FASTING = "fasting",
  BEFORE_MEAL = "before_meal",
  AFTER_MEAL = "after_meal",
  BEDTIME = "bedtime",
  RANDOM = "random",
}

/**
 * Sleep tracking data
 */
export interface SleepData {
  /** Total sleep duration in minutes */
  duration: number;
  /** Time went to bed */
  bedTime: Date;
  /** Time woke up */
  wakeTime: Date;
  /** Time to fall asleep in minutes */
  timeToFallAsleep?: number;
  /** Number of times woken up */
  awakenings?: number;
  /** Sleep quality rating */
  quality?: SleepQuality;
  /** Sleep stages breakdown */
  stages?: SleepStage[];
  /** Sleep efficiency percentage */
  efficiency?: number;
}

/**
 * Sleep quality ratings
 */
export enum SleepQuality {
  POOR = "poor",
  FAIR = "fair",
  GOOD = "good",
  EXCELLENT = "excellent",
}

/**
 * Sleep stage data
 */
export interface SleepStage {
  /** Stage type */
  stage: SleepStageType;
  /** Duration in minutes */
  duration: number;
  /** Percentage of total sleep */
  percentage: number;
}

/**
 * Types of sleep stages
 */
export enum SleepStageType {
  AWAKE = "awake",
  LIGHT = "light",
  DEEP = "deep",
  REM = "rem",
}

/**
 * Mental health metrics
 */
export interface MentalHealthMetrics {
  /** Mood rating */
  mood?: MoodRating;
  /** Stress level */
  stressLevel?: StressLevel;
  /** Energy level */
  energyLevel?: EnergyLevel;
  /** Mindfulness/meditation minutes */
  mindfulnessMinutes?: number;
  /** Journal entry reference */
  journalEntryId?: string;
  /** Notes */
  notes?: string;
}

/**
 * Mood ratings
 */
export enum MoodRating {
  VERY_BAD = "very_bad",
  BAD = "bad",
  NEUTRAL = "neutral",
  GOOD = "good",
  VERY_GOOD = "very_good",
}

/**
 * Stress levels
 */
export enum StressLevel {
  VERY_LOW = "very_low",
  LOW = "low",
  MODERATE = "moderate",
  HIGH = "high",
  VERY_HIGH = "very_high",
}

/**
 * Energy levels
 */
export enum EnergyLevel {
  EXHAUSTED = "exhausted",
  TIRED = "tired",
  NORMAL = "normal",
  ENERGETIC = "energetic",
  VERY_ENERGETIC = "very_energetic",
}
