import Script from 'next/script'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export default function Analytics() {
  return (
    <>
      {/* Google Analytics 4 (gtag.js) — only load if measurement ID is configured */}
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `}
          </Script>
        </>
      )}
      {/* Plausible Analytics — lightweight, privacy-friendly */}
      <Script
        defer
        data-domain="enablerdao.com"
        src="https://plausible.io/js/script.outbound-links.js"
        strategy="afterInteractive"
      />
    </>
  )
}
