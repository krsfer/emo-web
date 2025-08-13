// Core pattern types for the Emoty web application
// Based on Android Kotlin data classes migrated to TypeScript

export interface GridCell {
  emoji: string;
  row: number;
  col: number;
  layer: number;
  isCenter: boolean;
}

export interface PatternState {
  id?: string;
  sequence: string[];
  insertionIndex: number;
  patternSize: number;
  patternMode: PatternMode;
  activeInsertionMode: PatternMode;
  name?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isFavorite?: boolean;
  tags?: string[];
  metadata?: PatternMetadata;
}

export interface EmojiPalette {
  id: string;
  name: LocalizedString;
  category: PaletteCategory;
  emojis: string[];
  orderIndex: number;
  isCustom: boolean;
  description?: LocalizedString;
  tags?: string[];
}

export interface LocalizedString {
  en: string;
  fr: string;
  [locale: string]: string;
}

export enum PatternMode {
  CONCENTRIC = 'concentric',
  SEQUENTIAL = 'sequential'
}

export enum PaletteCategory {
  COLOR = 'color',
  MONOCHROME = 'monochrome', 
  CUSTOM = 'custom'
}

export interface PatternMetadata {
  aiGenerated: boolean;
  sourcePrompt?: string;
  rationale?: string;
  complexity: 'simple' | 'moderate' | 'complex';
  language: 'en' | 'fr';
  userLevel: number;
  renderTime?: number;
  canvasSize?: { width: number; height: number };
}

// Validation types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  suggestions?: string[];
}

export interface ValidationRule {
  validate: (value: any) => { isValid: boolean; message: string };
}

// Accessibility types
export interface PatternAccessibilityInfo {
  altText: string;
  description: string;
  sequenceDescription: string;
  spatialDescription: string;
}

// API response types
export interface PatternResponse {
  patterns: Array<{
    sequence: string[];
    rationale: string;
    confidence: number;
    name: string;
    tags: string[];
  }>;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// Voice command types
export interface VoiceCommand {
  intent: string;
  parameters: Record<string, any>;
  confidence: number;
  language: 'en' | 'fr';
}