# Frontend - Dashboard Decola

## Descrição
Frontend do dashboard desenvolvido em React com TypeScript, que exibe dados de vendas e metas de fornecedores.

## Estrutura do Projeto
```
frontend/
├── src/
│   ├── assets/           # Imagens e recursos estáticos
│   ├── components/       # Componentes reutilizáveis
│   │   └── VisualizacaoSelector.tsx
│   ├── pages/           # Páginas da aplicação
│   │   └── Dashboard/   # Página principal do dashboard
│   └── types/           # Definições de tipos TypeScript
└── README.md
```

## Componentes Principais

### Dashboard
Componente principal que exibe os dados de vendas e metas.

#### Funcionalidades
- Visualização de dados do mês atual
- Visualização de dados históricos (fevereiro a julho de 2025)
- Visualização de dados totais
- Exibição de metas mensais e totais
- Cálculo de percentuais de realização
- Indicadores visuais de desempenho

#### Estados
- `data`: Dados do dashboard
- `loading`: Estado de carregamento
- `error`: Mensagens de erro
- `totalVendas`: Total de vendas
- `visualizacaoTipo`: Tipo de visualização atual
- `mesAnoSelecionado`: Mês e ano selecionados
- `metaTotalAtual`: Meta total atual

### VisualizacaoSelector
Componente para seleção do tipo de visualização e mês.

#### Funcionalidades
- Seleção entre visualização atual e total
- Seleção de mês específico
- Exibição de meses disponíveis

## Tipos

### DashboardData
```typescript
interface DashboardData {
  cliente: {
    id: number;
    nome: string;
    rede: string;
  };
  dados: DadosFornecedor[];
  mesesDisponiveis: MesAno[];
}
```

### DadosFornecedor
```typescript
interface DadosFornecedor {
  idRede: number;
  nomeRede: string;
  idFornecedor: number;
  fornecedor: string;
  meta: number;
  valorVenda: number;
  gap: number;
  repPercentual: number;
}
```

## Estilos
- Utiliza styled-components para estilização
- Design responsivo com breakpoints para mobile e desktop
- Cores indicativas de status:
  - Vermelho: 0-79%
  - Amarelo: 80-99%
  - Verde: 100%+

## Integração com Backend
- Comunicação via API REST
- Endpoints:
  - `/api/dashboard`: Dados do dashboard
  - `/api/dashboard/total`: Dados totais
- Autenticação via token JWT

## Formatação
- Valores monetários em reais (R$)
- Percentuais com 2 casas decimais
- Datas em formato brasileiro
