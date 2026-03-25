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

// ── Binary assets ────────────────────────────────────────────────────────────

const IMG_ATAMI: &[u8] = include_bytes!("../../static/properties/atami.jpg");
const IMG_TESHIKAGA: &[u8] = include_bytes!("../../static/properties/teshikaga.jpg");
const IMG_NEST: &[u8] = include_bytes!("../../static/properties/nest.jpg");
const IMG_HONOLULU: &[u8] = include_bytes!("../../static/properties/honolulu.jpg");

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
        _ => None,
    }
}

/// Serve the Enabler vision page directly
pub fn serve_enabler_page() -> Response {
    text_response(ENABLER_HTML, "text/html; charset=utf-8")
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
