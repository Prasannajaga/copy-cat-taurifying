


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
    "java": "group-hover:!bg-gradient-to-r group-hover:!from-red-500 group-hover:!to-red-700 group-hover:!bg-clip-text group-hover:!text-transparent",
    "python": "group-hover:!bg-gradient-to-r group-hover:!from-blue-500 group-hover:!to-blue-700 group-hover:!bg-clip-text group-hover:!text-transparent",
    "typescript": "group-hover:!bg-gradient-to-r group-hover:!from-indigo-500 group-hover:!to-indigo-700 group-hover:!bg-clip-text group-hover:!text-transparent",
    "javascript": "group-hover:!bg-gradient-to-r group-hover:!from-yellow-400 group-hover:!to-yellow-600 group-hover:!bg-clip-text group-hover:!text-transparent",
    "text": "group-hover:!bg-gradient-to-r group-hover:!from-gray-500 group-hover:!to-gray-700 group-hover:!bg-clip-text group-hover:!text-transparent",
    "html": "group-hover:!bg-gradient-to-r group-hover:!from-orange-500 group-hover:!to-orange-700 group-hover:!bg-clip-text group-hover:!text-transparent",
    "css": "group-hover:!bg-gradient-to-r group-hover:!from-teal-500 group-hover:!to-teal-700 group-hover:!bg-clip-text group-hover:!text-transparent"
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