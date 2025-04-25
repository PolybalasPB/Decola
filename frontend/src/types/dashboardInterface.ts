export interface Cliente {
  id: number;
  nome: string;
  rede: string;
  idRede: number;
}

export interface RedeData {
  id: number;
  clientes: Record<string, number>;
}

export interface DadosFornecedor {
  idRede: number;
  nomeRede: string;
  idFornecedor: number;
  fornecedor: string;
  meta: number;
  valorVenda: number;
  gap: number;
  repPercentual: number;
  status: string;
}

export interface MesAno {
  mes: number;
  ano: number;
}

export interface DashboardData {
  cliente: Cliente;
  redeData: {
    id: number;
    clientes: Record<string, any>;
  };
  dados: DadosFornecedor[];
  mesesDisponiveis?: { mes: number; ano: number }[];
}

export interface HistoricoData {
  dados: DadosFornecedor[];
}

export interface LogsData {
  logs: string[];
}

export type VisualizacaoTipo = 'atual' | 'total'; 