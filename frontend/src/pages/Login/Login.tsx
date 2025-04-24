import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import backgroundMobile from '../../assets/DISNEY MOBILE.jpg';
import backgroundDesktop from '../../assets/DISNEY.jpg';
import logoPreto from '../../assets/decola PRETO PNG.png';
import { apiService } from '../../services/api';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background-image: url(${backgroundMobile});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  @media (min-width: 768px) {
    background-image: url(${backgroundDesktop});
  }
`;

const LoginForm = styled.form`
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
  margin: auto;

  @media (min-width: 768px) {
    padding: 3rem;
    max-width: 450px;
    width: 100%;
  }
`;

const Logo = styled.img`
  width: 180px;
  margin-bottom: 2rem;
  display: block;
  margin-left: auto;
  margin-right: auto;

  @media (min-width: 768px) {
    width: 220px;
    margin-bottom: 3rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;

  @media (min-width: 768px) {
    padding: 1rem;
    font-size: 1.1rem;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }

  @media (min-width: 768px) {
    padding: 1.2rem;
    font-size: 1.1rem;
    margin-top: 1.5rem;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
`;

const Login = () => {
  const [rede, setRede] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = await apiService.login(rede, senha);

      console.log('Token recebido:', data.token);
      console.log('Dados do cliente:', data.cliente);

      // Salvar token e dados do cliente no localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('cliente', JSON.stringify(data.cliente));

      console.log('Token salvo no localStorage:', localStorage.getItem('token'));
      console.log('Cliente salvo no localStorage:', localStorage.getItem('cliente'));

      // Redirecionar para o dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError(error instanceof Error ? error.message : 'Erro ao fazer login');
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <Logo src={logoPreto} alt="Logo Polybalas" />
        <Input
          type="text"
          placeholder="Número da Rede"
          value={rede}
          onChange={(e) => setRede(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <Button type="submit">Entrar</Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;