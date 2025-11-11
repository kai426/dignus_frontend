# Dignus Candidate Front - Configuração Docker

## 📋 Visão Geral

Este documento contém os detalhes técnicos da configuração Docker para a aplicação **Dignus Candidate Front**, uma Single Page Application (SPA) React com TypeScript servida via Nginx.

## 🏗️ Arquitetura da Aplicação

### Stack Tecnológico
- **Frontend:** React 19.1.1 + TypeScript
- **Build Tool:** Vite 7.1.0
- **Routing:** TanStack Router
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **State Management:** Zustand

### Estrutura do Projeto
```
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/         # Páginas da aplicação
│   ├── routes/        # Configuração de rotas
│   ├── api/           # Cliente HTTP e endpoints
│   ├── hooks/         # Custom hooks React
│   └── assets/        # Assets estáticos
├── Dockerfile         # Configuração Docker
├── nginx.conf         # Configuração do Nginx
└── package.json       # Dependências e scripts
```

## 🐳 Configuração Docker

### Multi-Stage Build

#### Stage 1: Build (Node.js)
```dockerfile
FROM node:slim AS build
WORKDIR /usr/local/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx vite build
```

#### Stage 2: Produção (Nginx)
```dockerfile
FROM nginx:stable-alpine
COPY --from=build /usr/local/app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
```

### Detalhes Técnicos

| **Aspecto** | **Valor** | **Descrição** |
|-------------|-----------|---------------|
| **Imagem Base** | `nginx:stable-alpine` | ~40MB, otimizada para produção |
| **Build Time** | ~50 segundos | Multi-stage build otimizado |
| **Porta Exposta** | 80 | Porta padrão do Nginx |
| **Mapeamento** | `8080:80` | Acesso via localhost:8080 |
| **Usuário** | `root` | Para evitar problemas de permissão |

## ⚙️ Configuração do Nginx

### Funcionalidades Implementadas

#### 1. **SPA Routing Support**
```nginx
location / {
    try_files $uri /index.html;
    add_header Cache-Control "no-store, no-cache, must-revalidate";
}
```

#### 2. **Headers de Segurança**
```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self';" always;
```

#### 3. **Cache de Assets Estáticos**
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 30d;
    add_header Cache-Control "public, max-age=2592000";
    access_log off;
}
```

#### 4. **Segurança de Arquivos**
```nginx
location ~ /\. {
    deny all;
    access_log off;
    log_not_found off;
}
```

## 🚀 Comandos de Execução

### Build da Imagem
```bash
docker build -t dignus-candidate-front .
```

### Execução do Container
```bash
docker run -d -p 8080:80 --name dignus-app dignus-candidate-front
```

### Comandos Úteis
```bash
# Verificar status
docker ps

# Ver logs
docker logs dignus-app

# Parar container
docker stop dignus-app

# Reiniciar container
docker start dignus-app

# Remover container
docker rm -f dignus-app

# Acessar container
docker exec -it dignus-app sh
```

## 🔧 Verificação de Funcionamento

### 1. **Teste Básico**
```bash
curl http://localhost:8080
```
**Resposta esperada:** HTML da aplicação React

### 2. **Teste SPA Routing**
```bash
curl http://localhost:8080/selection-process
```
**Resposta esperada:** Mesmo HTML (fallback funcionando)

### 3. **Teste de Assets**
```bash
curl -I http://localhost:8080/assets/index-B48VFJ1s.js
```
**Resposta esperada:** Headers de cache (30 dias)

## 📊 Performance e Otimizações

### Vantagens do Nginx
- ✅ **Performance Superior:** Otimizado para servir arquivos estáticos
- ✅ **Baixo Consumo:** ~40MB vs ~200MB das alternativas Node.js
- ✅ **Cache Eficiente:** 30 dias para assets, sem cache para HTML
- ✅ **Segurança:** Headers de proteção configurados
- ✅ **Produção-Ready:** Amplamente usado em ambientes de produção

### Comparação com Alternativas

| **Métrica** | **Nginx** | **Vite Preview** | **Serve** |
|-------------|-----------|------------------|-----------|
| Tamanho da Imagem | ~40MB | ~200MB | ~200MB |
| Performance | Excelente | Boa | Boa |
| Headers de Segurança | ✅ Configuráveis | ❌ Básicos | ❌ Básicos |
| Cache Avançado | ✅ | ❌ | ❌ |
| Uso em Produção | ✅ Recomendado | ⚠️ Limitado | ⚠️ Limitado |

## 🌐 Acesso à Aplicação

### URLs Disponíveis
- **Principal:** http://localhost:8080
- **Rotas SPA:** 
  - http://localhost:8080/selection-process
  - http://localhost:8080/interview
  - http://localhost:8080/portuguese
  - http://localhost:8080/questionnaire

### Integração com API
- **Backend URL:** Configurada via `VITE_API_BASE_URL`
- **Arquivo:** `.env` (http://localhost:5076)
- **Cliente HTTP:** Axios com interceptors para JWT

## 🔒 Segurança Implementada

1. **Content Security Policy (CSP)**
2. **X-Frame-Options** - Proteção contra clickjacking
3. **X-XSS-Protection** - Proteção contra XSS
4. **X-Content-Type-Options** - Prevenção de MIME sniffing
5. **Referrer Policy** - Controle de informações de referência
6. **Permissions Policy** - Bloqueio de APIs sensíveis

## 📝 Logs e Monitoramento

### Logs do Nginx
```bash
docker logs dignus-app
```

### Estrutura dos Logs
- **Access Logs:** Requisições HTTP
- **Error Logs:** Erros do servidor
- **Startup Logs:** Inicialização do Nginx

## 🔄 Deploy e CI/CD

### Preparação para Produção
1. **Build otimizado** com Vite
2. **Compressão** de assets
3. **Minificação** de código
4. **Tree-shaking** automático
5. **Code splitting** por rotas

### Variáveis de Ambiente
```env
VITE_API_BASE_URL=http://localhost:5076
```

---

## 📞 Troubleshooting

### Problemas Comuns

**1. Container não inicia**
```bash
docker logs dignus-app
# Verificar permissões e configurações
```

**2. Aplicação não carrega**
```bash
curl http://localhost:8080
# Verificar se o nginx está respondendo
```

**3. Rotas SPA não funcionam**
```bash
curl http://localhost:8080/qualquer-rota
# Deve retornar o mesmo HTML do index
```

**4. Assets não carregam**
- Verificar se o build foi realizado corretamente
- Confirmar se os arquivos estão em `/usr/share/nginx/html`

---

*Documentação atualizada em: Outubro 2025*