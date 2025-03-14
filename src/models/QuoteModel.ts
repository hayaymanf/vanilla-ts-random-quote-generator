// src/models/QuoteModel.ts
export interface Quote {
  text: string;
  author: string;
  category: string;
  id?: string; // Unique identifier for each quote
  timestamp?: number; // When the quote was added to favorites
}
 