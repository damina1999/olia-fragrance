export function cloudinaryUrl(src, { width, quality = 'auto', format = 'auto' } = {}) {
  if (!src) return src;
  try {
    // If Cloudinary URL, inject transformation after /upload/
    const idx = src.indexOf('/upload/');
    if (idx === -1) return src; // not a cloudinary URL
    const before = src.slice(0, idx + 8); // include /upload/
    const after = src.slice(idx + 8);
    const transform = [];
    if (width) transform.push(`w_${width}`);
    if (quality) transform.push(`q_${quality}`);
    if (format) transform.push(`f_${format}`);
    const t = transform.length ? transform.join(',') + '/' : '';
    return before + t + after;
  } catch (e) {
    return src;
  }
}
