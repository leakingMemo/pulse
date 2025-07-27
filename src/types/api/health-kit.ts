/**
 * HealthKit API integration types for the Pulse Raycast extension
 * iOS HealthKit data integration and sync
 */

/**
 * HealthKit quantity sample types
 */
export enum HKQuantityTypeIdentifier {
  // Body Measurements
  HEIGHT = 'HKQuantityTypeIdentifierHeight',
  BODY_MASS = 'HKQuantityTypeIdentifierBodyMass',
  BODY_MASS_INDEX = 'HKQuantityTypeIdentifierBodyMassIndex',
  LEAN_BODY_MASS = 'HKQuantityTypeIdentifierLeanBodyMass',
  BODY_FAT_PERCENTAGE = 'HKQuantityTypeIdentifierBodyFatPercentage',
  
  // Fitness
  STEP_COUNT = 'HKQuantityTypeIdentifierStepCount',
  DISTANCE_WALKING_RUNNING = 'HKQuantityTypeIdentifierDistanceWalkingRunning',
  DISTANCE_CYCLING = 'HKQuantityTypeIdentifierDistanceCycling',
  FLIGHTS_CLIMBED = 'HKQuantityTypeIdentifierFlightsClimbed',
  
  // Vitals
  HEART_RATE = 'HKQuantityTypeIdentifierHeartRate',
  BLOOD_PRESSURE_SYSTOLIC = 'HKQuantityTypeIdentifierBloodPressureSystolic',
  BLOOD_PRESSURE_DIASTOLIC = 'HKQuantityTypeIdentifierBloodPressureDiastolic',
  RESPIRATORY_RATE = 'HKQuantityTypeIdentifierRespiratoryRate',
  
  // Active Energy
  ACTIVE_ENERGY_BURNED = 'HKQuantityTypeIdentifierActiveEnergyBurned',
  BASAL_ENERGY_BURNED = 'HKQuantityTypeIdentifierBasalEnergyBurned',
  
  // Sleep
  SLEEP_ANALYSIS = 'HKCategoryTypeIdentifierSleepAnalysis',
  
  // Nutrition
  DIETARY_ENERGY_CONSUMED = 'HKQuantityTypeIdentifierDietaryEnergyConsumed',
  DIETARY_PROTEIN = 'HKQuantityTypeIdentifierDietaryProtein',
  DIETARY_CARBOHYDRATES = 'HKQuantityTypeIdentifierDietaryCarbohydrates',
  DIETARY_FAT_TOTAL = 'HKQuantityTypeIdentifierDietaryFatTotal'
}

/**
 * HealthKit quantity sample
 */
export interface HKQuantitySample {
  /** Sample identifier */
  uuid: string;
  /** Quantity type */
  quantityType: HKQuantityTypeIdentifier;
  /** Sample value */
  quantity: HKQuantity;
  /** Start date */
  startDate: Date;
  /** End date */
  endDate: Date;
  /** Source information */
  source: HKSource;
  /** Device information */
  device?: HKDevice;
  /** Metadata */
  metadata?: Record<string, any>;
}

/**
 * HealthKit quantity with unit
 */
export interface HKQuantity {
  /** Numeric value */
  doubleValue: number;
  /** Unit of measurement */
  unit: HKUnit;
}

/**
 * HealthKit unit
 */
export interface HKUnit {
  /** Unit string */
  unitString: string;
  /** Localized display name */
  displayName?: string;
}

/**
 * HealthKit data source
 */
export interface HKSource {
  /** Source name */
  name: string;
  /** Bundle identifier */
  bundleIdentifier: string;
  /** Version information */
  version?: string;
}

/**
 * HealthKit device information
 */
export interface HKDevice {
  /** Device name */
  name?: string;
  /** Manufacturer */
  manufacturer?: string;
  /** Model */
  model?: string;
  /** Hardware version */
  hardwareVersion?: string;
  /** Software version */
  softwareVersion?: string;
  /** Local identifier */
  localIdentifier?: string;
}

/**
 * HealthKit workout types
 */
export enum HKWorkoutActivityType {
  AMERICAN_FOOTBALL = 'HKWorkoutActivityTypeAmericanFootball',
  ARCHERY = 'HKWorkoutActivityTypeArchery',
  AUSTRALIAN_FOOTBALL = 'HKWorkoutActivityTypeAustralianFootball',
  BADMINTON = 'HKWorkoutActivityTypeBadminton',
  BASEBALL = 'HKWorkoutActivityTypeBaseball',
  BASKETBALL = 'HKWorkoutActivityTypeBasketball',
  BOWLING = 'HKWorkoutActivityTypeBowling',
  BOXING = 'HKWorkoutActivityTypeBoxing',
  CLIMBING = 'HKWorkoutActivityTypeClimbing',
  CRICKET = 'HKWorkoutActivityTypeCricket',
  CROSS_TRAINING = 'HKWorkoutActivityTypeCrossTraining',
  CURLING = 'HKWorkoutActivityTypeCurling',
  CYCLING = 'HKWorkoutActivityTypeCycling',
  DANCE = 'HKWorkoutActivityTypeDance',
  ELLIPTICAL = 'HKWorkoutActivityTypeElliptical',
  EQUESTRIAN_SPORTS = 'HKWorkoutActivityTypeEquestrianSports',
  FENCING = 'HKWorkoutActivityTypeFencing',
  FISHING = 'HKWorkoutActivityTypeFishing',
  FUNCTIONAL_STRENGTH_TRAINING = 'HKWorkoutActivityTypeFunctionalStrengthTraining',
  GOLF = 'HKWorkoutActivityTypeGolf',
  GYMNASTICS = 'HKWorkoutActivityTypeGymnastics',
  HANDBALL = 'HKWorkoutActivityTypeHandball',
  HIKING = 'HKWorkoutActivityTypeHiking',
  HOCKEY = 'HKWorkoutActivityTypeHockey',
  HUNTING = 'HKWorkoutActivityTypeHunting',
  LACROSSE = 'HKWorkoutActivityTypeLacrosse',
  MARTIAL_ARTS = 'HKWorkoutActivityTypeMartialArts',
  MIND_AND_BODY = 'HKWorkoutActivityTypeMindAndBody',
  MIXED_METABOLIC_CARDIO_TRAINING = 'HKWorkoutActivityTypeMixedMetabolicCardioTraining',
  PADDLE_SPORTS = 'HKWorkoutActivityTypePaddleSports',
  PLAY = 'HKWorkoutActivityTypePlay',
  PREPARATION_AND_RECOVERY = 'HKWorkoutActivityTypePreparationAndRecovery',
  RACQUETBALL = 'HKWorkoutActivityTypeRacquetball',
  ROWING = 'HKWorkoutActivityTypeRowing',
  RUGBY = 'HKWorkoutActivityTypeRugby',
  RUNNING = 'HKWorkoutActivityTypeRunning',
  SAILING = 'HKWorkoutActivityTypeSailing',
  SKATING_SPORTS = 'HKWorkoutActivityTypeSkatingSports',
  SNOW_SPORTS = 'HKWorkoutActivityTypeSnowSports',
  SOCCER = 'HKWorkoutActivityTypeSoccer',
  SOFTBALL = 'HKWorkoutActivityTypeSoftball',
  SQUASH = 'HKWorkoutActivityTypeSquash',
  STAIR_CLIMBING = 'HKWorkoutActivityTypeStairClimbing',
  SURFING_SPORTS = 'HKWorkoutActivityTypeSurfingSports',
  SWIMMING = 'HKWorkoutActivityTypeSwimming',
  TABLE_TENNIS = 'HKWorkoutActivityTypeTableTennis',
  TENNIS = 'HKWorkoutActivityTypeTennis',
  TRACK_AND_FIELD = 'HKWorkoutActivityTypeTrackAndField',
  TRADITIONAL_STRENGTH_TRAINING = 'HKWorkoutActivityTypeTraditionalStrengthTraining',
  VOLLEYBALL = 'HKWorkoutActivityTypeVolleyball',
  WALKING = 'HKWorkoutActivityTypeWalking',
  WATER_FITNESS = 'HKWorkoutActivityTypeWaterFitness',
  WATER_POLO = 'HKWorkoutActivityTypeWaterPolo',
  WATER_SPORTS = 'HKWorkoutActivityTypeWaterSports',
  WRESTLING = 'HKWorkoutActivityTypeWrestling',
  YOGA = 'HKWorkoutActivityTypeYoga',
  OTHER = 'HKWorkoutActivityTypeOther'
}

/**
 * HealthKit workout
 */
export interface HKWorkout {
  /** Workout identifier */
  uuid: string;
  /** Workout activity type */
  workoutActivityType: HKWorkoutActivityType;
  /** Start date */
  startDate: Date;
  /** End date */
  endDate: Date;
  /** Duration in seconds */
  duration: number;
  /** Total energy burned */
  totalEnergyBurned?: HKQuantity;
  /** Total distance */
  totalDistance?: HKQuantity;
  /** Source information */
  source: HKSource;
  /** Device information */
  device?: HKDevice;
  /** Metadata */
  metadata?: Record<string, any>;
  /** Workout events */
  workoutEvents?: HKWorkoutEvent[];
}

/**
 * HealthKit workout event
 */
export interface HKWorkoutEvent {
  /** Event type */
  type: HKWorkoutEventType;
  /** Event date */
  date: Date;
  /** Metadata */
  metadata?: Record<string, any>;
}

/**
 * Workout event types
 */
export enum HKWorkoutEventType {
  PAUSE = 'HKWorkoutEventTypePause',
  RESUME = 'HKWorkoutEventTypeResume',
  LAP = 'HKWorkoutEventTypeLap',
  MARKER = 'HKWorkoutEventTypeMarker',
  MOTION_PAUSED = 'HKWorkoutEventTypeMotionPaused',
  MOTION_RESUMED = 'HKWorkoutEventTypeMotionResumed',
  SEGMENT = 'HKWorkoutEventTypeSegment',
  PAUSE_OR_RESUME_REQUEST = 'HKWorkoutEventTypePauseOrResumeRequest'
}

/**
 * HealthKit statistics query
 */
export interface HKStatisticsQuery {
  /** Quantity type to query */
  quantityType: HKQuantityTypeIdentifier;
  /** Predicate for filtering */
  predicate?: HKQueryPredicate;
  /** Statistics options */
  options: HKStatisticsOptions;
}

/**
 * Statistics options
 */
export enum HKStatisticsOptions {
  NONE = 'HKStatisticsOptionNone',
  SEPARATE_BY_SOURCE = 'HKStatisticsOptionSeparateBySource',
  DISCRETE_AVERAGE = 'HKStatisticsOptionDiscreteAverage',
  DISCRETE_MIN = 'HKStatisticsOptionDiscreteMin',
  DISCRETE_MAX = 'HKStatisticsOptionDiscreteMax',
  CUMULATIVE_SUM = 'HKStatisticsOptionCumulativeSum'
}

/**
 * Query predicate for filtering HealthKit data
 */
export interface HKQueryPredicate {
  /** Start date */
  startDate?: Date;
  /** End date */
  endDate?: Date;
  /** Source filters */
  sources?: HKSource[];
  /** Device filters */
  devices?: HKDevice[];
}

/**
 * HealthKit statistics result
 */
export interface HKStatistics {
  /** Quantity type */
  quantityType: HKQuantityTypeIdentifier;
  /** Start date */
  startDate: Date;
  /** End date */
  endDate: Date;
  /** Sum quantity */
  sumQuantity?: HKQuantity;
  /** Average quantity */
  averageQuantity?: HKQuantity;
  /** Minimum quantity */
  minimumQuantity?: HKQuantity;
  /** Maximum quantity */
  maximumQuantity?: HKQuantity;
  /** Most recent quantity */
  mostRecentQuantity?: HKQuantity;
  /** Most recent quantity date */
  mostRecentQuantityDateInterval?: DateInterval;
  /** Sources */
  sources?: HKSource[];
}

/**
 * Date interval
 */
export interface DateInterval {
  /** Start date */
  start: Date;
  /** End date */
  end: Date;
  /** Duration in seconds */
  duration: number;
}

/**
 * HealthKit authorization status
 */
export enum HKAuthorizationStatus {
  NOT_DETERMINED = 'HKAuthorizationStatusNotDetermined',
  SHARING_DENIED = 'HKAuthorizationStatusSharingDenied',
  SHARING_AUTHORIZED = 'HKAuthorizationStatusSharingAuthorized'
}

/**
 * HealthKit permission request
 */
export interface HKPermissionRequest {
  /** Types to read */
  read: HKQuantityTypeIdentifier[];
  /** Types to write */
  write?: HKQuantityTypeIdentifier[];
}

/**
 * HealthKit data sync configuration
 */
export interface HKSyncConfig {
  /** Enabled data types */
  enabledTypes: HKQuantityTypeIdentifier[];
  /** Sync frequency in minutes */
  syncFrequencyMinutes: number;
  /** Background sync enabled */
  backgroundSyncEnabled: boolean;
  /** Data retention period in days */
  retentionDays?: number;
  /** Last sync timestamp */
  lastSyncDate?: Date;
}