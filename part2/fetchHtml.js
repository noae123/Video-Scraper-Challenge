export async function fetchHtml(url) {
    const res = await fetch(url);
    const html = await res.text();

    return html;
}