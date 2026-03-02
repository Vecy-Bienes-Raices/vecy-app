import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    twitterCard = "summary_large_image"
}) => {
    const location = useLocation();

    useEffect(() => {
        // Update Title
        if (title) {
            document.title = title;
        }

        // Update Description
        updateMetaTag('name', 'description', description);

        // Update Keywords
        updateMetaTag('name', 'keywords', keywords);

        // Update OpenGraph tags
        updateMetaTag('property', 'og:title', ogTitle || title);
        updateMetaTag('property', 'og:description', ogDescription || description);
        updateMetaTag('property', 'og:image', ogImage);
        updateMetaTag('property', 'og:url', ogUrl || window.location.origin + location.pathname);
        updateMetaTag('property', 'og:type', 'website');

        // Update Twitter tags
        updateMetaTag('name', 'twitter:card', twitterCard);
        updateMetaTag('name', 'twitter:title', ogTitle || title);
        updateMetaTag('name', 'twitter:description', ogDescription || description);
        updateMetaTag('name', 'twitter:image', ogImage);

        // Tracking tags & Bots hints (example placeholders)
        updateMetaTag('name', 'robots', 'index, follow');
        updateMetaTag('name', 'googlebot', 'index, follow');

    }, [title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl, twitterCard, location]);

    const updateMetaTag = (attr, key, content) => {
        if (!content) return;

        let element = document.querySelector(`meta[${attr}="${key}"]`);

        if (!element) {
            element = document.createElement('meta');
            element.setAttribute(attr, key);
            document.head.appendChild(element);
        }

        element.setAttribute('content', content);
    };

    return null; // This component doesn't render anything
};

export default SEO;
