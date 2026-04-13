# 🧠 Cérebro do Projeto: Wave Defender

Este documento atua como a **Única Fonte de Verdade (SSOT)** do Wave Defender. Ele centraliza as regras, a direção visual, as definições de código e o histórico de decisões do projeto. Se houver dúvida sobre qual rumo tomar (código ou design), consulte este arquivo.

---

## 🎯 1. Visão Geral & Filosofia

- **O Jogo**: Um Tower Defense de grid com elementos roguelite, focado em alta tomada de decisão via sinergias de posicionamento e meta-progressão.
- **Objetivo da Experiência**: Ser rápido, imersivo, altamente visual e tático, sem soterrar o jogador em textões ou menus monótonos.
- **Identidade Principal**: *Minimalismo Dark Neon*. Estilo moderno que evoca uma central tática / painel tecnológico iluminado.

---

## 🎨 2. Direção de Arte e UI/UX

### O que Fazer (O que Gostamos ✅)
- **Minimalismo Baseado em Ícones**: Substituir descrições volumosas por comunicação visual intuitiva (ex: uso constante de emojis 🪙, 🟠, 🏹, 🧙 para padronização universal).
- **Contraste "Neon em Fundo Escuro"**: Interfaces e cards devem ficar sobre painéis com fundos sólidos, foscos (`#0a0c10` ou preto puro) complementados por box-shadow neon para denotar impacto (ex: cores diferentes de ataques brilhando sob a carta).
- **Feedbacks Visuais Cinéticos**: Usar *micro-animações* reativas. Pulsar ícones, linhas geométricas tracejadas em movimento para sinergias, flutuação e halos e auras radiantes.
- **Componentes Flutuantes Premium**: Modais e painéis usam "Glassmorphism" sutil e suave (`backdrop-filter`) focando no enquadramento limpo da interface.

### O que Evitar (O que NÃO Gostamos ❌)
- **Componentes Quebrados/Irregulares**: Cuidado com clip-paths excessivos, polígonos distorcidos ou margens espremidas. Prezamos muito pelo formato de quadrados e cantos devidamente arredondados (radiants de 8px a 16px).
- **Paredões Frios de Texto**: Jamais forçar o jogador a ler textos corridos de lore para descobrir mecânicas. Estruturas devem mostrar eficácia por métricas cruas, e as sinergias (Combos) através de blocos de imagem (`Ícone + Ícone = Evolução Visual`).
- **Símbolos Irregulares em Labels**: Evitar caracteres como `<` ou `>` em enunciados de UI. Substituir por texto legível ou nomes de estados (ex: "abaixo de 50%" ou "HP Crítico").

### 📐 O Padrão de Cards (Soul Forge Pattern) ✅
Para garantir que menus futuros (Lojas, Biblioteca, etc.) mantenham a mesma qualidade:
- **Tamanho Fixo & Unidade**: Cards devem ter altura padronizada (ex: 185px para grids densos) para garantir alinhamento "pixel-perfect" independente do conteúdo.
- **Hierarquia Vertical Fixa**: Ícone (Topo) ➜ Nome (Destaque) ➜ Descrição (Centro) ➜ Status/Custo (Base).
- **Desvinculação de Estados**: Indicadores temporários (bolinhas de nível) não devem empurrar ou deslocar o rótulo permanente de custo. O rodapé do card deve ter altura fixa dedicada.
- **Economia de Informação**: Descrições devem focar no benefício bruto. Remova o sujeito se ele já estiver implícito pela categoria (ex: em "Físico", use "Ignora 5% armadura" em vez de "Torres físicas ignoram...").

### 🖼️ O Padrão de Modal Premium (Unified Header) ✅
Estabelece a paridade visual absoluta entre menus:
- **Enquadramento**: Modais de meta-progressão (Soul Forge, Biblioteca) devem usar `max-width: 1000px`.
- **Cabeçalho Centralizado**: O `shop-header` deve usar `justify-content: center` com `gap: 30px`.
- **Contadores (Pills)**: O contador de recursos (`shop-coins`) deve ser uma "pílula" com bordas de 1px e cantos de 4px.
- **Saída Absoluta**: O botão de fechar (`btn-close`) fica em `right: 20px; top: 20px`.
- **Padding Sagrado**: O padding interno de todos os modais premium deve ser exatamente `30px`.

### 🔄 Protocolo Nuclear Cache-Bust ☢️
Para evitar a renderização de arquivos antigos pelo navegador:
- **Renomeação**: Sempre que houver mudanças estruturais em CSS ou JS, o arquivo deve ser renomeado (ex: `style_v4.css`).
- **Versioning**: No `index.html`, o link deve conter um parâmetro de data ou versão (ex: `?v=20240412`).

---

## 📐 3. Estrutura do HUD e Layout Global

A interface foi projetada quebrando painéis tradicionais engessados, dando maior respiro à janela de batalha. Em telas grandes e no Mobile, as zonas têm funções sagradas:

1. **Top HUD (Header)**: Espaço superior intocável de visualização limpa. Reserva os contadores definitivos do jogo (Moedas 🪙, Souls 🟠, Abates 💀, Recorde ⭐). 
2. **Sidebar HUD**: Nav flutuante (no desktop é lateral-esquerda, no mobile vira bottom-bar adaptável). Contém os acessos de ferramentas e lojas (Codex 📖, Mercado 🛒, Soul Forge, Biblioteca 📚, e o Slot de Livro do Leitoril).
3. **Bottom HUD**: Centro inferior, abriga os botões capitais urgentes: Avanço de Setor (▶ Wave), Monitor de Vida Máxima da Run e Encerramento / Reset.
4. **Selection HUD (Bottom Dock)**: O modal que emerge do fundo apenas no estado de preparação da grade revelando as escolhas sem obstruir totalmente o campo de visão.

---

## ⚙️ 4. Sistemas de Jogo (Game Design)

### Torres e Combate (Structures)
Divididas fundamentalmente nos perfis: **Físico**, **Mágico** e **Suporte**.
- Estruturas chegam ao Cap no Nível 4 nativamente via Merges/compras.
- O ambicioso estado **[EVO] Divino Nível 5 Lendário** é um "despertar". Geralmente condicionado às auras globais ou à Sinergia Especial de Suporte de Nível Max (Ascensão Dourada).

### Sinergias (Os Combos)
É o núcleo principal da estratégia mental do usuário. O Loop do jogo traça cruzamentos passivos:
- Combinações procuram por *tags adjacentes* (Acampamento + Espadachim) ou (Melee + Healer).
- O HUD principal reage desenhando cordões dinâmicos de luz na tela conectando as peças interativas, enquanto concede buffs estatísticos globais aos pares formados.

### Economia e Meta-Progressão
O projeto separa drasticamente sua escalada em 3 mecânicas autônomas:
1. **Intra-run (Moedas 🪙)**: Zera em cada restart. Compram novas tentativas.
2. **Buff-Run (Leitoril - Biblioteca 📚)**: Sistema de modificador isolado escolhido antes de correr solto, gasta Souls limitadas para um buff temporário até a morte. O "Livro" em uso brilha no ambiente de HUD e concede traços exóticos ou melhoria global.
3. **Pós-run permanente (Soul Tree - 🟠)**: Adotou modelo de roguelike onde almas extraídas dos chefões desbloqueiam buffs permanentes que empurram os atributos base (HP inicial + forte, chance de Drop lendário).

---

## 💻 5. Regras de Código & Arquitetura

O Wave Defender opera em ambiente limpo: **Vanilla HTML / CSS / JS** visando zero inchaços de peso gerados por bundles empacotadores (esmagar a dependência em Frameworks pesados).

- **O Motor de Estado (O Grande 'G')**: A arquitetura do sistema funciona sob um Singleton reativo manual (A constante global `let G = {}`). `G` sempre retém a verdade do jogo. Para avançar algo:
  1. O código manuseia e recalcula objetos dentro da memória do `G`.
  2. Chamam-se gatilhos imperativos limpos de tela (`updateHUD()`, `renderGrid()`).
  3. O loop lida com redesenho. NADA pode alterar DOM de valor vital diretamente contornando `G`.
- **Prevenção Defensiva**: Antes de rodar injeções visuais pesadas, ou atirar laços em Canvas Animations, funções adotam saídas abruptas com `if (!elemento) return;` prevenindo crashes de console invisíveis caso nós de DOM desmontem.
- **Memória Cautelosa**: `localStorage` suporta a durabilidade. Como as variáveis do browser podem falhar, engolimos os bugs com blocos `try/catch` envolvendo fallback defaults pra estancar corrupções.

---

## 🗂️ 6. Decisões Históricas (Log de Evolução)

*Aqui registramos por que as coisas são montadas como são para não voltarmos ciclicamente no mesmo problema.*

| A Problema Identificado | Qual a Solução Adotada? | Por quë? / Racional |
|-------------------------|-------------------------|----------------------|
| **Ruído e Caos no Codex** | Abolimos o "Text-wall" descritivo bruto e trocamos o catálogo em diagramas visuais ("X ➜ Y ➜ Z"). | Jogadores não gastam tempo lendo num Tower Defense veloz; eles absorvem informações escaneando signos instantâneos de forma padronizada. |
| **Grid Clicável de Animações HTML** | Desenhamos as cordas de Combo (Sinérgia) em `<canvas id="connection-canvas">` por fora do grid fixo desvinculado a Divs. | Renderizar vetores dinâmicos que cortam e atravessam o Grid usando HTML quebrava contornos e performance (Refluxo). O Canvas `pointer-events:none` atua limpo como uma lente mágica. |
| **Bugs de Grid Quebrado e Telas Escuras** | Adição de blocos de respiro visual, cache busts agressivos nas trocas de CSS, preenchimentos via Grid/FlexBox minmax flexível e `<style>` inline. | As atualizações falfalhavam por travamento local ou Layouts complexos engolindo telas quando componentes de blocos absolutos perdiam as rédeas de formatação. |
| **HUD Lateral Apertada / Menus Ocultos** | Refizemos a interface para ter Squares (Ícones unificados premium quadrados) e não polígonos disformes aleatórios. | Coerência estética dá aspecto de jogo finalizado e comercial, ao remover "jeitinhos temporários". |
| **Espaço Morto e Cache Corrompido** | Implementamos cards hiper-compactos (185px) com estrutura de rodapé fixa e usamos "Cache-Busting" via renomeação de arquivo (`game_core.js`). | Evita que o jogador veja dados antigos ou sinta a interface "vazia" quando há pouca informação, garantindo que o design pixel-perfect seja forçado no carregamento. |

---

## 🛡️ 7. Fortaleza de Interface (UI Immutable Hooks)

Esta seção define os elementos que **NUNCA** devem ter seus IDs ou classes alterados, pois são os ganchos vitais para o motor de jogo (`game_core.js`).

### 🧩 Elementos Sagrados (IDs)
| ID | Função | Localização |
|---|---|---|
| `h-hp-fill` | Barra de vida visual | Bottom HUD / HP Container |
| `h-hp` / `h-maxhp` | Valores numéricos de vida | Bottom HUD |
| `h-coins` | Saldo de Moedas (Run) | Top HUD (Pílula) |
| `h-souls` | Saldo de Almas (Meta) | Top HUD (Pílula) |
| `h-wave` | Contador de Ondas | Side Panel |
| `h-kills` | Contador de Abates | Top HUD |
| `h-record` | Recorde da Run | Top HUD |
| `phase-badge` | Badge de fase atual | Top HUD |
| `btn-start` | Botão de controle de ondas | Bottom HUD |
| `h-leitoril-slot` | Slot interativo de livro | Sidebar HUD |
| `grid-container` | Container do campo de batalha | Main Viewport |

### 🎨 Classes de Layout Intocáveis
- `.top-hud`: Distribuição do cabeçalho.
- `.bottom-hud`: Painel fixo de controle inferior.
- `.sidebar-hud`: Navegação lateral fixa.
- `.premium-modal`: Padronização de menus Soul Forge/Library.
- `.currency-group`: Estética de "pílulas" do HUD superior.


---

## 🗃️ 8. Pontos de Restauração (Backups)

| Versão | Nome | Foco Principal | Pasta de Backup |
|---|---|---|---|
| **V13** | **Merge & Polish** | Sistema de Merge/Upgrade (LV Up via Shop), Nomes de combo simplificados e Codex atualizado. | `save_point_v13_merge_simplified_codex/` |
| **V12** | **Early Balance** | Nerf da Wave 5 (Chefes/Elites), Persistência visual de sinergia durante combate. | `save_point_v12_early_wave_balance/` |
| **V11** | **Amplifier Logic** | Implementação real do Amplificador (Buff de LV/Atk) e visual +LV individual. | `save_point_v11_amplifier_logic/` |
| **V10** | **Mercado Premium** | Upgrade Visual do Shop, Mercado Negro Simétrico, "Mercado Fechado". | `save_point_v10_market_upgrade/` |
| **V9** | **Codex & Library** | Refinamento final de simetria e navegação na Biblioteca e Codex. | `save_poit_v9_final_library_codex/` |
| **V8** | **Standardization** | Padronização de cards compactos e grid-minmax. | `save_poit_v8_standardized/` |
| **V7** | **Soul Forge** | Reformulação completa do sistema de Meta-Progresso. | `save_soul_forge_reformulada/` |

> [!NOTE]
> Em caso de quebra crítica, restaure os arquivos `index.html`, `style.css` e `game.js` a partir da pasta da versão estável mais recente.
