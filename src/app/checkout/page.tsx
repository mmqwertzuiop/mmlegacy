'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Check, ChevronRight, Package, ArrowLeft, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/mock-products'

type Step = 1 | 2 | 3

interface ShippingForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  city: string
  postalCode: string
}

const EMPTY_FORM: ShippingForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  postalCode: '',
}

const STEPS = [
  { id: 1, label: 'Dorucenie' },
  { id: 2, label: 'Platba' },
  { id: 3, label: 'Potvrdenie' },
] as const

function StepIndicator({ current }: { current: Step }) {
  return (
    <div
      className="flex items-center gap-2 sm:gap-4"
      aria-label="Postup objednavky"
      data-testid="checkout-steps"
    >
      {STEPS.map((step, i) => {
        const done = current > step.id
        const active = current === step.id
        return (
          <div key={step.id} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  done
                    ? 'bg-[#f5c842] text-black'
                    : active
                    ? 'bg-[#f5c842]/20 border-2 border-[#f5c842] text-[#f5c842]'
                    : 'bg-[#1e1e2e] text-[#64748b]'
                }`}
              >
                {done ? <Check className="size-4" /> : step.id}
              </div>
              <span
                className={`text-sm font-medium hidden sm:block ${
                  active ? 'text-[#e2e8f0]' : done ? 'text-[#64748b]' : 'text-[#64748b]'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <ChevronRight className="size-4 text-[#1e1e2e] shrink-0" />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total)
  const clearCart = useCartStore((s) => s.clearCart)

  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<ShippingForm>(EMPTY_FORM)
  const [orderNumber] = useState(() =>
    'PE-' + Math.floor(100000 + Math.random() * 900000)
  )

  function handleField(field: keyof ShippingForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function isStep1Valid() {
    return (
      form.firstName.trim() &&
      form.lastName.trim() &&
      form.email.includes('@') &&
      form.street.trim() &&
      form.city.trim() &&
      form.postalCode.trim()
    )
  }

  function handlePlaceOrder() {
    clearCart()
    setStep(3)
  }

  // Empty cart
  if (items.length === 0 && step !== 3) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center text-center gap-6">
        <ShoppingBag className="size-16 text-[#1e1e2e]" />
        <div>
          <h1 className="text-2xl font-bold text-[#e2e8f0]">
            Kosik je prazdny
          </h1>
          <p className="text-[#64748b] mt-2">
            Pridaj produkty do kosika a vrat sa sem.
          </p>
        </div>
        <Button
          className="bg-[#f5c842] text-black hover:bg-[#f5c842]/80 font-semibold"
          render={<Link href="/shop" />}
        >
          Ist do obchodu
        </Button>
      </div>
    )
  }

  const shipping = 299 // 2.99 EUR flat rate

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#e2e8f0] transition-colors mb-3"
          >
            <ArrowLeft className="size-3.5" />
            Spat do obchodu
          </Link>
          <h1 className="text-2xl font-bold text-[#e2e8f0]">Pokladna</h1>
        </div>
        <StepIndicator current={step} />
      </div>

      {step === 3 ? (
        // Confirmation
        <div
          className="mx-auto max-w-lg flex flex-col items-center text-center gap-6 py-12"
          data-testid="step-confirmation"
        >
          <div className="size-16 rounded-full bg-[#f5c842]/15 border-2 border-[#f5c842] flex items-center justify-center">
            <Check className="size-8 text-[#f5c842]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#e2e8f0]">
              Objednavka prijata!
            </h2>
            <p className="text-[#64748b] mt-2">
              Dakujeme za tvojú objednavku. Coskoro te budeme kontaktovat.
            </p>
          </div>
          <div className="rounded-xl border border-[#1e1e2e] bg-[#111118] p-6 w-full text-left">
            <p className="text-sm text-[#64748b]">Cislo objednavky</p>
            <p className="text-xl font-bold text-[#f5c842] mt-1">{orderNumber}</p>
            <Separator className="bg-[#1e1e2e] my-4" />
            <p className="text-sm text-[#64748b]">Dorucovacia adresa</p>
            <p className="text-sm text-[#e2e8f0] mt-1">
              {form.firstName} {form.lastName}
              <br />
              {form.street}, {form.postalCode} {form.city}
            </p>
            <Separator className="bg-[#1e1e2e] my-4" />
            <p className="text-sm text-[#64748b]">Sposob platby</p>
            <p className="text-sm text-[#e2e8f0] mt-1">Platba pri doruceni (dobierka)</p>
          </div>
          <Button
            className="bg-[#f5c842] text-black hover:bg-[#f5c842]/80 font-semibold w-full"
            render={<Link href="/shop" />}
          >
            Pokracovat v nakupovani
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Left: form steps */}
          <div>
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div data-testid="step-shipping" className="space-y-6">
                <div className="rounded-xl border border-[#1e1e2e] bg-[#111118] p-6">
                  <h2 className="text-base font-semibold text-[#e2e8f0] mb-5">
                    Dorucovacia adresa
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="firstName"
                        className="text-xs font-medium text-[#64748b] uppercase tracking-wide"
                      >
                        Meno *
                      </label>
                      <Input
                        id="firstName"
                        data-testid="shipping-first-name"
                        value={form.firstName}
                        onChange={(e) => handleField('firstName', e.target.value)}
                        placeholder="Jan"
                        className="bg-[#0d0d15] border-[#1e1e2e] text-[#e2e8f0] placeholder:text-[#64748b] focus-visible:border-[#f5c842]/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="lastName"
                        className="text-xs font-medium text-[#64748b] uppercase tracking-wide"
                      >
                        Priezvisko *
                      </label>
                      <Input
                        id="lastName"
                        data-testid="shipping-last-name"
                        value={form.lastName}
                        onChange={(e) => handleField('lastName', e.target.value)}
                        placeholder="Novak"
                        className="bg-[#0d0d15] border-[#1e1e2e] text-[#e2e8f0] placeholder:text-[#64748b] focus-visible:border-[#f5c842]/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="email"
                        className="text-xs font-medium text-[#64748b] uppercase tracking-wide"
                      >
                        Email *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        data-testid="shipping-email"
                        value={form.email}
                        onChange={(e) => handleField('email', e.target.value)}
                        placeholder="jan@example.sk"
                        className="bg-[#0d0d15] border-[#1e1e2e] text-[#e2e8f0] placeholder:text-[#64748b] focus-visible:border-[#f5c842]/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="phone"
                        className="text-xs font-medium text-[#64748b] uppercase tracking-wide"
                      >
                        Telefon
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        data-testid="shipping-phone"
                        value={form.phone}
                        onChange={(e) => handleField('phone', e.target.value)}
                        placeholder="+421 900 000 000"
                        className="bg-[#0d0d15] border-[#1e1e2e] text-[#e2e8f0] placeholder:text-[#64748b] focus-visible:border-[#f5c842]/50"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label
                        htmlFor="street"
                        className="text-xs font-medium text-[#64748b] uppercase tracking-wide"
                      >
                        Ulica a cislo domu *
                      </label>
                      <Input
                        id="street"
                        data-testid="shipping-street"
                        value={form.street}
                        onChange={(e) => handleField('street', e.target.value)}
                        placeholder="Hlavna 1"
                        className="bg-[#0d0d15] border-[#1e1e2e] text-[#e2e8f0] placeholder:text-[#64748b] focus-visible:border-[#f5c842]/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="postalCode"
                        className="text-xs font-medium text-[#64748b] uppercase tracking-wide"
                      >
                        PSC *
                      </label>
                      <Input
                        id="postalCode"
                        data-testid="shipping-postal-code"
                        value={form.postalCode}
                        onChange={(e) => handleField('postalCode', e.target.value)}
                        placeholder="811 01"
                        className="bg-[#0d0d15] border-[#1e1e2e] text-[#e2e8f0] placeholder:text-[#64748b] focus-visible:border-[#f5c842]/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="city"
                        className="text-xs font-medium text-[#64748b] uppercase tracking-wide"
                      >
                        Mesto *
                      </label>
                      <Input
                        id="city"
                        data-testid="shipping-city"
                        value={form.city}
                        onChange={(e) => handleField('city', e.target.value)}
                        placeholder="Bratislava"
                        className="bg-[#0d0d15] border-[#1e1e2e] text-[#e2e8f0] placeholder:text-[#64748b] focus-visible:border-[#f5c842]/50"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  disabled={!isStep1Valid()}
                  className="w-full h-11 bg-[#f5c842] text-black font-semibold hover:bg-[#f5c842]/80 disabled:opacity-40"
                >
                  Pokracovat k platbe
                  <ChevronRight className="size-4 ml-1" />
                </Button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div data-testid="step-payment" className="space-y-6">
                <div className="rounded-xl border border-[#1e1e2e] bg-[#111118] p-6">
                  <h2 className="text-base font-semibold text-[#e2e8f0] mb-5">
                    Sposob platby
                  </h2>

                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5">🚚</span>
                      <div>
                        <p className="text-sm font-semibold text-[#e2e8f0]">
                          Platba pri doruceni (dobierka)
                        </p>
                        <p className="text-sm text-[#64748b] mt-1 leading-relaxed">
                          Platba kartou bude dostupna coskoro. Momentalne
                          prijimame iba platbu pri doruceni. Zaplatite
                          kuriérovi hotovostou alebo kartou pri prevzati
                          balika.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1 h-11 border-[#1e1e2e] bg-[#111118] text-[#e2e8f0] hover:bg-[#1e1e2e]"
                  >
                    <ArrowLeft className="size-4 mr-1" />
                    Spat
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    className="flex-1 h-11 bg-[#f5c842] text-black font-semibold hover:bg-[#f5c842]/80"
                  >
                    Objednat
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order summary */}
          <div>
            <div
              className="rounded-xl border border-[#1e1e2e] bg-[#111118] p-5 sticky top-24"
              data-testid="order-summary"
            >
              <h2 className="text-sm font-semibold text-[#e2e8f0] mb-4">
                Suhrn objednavky
              </h2>

              <ul className="flex flex-col gap-3 mb-4">
                {items.map((item) => {
                  const imgSrc = item.product.images[0] ?? null
                  return (
                    <li
                      key={item.product.id}
                      className="flex items-center gap-3"
                    >
                      <div className="relative size-12 shrink-0 rounded-lg overflow-hidden bg-[#0d0d15]">
                        {imgSrc ? (
                          <Image
                            src={imgSrc}
                            alt={item.product.name}
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Package className="size-4 text-[#1e1e2e]" />
                          </div>
                        )}
                        <span className="absolute -top-1 -right-1 size-4 rounded-full bg-[#f5c842] text-[9px] font-bold text-black flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#e2e8f0] line-clamp-2 leading-snug">
                          {item.product.name}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-[#f5c842] shrink-0">
                        {formatPrice(item.product.price_cents * item.quantity)}
                      </p>
                    </li>
                  )
                })}
              </ul>

              <Separator className="bg-[#1e1e2e] mb-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Medzisucet</span>
                  <span className="text-[#e2e8f0]">{formatPrice(total())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Doprava</span>
                  <span className="text-[#e2e8f0]">{formatPrice(shipping)}</span>
                </div>
                <Separator className="bg-[#1e1e2e]" />
                <div className="flex justify-between font-bold">
                  <span className="text-[#e2e8f0]">Celkova suma</span>
                  <span className="text-[#f5c842] text-base">
                    {formatPrice(total() + shipping)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
