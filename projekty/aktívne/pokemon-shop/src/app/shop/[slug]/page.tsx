import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PRODUCTS, formatPrice } from '@/data/products'
import ProductDetailClient from './ProductDetailClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = PRODUCTS.find(p => p.slug === slug)
  if (!product) return { title: 'Produkt nenájdený — MM Legacy' }
  return {
    title: `${product.name} — MM Legacy`,
    description: product.description,
  }
}

export async function generateStaticParams() {
  return PRODUCTS.map(p => ({ slug: p.slug }))
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = PRODUCTS.find(p => p.slug === slug)
  if (!product) notFound()

  const related = PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return <ProductDetailClient product={product} related={related} />
}
