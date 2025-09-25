import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'

export const dynamic = 'force-dynamic'

// グラフデータを取得するGROQクエリ
const GRAPH_QUERY = groq`{
  "nodes": *[!(_id in path("drafts.*")) && !(_type in ["system.*", "sanity.*"])] {
    "id": _id,
    "label": coalesce(title, name, _type),
    "type": _type,
    "group": _type
  },
  "edges": *[!(_id in path("drafts.*")) && defined(references)] {
    "from": _id,
    "references": references(*[]{
      "to": _id,
      "type": _type
    })
  }
}`

interface Node {
  id: string
  label: string
  type: string
  group: string
}

interface Edge {
  from: string
  to: string
  type: string
}

export async function GET() {
  try {
    console.log('[Content Graph API] Fetching graph data...')

    // Sanityからグラフデータを取得
    const data = await client.fetch(GRAPH_QUERY)

    // エッジデータをフラット化
    const edges: Edge[] = []
    if (data.edges && Array.isArray(data.edges)) {
      data.edges.forEach((item: any) => {
        if (item.references && Array.isArray(item.references)) {
          item.references.forEach((ref: any) => {
            if (ref.to) {
              edges.push({
                from: item.from,
                to: ref.to,
                type: ref.type || 'reference'
              })
            }
          })
        }
      })
    }

    // ノードデータの整形
    const nodes: Node[] = data.nodes || []

    // 統計情報を追加
    const stats = {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      nodeTypes: nodes.reduce((acc: any, node: Node) => {
        acc[node.type] = (acc[node.type] || 0) + 1
        return acc
      }, {}),
      timestamp: new Date().toISOString()
    }

    console.log(`[Content Graph API] Found ${nodes.length} nodes and ${edges.length} edges`)

    return NextResponse.json({
      success: true,
      data: {
        nodes,
        edges
      },
      stats
    })
  } catch (error) {
    console.error('[Content Graph API] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        data: {
          nodes: [],
          edges: []
        }
      },
      { status: 500 }
    )
  }
}