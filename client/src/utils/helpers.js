export const calculateReadingTime = (text) => {
  const words = text ? text.trim().split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / 200));
};

export const stripMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/#+\s/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\n+/g, ' ')
    .trim();
};

export const truncateText = (text, maxLength = 120) => {
  if (!text) return '';
  const clean = stripMarkdown(text);
  if (clean.length <= maxLength) return clean;
  return clean.substring(0, maxLength) + '...';
};
