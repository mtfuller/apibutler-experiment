const CODE_BLOCK_PATTERN = /\`\`\`([a-z]+)\n([A-Za-z0-9!@#$%^&*()_\-+={}\[\]\|\\:;"'<>,.\?\/\n ]+)\`\`\`/g

interface CodeBlock {
    language: string,
    code: string
}

export const parseCodeBlocks = (text: string) => {

    const matches = [...text.matchAll(CODE_BLOCK_PATTERN)]

    const codeBlocks: CodeBlock[] = matches.map(match => ({
        language: match[1],
        code: match[2].trim()
    }));

    return codeBlocks

}