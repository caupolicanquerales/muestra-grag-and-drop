export function formatDataIfJson(data: string): string {
    if (!data) return data;
    try {
      const parsed = JSON.parse(data);
      const formatted = JSON.stringify(parsed, null, 2)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `<pre style="white-space: pre-wrap; margin: 0; font-size: inherit;">${formatted}</pre>`;
    } catch {
      return data;
    }
}

