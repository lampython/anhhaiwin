# main.py
from dataclasses import dataclass
import sys
from typing import List

from PyQt6.QtWidgets import (
    QApplication, QMainWindow, QMessageBox, QFileDialog
)

from giaodien_ui import Ui_MainWindow
import generator  # render_card, append_card_to_html

@dataclass
class Product:
    title: str
    image_url: str
    link: str

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.ui = Ui_MainWindow()
        self.ui.setupUi(self)

        self.products: List[Product] = []
        self.html_path: str = ""

        # Signals
        self.ui.btnBrowseHtml.clicked.connect(self.on_browse_html)
        self.ui.btnAdd.clicked.connect(self.on_add_product)
        self.ui.edtLink.returnPressed.connect(self.on_add_product)

        self.ui.edtTitle.setFocus()

    # ===== Helpers =====
    def info(self, msg: str):
        self.statusBar().showMessage(msg, 4000)

    def warn(self, msg: str):
        QMessageBox.warning(self, "Thiếu thông tin", msg)

    def error(self, msg: str):
        QMessageBox.critical(self, "Lỗi", msg)

    # ===== Slots =====
    def on_browse_html(self):
        path, _ = QFileDialog.getOpenFileName(
            self, "Chọn file HTML để chèn sản phẩm", "",
            "HTML Files (*.html *.htm);;All Files (*.*)"
        )
        if path:
            self.html_path = path
            self.ui.edtHtmlPath.setText(path)
            self.info("Đã chọn file HTML.")

    def on_add_product(self):
        if not self.html_path:
            return self.warn("Vui lòng chọn file HTML trước.")

        title = self.ui.edtTitle.text().strip()
        img = self.ui.edtImage.text().strip()
        link = self.ui.edtLink.text().strip()

        if not title:
            return self.warn("Vui lòng nhập Title.")
        if not img:
            return self.warn("Vui lòng nhập Image URL.")
        if not link:
            return self.warn("Vui lòng nhập Link sản phẩm.")

        # Lưu vào bộ nhớ tạm (nếu bạn muốn dùng về sau)
        self.products.append(Product(title=title, image_url=img, link=link))

        # Tạo card và chèn vào file HTML
        try:
            card_html = generator.render_card(title, img, link)
            method = generator.append_card_to_html(self.html_path, card_html)
            self.info(f"Đã chèn sản phẩm vào file (cách: {method}).")
            QMessageBox.information(self, "Thành công", "Đã thêm sản phẩm vào file HTML.")
            self.ui.edtTitle.clear()
            self.ui.edtImage.clear()
            self.ui.edtLink.clear()
            self.ui.edtTitle.setFocus()
        except Exception as e:
            self.error(f"Không thể chèn HTML: {e!r}")

def main():
    app = QApplication(sys.argv)
    app.setApplicationName("TikTok Shop — Product Tool")
    w = MainWindow()
    w.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
