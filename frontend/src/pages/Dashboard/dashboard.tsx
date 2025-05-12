import { useEffect, useState } from 'react';
import styled from 'styled-components';
import backgroundMobile from '../../assets/DISNEY MOBILE.jpg';
import backgroundDesktop from '../../assets/DISNEY.jpg';
import logoPreto from '../../assets/decola PRETO PNG.png';
import { DashboardData, DadosFornecedor, VisualizacaoTipo } from '../../types/dashboardInterface';
import { metaTotal } from '../../types/metas';
import VisualizacaoSelector from '../../components/VisualizacaoSelector';
import { apiService } from '../../services/api';

const DashboardContainer = styled.div`
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
  overflow-y: auto;

  @media (min-width: 768px) {
    background-image: url(${backgroundDesktop});
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
`;

const Logo = styled.img`
  width: 150px;
  height: auto;

  @media (min-width: 768px) {
    width: 200px;
  }
`;

const TableContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(170, 55, 55, 0.1);
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Th = styled.th`
  background-color: #f8f9fa;
  padding: 1rem;
  text-align: left;
  font-weight: bold;
  border-bottom: 2px solid #dee2e6;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
`;

const PercentualCell = styled.td<{ percentual: number }>`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  color: ${props => {
    if (props.percentual >= 100) return '#28a745'; // Verde
    if (props.percentual >= 80) return '#ffc107'; // Amarelo
    return '#dc3545'; // Vermelho
  }};
  font-weight: bold;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #dc3545;
  font-size: 1.2rem;
`;

const ProgressContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ProgressLabel = styled.span`
  font-weight: bold;
  color: #333;
`;

const ProgressValue = styled.span<{ percentual?: number }>`
  color: ${props => {
    if (!props.percentual) return '#28a745';
    if (props.percentual >= 100) return '#28a745';
    if (props.percentual >= 80) return '#ffc107';
    return '#dc3545';
  }};
  font-weight: bold;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 20px;
  background-color: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div<{ percentage: number }>`
  width: ${props => Math.min(props.percentage, 100)}%;
  height: 100%;
  background-color: ${props => {
    if (props.percentage < 80) return '#dc3545'; // Vermelho
    if (props.percentage < 100) return '#ffc107'; // Amarelo
    return '#28a745'; // Verde
  }};
  transition: width 0.5s ease-in-out;
`;

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const formatPercentage = (value: number | undefined | null) => {
  if (value === undefined || value === null) return '0%';
  return `${value.toFixed(2)}%`;
};

const MesSelecionado = styled.div`
  background-color: #e9ecef;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  color: #333;
  margin-top: 0.5rem;
`;

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalVendas, setTotalVendas] = useState(0);
  const [visualizacaoTipo, setVisualizacaoTipo] = useState<VisualizacaoTipo>('atual');
  const [mesAnoSelecionado, setMesAnoSelecionado] = useState<{ mes: string; ano: string } | null>(null);

  const fetchData = async (mes?: string, ano?: string) => {
    try {
      console.log('Buscando dados com mês:', mes, 'e ano:', ano);
      const dashboardData = await apiService.getDashboard(mes, ano);
      setData(dashboardData);

      // Calcula o total de vendas
      const total = dashboardData.dados.reduce((acc: number, item: DadosFornecedor) => acc + item.valorVenda, 0);
      setTotalVendas(total);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (mesAnoSelecionado) {
      console.log('Mês/Ano selecionado:', mesAnoSelecionado);
      fetchData(mesAnoSelecionado.mes, mesAnoSelecionado.ano);
    }
  }, [mesAnoSelecionado]);

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        console.log('Buscando dados totais');
        const dashboardData = await apiService.getDashboardTotal();
        setData(dashboardData);
        
        // Calcula o total de vendas
        const total = dashboardData.dados.reduce((acc: number, item: DadosFornecedor) => acc + item.valorVenda, 0);
        setTotalVendas(total);
      } catch (err) {
        console.error('Erro ao buscar dados totais:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados totais');
      }
    };

    if (visualizacaoTipo === 'total') {
      fetchTotal();
    } else if (visualizacaoTipo === 'atual') {
      fetchData();
    }
  }, [visualizacaoTipo]);

  const handleTipoChange = (tipo: VisualizacaoTipo) => {
    setVisualizacaoTipo(tipo);

    if (tipo === 'total') {
      setMesAnoSelecionado(null);
    } else {
      const hoje = new Date();
      const mesAtual = hoje.getMonth() + 1; // Meses começam em 0
      const anoAtual = hoje.getFullYear();

      setMesAnoSelecionado({ mes: String(mesAtual), ano: String(anoAtual) });

    }
  };

  const handleMesAnoChange = (mes: string, ano: string) => {
    setMesAnoSelecionado({ mes, ano });
  };

  const getMetaTotal = (idRede: number): number => {
    const rede = metaTotal.find((r) => r.id === idRede);
    return rede?.metaTotal || 0;
  };

  const getMetaAtual = () => {
    if (!data?.cliente?.id) return 0;
    const metaTotal = getMetaTotal(data.cliente.id);
    return visualizacaoTipo === 'total' ? metaTotal : metaTotal / 6;
  };

  const getDadosAtuais = () => {
    if (!data?.dados) return [];
    return data.dados;
  };

  if (loading) return <LoadingMessage>Carregando...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!data) return <ErrorMessage>Nenhum dado disponível</ErrorMessage>;

  const dadosAtuais = getDadosAtuais();
  if (!dadosAtuais) return <ErrorMessage>Erro ao processar dados</ErrorMessage>;

  const metaAtual = getMetaAtual();
  const percentualTotal = metaAtual > 0 ? (totalVendas / metaAtual) * 100 : 0;


  return (
    <DashboardContainer>
      <Content>
        <Header>
          <Logo src={logoPreto} alt="Logo Decola" />
          <div>
            <h2>{data.cliente.nome}</h2>
            <p>{data.cliente.rede}</p>
            {visualizacaoTipo === 'total' ? (
              <MesSelecionado>Total</MesSelecionado>
            ) : (
              mesAnoSelecionado && (
                <MesSelecionado>
                  {new Date(Number(mesAnoSelecionado.ano), Number(mesAnoSelecionado.mes) - 1)
                    .toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                </MesSelecionado>
              )
            )}
          </div>
          <VisualizacaoSelector
            tipo={visualizacaoTipo}
            onTipoChange={handleTipoChange}
            onMesAnoChange={handleMesAnoChange}
            mesesDisponiveis={data.mesesDisponiveis || []}
          />
        </Header>

        <ProgressContainer>
          <ProgressInfo>
            <ProgressLabel>Meta {visualizacaoTipo === 'total' ? 'Total' : 'Mensal'}</ProgressLabel>
            <ProgressValue>{formatCurrency(getMetaAtual())}</ProgressValue>
          </ProgressInfo>
          <ProgressInfo>
            <ProgressLabel>Valor</ProgressLabel>
            <ProgressValue>{formatCurrency(totalVendas)}</ProgressValue>
          </ProgressInfo>
          <ProgressInfo>
            <ProgressLabel>Percentual de Realização</ProgressLabel>
            <ProgressValue percentual={percentualTotal}>{formatPercentage(percentualTotal)}</ProgressValue>
          </ProgressInfo>
          <ProgressBarContainer>
            <ProgressBarFill percentage={percentualTotal} />
          </ProgressBarContainer>
        </ProgressContainer>

        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>Fornecedor</Th>
                <Th>Meta</Th>
                <Th>Real</Th>
                <Th>Gap</Th>
                <Th>%(Status)</Th>
              </tr>
            </thead>
            <tbody>
              {dadosAtuais.map((dado, index) => (
                <tr key={index}>
                  <Td>{dado.fornecedor}</Td>
                  <Td>{formatCurrency(dado.meta)}</Td>
                  <Td>{formatCurrency(dado.valorVenda)}</Td>
                  <Td>{formatCurrency(dado.gap)}</Td>
                  <PercentualCell percentual={dado.repPercentual}>
                    {formatPercentage(dado.repPercentual)}
                  </PercentualCell>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </Content>
    </DashboardContainer>
  );
};

export default Dashboard; 