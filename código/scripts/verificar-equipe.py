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
import subprocess
import sys
import time
import urllib.request

import websocket

BASE = os.environ.get("BASE_URL", "http://localhost:4173")
PORTA = 9333


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

    def cmd(self, metodo, **params):
        self.seq += 1
        self.ws.send(json.dumps({"id": self.seq, "method": metodo, "params": params}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == self.seq:
                if "error" in msg:
                    raise RuntimeError(msg["error"])
                return msg.get("result", {})

    def ir(self, caminho, espera=3.0):
        self.cmd("Page.navigate", url=BASE + caminho)
        time.sleep(espera)

    def js(self, expressao):
        r = self.cmd(
            "Runtime.evaluate", expression=expressao, returnByValue=True, awaitPromise=True
        )
        return r["result"].get("value")


def esperar_devtools(tempo=10):
    limite = time.time() + tempo
    while time.time() < limite:
        try:
            with urllib.request.urlopen(f"http://127.0.0.1:{PORTA}/json/version") as r:
                return json.load(r)
        except Exception:
            time.sleep(0.3)
    sys.exit("DevTools não subiu")


def main():
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

        falhas = []

        def checar(rotulo, condicao, detalhe=""):
            print(f"{'OK    ' if condicao else 'FALHOU'}  {rotulo} {detalhe}")
            if not condicao:
                falhas.append(rotulo)

        # --- Home -------------------------------------------------------
        aba.ir("/", espera=5.0)  # o preloader precisa terminar
        home = aba.js(
            """(() => {
              const s = document.querySelector('#nozes');
              if (!s) return { existe: false };
              return {
                existe: true,
                imgs: s.querySelectorAll('img').length,
                linkEquipe: !!s.querySelector('a[href="/equipe"]'),
                temSetores: /Presid[êe]ncia|Marketing Interno/.test(s.textContent),
                temNamesNote: /papelada/.test(s.textContent),
              };
            })()"""
        )
        checar("§10.8 Home tem a seção #nozes", home and home["existe"])
        checar("§10.8 Home tem exatamente 1 foto", home.get("imgs") == 1, f"(imgs={home.get('imgs')})")
        checar("§10.8 Home aponta para /equipe", home.get("linkEquipe"))
        checar("§10.8 Home sem lista de setores", not home.get("temSetores"))
        checar("§10.8 Home sem namesNote", not home.get("temNamesNote"))

        # --- Navegação client-side para /equipe -------------------------
        aba.js("""document.querySelector('#nozes a[href="/equipe"]').click()""")
        time.sleep(3.5)
        nav = aba.js("({ rota: location.pathname, titulo: document.title })")
        checar("Navegação client-side chega em /equipe", nav["rota"] == "/equipe", f"({nav['rota']})")
        checar("§7.2 título por rota", nav["titulo"].startswith("As Nozes"), f"({nav['titulo']})")

        # --- Conteúdo da /equipe ----------------------------------------
        equipe = aba.js(
            """(() => {
              const membros = [...document.querySelectorAll('[data-membro]')];
              const imgs = [...document.querySelectorAll('img')];
              return {
                membros: membros.length,
                slugs: membros.map((m) => m.dataset.membro),
                setores: document.querySelectorAll('[data-setor]').length,
                imgsQuebradas: imgs.filter((i) => i.complete && i.naturalWidth === 0).length,
                temLista: !!document.querySelector('#lista'),
                stickyAplicado: [...document.querySelectorAll('.section')].every((s) => s.style.top !== ''),
              };
            })()"""
        )
        checar("§10.2 onze integrantes", equipe["membros"] == 11, f"({equipe['membros']})")
        checar("§10.2 sete setores", equipe["setores"] == 7, f"({equipe['setores']})")
        checar("§10.2 nenhuma imagem quebrada", equipe["imgsQuebradas"] == 0)
        checar("§7 âncora #lista existe", equipe["temLista"])
        checar("§10.3 sticky stack recalculado na rota nova", equipe["stickyAplicado"])

        esperados = {
            "julia", "lara", "isis", "leandro", "lavinia", "lucas",
            "ana", "otavio", "kaua", "luan", "kamilly",
        }
        checar(
            "§10.2 todos os slugs presentes",
            set(equipe["slugs"]) == esperados,
            f"(faltando: {sorted(esperados - set(equipe['slugs']))})",
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
              return { ok: Math.abs(t) < window.innerHeight * 0.5, top: Math.round(t) };
            })()"""
        )
        checar("§3.3 /#cases rola até a âncora", ancora.get("ok"), f"(top={ancora.get('top')})")

        print()
        if falhas:
            print(f"{len(falhas)} critério(s) falharam:")
            for f in falhas:
                print(f"  - {f}")
            sys.exit(1)
        print("todos os critérios verificados passaram")
    finally:
        proc.terminate()


if __name__ == "__main__":
    main()
