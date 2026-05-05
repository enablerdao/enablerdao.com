/// Serves static assets embedded at compile time.
///
/// Text files use `include_str!` and binary files use `include_bytes!`.
/// All responses set `Cache-Control: public, max-age=86400` (24 hours).

use spin_sdk::http::Response;

// ── Text assets ──────────────────────────────────────────────────────────────

const CSS: &str = include_str!("../../static/styles.css");
const JS: &str = include_str!("../../static/app.js");
const FAVICON: &str = include_str!("../../static/favicon.svg");
const ENABLER_HTML: &str = include_str!("../../static/enabler.html");
const PRODUCTS_HTML: &str = include_str!("../../static/products.html");
const FUTAMI_HTML: &str = include_str!("../../static/futami/index.html");
const FUTAMI_VILLAGE_HTML: &str = include_str!("../../static/futami/village.html");
const FUTAMI_COMPLEX_HTML: &str = include_str!("../../static/futami/complex.html");

// ── Binary assets ────────────────────────────────────────────────────────────

// Futami vision concept renders (AI-generated)
const FUTAMI_AERIAL: &[u8]      = include_bytes!("../../static/futami/vision_aerial.jpg");
const FUTAMI_COMPLEX: &[u8]     = include_bytes!("../../static/futami/vision_complex.jpg");
const FUTAMI_OMOTESANDO: &[u8]  = include_bytes!("../../static/futami/vision_omotesando.jpg");
const FUTAMI_GLAMPING: &[u8]    = include_bytes!("../../static/futami/vision_glamping.jpg");
const FUTAMI_LOBBY: &[u8]       = include_bytes!("../../static/futami/vision_lobby.jpg");
const FUTAMI_STREET: &[u8]      = include_bytes!("../../static/futami/complex_street.jpg");
const FUTAMI_PR: &[u8]          = include_bytes!("../../static/futami/complex_pr.jpg");
const FUTAMI_2F: &[u8]          = include_bytes!("../../static/futami/complex_2f.jpg");
const FUTAMI_ROOM: &[u8]        = include_bytes!("../../static/futami/complex_room.jpg");
const FUTAMI_NIGHT: &[u8]       = include_bytes!("../../static/futami/complex_night.jpg");
const FUTAMI_ROOFTOP: &[u8]     = include_bytes!("../../static/futami/complex_rooftop.jpg");
const FUTAMI_WATER: &[u8]       = include_bytes!("../../static/futami/complex_water.jpg");
const FUTAMI_MORNING: &[u8]     = include_bytes!("../../static/futami/complex_morning.jpg");
const FUTAMI_VISTA: &[u8]       = include_bytes!("../../static/futami/complex_vista.jpg");
const FUTAMI_MARKET: &[u8]      = include_bytes!("../../static/futami/complex_market.jpg");

// Futami property photos (before + AI-generated after)
const FUTAMI_6_27_BEFORE: &[u8] = include_bytes!("../../static/futami/6-27_before.jpg");
const FUTAMI_6_27_AFTER: &[u8] = include_bytes!("../../static/futami/6-27_after.jpg");
const FUTAMI_6_15_BEFORE: &[u8] = include_bytes!("../../static/futami/6-15_before.png");
const FUTAMI_6_15_AFTER: &[u8] = include_bytes!("../../static/futami/6-15_after.jpg");
const FUTAMI_7_19_BEFORE: &[u8] = include_bytes!("../../static/futami/7-19_before.png");
const FUTAMI_7_19_AFTER: &[u8] = include_bytes!("../../static/futami/7-19_after.jpg");
const FUTAMI_7530_BEFORE: &[u8] = include_bytes!("../../static/futami/7530_before.jpg");
const FUTAMI_7530_AFTER: &[u8] = include_bytes!("../../static/futami/7530_after.jpg");
const FUTAMI_7269_BEFORE: &[u8] = include_bytes!("../../static/futami/7269_before.jpg");
const FUTAMI_7269_AFTER: &[u8] = include_bytes!("../../static/futami/7269_after.jpg");

const IMG_ATAMI: &[u8] = include_bytes!("../../static/properties/atami.jpg");
const IMG_TESHIKAGA: &[u8] = include_bytes!("../../static/properties/teshikaga.jpg");
const IMG_NEST: &[u8] = include_bytes!("../../static/properties/nest.jpg");
const IMG_HONOLULU: &[u8] = include_bytes!("../../static/properties/honolulu.jpg");

// App Icons
const ICON_ELIO: &[u8] = include_bytes!("../../static/app-icons/elio.png");
const ICON_PASHA: &[u8] = include_bytes!("../../static/app-icons/pasha.png");
const ICON_CLAUDETERM: &[u8] = include_bytes!("../../static/app-icons/claudeterm.png");
const ICON_STAYFLOW: &[u8] = include_bytes!("../../static/app-icons/stayflow.png");
const ICON_JIUFLOW: &[u8] = include_bytes!("../../static/app-icons/jiuflow.png");
const ICON_PON: &[u8] = include_bytes!("../../static/app-icons/pon.png");
const ICON_KAGI: &[u8] = include_bytes!("../../static/app-icons/kagi.png");
const ICON_NOU: &[u8] = include_bytes!("../../static/app-icons/nou.png");
const ICON_CHARIN: &[u8] = include_bytes!("../../static/app-icons/charin.png");
const ICON_SAKUTSU: &[u8] = include_bytes!("../../static/app-icons/sakutsu.png");
const ICON_POI: &[u8] = include_bytes!("../../static/app-icons/poi.png");
const ICON_TORO: &[u8] = include_bytes!("../../static/app-icons/toro.png");
const ICON_MISEBAN: &[u8] = include_bytes!("../../static/app-icons/miseban_ai.png");
const ICON_BANTO: &[u8] = include_bytes!("../../static/app-icons/banto.png");
const ICON_ENABLERDAO: &[u8] = include_bytes!("../../static/app-icons/enablerdao.png");
const ICON_SOLUNA: &[u8] = include_bytes!("../../static/app-icons/soluna.png");
const ICON_KOE_DEVICE: &[u8] = include_bytes!("../../static/app-icons/koe_device.png");
const ICON_KOE_SOFTWARE: &[u8] = include_bytes!("../../static/app-icons/koe_software.png");

// Screenshots
const SS_KAGI: &[u8] = include_bytes!("../../static/screenshots/kagi-home.jpg");
const SS_PASHA: &[u8] = include_bytes!("../../static/screenshots/pasha-home.jpg");
const SS_CHARIN: &[u8] = include_bytes!("../../static/screenshots/charin-home.jpg");
const SS_PON: &[u8] = include_bytes!("../../static/screenshots/pon-home.jpg");
const SS_SAKUTSU: &[u8] = include_bytes!("../../static/screenshots/sakutsu-home.jpg");

// ── Cache header applied to every static response ────────────────────────────

const CACHE_CONTROL: &str = "public, max-age=86400";

/// Attempts to serve the static file at `path`.
///
/// Returns `Some(Response)` with the correct `Content-Type` and cache headers
/// if the path matches a known asset, or `None` if not found.
pub fn serve_static(path: &str) -> Option<Response> {
    match path {
        // Text assets
        "/static/styles.css" => Some(text_response(CSS, "text/css")),
        "/static/app.js" => Some(text_response(JS, "application/javascript")),
        "/static/favicon.svg" => Some(text_response(FAVICON, "image/svg+xml")),

        // Image assets
        "/static/properties/atami.jpg" => Some(bytes_response(IMG_ATAMI, "image/jpeg")),
        "/static/properties/teshikaga.jpg" => Some(bytes_response(IMG_TESHIKAGA, "image/jpeg")),
        "/static/properties/nest.jpg" => Some(bytes_response(IMG_NEST, "image/jpeg")),
        "/static/properties/honolulu.jpg" => Some(bytes_response(IMG_HONOLULU, "image/jpeg")),

        "/static/enabler.html" => Some(text_response(ENABLER_HTML, "text/html")),
        "/static/products.html" => Some(text_response(PRODUCTS_HTML, "text/html")),

        // Futami village vision renders
        "/static/futami/vision_aerial.jpg"     => Some(bytes_response(FUTAMI_AERIAL,     "image/jpeg")),
        "/static/futami/vision_complex.jpg"    => Some(bytes_response(FUTAMI_COMPLEX,    "image/jpeg")),
        "/static/futami/vision_omotesando.jpg" => Some(bytes_response(FUTAMI_OMOTESANDO, "image/jpeg")),
        "/static/futami/vision_glamping.jpg"   => Some(bytes_response(FUTAMI_GLAMPING,   "image/jpeg")),
        "/static/futami/vision_lobby.jpg"      => Some(bytes_response(FUTAMI_LOBBY,      "image/jpeg")),
        "/static/futami/complex_street.jpg"    => Some(bytes_response(FUTAMI_STREET,     "image/jpeg")),
        "/static/futami/complex_pr.jpg"        => Some(bytes_response(FUTAMI_PR,         "image/jpeg")),
        "/static/futami/complex_2f.jpg"        => Some(bytes_response(FUTAMI_2F,         "image/jpeg")),
        "/static/futami/complex_room.jpg"      => Some(bytes_response(FUTAMI_ROOM,       "image/jpeg")),
        "/static/futami/complex_night.jpg"     => Some(bytes_response(FUTAMI_NIGHT,      "image/jpeg")),
        "/static/futami/complex_rooftop.jpg"   => Some(bytes_response(FUTAMI_ROOFTOP,    "image/jpeg")),
        "/static/futami/complex_water.jpg"     => Some(bytes_response(FUTAMI_WATER,     "image/jpeg")),
        "/static/futami/complex_morning.jpg"   => Some(bytes_response(FUTAMI_MORNING,   "image/jpeg")),
        "/static/futami/complex_vista.jpg"     => Some(bytes_response(FUTAMI_VISTA,     "image/jpeg")),
        "/static/futami/complex_market.jpg"    => Some(bytes_response(FUTAMI_MARKET,    "image/jpeg")),

        // Futami property images
        "/static/futami/6-27_before.jpg" => Some(bytes_response(FUTAMI_6_27_BEFORE, "image/jpeg")),
        "/static/futami/6-27_after.jpg"  => Some(bytes_response(FUTAMI_6_27_AFTER,  "image/jpeg")),
        "/static/futami/6-15_before.png" => Some(bytes_response(FUTAMI_6_15_BEFORE, "image/png")),
        "/static/futami/6-15_after.jpg"  => Some(bytes_response(FUTAMI_6_15_AFTER,  "image/jpeg")),
        "/static/futami/7-19_before.png" => Some(bytes_response(FUTAMI_7_19_BEFORE, "image/png")),
        "/static/futami/7-19_after.jpg"  => Some(bytes_response(FUTAMI_7_19_AFTER,  "image/jpeg")),
        "/static/futami/7530_before.jpg" => Some(bytes_response(FUTAMI_7530_BEFORE, "image/jpeg")),
        "/static/futami/7530_after.jpg"  => Some(bytes_response(FUTAMI_7530_AFTER,  "image/jpeg")),
        "/static/futami/7269_before.jpg" => Some(bytes_response(FUTAMI_7269_BEFORE, "image/jpeg")),
        "/static/futami/7269_after.jpg"  => Some(bytes_response(FUTAMI_7269_AFTER,  "image/jpeg")),

        // App Icons
        "/static/app-icons/elio.png" => Some(bytes_response(ICON_ELIO, "image/png")),
        "/static/app-icons/pasha.png" => Some(bytes_response(ICON_PASHA, "image/png")),
        "/static/app-icons/claudeterm.png" => Some(bytes_response(ICON_CLAUDETERM, "image/png")),
        "/static/app-icons/stayflow.png" => Some(bytes_response(ICON_STAYFLOW, "image/png")),
        "/static/app-icons/jiuflow.png" => Some(bytes_response(ICON_JIUFLOW, "image/png")),
        "/static/app-icons/pon.png" => Some(bytes_response(ICON_PON, "image/png")),
        "/static/app-icons/kagi.png" => Some(bytes_response(ICON_KAGI, "image/png")),
        "/static/app-icons/nou.png" => Some(bytes_response(ICON_NOU, "image/png")),
        "/static/app-icons/charin.png" => Some(bytes_response(ICON_CHARIN, "image/png")),
        "/static/app-icons/sakutsu.png" => Some(bytes_response(ICON_SAKUTSU, "image/png")),
        "/static/app-icons/poi.png" => Some(bytes_response(ICON_POI, "image/png")),
        "/static/app-icons/toro.png" => Some(bytes_response(ICON_TORO, "image/png")),
        "/static/app-icons/miseban_ai.png" => Some(bytes_response(ICON_MISEBAN, "image/png")),
        "/static/app-icons/banto.png" => Some(bytes_response(ICON_BANTO, "image/png")),
        "/static/app-icons/enablerdao.png" => Some(bytes_response(ICON_ENABLERDAO, "image/png")),
        "/static/app-icons/soluna.png" => Some(bytes_response(ICON_SOLUNA, "image/png")),
        "/static/app-icons/koe_device.png" => Some(bytes_response(ICON_KOE_DEVICE, "image/png")),
        "/static/app-icons/koe_software.png" => Some(bytes_response(ICON_KOE_SOFTWARE, "image/png")),

        // Screenshots
        "/static/screenshots/kagi-home.jpg" => Some(bytes_response(SS_KAGI, "image/jpeg")),
        "/static/screenshots/pasha-home.jpg" => Some(bytes_response(SS_PASHA, "image/jpeg")),
        "/static/screenshots/charin-home.jpg" => Some(bytes_response(SS_CHARIN, "image/jpeg")),
        "/static/screenshots/pon-home.jpg" => Some(bytes_response(SS_PON, "image/jpeg")),
        "/static/screenshots/sakutsu-home.jpg" => Some(bytes_response(SS_SAKUTSU, "image/jpeg")),

        _ => None,
    }
}

/// Serve the Enabler vision page directly
pub fn serve_enabler_page() -> Response {
    text_response(ENABLER_HTML, "text/html; charset=utf-8")
}

/// Serve the Products showcase page
pub fn serve_products_page() -> Response {
    text_response(PRODUCTS_HTML, "text/html; charset=utf-8")
}

/// Serve the Futami Airbnb property comparison page
pub fn serve_futami_page() -> Response {
    text_response(FUTAMI_HTML, "text/html; charset=utf-8")
}

/// Serve the MISOGIHAMA resort village development concept page
pub fn serve_futami_village_page() -> Response {
    text_response(FUTAMI_VILLAGE_HTML, "text/html; charset=utf-8")
}

/// Serve the station complex detailed design brief
pub fn serve_complex_page() -> Response {
    text_response(FUTAMI_COMPLEX_HTML, "text/html; charset=utf-8")
}

/// Build a 200 response from a `&str` body.
fn text_response(body: &str, content_type: &str) -> Response {
    Response::builder()
        .status(200)
        .header("content-type", content_type)
        .header("cache-control", CACHE_CONTROL)
        .body(body)
        .build()
}

/// Build a 200 response from a `&[u8]` body.
fn bytes_response(body: &[u8], content_type: &str) -> Response {
    Response::builder()
        .status(200)
        .header("content-type", content_type)
        .header("cache-control", CACHE_CONTROL)
        .body(body.to_vec())
        .build()
}
