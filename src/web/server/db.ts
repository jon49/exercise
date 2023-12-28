import { get as get1, getMany, setMany, set as set1, update as update1, DBGet, DBSet, DBUpdate, Updated, Theme } from "@jon49/sw/db.js"

interface DBGetExtras {
    (key: ["exercise", number]): Promise<Exercise | undefined>
}

interface DBSetExtras {
    (key: ["exercise", number], value: Exercise, sync?: boolean): Promise<void>
}

interface DBUpdateExtras {
    (key: ["exercise", number], f: (val: Exercise | undefined) => Exercise, options?: { sync: boolean }): Promise<void>
}

const get: DBGet<DBAccessors> & DBGetExtras = get1
const set: DBSet<DBAccessors> & DBSetExtras = set1
const update: DBUpdate<DBAccessors> & DBUpdateExtras = update1

interface DBAccessors {
    "updated": Updated
    "settings": Settings
    "exercises": Exercises
}

export { update, set, get, getMany, setMany }

export interface Settings {
    lastSyncedId?: number
    theme?: Theme
}

export const type = ["Reps", "Time", "Distance", "Weight", "None"] as const
export type Type = typeof type[number]
export const timeUnit = ["Seconds", "Minutes", "Hours"] as const
export type TimeUnit = typeof timeUnit[number]
export const distanceUnit = ["Steps", "Meters", "Kilometers", "Miles", "Yards"] as const
export type DistanceUnit = typeof distanceUnit[number]
export const weightUnit = ["Kilograms", "Pounds"] as const
export type WeightUnit = typeof weightUnit[number]
export type Unit = TimeUnit | DistanceUnit | WeightUnit
export const difficulty = ["easy", "medium", "hard"] as const
export type Difficulty = typeof difficulty[number]

export type TypeToUnit<T extends Type> =
    T extends "Time"
        ? TimeUnit
    : T extends "Distance"
        ? DistanceUnit
    : T extends "Weight"
        ? WeightUnit
    : never

export const typeToUnit = {
    "Time": timeUnit,
    "Distance": distanceUnit,
    "Weight": weightUnit,
    "None": []
}

export type TypeUnit = {
    name: Type
    unit: TypeToUnit<TypeUnit["name"]>
}

export interface Workout {
    id: number // Unique identifier for the workout
    name: string // Name of the Workout
    description: string // Description of the Workout
    exercises: number[] // Array of exercis IDs in the Workout
    sets: number // Number of sets in the WorkoutLog
    restBetweenExercises: number // Rest between exercises in Seconds
    restBetweenWorkouts: number // Rest between workouts in Seconds
}

// Define Measure interface
export interface Measure extends TypeUnit {
    goal: number
}

export interface ExerciseName {
    id: number
    name: string
    active: boolean
}

export interface Exercises {
    exercise: ExerciseName[]
}

// Exercise template
export interface Exercise {
  id: number
  name: string
  description?: string
  difficulty?: Difficulty
  measures?: Measure[]
}

// Define ExerciseLog interface
export interface WorkoutLog {
  workoutId: number // Reference to the exercise definition
  timestamp: Date // Timestamp for when the exercise was performed
  sets: [number, number, number][][] // [set => [exercise ID, exercise value, goal value][]]
}

