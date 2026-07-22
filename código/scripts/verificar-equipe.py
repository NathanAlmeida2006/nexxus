#!/usr/bin/env python3
"""Verifica os critérios de aceite da seção Equipe contra o build servido.

Uso:
    cd código && npm run build && npm run preview &
    python3 scripts/verificar-equipe.py

Requer websocket-client (pip install websocket-client) e um Chrome/Chromium.
Procura o chrome-headless-shell do cache do Playwright; CHROME_BIN sobrescreve.
"""
import glob
import json
import os
import re
import subprocess
import sys
import time
import urllib.request

import websocket

BASE = os.environ.get("BASE_URL", "http://localhost:4173")
PORTA = 9333

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CODIGO_DIR = os.path.dirname(SCRIPT_DIR)  # código/


def achar_chrome():
    if os.environ.get("CHROME_BIN"):
        return os.environ["CHROME_BIN"]
    padroes = [
        "~/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell",
        "~/.cache/ms-playwright/chromium-*/chrome-linux/chrome",
        "/usr/bin/chromium",
        "/usr/bin/google-chrome",
    ]
    for padrao in padroes:
        achados = sorted(glob.glob(os.path.expanduser(padrao)))
        if achados:
            return achados[-1]
    sys.exit("Chrome não encontrado — defina CHROME_BIN")


class Aba:
    def __init__(self, url_ws):
        self.ws = websocket.create_connection(url_ws, suppress_origin=True)
        self.seq = 0
        # Eventos CDP (sem "id", ex.: Network.responseReceived) chegam
        # intercalados com as respostas de comando na mesma conexão. Quem só
        # espera a resposta do próprio comando (como o cmd() original fazia)
        # os descarta silenciosamente. Guardamos aqui para inspeção posterior
        # (ex.: achar 404s de rede que aconteceram durante um time.sleep()).
        self.eventos = []

    def cmd(self, metodo, **params):
        self.seq += 1
        self.ws.send(json.dumps({"id": self.seq, "method": metodo, "params": params}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == self.seq:
                if "error" in msg:
                    raise RuntimeError(msg["error"])
                return msg.get("result", {})
            if "method" in msg:
                self.eventos.append(msg)

    def ir(self, caminho, espera=3.0):
        self.cmd("Page.navigate", url=BASE + caminho)
        time.sleep(espera)

    def js(self, expressao):
        r = self.cmd(
            "Runtime.evaluate", expression=expressao, returnByValue=True, awaitPromise=True
        )
        return r["result"].get("value")

    def respostas_com_erro(self, contendo, status_minimo=400):
        """Eventos Network.responseReceived cuja URL contém `contendo` e que
        indicam falha real de carregamento. Requer Network.enable ligado.

        Importante (achado empírico deste ambiente): `vite preview` serve
        `/fotos/*` através do mesmo middleware de fallback de SPA que serve
        as rotas do React Router — qualquer caminho que não bata um arquivo
        real (ex.: uma foto 404) volta como HTTP 200 com `index.html`
        (`Content-Type: text/html`), não como 404. Confirmado testando com
        uma foto forçada a não existir: o CDP reporta `status: 200,
        mimeType: 'text/html'`. Checar só `status >= status_minimo` teria
        essa lacuna também: nunca dispararia mesmo com uma foto realmente
        quebrada. Por isso o sinal de falha aqui é "status de erro OU
        mimeType que não é imagem" — o segundo é o que de fato pega o caso
        real neste servidor.
        """
        erros = []
        for e in self.eventos:
            if e.get("method") != "Network.responseReceived":
                continue
            resp = e["params"]["response"]
            if contendo not in resp["url"]:
                continue
            mime = resp.get("mimeType", "")
            if resp["status"] >= status_minimo or not mime.startswith("image/"):
                erros.append(f"{resp['url']} (status={resp['status']}, mimeType={mime})")
        return erros


def esperar_devtools(tempo=10):
    limite = time.time() + tempo
    while time.time() < limite:
        try:
            with urllib.request.urlopen(f"http://127.0.0.1:{PORTA}/json/version") as r:
                return json.load(r)
        except Exception:
            time.sleep(0.3)
    sys.exit("DevTools não subiu")


def ler_bloco_export(caminho, nome):
    """Recorta o texto-fonte de `export const <nome> = {...}` até o próximo
    `export const`, sem precisar avaliar JS — dá para checar a ausência de um
    campo no data model sem depender do texto renderizado (que pode mudar de
    palavra sem que o campo em si suma, ou vice-versa)."""
    texto = open(caminho, encoding="utf-8").read()
    inicio = texto.index(f"export const {nome} =")
    prox = texto.find("\nexport const ", inicio + 1)
    return texto[inicio: prox if prox != -1 else len(texto)]


def rodar_lint(checar):
    """§10.1 — roda `npm run lint` via subprocess a partir de código/.

    Nota: quando o próprio agente chama `npm run lint` direto no shell deste
    ambiente, um hook do RTK reescreve/corrompe a saída do comando. Validamos
    empiricamente que isso é específico à invocação do shell do agente — um
    subprocess.run() disparado de dentro deste script Python não passa pelo
    hook (ele não intercepta chamadas de processo feitas por outros
    processos) e devolve o exit code real do eslint. Por isso usamos
    `npm run lint` por subprocess aqui; não foi necessário cair para
    `npx eslint .`.
    """
    try:
        r = subprocess.run(
            ["npm", "run", "lint"],
            cwd=CODIGO_DIR,
            capture_output=True,
            text=True,
            timeout=120,
        )
    except Exception as exc:  # npm ausente, timeout etc.
        checar("§10.1 npm run lint sem erro/warning", False, f"(exceção: {exc})")
        return
    saida = (r.stdout + r.stderr).strip().splitlines()
    cauda = " | ".join(saida[-3:]) if r.returncode != 0 else ""
    checar("§10.1 npm run lint sem erro/warning", r.returncode == 0, f"(exit={r.returncode}) {cauda}")


def main():
    falhas = []

    def checar(rotulo, condicao, detalhe=""):
        print(f"{'OK    ' if condicao else 'FALHOU'}  {rotulo} {detalhe}")
        if not condicao:
            falhas.append(rotulo)

    # --- Checagens estáticas (sem navegador) -----------------------------
    rodar_lint(checar)

    bloco_team = ler_bloco_export(
        os.path.join(CODIGO_DIR, "src", "data", "content.js"), "team"
    )
    checar(
        "§10.8 data model do team sem campo namesNote",
        "namesNote" not in bloco_team,
    )

    chrome = achar_chrome()
    proc = subprocess.Popen(
        [
            chrome,
            f"--remote-debugging-port={PORTA}",
            "--remote-allow-origins=*",
            "--no-sandbox",
            "--disable-gpu",
            "--window-size=1440,900",
            "about:blank",
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    try:
        esperar_devtools()
        req = urllib.request.Request(
            f"http://127.0.0.1:{PORTA}/json/new?about:blank", method="PUT"
        )
        with urllib.request.urlopen(req) as r:
            alvo = json.load(r)
        aba = Aba(alvo["webSocketDebuggerUrl"])
        aba.cmd("Page.enable")
        aba.cmd("Runtime.enable")
        aba.cmd("Network.enable")  # necessário para pegar 404s de /fotos/*

        # --- Home -------------------------------------------------------
        aba.ir("/", espera=5.0)  # o preloader precisa terminar
        home = aba.js(
            """(() => {
              const s = document.querySelector('#nozes');
              if (!s) return { existe: false };
              const setores = [
                'Presidência', 'Coordenação', 'Vendas', 'Recursos Humanos',
                'Financeiro', 'Marketing Interno', 'Área Técnica',
              ];
              const re = new RegExp(setores.join('|'));
              const img = s.querySelector('img');
              return {
                existe: true,
                imgs: s.querySelectorAll('img').length,
                linkEquipe: !!s.querySelector('a[href="/equipe"]'),
                temSetores: re.test(s.textContent),
                fotoGrupo: img ? (img.currentSrc || img.src) : null,
              };
            })()"""
        )
        checar("§10.8 Home tem a seção #nozes", home and home["existe"])
        checar("§10.8 Home tem exatamente 1 foto", home.get("imgs") == 1, f"(imgs={home.get('imgs')})")
        checar("§10.8 Home aponta para /equipe", home.get("linkEquipe"))
        checar("§10.8 Home sem lista de setores (7 setores reais)", not home.get("temSetores"))

        # --- Navegação client-side para /equipe -------------------------
        aba.js("""document.querySelector('#nozes a[href="/equipe"]').click()""")
        time.sleep(3.5)
        nav = aba.js("({ rota: location.pathname, titulo: document.title })")
        checar("Navegação client-side chega em /equipe", nav["rota"] == "/equipe", f"({nav['rota']})")
        checar("§7.2 título por rota", nav["titulo"].startswith("As Nozes"), f"({nav['titulo']})")

        # --- Conteúdo estrutural da /equipe -------------------------------
        equipe = aba.js(
            """(() => {
              const membros = [...document.querySelectorAll('[data-membro]')];
              return {
                membros: membros.length,
                slugs: membros.map((m) => m.dataset.membro),
                setores: document.querySelectorAll('[data-setor]').length,
                temLista: !!document.querySelector('#lista'),
                mosaico: [...document.querySelectorAll('.reveal-tilt img')].map((i) => i.src),
              };
            })()"""
        )
        checar("§10.2 onze integrantes", equipe["membros"] == 11, f"({equipe['membros']})")
        checar("§10.2 sete setores", equipe["setores"] == 7, f"({equipe['setores']})")
        checar("§7 âncora #lista existe", equipe["temLista"])

        esperados = {
            "julia", "lara", "isis", "leandro", "lavinia", "lucas",
            "ana", "otavio", "kaua", "luan", "kamilly",
        }
        checar(
            "§10.2 todos os slugs presentes",
            set(equipe["slugs"]) == esperados,
            f"(faltando: {sorted(esperados - set(equipe['slugs']))})",
        )

        # --- §10.8 (cauda): nenhuma foto de grupo repetida Home × /equipe ---
        fotos_home = {home.get("fotoGrupo")} if home.get("fotoGrupo") else set()
        fotos_equipe = set(equipe.get("mosaico") or [])
        intersecao = fotos_home & fotos_equipe
        checar(
            "§10.8 nenhuma foto de grupo repetida entre Home e /equipe",
            len(intersecao) == 0,
            f"(repetidas: {sorted(intersecao)})",
        )

        # --- §10.2: prova de verdade de "nenhuma imagem quebrada" ---------
        # As checagens de `complete`/`naturalWidth` só valem para imagens que
        # já tentaram carregar. A /equipe é bem mais alta que o viewport e o
        # MemberCard usa loading="lazy" — a maioria das <img> nunca começa a
        # carregar sem rolagem, então fica complete:false e escaparia de
        # qualquer filtro de "quebrada". Aqui forçamos loading="eager" em
        # todas, rolamos a página inteira (cobre o disparo por proximidade de
        # viewport de qualquer implementação de lazy-load) e aguardamos
        # decode() de cada uma antes de medir naturalWidth. Só depois disso a
        # contagem de "quebradas" prova algo.
        carga = aba.js(
            """(async () => {
              const imgs = [...document.querySelectorAll('img')];
              imgs.forEach((i) => { i.loading = 'eager'; });
              const alturaTotal = document.documentElement.scrollHeight;
              const passo = Math.max(200, window.innerHeight - 100);
              for (let y = 0; y <= alturaTotal; y += passo) {
                window.scrollTo(0, y);
                await new Promise((r) => setTimeout(r, 60));
              }
              window.scrollTo(0, alturaTotal);
              await new Promise((r) => setTimeout(r, 250));
              await Promise.allSettled(
                imgs.map((i) => (i.decode ? i.decode().catch(() => {}) : Promise.resolve()))
              );
              window.scrollTo(0, 0);
              await new Promise((r) => setTimeout(r, 250));
              const quebradas = imgs.filter((i) => i.naturalWidth === 0);
              return {
                totalImgs: imgs.length,
                quebradas: quebradas.length,
                quebradasSrcs: quebradas.map((i) => i.currentSrc || i.src),
                revelados: document.querySelectorAll('[data-inview="true"]').length,
              };
            })()"""
        )
        checar(
            "§10.2 todas as <img> tentaram carregar (loading forçado)",
            carga["totalImgs"] > 0,
            f"(total={carga['totalImgs']})",
        )
        checar(
            "§10.2 nenhuma imagem quebrada após carga forçada (naturalWidth)",
            carga["quebradas"] == 0,
            f"(quebradas={carga['quebradas']} srcs={carga['quebradasSrcs']})",
        )
        fotos_com_erro = aba.respostas_com_erro("/fotos/")
        checar(
            "§10.2 nenhum 404 em /fotos/* (Network.responseReceived: status/mimeType)",
            len(fotos_com_erro) == 0,
            f"({fotos_com_erro})",
        )

        # --- §10.3: Home → /equipe → voltar preserva sticky/tema/reveals --
        sticky_equipe = aba.js(
            """(() => {
              const tops = [...document.querySelectorAll('.section')].map(
                (s) => parseFloat(s.style.top || 'NaN')
              );
              return {
                total: tops.length,
                todosDefinidos: tops.every((t) => !Number.isNaN(t)),
                algumNegativo: tops.some((t) => t < 0),
                todosNaoPositivos: tops.every((t) => t <= 0),
              };
            })()"""
        )
        checar(
            "§10.3 sticky stack coerente em /equipe (nem todos 0px)",
            sticky_equipe["total"] > 0
            and sticky_equipe["todosDefinidos"]
            and sticky_equipe["algumNegativo"]
            and sticky_equipe["todosNaoPositivos"],
            f"({sticky_equipe})",
        )
        checar("§10.3 reveals dispararam em /equipe", carga["revelados"] >= 4, f"(revelados={carga['revelados']})")

        tema_equipe = aba.js(
            """(async () => {
              const header = document.querySelector('header');
              const antes = header.dataset.on;
              const alvo = document.querySelector('[data-theme="pistachio"], [data-theme="white"]');
              if (!alvo) return { achou: false };
              window.scrollTo(0, alvo.offsetTop + 40);
              await new Promise((r) => setTimeout(r, 500));
              const depois = header.dataset.on;
              window.scrollTo(0, 0);
              await new Promise((r) => setTimeout(r, 300));
              return { achou: true, antes, depois };
            })()"""
        )
        checar(
            "§10.3 tema do header troca por seção em /equipe",
            tema_equipe.get("achou") and tema_equipe.get("antes") == "navy" and tema_equipe.get("depois") == "light",
            f"({tema_equipe})",
        )

        # --- roundtrip: volta para a Home e reconfere as três garantias ---
        aba.js("""document.querySelector('header a[href="/"]').click()""")
        time.sleep(3.0)
        volta = aba.js("({ rota: location.pathname })")
        checar("§10.3 volta para Home (client-side)", volta["rota"] == "/", f"({volta['rota']})")

        sticky_home = aba.js(
            """(() => {
              const tops = [...document.querySelectorAll('.section')].map(
                (s) => parseFloat(s.style.top || 'NaN')
              );
              return {
                total: tops.length,
                todosDefinidos: tops.every((t) => !Number.isNaN(t)),
                algumNegativo: tops.some((t) => t < 0),
                todosNaoPositivos: tops.every((t) => t <= 0),
              };
            })()"""
        )
        checar(
            "§10.3 volta: sticky stack recalculado na Home (nem todos 0px)",
            sticky_home["total"] > 0
            and sticky_home["todosDefinidos"]
            and sticky_home["algumNegativo"]
            and sticky_home["todosNaoPositivos"],
            f"({sticky_home})",
        )

        tema_home = aba.js(
            """(async () => {
              const header = document.querySelector('header');
              const antes = header.dataset.on;
              const alvo = document.querySelector('[data-theme="pistachio"], [data-theme="white"]');
              if (!alvo) return { achou: false };
              window.scrollTo(0, alvo.offsetTop + 40);
              await new Promise((r) => setTimeout(r, 500));
              const depois = header.dataset.on;
              return { achou: true, antes, depois };
            })()"""
        )
        checar(
            "§10.3 volta: tema do header troca por seção na Home",
            tema_home.get("achou") and tema_home.get("antes") == "navy" and tema_home.get("depois") == "light",
            f"({tema_home})",
        )

        revelados_home = aba.js(
            "document.querySelectorAll('[data-inview=\"true\"]').length"
        )
        checar(
            "§10.3 volta: reveals dispararam na Home",
            revelados_home >= 1,
            f"(revelados={revelados_home})",
        )

        # --- Carga direta e âncora cross-page ---------------------------
        aba.ir("/equipe", espera=5.0)
        direto = aba.js("({ rota: location.pathname, membros: document.querySelectorAll('[data-membro]').length })")
        checar("§10.4 carga direta de /equipe funciona", direto["membros"] == 11, f"({direto['membros']})")

        aba.ir("/#cases", espera=4.0)
        ancora = aba.js(
            """(() => {
              const el = document.querySelector('#cases');
              if (!el) return { ok: false };
              const t = el.getBoundingClientRect().top;
              return { ok: Math.abs(t) <= 16, top: Math.round(t) };
            })()"""
        )
        checar("§3.3 /#cases rola até a âncora (±16px, tolera easing do Lenis)", ancora.get("ok"), f"(top={ancora.get('top')})")

        # --- §10.7: sob prefers-reduced-motion, nenhum parallax ----------
        # O grep em CSS do MemberCard só prova a troca de foto no hover; o
        # parallax do hero mosaico vive em runtime (useParallax lendo
        # prefersReducedMotion() de utils/media.js), caminho nunca exercitado
        # antes. Emula a media query via CDP, recarrega a /equipe e compara a
        # geometria/transform das fotos do mosaico em duas posições de
        # scroll — sem reduced motion elas mudariam de transform ao rolar.
        aba.cmd(
            "Emulation.setEmulatedMedia",
            media="screen",
            features=[{"name": "prefers-reduced-motion", "value": "reduce"}],
        )
        aba.ir("/equipe", espera=5.0)
        paralaxe = aba.js(
            """(async () => {
              const imgs = [...document.querySelectorAll('.reveal-tilt img')];
              window.scrollTo(0, 0);
              await new Promise((r) => setTimeout(r, 200));
              const antes = imgs.map((i) => getComputedStyle(i).transform);
              window.scrollTo(0, 500);
              await new Promise((r) => setTimeout(r, 350));
              const depois = imgs.map((i) => getComputedStyle(i).transform);
              window.scrollTo(0, 0);
              return { total: imgs.length, antes, depois };
            })()"""
        )
        sem_transform = all(t in ("none", "") for t in paralaxe["antes"])
        sem_mudanca = paralaxe["antes"] == paralaxe["depois"]
        checar(
            "§10.7 nenhum parallax no hero sob prefers-reduced-motion",
            paralaxe["total"] > 0 and sem_transform and sem_mudanca,
            f"(total={paralaxe['total']} antes={paralaxe['antes']} depois={paralaxe['depois']})",
        )
        aba.cmd("Emulation.setEmulatedMedia", media="screen", features=[])
    finally:
        proc.terminate()

    print()
    if falhas:
        print(f"{len(falhas)} critério(s) falharam:")
        for f in falhas:
            print(f"  - {f}")
        sys.exit(1)
    print("todos os critérios verificados passaram")


if __name__ == "__main__":
    main()
