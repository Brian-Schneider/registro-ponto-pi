async function getBaseUrl() {
    const response = await fetch('/api/getBaseUrl');
    const baseUrl = await response.text();
    console.log('Base URL response:', baseUrl);
    return baseUrl;
}

async function apiRequest(endpoint, method = 'GET', body = null, headers = {}, requireAuth = true) {
    const url = await getBaseUrl() + endpoint;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    };

    if (requireAuth) {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken || accessToken.split('.').length !== 3) {
            console.error('Invalid or missing access token');
            throw new Error('Invalid or missing access token');
        }
        options.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

export async function fetchRelatorio(funcionario, periodo) {
    const endpoint = `/registro/?funcionario=${funcionario}&periodo=${periodo}`;
    return await apiRequest(endpoint);
}

export async function login(email, password) {
    const endpoint = '/login';
    const body = { email, password };
    return await apiRequest(endpoint, 'POST', body, {}, false);
}

export async function saveRegistro(body) {
    const endpoint = '/registro/salvar';
    const registro = body;
    return await apiRequest(endpoint, 'POST', registro);
}

export async function fetchHistoryUser(userId) {
    const endpoint = `/registro/${userId}`;
    return await apiRequest(endpoint);
}

export async function criarFuncionario(body) {
    const endpoint = '/funcionarios/cadastrar';
    return await apiRequest(endpoint, 'POST', body);
}

export async function atualizarFuncionario(body) {
    const endpoint = '/funcionarios/cadastrar';
    return await apiRequest(endpoint, 'PUT', body);
}

export async function fetchFuncionarios() {
    const endpoint = '/funcionarios';
    return await apiRequest(endpoint);
}

export async function fetchFuncionariosByName(nome) {
    const endpoint = `/funcionarios/?nome=${nome}`;
    return await apiRequest(endpoint);
}