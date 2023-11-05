import { id } from '@/helpers/id'
import { pointEnd, pointStart } from 'unist-util-position'

function extractCaptionFromTableNode(node) {
    if (node.children.length < 2) {
        return null
    }

    const lastChild = node.children[node.children.length - 1]

    if (lastChild.children.length !== 1) {
        return null
    }

    const cell = lastChild.children[0]

    if (cell.children.length !== 1) {
        return null
    }

    const child = cell.children[0]

    if (child.type !== 'text') {
        return null
    }

    if (!child.value.startsWith('[') || !child.value.endsWith(']')) {
        return null
    }

    return child.value.slice(1, -1)
}

export function table(state, node) {
    const caption = extractCaptionFromTableNode(node)
    let rows = state.all(node)
    const firstRow = rows.shift()
    const tableContent = []

    if (caption) {
        // Remove last row
        rows.pop()
    }

    if (firstRow) {
        const head = {
            type: 'element',
            tagName: 'thead',
            properties: {},
            children: state.wrap([firstRow], true),
        }
        state.patch(node.children[0], head)
        tableContent.push(head)
    }

    if (rows.length > 0) {
        const body = {
            type: 'element',
            tagName: 'tbody',
            properties: {},
            children: state.wrap(rows, true),
        }

        const start = pointStart(node.children[1])
        const end = pointEnd(node.children[node.children.length - 1])
        if (start && end) {
            body.position = { start, end }
        }

        tableContent.push(body)
    }

    let result = null

    if (caption) {
        const captionId = id()
        result = {
            type: 'element',
            tagName: 'div',
            properties: {
                role: 'region',
                'aria-labelledby': captionId,
                tabindex: 0,
            },
            children: [
                {
                    type: 'element',
                    tagName: 'table',
                    properties: {},
                    children: [
                        {
                            type: 'element',
                            tagName: 'caption',
                            properties: {
                                id: captionId,
                            },
                            children: [
                                {
                                    type: 'text',
                                    value: caption,
                                },
                            ],
                        },
                        ...state.wrap(tableContent, true),
                    ],
                },
            ],
        }
    } else {
        result = {
            type: 'element',
            tagName: 'table',
            properties: {},
            children: state.wrap(tableContent, true),
        }
    }

    state.patch(node, result)

    return state.applyData(node, result)
}
