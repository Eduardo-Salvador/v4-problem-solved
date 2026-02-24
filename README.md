# Mars Mission Control — V4

> Solução desenvolvida como parte do processo seletivo da V4 Company.

---

## Demo

> **[Assista à demonstração aqui](https://youtu.be/Lv61eai-ts0)**

---

## O que foi implementado

O projeto base já possuía o módulo de astronautas parcialmente pronto (listagem e criação) e APIs fake para suprimentos e missões. A solução evoluiu o sistema para um painel operacional completo com banco de dados real.

### 1. Soft Delete de Astronautas

Implementei a exclusão lógica de astronautas: ao deletar, o campo `deleted_at` é preenchido com a data atual em vez de remover o registro fisicamente do banco. Todas as listagens filtram por `deleted_at IS NULL`, preservando o histórico de dados.

**Endpoint:** `DELETE /astronauts/:id`

### 2. Update de Astronautas

Implementei a atualização parcial de astronautas, onde apenas os campos enviados na requisição são alterados. A query SQL é construída dinamicamente com base nos campos presentes no body.

**Endpoint:** `PUT /astronauts/:id`

### 3. CRUD de Suprimentos

Criei o módulo de suprimentos do zero, substituindo a API fake em memória por integração real com o banco de dados PostgreSQL. O módulo inclui:

- Tabela `supplies` com soft delete
- Schema de validação
- Repository com queries SQL parametrizadas
- Rotas para listagem, criação, atualização e deleção
- Frontend conectado à API real

**Endpoints:**
- `GET /supplies` — listagem com paginação e busca
- `POST /supplies` — criação
- `PUT /supplies/:id` — atualização parcial
- `DELETE /supplies/:id` — soft delete

### 4. Módulo de Missões

Criei o módulo de missões com relacionamento entre astronautas e suprimentos. A tabela `missions` utiliza foreign keys para garantir a integridade referencial. O frontend, que já estava estruturado com TanStack Query, foi conectado à API real.

**Endpoints:**
- `GET /missions` — listagem
- `POST /missions` — criação com vínculo a astronauta e suprimento

---

## Schema do Banco de Dados

```sql
-- Astronautas (já existia)
CREATE TABLE astronauts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  nationality VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  deleted_at TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Suprimentos (criado do zero)
CREATE TABLE supplies (
  id SERIAL PRIMARY KEY,
  item VARCHAR(255) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  estoque INTEGER NOT NULL DEFAULT 0 CHECK (estoque >= 0 AND estoque <= 100),
  unidade VARCHAR(20) NOT NULL DEFAULT '%',
  deleted_at TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Missões (criado do zero)
CREATE TABLE missions (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  astronaut_id INTEGER NOT NULL REFERENCES astronauts(id),
  supply_id INTEGER NOT NULL REFERENCES supplies(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## Estrutura criada

```
backend/src/modules/
├── astronauts/         # Soft delete e update implementados
├── supplies/           # Módulo criado do zero
│   ├── supply.schema.ts
│   ├── supply.repository.ts
│   └── supply.routes.ts
└── missions/           # Módulo criado do zero
    ├── mission.schema.ts
    ├── mission.repository.ts
    └── mission.routes.ts
```