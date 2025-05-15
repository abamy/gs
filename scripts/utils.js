export async function loadNav() {
    
    const response = await fetch(`/query-index.json`);
    if (!response.ok) {
        throw new Error('Failed to fetch query index');
    }
    return await response.json();
}

export const isAuthorMode = window.location.href.includes('.html');
