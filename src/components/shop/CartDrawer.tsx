'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Trash2, Plus, Minus, Package } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/mock-products'

export function CartDrawer() {
  const items = useCartStore((s) => s.items)
  const isOpen = useCartStore((s) => s.isOpen)
  const closeCart = useCartStore((s) => s.closeCart)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQty = useCartStore((s) => s.updateQty)
  const total = useCartStore((s) => s.total)

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        data-testid="cart-drawer"
        side="right"
        className="flex w-full flex-col bg-[#111118] border-l border-[#1e1e2e] sm:max-w-md p-0"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-[#1e1e2e]">
          <SheetTitle className="flex items-center gap-2 text-[#e2e8f0] text-base font-semibold">
            <ShoppingCart className="size-5 text-[#f5c842]" />
            Kosik
            {items.length > 0 && (
              <span className="ml-1 rounded-full bg-[#f5c842] px-2 py-0.5 text-[11px] font-bold text-black">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center">
              <ShoppingCart className="size-16 text-[#1e1e2e]" />
              <div>
                <p className="text-[#e2e8f0] font-medium">Kosik je prazdny</p>
                <p className="text-[#64748b] text-sm mt-1">
                  Pridaj produkty z obchodu
                </p>
              </div>
              <Button
                onClick={closeCart}
                className="mt-2 bg-[#f5c842] text-black hover:bg-[#f5c842]/80"
                render={<Link href="/shop" />}
              >
                Ist do obchodu
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => {
                const imgSrc = item.product.images[0] ?? null
                return (
                  <li
                    key={item.product.id}
                    data-testid={`cart-item-${item.product.id}`}
                    className="flex gap-3 rounded-xl bg-[#0d0d15] p-3 border border-[#1e1e2e]"
                  >
                    {/* Thumbnail */}
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-[#111118]">
                      {imgSrc ? (
                        <Image
                          src={imgSrc}
                          alt={item.product.name}
                          fill
                          sizes="64px"
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package className="size-6 text-[#1e1e2e]" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col gap-1 min-w-0">
                      <p className="text-[13px] font-medium text-[#e2e8f0] line-clamp-2 leading-snug">
                        {item.product.name}
                      </p>
                      <p className="text-[#f5c842] text-sm font-bold">
                        {formatPrice(item.product.price_cents)}
                      </p>

                      {/* Qty controls */}
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          data-testid={`qty-decrease-${item.product.id}`}
                          onClick={() =>
                            updateQty(item.product.id, item.quantity - 1)
                          }
                          className="size-6 rounded-md border border-[#1e1e2e] bg-[#111118] flex items-center justify-center text-[#64748b] hover:text-[#e2e8f0] hover:border-[#f5c842]/40 transition-colors"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="min-w-[20px] text-center text-sm font-medium text-[#e2e8f0]">
                          {item.quantity}
                        </span>
                        <button
                          data-testid={`qty-increase-${item.product.id}`}
                          onClick={() =>
                            updateQty(item.product.id, item.quantity + 1)
                          }
                          disabled={
                            item.quantity >= item.product.stock_quantity
                          }
                          className="size-6 rounded-md border border-[#1e1e2e] bg-[#111118] flex items-center justify-center text-[#64748b] hover:text-[#e2e8f0] hover:border-[#f5c842]/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Plus className="size-3" />
                        </button>

                        <button
                          data-testid={`cart-remove-${item.product.id}`}
                          onClick={() => removeItem(item.product.id)}
                          className="ml-auto size-6 rounded-md flex items-center justify-center text-[#64748b] hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer with total */}
        {items.length > 0 && (
          <SheetFooter className="px-6 pb-6 pt-4 border-t border-[#1e1e2e] flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[#64748b] text-sm">Medzisucet</span>
              <span className="text-[#e2e8f0] font-bold text-base">
                {formatPrice(total())}
              </span>
            </div>
            <Separator className="bg-[#1e1e2e]" />
            <p className="text-[11px] text-[#64748b] text-center">
              Doprava a dane sa vypocitaju pri pokladni
            </p>
            <Button
              data-testid="cart-checkout-btn"
              onClick={closeCart}
              className="w-full bg-[#f5c842] text-black font-semibold hover:bg-[#f5c842]/80 h-11 text-sm"
              render={<Link href="/checkout" />}
            >
              Prejst k platbe
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
