# generator.py
from html import escape
from typing import Iterable
from bs4 import BeautifulSoup
import shutil
import os

CARD_TMPL = """\
    <div class="bg-white p-2 rounded-lg shadow hover:shadow-md transition-shadow">
      <div class="aspect-square rounded-lg overflow-hidden mb-2">
        <img alt="{alt}" class="w-full h-full object-cover" src="{img}"/>
      </div>
      <h3 class="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">{title}</h3>
      <a class="block text-center bg-primary text-white py-1 text-sm rounded hover:bg-primary/90 transition-colors" href="{link}" target="_blank">Mua Ngay</a>
    </div>"""

def render_card(title: str, image_url: str, link: str, alt: str | None = None) -> str:
    return CARD_TMPL.format(
        title=escape(title or ""),
        img=(image_url or "").strip(),
        link=(link or "").strip(),
        alt=escape(alt or title or "Sản phẩm"),
    )

# --------- Append vào file HTML ---------
START_MARK = "<!-- PRODUCTS_START -->"
END_MARK = "<!-- PRODUCTS_END -->"

def _backup_file(path: str):
    try:
        shutil.copy2(path, path + ".bak")
    except Exception:
        pass  # không bắt buộc

def append_card_to_html(html_path: str, card_html: str) -> str:
    """
    Trả về 'marker' nếu chèn theo marker, hoặc 'soup' nếu chèn bằng BeautifulSoup.
    """
    if not os.path.exists(html_path):
        raise FileNotFoundError(f"Không tìm thấy file: {html_path}")

    with open(html_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1) Nếu có marker, chèn giữa START
