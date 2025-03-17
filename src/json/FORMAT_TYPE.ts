


const PATTERNS = {
    "java": /\b(public|private|protected)\s+(static\s+)?(final\s+)?(class|interface|void|int|double|boolean|String|char)\b|\bSystem\.out\.print/,
    "python": /\b(def|class|import|from|print|lambda|self|__init__)\b|\b:\s*(\n|\r)|\b(range|len|dict|list|set|tuple)\b/,
    "typescript": /\b(let|const|interface|type|namespace|enum)\b|\bfunction\s*\w*\([^)]*\):\s*\w+/,
    "javascript": /\b(let|const|var|function|=>|console\.log|document\.getElementById)\b/,
    "text": /^[A-Za-z0-9\s.,?!'"\-]+$/,
    "html": /^\s*<(!DOCTYPE|html|head|body|div|span|h[1-6]|p|a|img|script|link|meta|style|form|input|button|table)\b/,
    "css": /^\s*([.#]?[a-zA-Z0-9_-]+)\s*\{\s*([^}]+:\s*[^}]+;)+\s*\}/
};

export const TYPE_COLORS : Record<string , string> = {
    "java": "!bg-gradient-to-r !from-red-500 !to-red-700 !bg-clip-text !text-transparent",
    "python": "!bg-gradient-to-r !from-blue-500 !to-blue-700 !bg-clip-text !text-transparent",
    "typescript": "!bg-gradient-to-r !from-indigo-500 !to-indigo-700 !bg-clip-text !text-transparent",
    "javascript": "!bg-gradient-to-r !from-yellow-400 !to-yellow-600 !bg-clip-text !text-transparent",
    "text": "!bg-gradient-to-r !from-gray-500 !to-gray-700 !bg-clip-text !text-transparent",
    "html": "!bg-gradient-to-r !from-orange-500 !to-orange-700 !bg-clip-text !text-transparent",
    "css": "!bg-gradient-to-r !from-teal-500 !to-teal-700 !bg-clip-text !text-transparent"
};



export function matchPattern(text: string): string {

    for (const [language, pattern] of Object.entries(PATTERNS)) {
        if (pattern.test(text)) {
            return language;
        }
    }

    return "text";
}


export const AVAILABLE_TYPE_FORMATS = ["all", "text", "java", "python", "typescript", "javascript", "html", "css"];