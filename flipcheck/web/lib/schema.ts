export type Condition = 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor' | 'Unknown';
export type Confidence = 'high' | 'medium' | 'low';

export interface AnalyzeResponse {
  itemName: string;
  category: string;
  brand: string | null;
  conditionEstimate: Condition;
  estimatedValue: {
    low: number;
    high: number;
    currency: 'USD';
  };
  bestPlatform: string;
  platformReasoning: string;
  suggestedTitle: string;
  sellingTips: string[];
  confidence: Confidence;
  warnings: string[];
}

export const analyzeJsonSchema = {
  type: 'object',
  properties: {
    itemName: {
      type: 'string',
      description: 'Short descriptive name of the item, e.g., "Vintage Levi\'s 501 Denim Jacket".',
    },
    category: {
      type: 'string',
      description: 'Broad category: Clothing, Shoes, Electronics, Home, Books, Collectibles, Toys, Other.',
    },
    brand: {
      type: ['string', 'null'],
      description: 'Brand name if visible or confidently identifiable; otherwise null.',
    },
    conditionEstimate: {
      type: 'string',
      enum: ['New', 'Like New', 'Good', 'Fair', 'Poor', 'Unknown'],
      description: 'Best-guess condition from what is visible in the photo.',
    },
    estimatedValue: {
      type: 'object',
      properties: {
        low: { type: 'number', description: 'Conservative resale price in USD.' },
        high: { type: 'number', description: 'Optimistic resale price in USD.' },
        currency: { type: 'string', enum: ['USD'] },
      },
      required: ['low', 'high', 'currency'],
      additionalProperties: false,
    },
    bestPlatform: {
      type: 'string',
      description: 'One of: Poshmark, Depop, eBay, Mercari, Facebook Marketplace, Grailed, StockX, The RealReal, Etsy, OfferUp.',
    },
    platformReasoning: {
      type: 'string',
      description: 'One sentence explaining why this platform is best for this item.',
    },
    suggestedTitle: {
      type: 'string',
      description: 'A keyword-rich listing title (60-80 chars ideal).',
    },
    sellingTips: {
      type: 'array',
      items: { type: 'string' },
      description: 'Two to four actionable tips: what to photograph, what to mention, pricing strategy.',
    },
    confidence: {
      type: 'string',
      enum: ['high', 'medium', 'low'],
      description: 'Confidence in the overall assessment.',
    },
    warnings: {
      type: 'array',
      items: { type: 'string' },
      description: 'Flags for the user: blurry photo, tag not visible, counterfeit risk, etc. Empty array if none.',
    },
  },
  required: [
    'itemName',
    'category',
    'brand',
    'conditionEstimate',
    'estimatedValue',
    'bestPlatform',
    'platformReasoning',
    'suggestedTitle',
    'sellingTips',
    'confidence',
    'warnings',
  ],
  additionalProperties: false,
} as const;
