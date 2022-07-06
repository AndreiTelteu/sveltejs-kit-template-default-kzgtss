import api from '$lib/api';
import type { Product } from '$types';
export async function get({ url }: any) {
    const headers = {
        'Cache-Control': 'max-age=0, s-maxage=3600',
        'Content-Type': 'application/xml',
    };
    let parsed = new URL(url);
    let { produse } = await api.getProducts();
    return {
        headers,
        body: `<?xml version="1.0" encoding="UTF-8" ?>
<urlset
    xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
    xmlns:xhtml="https://www.w3.org/1999/xhtml"
    xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
    xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
    xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
>
    <url>
        <loc>${parsed.origin}</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${parsed.origin}/produse</loc>
        <changefreq>daily</changefreq>
        <priority>1</priority>
    </url>
    ${produse.map((produs: Product) => `
    <url>
        <loc>${parsed.origin}/produs/${produs.id}</loc>
        <changefreq>daily</changefreq>
        <priority>0.7</priority>
    </url>
    `).join('')}
</urlset>`,
    };
}
