import Script from 'next/script'

export default function Analytics() {
  return (
    <>
      {/* Plausible Analytics */}
      <Script
        defer
        data-domain="enablerdao.com"
        src="https://plausible.io/js/script.js"
      />
    </>
  )
}
