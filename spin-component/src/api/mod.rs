/// API endpoint handlers.
///
/// Each sub-module exposes functions that accept a `spin_sdk::http::Request`
/// (or nothing for GETs) and return a `spin_sdk::http::Response`.

pub mod ideas;
pub mod qa;
pub mod newsletter;
pub mod feedback;
pub mod metrics;
