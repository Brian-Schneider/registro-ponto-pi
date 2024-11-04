import { requireAuth, requireRole } from './auth.js';
import { debounce, updateTime, nomeFuncionarioLogado } from './utils.js';
import { fetchFuncionarios, criarFuncionario, atualizarFuncionario, fetchFuncionariosByName } from './api.js';
import { logout } from './logout.js';

document.addEventListener('DOMContentLoaded', () => {

    requireAuth();

    requireRole();

    nomeFuncionarioLogado();

    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', () => {
        logout();
    });
    
    const formCriarFuncionario = document.getElementById('formCriarFuncionario');
    const formAtualizarFuncionario = document.getElementById('formAtualizarFuncionario');
    const tabelaFuncionarios = document.getElementById('tabelaFuncionarios');
    const filtrarButton = document.getElementById('filter-button');
    const funcionarioInput = document.getElementById('funcionario');

    formCriarFuncionario.addEventListener('submit', async (event) => {
        event.preventDefault();
        const nome = document.getElementById('nome').value;
        const sobrenome = document.getElementById('sobrenome').value;
        const email = document.getElementById('email').value;
        const cargo = document.getElementById('cargo').value;
        const role = document.getElementById('nivelAcesso').value;
        const password = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;

        if (password !== confirmarSenha) {
            alert('As senhas não coincidem. Por favor, tente novamente.');
            return;
        }

        try {
            const body = {
                nome: nome,
                sobrenome: sobrenome,
                email: email,
                cargo: cargo,
                role: role,
                password: password
            }
            await criarFuncionario(body);
            fecharFormCriar();
            popularTabelaFuncionarios();
        } catch (error) {
            alert('Erro ao criar funcionário');
        }
    });

    filtrarButton.addEventListener('click', debounce(async () => {

        
        try {
            const funcionario = funcionarioInput.value.trim();
            let funcionarios = await fetchFuncionariosByName(funcionario);

            funcionarios.sort((a, b) => a.nome.localeCompare(b.nome));

            tabelaFuncionarios.innerHTML = ''; // Clear the current table body

            funcionarios.forEach(funcionario => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${funcionario.id}</td>
                    <td>${funcionario.nome} ${funcionario.sobrenome}</td>
                    <td>${funcionario.email}</td>
                    <td>${funcionario.cargo}</td>
                    <td>${funcionario.role_id === 1 ? 'admin' : 'usuario'}</td>
                    <td>
                        <button onclick="abrirFormAtualizar(${funcionario.id}, '${funcionario.nome}', '${funcionario.sobrenome}', '${funcionario.email}', '${funcionario.cargo}', '${funcionario.role_id}')">Atualizar</button>
                        <button onclick="abrirModalDetalhes('ID: ${funcionario.id}\\nNome: ${funcionario.nome} ${funcionario.sobrenome}\\nEmail: ${funcionario.email}\\nCargo: ${funcionario.cargo}')">Detalhes</button>
                    </td>
                `;
                tabelaFuncionarios.appendChild(row);
            });
        } catch (error) {
            tabelaFuncionarios.innerHTML = '<tr><td colspan="6">Erro ao carregar Tabela</td></tr>'; // Show error message
        }
    }, 300));

    formAtualizarFuncionario.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = document.getElementById('atualizarId').value;
        const nome = document.getElementById('atualizarNome').value;
        const sobrenome = document.getElementById('atualizarSobrenome').value;
        const email = document.getElementById('atualizarEmail').value;
        const cargo = document.getElementById('atualizarCargo').value;
        const role = document.getElementById('atualizarNivelAcesso').value;
        const password = document.getElementById('atualizarSenha').value;

        const confirmarSenha = document.getElementById('atualizarConfirmarSenha').value;

        if (password !== confirmarSenha) {
            alert('As senhas não coincidem. Por favor, tente novamente.');
            return;
        }

        try {

            const body = {
                id: id,
                nome: nome,
                sobrenome: sobrenome,
                email: email,
                cargo: cargo,
                role: role,
                password: password
            }

            await atualizarFuncionario(body);
            fecharFormAtualizar();
            popularTabelaFuncionarios();
        } catch (error) {
            alert('Erro ao atualizar funcionário');
        }
    });

    function abrirFormCriar() {
        document.getElementById('formCriar').style.display = 'block';
    }

    function fecharFormCriar() {
        document.getElementById('formCriar').style.display = 'none';
    }

    function abrirFormAtualizar(id, nome, sobrenome, email, cargo, role) {
        document.getElementById('atualizarId').value = id;
        document.getElementById('atualizarNome').value = nome;
        document.getElementById('atualizarSobrenome').value = sobrenome;
        document.getElementById('atualizarEmail').value = email;
        document.getElementById('atualizarCargo').value = cargo;
        document.getElementById('atualizarNivelAcesso').value = role;
        document.getElementById('formAtualizar').style.display = 'block';
    }

    function fecharFormAtualizar() {
        document.getElementById('formAtualizar').style.display = 'none';
    }

    function abrirModalDetalhes(detalhes) {
        document.getElementById('detalhesFuncionario').innerText = detalhes;
        document.getElementById('modalDetalhes').style.display = 'block';
    }

    function fecharModalDetalhes() {
        document.getElementById('modalDetalhes').style.display = 'none';
    }

    async function popularTabelaFuncionarios() {
        try {
            let funcionarios = await fetchFuncionarios();


            funcionarios.sort((a, b) => a.nome.localeCompare(b.nome));

            tabelaFuncionarios.innerHTML = '';

            funcionarios.forEach(funcionario => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${funcionario.id}</td>
                    <td>${funcionario.nome} ${funcionario.sobrenome}</td>
                    <td>${funcionario.email}</td>
                    <td>${funcionario.cargo}</td>
                    <td>${funcionario.role_id === 1 ? 'admin' : 'usuario'}</td>
                    <td>
                        <button onclick="abrirFormAtualizar(${funcionario.id}, '${funcionario.nome}', '${funcionario.sobrenome}', '${funcionario.email}', '${funcionario.cargo}', '${funcionario.role_id}')">Atualizar</button>
                        <button onclick="abrirModalDetalhes('ID: ${funcionario.id}\\nNome: ${funcionario.nome} ${funcionario.sobrenome}\\nEmail: ${funcionario.email}\\nCargo: ${funcionario.cargo}')">Detalhes</button>
                    </td>
                `;
                tabelaFuncionarios.appendChild(row);
            });
        } catch (error) {
            tabelaFuncionarios.innerHTML = '<tr><td colspan="4">Erro ao carregar funcionários</td></tr>';
        }
    }

    window.abrirFormCriar = abrirFormCriar;
    window.fecharFormCriar = fecharFormCriar;
    window.abrirFormAtualizar = abrirFormAtualizar;
    window.fecharFormAtualizar = fecharFormAtualizar;
    window.abrirModalDetalhes = abrirModalDetalhes;
    window.fecharModalDetalhes = fecharModalDetalhes;

    setInterval(updateTime, 1000);
    updateTime();

    popularTabelaFuncionarios();
});