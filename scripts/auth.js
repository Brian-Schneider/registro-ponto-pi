function isAuthenticated() {
    return localStorage.getItem('accessToken') !== null;
}

function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'pages/login.html';
    }
}

function getUserRole() {
    return localStorage.getItem('role'); 
}

function requireRole() {
    const role =  getUserRole();
    if (role !== 'admin') {
        window.location.href = 'index.html';
    }
}