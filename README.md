# PROJETO MATRIP

*Startup maranhense de Tecnologia e Turismo*  
*Aplicativos + Plataforma Web + API Back-end*

## Sobre a Matrip

A **Matrip** é uma startup maranhense focada em tecnologia aplicada ao turismo. Seu propósito é centralizar informações turísticas, conectar turistas, agências e guias credenciados, além de facilitar a compra de passeios, experiências gastronômicas e culturais no Maranhão.

Baseado no documento oficial:

> “A Matrip visa centralizar a informação e facilitar ao turista encontrar o melhor passeio, a melhor agência ou o melhor lugar para visitar sem perder muito tempo com isso…”

> “Garantindo ao mesmo a melhor experiência possível baseado no seu perfil.”

A plataforma Matrip é composta por:

- Aplicativo do Cliente (`app-cliente`)
- Aplicativo do Parceiro (`app-parceiro`)
- Aplicativo Administrativo (`app-admMatrip`)
- Plataforma Web
- Back-end (API REST)

O ecossistema Matrip incentiva o turismo local, fortalece agências e guias, e melhora a logística nos serviços turísticos.

## 1. Aplicativo do Cliente — `app-cliente`

Aplicativo voltado ao turista que deseja conhecer, comprar e gerenciar passeios no Maranhão.

### Funcionalidades

- Cadastro e login do cliente
- Escolha de produtos
  - Passeios turísticos
  - Experiências gastronômicas
  - Atividades culturais
- Pagamento dos produtos
- Visualização do contrato de compra
- Cancelamento de compras
- Histórico de produtos adquiridos
- Exploração de produtos Matrip
  - Descrição
  - Fotos
  - Avaliações
  - Informações sobre clima, localidade e feedbacks
- Acompanhamento do que está acontecendo no Maranhão
  - Eventos
  - Festas
  - Roteiros recomendados

### Tecnologias

- **Front-end:** React Native / HTML / CSS / JavaScript
- **Back-end:** Spring Boot
- **Banco de Dados:** MySQL
- **Controle de versão:** Git + GitHub

### Como executar

#### Aplicativo React Native

1. Instale Node.js e Yarn/NPM.
2. Instale o Expo ou configure o ambiente Android/iOS.
3. Clone o repositório.
4. Instale as dependências: **DESCREVER**.
5. Execute o projeto: **DESCREVER**.
6. Abra no dispositivo físico ou emulador.

#### API Spring Boot

1. Instale Java 17 ou superior.
2. Instale Maven.
3. Configure o MySQL e crie o banco `matrip`.
4. Ajuste o arquivo `application.properties` com usuário e senha.
5. Abra o projeto na IDE.
6. Aguarde o Maven baixar as dependências.
7. Execute a classe principal `MatripApplication.java`.

A API iniciará em:

```text
http://localhost:8080
```

## 2. Aplicativo do Parceiro — `app-parceiro`

Voltado para agências de turismo e guias (MEI) que desejam cadastrar e vender seus produtos.

### Funcionalidades

- Cadastro de produtos
  - Passeios
  - Gastronomia
  - Cultura
- Definição de valores
- Cadastro de serviços adicionais
- Relatório de contas a receber
- Acesso ao contrato Matrip
- Acesso ao contrato do cliente
- Gerenciamento de produtos vendidos
  - Reservas
  - Cancelamentos
  - Avaliações
- Publicação de materiais de divulgação para aplicativos e plataforma web

### Tecnologias

- **Front-end:** React Native / HTML / CSS / JavaScript
- **Back-end:** Spring Boot
- **Banco de Dados:** MySQL
- **Controle de versão:** Git + GitHub

### Como executar

Segue o mesmo processo do `app-cliente`, utilizando os endpoints específicos do parceiro.

## 3. Aplicativo Administrativo — `app-admMatrip`

Ferramenta interna para gestão completa da Matrip.

### Funcionalidades

- Cadastro de parceiros
  - Agências
  - Guias
- Cadastro de produtos
- Cancelamento de vendas
- Contas a receber
- Contas a pagar
- Bloqueio de produtos
- Bloqueio de parceiros
- Gerenciamento de avaliações
- Gerenciamento das histórias e descrições das localidades

### Tecnologias

- **Front-end:** React Native / HTML / CSS / JavaScript
- **Back-end:** Spring Boot
- **Banco de Dados:** MySQL
- **Controle de versão:** Git + GitHub

### Como executar

O processo é idêntico ao utilizado no `app-cliente` e no `app-parceiro`.

## 4. Plataforma Web

A plataforma web reúne todas as funcionalidades dos três aplicativos.

### Funcionalidades do cliente

- Explorar produtos
- Comprar passeios
- Ver histórico
- Cancelar compras
- Avaliar produtos
- Ver eventos e informações turísticas

### Funcionalidades do parceiro

- Cadastrar produtos
- Gerenciar vendas
- Ver contratos
- Publicar materiais
- Acompanhar contas a receber

### Funcionalidades administrativas

- Gerenciar parceiros
- Gerenciar produtos
- Aprovar avaliações
- Controlar contas a pagar e receber
- Bloquear parceiros e produtos
- Gerenciar conteúdo turístico

### Tecnologias

- HTML / CSS / JavaScript (Vanilla)
- Spring Boot
- MySQL
- Git / GitHub

### Como executar

A plataforma web é servida de forma integrada pelo back-end Spring Boot.

1. Abra o terminal na pasta raiz do projeto.
2. Navegue até a pasta do back-end:

```bash
cd backend-java
```

3. Inicie o servidor:

```bash
mvn spring-boot:run
```

4. A API e a plataforma web serão carregadas na porta `3000`.
5. Abra no navegador:

```text
http://localhost:3000
```

## 5. Back-end — API Matrip

A API centraliza toda a comunicação entre os aplicativos e a plataforma web.

### Endpoints do cliente

- `/cliente/cadastrar`
- `/cliente/login`
- `/produtos/listar`
- `/compra/realizar`
- `/compra/cancelar`
- `/compra/contrato`
- `/cliente/historico`

### Endpoints do parceiro

- `/parceiro/cadastrar`
- `/parceiro/produtos`
- `/parceiro/servicos`
- `/parceiro/contas-receber`
- `/parceiro/vendas`
- `/parceiro/contratos`

### Endpoints administrativos

- `/adm/parceiros`
- `/adm/produtos`
- `/adm/bloqueios`
- `/adm/contas-receber`
- `/adm/contas-pagar`
- `/adm/avaliacoes`

### Tecnologias

- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security, se aplicável
- MySQL
- Maven
- Git / GitHub

### Como executar a API

1. Abra o projeto na IDE.
2. Configure o MySQL.
3. Ajuste o arquivo `application.properties`.
4. Execute a classe principal `MatripApplication.java`.
5. Teste os endpoints via Postman ou Swagger.
