import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { CreateOrderInput, ShippingAddress } from '@/types/shop'

// ─── Validácia ────────────────────────────────────────────────────────────────

function isValidShippingAddress(addr: unknown): addr is ShippingAddress {
  if (!addr || typeof addr !== 'object') return false
  const a = addr as Record<string, unknown>
  const required: (keyof ShippingAddress)[] = [
    'first_name', 'last_name', 'email', 'phone',
    'street', 'city', 'postal_code', 'country',
  ]
  return required.every((key) => typeof a[key] === 'string' && a[key] !== '')
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// ─── POST /api/orders ─────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { data: null, error: 'Neplatne JSON telo poziadavky' },
        { status: 400 }
      )
    }

    const input = body as CreateOrderInput

    // ── Validácia items ──────────────────────────────────────────────────────
    if (!Array.isArray(input?.items) || input.items.length === 0) {
      return NextResponse.json(
        { data: null, error: 'Objednavka musi obsahovat aspon jednu polozku' },
        { status: 400 }
      )
    }

    for (const item of input.items) {
      if (!item.product_id || typeof item.product_id !== 'string') {
        return NextResponse.json(
          { data: null, error: 'Neplatne product_id v polozke objednavky' },
          { status: 400 }
        )
      }
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return NextResponse.json(
          { data: null, error: 'Mnozstvo musi byt cele cislo >= 1' },
          { status: 400 }
        )
      }
      if (!Number.isInteger(item.price_cents) || item.price_cents < 1) {
        return NextResponse.json(
          { data: null, error: 'price_cents musi byt cele cislo > 0' },
          { status: 400 }
        )
      }
    }

    // ── Validácia shipping_address ───────────────────────────────────────────
    if (!isValidShippingAddress(input?.shipping_address)) {
      return NextResponse.json(
        { data: null, error: 'Neplatna alebo neuplna adresa dorucovania' },
        { status: 400 }
      )
    }

    if (!isValidEmail(input.shipping_address.email)) {
      return NextResponse.json(
        { data: null, error: 'Neplatna emailova adresa' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // ── Zisti aktuálneho usera (nepovinné — anonymné objednávky povolené) ────
    const { data: { user } } = await supabase.auth.getUser()

    // ── Vypočítaj total na serveri (bezpečnostné opatrenie) ──────────────────
    const productIds = input.items.map((i) => i.product_id)
    const { data: productsRaw, error: productsError } = await supabase
      .from('shop_products')
      .select('id, price_cents, stock_quantity, is_active, name')
      .in('id', productIds)
    const products = productsRaw as Array<{ id: string; price_cents: number; stock_quantity: number; is_active: boolean; name: string }> | null

    if (productsError) {
      console.error('[POST /api/orders] products fetch:', productsError.message)
      return NextResponse.json(
        { data: null, error: 'Chyba pri nacitani produktov' },
        { status: 500 }
      )
    }

    // ── Skontroluj dostupnosť a prepočítaj ceny ──────────────────────────────
    const productMap = new Map(products?.map((p) => [p.id, p]) ?? [])
    let totalCents = 0
    const verifiedItems: Array<{ product_id: string; quantity: number; price_cents: number }> = []

    for (const item of input.items) {
      const product = productMap.get(item.product_id)
      if (!product) {
        return NextResponse.json(
          { data: null, error: `Produkt ${item.product_id} nenajdeny alebo nie je aktivny` },
          { status: 400 }
        )
      }
      if (product.stock_quantity < item.quantity) {
        return NextResponse.json(
          { data: null, error: `Nedostatok skladu pre produkt: ${product.name}` },
          { status: 400 }
        )
      }
      // Pouzi cenu zo servera, nie z klienta
      totalCents += product.price_cents * item.quantity
      verifiedItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price_cents: product.price_cents,
      })
    }

    // ── Vytvor objednávku ────────────────────────────────────────────────────
    const { data: order, error: orderError } = await supabase
      .from('shop_orders')
      .insert({
        user_id: user?.id ?? null,
        status: 'pending',
        total_cents: totalCents,
        shipping_address: input.shipping_address as unknown as import('@/types/database').Json,
        notes: input.notes ?? null,
      })
      .select('id')
      .single()

    if (orderError || !order) {
      console.error('[POST /api/orders] insert order:', orderError?.message)
      return NextResponse.json(
        { data: null, error: 'Chyba pri vytvarani objednavky' },
        { status: 500 }
      )
    }

    // ── Vlož order items ─────────────────────────────────────────────────────
    const orderItems = verifiedItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_cents: item.price_cents,
    }))

    const { error: itemsError } = await supabase
      .from('shop_order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('[POST /api/orders] insert items:', itemsError.message)
      // Objednávka vznikla ale items nie — potrebný rollback cez DB trigger v produkcii
      return NextResponse.json(
        { data: null, error: 'Chyba pri ulozeni poloziek objednavky' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        data: {
          orderId: order.id,
          status: 'pending',
          total_cents: totalCents,
        },
        error: null,
      },
      { status: 201 }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Interna chyba servera'
    console.error('[POST /api/orders] unexpected:', message)
    return NextResponse.json(
      { data: null, error: message },
      { status: 500 }
    )
  }
}
