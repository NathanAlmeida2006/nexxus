#!/usr/bin/env bash
# Otimiza o ensaio fotográfico (gerenciamento/fotos) para código/public/fotos.
# Idempotente: regenera tudo a cada execução. Requer ffmpeg no PATH.
#
# O ffmpeg aplica a rotação EXIF antes dos filtros, então os arquivos de
# câmera (6000x4000 com flag de rotação) saem corretamente em retrato.
# min(largura, iw) impede upscale das duas fotos que já vêm pequenas.
set -euo pipefail

raiz="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
origem="$raiz/gerenciamento/fotos"
destino="$raiz/código/public/fotos"

# <caminho relativo à origem>|<nome de saída, sem largura nem extensão>
retratos=(
  "julia/julia1.JPG|julia-1"
  "julia/julia2.JPG|julia-2"
  "lara/lara1.JPG|lara-1"
  "lara/lara2.JPG|lara-2"
  "ísis/isis1.JPG|isis-1"
  "ísis/isis2.JPG|isis-2"
  "leandro/leandro1.JPG|leandro-1"
  "leandro/leandro2.JPG|leandro-2"
  "lívinia/i1.JPG|lavinia-1"
  "lívinia/i2.JPG|lavinia-2"
  "lucas/lucas1.jpeg|lucas-1"
  "ana/ana1.JPG|ana-1"
  "ana/ana2.JPG|ana-2"
  "otávio/otávio1.JPG|otavio-1"
  "otávio/otávio2.JPG|otavio-2"
  "kaua/kaua1.JPG|kaua-1"
  "kaua/kaua2.JPG|kaua-2"
  "luan/luan1.JPG|luan-1"
  "luan/luan2.JPG|luan-2"
  "kamilly/kamilly1.jpeg|kamilly-1"
)

grupo=(
  "equipe/horizontal1.JPG|equipe/time-h1"
  "equipe/horizontal2.JPG|equipe/time-h2"
  "equipe/horizontal3.JPG|equipe/time-h3"
  "equipe/vertical1.JPG|equipe/time-v1"
  "equipe/vertical 2.JPG|equipe/time-v2"
  "equipe/vertical3.JPG|equipe/time-v3"
)

converter() { # converter <origem> <saída sem extensão> <larguras...>
  local src="$1" out="$2"
  shift 2
  local w
  for w in "$@"; do
    ffmpeg -nostdin -loglevel error -y -i "$src" \
      -vf "scale='min($w,iw)':-2" \
      -c:v libwebp -quality 80 -compression_level 6 \
      "$destino/$out-$w.webp"
  done
}

mkdir -p "$destino/equipe"

for par in "${retratos[@]}"; do
  converter "$origem/${par%%|*}" "${par##*|}" 640 1200
done

for par in "${grupo[@]}"; do
  converter "$origem/${par%%|*}" "${par##*|}" 900 1600
done

echo "retratos: $(ls "$destino"/*.webp | wc -l) | grupo: $(ls "$destino"/equipe/*.webp | wc -l)"
