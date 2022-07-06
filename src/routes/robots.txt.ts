export async function get({ url }: any) {
    let parsed = new URL(url);
    return {
        headers: {
            'Content-Type': 'text/plain',
        },
        body: `User-agent: *
Disallow:
Sitemap: ${parsed.origin}/sitemap.xml`,
    };
};
