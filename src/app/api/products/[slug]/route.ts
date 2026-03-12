import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ slug: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { data: null, error: 'Neplatny slug' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('shop_products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { data: null, error: 'Produkt nenajdeny' },
          { status: 404 }
        )
      }
      console.error('[GET /api/products/[slug]]', error.message)
      return NextResponse.json(
        { data: null, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data, error: null })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Interna chyba servera'
    console.error('[GET /api/products/[slug]] unexpected:', message)
    return NextResponse.json(
      { data: null, error: message },
      { status: 500 }
    )
  }
}
