function getUserRole() {
    return localStorage.getItem('role'); 
}

function requireRole() {
    const role =  getUserRole();
    if (role !== 'admin') {
        window.location.href = '/pages/index.html';
    }
}