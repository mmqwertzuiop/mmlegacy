import { supabase } from './supabase'
import { PRODUCTS } from '@/data/products'
import type { Product } from '@/types'

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: true })
  if (error || !data || data.length === 0) return PRODUCTS
  return data as Product[]
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single()
  if (error || !data) return PRODUCTS.find(p => p.slug === slug) ?? null
  return data as Product
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('active', true)
    .order('created_at', { ascending: true })
  if (error || !data || data.length === 0) return PRODUCTS.filter(p => p.category === category)
  return data as Product[]
}

export async function getAllSlugs(): Promise<string[]> {
  const { data } = await supabase.from('products').select('slug').eq('active', true)
  if (!data || data.length === 0) return PRODUCTS.map(p => p.slug)
  return data.map(p => p.slug)
}
