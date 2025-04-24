import styled from 'styled-components';
import { VisualizacaoTipo } from '../types/dashboardInterface';

const SelectorContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SelectorButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.active ? '#007bff' : '#e9ecef'};
  color: ${props => props.active ? '#fff' : '#333'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.active ? '#0056b3' : '#dee2e6'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const MesSelector = styled.select`
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  margin-left: 1rem;
  min-width: 200px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

interface MesAno {
  mes: number;
  ano: number;
}

interface VisualizacaoSelectorProps {
  tipo: VisualizacaoTipo;
  onTipoChange: (tipo: VisualizacaoTipo) => void;
  onMesAnoChange?: (mes: string, ano: string) => void;
  mesesDisponiveis: MesAno[];
}

const VisualizacaoSelector = ({ 
  tipo, 
  onTipoChange, 
  onMesAnoChange,
  mesesDisponiveis
}: VisualizacaoSelectorProps) => {
  const handleMesAnoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const [mes, ano] = event.target.value.split('-');
    onMesAnoChange?.(mes, ano);
  };

  return (
    <SelectorContainer>
      <SelectorButton
        active={tipo === 'atual'}
        onClick={() => onTipoChange('atual')}
      >
        Mês Atual
      </SelectorButton>
      <SelectorButton
        active={tipo === 'total'}
        onClick={() => onTipoChange('total')}
      >
        Total
      </SelectorButton>
      <MesSelector
        onChange={handleMesAnoChange}
        disabled={mesesDisponiveis.length === 0}
        value={tipo === 'atual' ? '' : ''}
      >
        <option value="">Selecione o mês</option>
        {mesesDisponiveis.map(({ mes, ano }) => (
          <option key={`${mes}-${ano}`} value={`${mes}-${ano}`}>
            {new Date(ano, mes - 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
          </option>
        ))}
      </MesSelector>
    </SelectorContainer>
  );
};

export default VisualizacaoSelector; 