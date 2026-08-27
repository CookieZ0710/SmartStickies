export function parseNoteContent(content) {
    const emptyDocument = {
        type: "doc",
        content: [
            {
                type: "paragraph"
            }
        ]
    };
    
    if (!content) {
        return emptyDocument;
    }

    try {
        const parsed = JSON.parse(content);

        const validDoc =
            parsed &&
            parsed.type === "doc" &&
            Array.isArray(parsed.content) &&
            parsed.content.every(
                node => node.type !== "text"
            );

        if (validDoc) {
            return parsed;
        }

        const text = extractText(parsed);

        return {
            type: "doc",
            content: [
                {
                    type: "paragraph",
                    content: text
                    ? [
                        {
                            type: "text",
                            text
                        }
                    ]
                    : undefined
                }
            ]
        };
    } catch {
        return {
            type: "doc",
            content: [
                {
                    type: "paragraph",
                    content: [
                        {
                            type: "text",
                            text: content
                        }
                    ]
                }
            ]
        };
    }
}

function extractText(node) {
    if (!node) {
        return "";
    }

    if (node.type === "text") {
        return node.text ?? "";
    }

    if (!Array.isArray(node.content)) {
        return "";
    }

    return node.content.map(extractText).join("");
}

export function getNotePreview(content) {
    if (!content) {
        return "";
    }

    try {
        const json = JSON.parse(content);

        const extractText = (node) => {
            if (node.type === "text") {
                return node.text ?? "";
            }

            if (!node.content) {
                return "";
            }

            return node.content.map(extractText).join("");
        };

        return extractText(json);
    } catch {
        // legacy plain text
        return content;
    }
}