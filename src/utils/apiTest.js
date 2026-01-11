// Simple API test utility
export const testApiConnection = async () => {
    try {
        // Test direct fetch without axios
        const response = await fetch('http://localhost/career-path-api/api/courses/index.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        console.log('Direct fetch response status:', response.status);
        console.log('Direct fetch response headers:', response.headers);
        
        const data = await response.json();
        console.log('Direct fetch response data:', data);
        
        return {
            success: true,
            data: data,
            method: 'direct_fetch'
        };
    } catch (error) {
        console.error('Direct fetch error:', error);
        return {
            success: false,
            error: error.message,
            method: 'direct_fetch'
        };
    }
};

export const testAxiosConnection = async () => {
    try {
        const api = (await import('../services/api')).default;
        const response = await api.get('/courses/index.php');
        
        console.log('Axios response:', response);
        
        return {
            success: true,
            data: response.data,
            method: 'axios'
        };
    } catch (error) {
        console.error('Axios error:', error);
        return {
            success: false,
            error: error.message,
            response: error.response?.data,
            method: 'axios'
        };
    }
};