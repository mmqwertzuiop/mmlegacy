import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl

    const category = searchParams.get('category') ?? undefined
    const search   = searchParams.get('search')   ?? undefined
    const sort     = searchParams.get('sort')      ?? 'newest'
    const page     = Math.max(1, parseInt(searchParams.get('page')  ?? '1',  10))
    const limit    = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)))
    const from     = (page - 1) * limit
    const to       = from + limit - 1

    const supabase = await createClient()

    let query = supabase
      .from('shop_products')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .range(from, to)

    if (category) {
      query = query.eq('category_slug', category)
    }

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    switch (sort) {
      case 'price_asc':
        query = query.order('price_cents', { ascending: true })
        break
      case 'price_desc':
        query = query.order('price_cents', { ascending: false })
        break
      case 'name_asc':
        query = query.order('name', { ascending: true })
        break
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false })
        break
    }

    const { data, error, count } = await query

    if (error) {
      console.error('[GET /api/products]', error.message)
      return NextResponse.json(
        { data: null, error: error.message },
        { status: 500 }
      )
    }

    const totalPages = Math.ceil((count ?? 0) / limit)

    return NextResponse.json({
      data: data ?? [],
      error: null,
      meta: {
        total: count ?? 0,
        page,
        limit,
        total_pages: totalPages,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Interna chyba servera'
    console.error('[GET /api/products] unexpected:', message)
    return NextResponse.json(
      { data: null, error: message },
      { status: 500 }
    )
  }
}
