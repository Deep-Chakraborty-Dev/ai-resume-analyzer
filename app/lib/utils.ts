import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  // Determine the appropriate unit by calculating the log
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // Format with 2 decimal places and round
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const generateUUID = () => crypto.randomUUID();

const createDefaultFeedback = (): Feedback => ({
  overallScore: 0,
  ATS: { score: 0, tips: [] },
  toneAndStyle: { score: 0, tips: [] },
  content: { score: 0, tips: [] },
  structure: { score: 0, tips: [] },
  skills: { score: 0, tips: [] },
});

const normalizeTips = (tips: unknown) => {
  if (!Array.isArray(tips)) {
    return [];
  }

  return tips
    .filter((tip): tip is Record<string, unknown> => typeof tip === 'object' && tip !== null)
    .map((tip) => ({
      type: tip.type === 'good' || tip.type === 'improve' ? tip.type : 'improve',
      tip: typeof tip.tip === 'string' ? tip.tip : 'Improve this section',
      explanation:
        typeof tip.explanation === 'string' ? tip.explanation : undefined,
    }));
};

export const extractFeedbackText = (response: unknown): string => {
  if (typeof response === 'string') {
    return response;
  }

  if (!response || typeof response !== 'object') {
    return '';
  }

  const candidate = response as Record<string, unknown>;
  const message = candidate.message;

  const content =
    message && typeof message === 'object'
      ? (message as Record<string, unknown>).content
      : candidate.content;

  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    const parts = content
      .map((item) => {
        if (typeof item === 'string') {
          return item;
        }

        if (item && typeof item === 'object') {
          const record = item as Record<string, unknown>;
          if (typeof record.text === 'string') {
            return record.text;
          }
          if (typeof record.content === 'string') {
            return record.content;
          }
          if (Array.isArray(record.content)) {
            return extractFeedbackText(record.content);
          }
        }

        return '';
      })
      .filter(Boolean);

    return parts.join('\n');
  }

  if (content && typeof content === 'object') {
    const record = content as Record<string, unknown>;
    if (typeof record.text === 'string') {
      return record.text;
    }
  }

  if (typeof candidate.text === 'string') {
    return candidate.text;
  }

  return '';
};

export const parseFeedback = (rawText: string): Feedback => {
  const cleaned = rawText.trim();
  const fallbackFeedback = createDefaultFeedback();

  if (!cleaned) {
    return fallbackFeedback;
  }

  const startIndex = cleaned.indexOf('{');
  const endIndex = cleaned.lastIndexOf('}');
  const jsonCandidate =
    startIndex !== -1 && endIndex > startIndex
      ? cleaned.slice(startIndex, endIndex + 1)
      : cleaned;

  try {
    const parsed = JSON.parse(jsonCandidate);

    if (!parsed || typeof parsed !== 'object') {
      return fallbackFeedback;
    }

    const feedback = parsed as Partial<Feedback>;

    return {
      overallScore: typeof feedback.overallScore === 'number' ? feedback.overallScore : 0,
      ATS: {
        score: typeof feedback.ATS?.score === 'number' ? feedback.ATS.score : 0,
        tips: normalizeTips(feedback.ATS?.tips) as Feedback['ATS']['tips'],
      },
      toneAndStyle: {
        score: typeof feedback.toneAndStyle?.score === 'number' ? feedback.toneAndStyle.score : 0,
        tips: normalizeTips(feedback.toneAndStyle?.tips) as Feedback['toneAndStyle']['tips'],
      },
      content: {
        score: typeof feedback.content?.score === 'number' ? feedback.content.score : 0,
        tips: normalizeTips(feedback.content?.tips) as Feedback['content']['tips'],
      },
      structure: {
        score: typeof feedback.structure?.score === 'number' ? feedback.structure.score : 0,
        tips: normalizeTips(feedback.structure?.tips) as Feedback['structure']['tips'],
      },
      skills: {
        score: typeof feedback.skills?.score === 'number' ? feedback.skills.score : 0,
        tips: normalizeTips(feedback.skills?.tips) as Feedback['skills']['tips'],
      },
    };
  } catch {
    return fallbackFeedback;
  }
};
