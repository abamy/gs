export async function loadNav() {
    try {
        const response = await fetch(`/nav.json`);
        if (!response.ok) {
            throw new Error(`Failed to fetch navigation: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();

        const filteredData = result.data.filter(item => 
            item.path.startsWith('/pages/')
        );
        
        filteredData.forEach(item => {
            item.path = item.path.replace('/pages', '');
        });

        return filteredData;
    } catch (error) {
        console.error('Error loading navigation:', error);
        return [];
    }
}

export const isAuthorMode = window.location.href.includes('.html');
