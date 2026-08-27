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

        if (
            parsed && parsed.type === "doc" && Array.isArray(parsed.content)
        ) {
            return parsed;
        }

        return emptyDocument;
    } catch {
        return {
            type: "doc",
            content: [
                {
                    type: "paragraph",
                    content: content
                    ? [
                        {
                            type: "text",
                            text: content
                        }
                    ]
                    : undefined
                }
            ]
        };
    }
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