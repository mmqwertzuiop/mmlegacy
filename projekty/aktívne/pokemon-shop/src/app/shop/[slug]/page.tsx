import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductBySlug, getAllSlugs, getProducts } from '@/lib/products-db'
import ProductDetailClient from './ProductDetailClient'

export const revalidate = 60

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Produkt nenájdený — MM Legacy' }
  return { title: `${product.name} — MM Legacy`, description: product.description }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()
  const allProducts = await getProducts()
  const related = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
  return <ProductDetailClient product={product} related={related} />
}
