interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
}

const SEO = ({
    title = "Incridea'26 | Innovate, Create, Ideate",
    description = "Official website of Incridea, the national level techno-cultural fest of NMAM Institute of Technology.",
    keywords = "Incridea, NMAMIT, Techno-cultural fest, Nitte, Engineering fest, College fest",
    image = "/thumbnail.jpg", // Ensure you have a default thumbnail in public folder or update this
    url = window.location.href
}: SEOProps) => {
    const siteTitle = title.includes("Incridea'26") ? title : `${title} | Incridea'26`;

    return (
        <>
            {/* Standard Metadata */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta charSet="utf-8" />
            <link rel="canonical" href={url} />

            {/* Open Graph (Instagram, WhatsApp, LinkedIn) */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Structured Data for Instagram */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "url": url,
                    "logo": image,
                    "sameAs": [
                        "https://www.instagram.com/incridea"
                    ]
                })}
            </script>
        </>
    );
};

export default SEO;
