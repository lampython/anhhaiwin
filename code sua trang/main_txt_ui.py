import sys
import os
from PyQt6 import QtWidgets
from PyQt6.QtWidgets import QApplication, QMessageBox
from PyQt6.QtGui import QPixmap
from PyQt6.QtCore import Qt
from bs4 import BeautifulSoup
from giaodien_ui import Ui_HTMLImageEditorUI


class HTMLTextEditorApp:
    def __init__(self):
        self.window = QtWidgets.QWidget()
        self.ui = Ui_HTMLImageEditorUI()
        self.ui.setupUi(self.window)

        self.file_path = None

        self.ui.btn_open.clicked.connect(self.open_file_dialog)
        self.ui.pushButton_ovewrite_html.clicked.connect(self.overwrite_html)

        self.ui.input_linkanh.textChanged.connect(self.preview_new_image)
        self.ui.btn_replace_linkanh.clicked.connect(self.replace_image_link)
        self.ui.btn_replace_href.clicked.connect(self.replace_href_link)
        self.ui.btn_replace_url.clicked.connect(self.replace_url_link)

        self.ui.search_text_input.textChanged.connect(self.search_text)
        self.ui.text_results.itemClicked.connect(self.show_only_in_lineedit)
        self.ui.btn_replace_text.clicked.connect(self.replace_text_content)

        self.ui.list_widget_img.itemClicked.connect(self.handle_img_selection)
        self.ui.list_widget_href.itemClicked.connect(self.handle_href_selection)
        self.ui.list_widget_url.itemClicked.connect(self.handle_url_selection)

    def open_file_dialog(self):
        file_path, _ = QtWidgets.QFileDialog.getOpenFileName(self.window, "Chọn file HTML", "", "HTML Files (*.html *.htm)")
        if file_path:
            self.file_path = file_path
            with open(file_path, "r", encoding="utf-8") as f:
                self.soup = BeautifulSoup(f.read(), "html.parser")
            self.load_from_soup()

    def load_from_soup(self):
        self.images = self.soup.find_all("img")
        self.links = self.soup.find_all("a")
        self.text_nodes = self.soup.find_all(string=True)

        self.ui.list_widget_img.clear()
        self.ui.list_widget_href.clear()
        self.ui.list_widget_url.clear()
        self.ui.text_results.clear()

        for img in self.images:
            src = img.get("src")
            if src:
                self.ui.list_widget_img.addItem(src)
        for a in self.links:
            href = a.get("href")
            if href:
                self.ui.list_widget_href.addItem(href)
                self.ui.list_widget_url.addItem(href)
        for t in self.text_nodes:
            content = t.strip()
            if content:
                self.ui.text_results.addItem(content)

    def replace_image_link(self):
        selected = self.ui.list_widget_img.currentItem()
        if not selected:
            return
        old_link = selected.text()
        new_link = self.ui.input_linkanh.text().strip()
        for img in self.images:
            if img.get("src") == old_link:
                img["src"] = new_link
        self.load_from_soup()

    def replace_href_link(self):
        selected = self.ui.list_widget_href.currentItem()
        if not selected:
            return
        old_href = selected.text()
        new_href = self.ui.input_link_href.text().strip()
        for a in self.links:
            if a.get("href") == old_href:
                a["href"] = new_href
        self.load_from_soup()

    def replace_url_link(self):
        selected = self.ui.list_widget_url.currentItem()
        if not selected:
            return
        old_href = selected.text()
        new_href = self.ui.input_link_url.text().strip()
        for a in self.links:
            if a.get("href") == old_href:
                a["href"] = new_href
        self.load_from_soup()

    def search_text(self):
        if not hasattr(self, "text_nodes"):
            return
        keyword = self.ui.search_text_input.text().strip().lower()
        self.ui.text_results.clear()
        if keyword:
            matches = [s for s in self.text_nodes if keyword in s.lower()]
            for match in matches:
                self.ui.text_results.addItem(match)

    def show_only_in_lineedit(self, item):
        self.ui.lineEdit_chon.setText(item.text())

    def replace_text_content(self):
        selected = self.ui.text_results.currentItem()
        if not selected:
            return
        old_text = selected.text()
        new_text = self.ui.input_text_edit.text().strip()
        for i, t in enumerate(self.text_nodes):
            if t.strip() == old_text:
                self.text_nodes[i].replace_with(new_text)
                break
        self.load_from_soup()

    def handle_img_selection(self, item):
        text = item.text()
        self.ui.lineEdit_chon.setText(text)
        self.preview_current_image(item)

    def handle_href_selection(self, item):
        text = item.text()
        self.ui.lineEdit_chon.setText(text)

    def handle_url_selection(self, item):
        text = item.text()
        self.ui.lineEdit_chon.setText(text)

    def preview_current_image(self, item):
        self.load_image(item.text(), self.ui.preview_current, self.ui.preview_current_info)

    def preview_new_image(self):
        url = self.ui.input_linkanh.text().strip()
        if url:
            self.load_image(url, self.ui.preview_new, self.ui.preview_new_info)

    def load_image(self, url, label, info_label):
        try:
            if url.startswith("http"):
                import requests
                response = requests.get(url)
                image = QPixmap()
                image.loadFromData(response.content)
            else:
                image = QPixmap(url)
            label.setPixmap(image.scaled(label.width(), label.height(), Qt.AspectRatioMode.KeepAspectRatio))
            info_label.setText(f"Kích thước: {image.width()} x {image.height()} px")
        except Exception as e:
            label.setText(f"Lỗi: {e}")
            info_label.setText("")

    def overwrite_html(self):
        if not self.file_path or not hasattr(self, "soup"):
            QMessageBox.warning(self.window, "Lỗi", "Chưa có file HTML để ghi!")
            return
        try:
            with open(self.file_path, "w", encoding="utf-8") as f:
                f.write(str(self.soup))
            QMessageBox.information(self.window, "Hoàn tất", f"Đã ghi đè HTML tại {self.file_path}")
        except Exception as e:
            QMessageBox.critical(self.window, "Lỗi khi ghi đè HTML", str(e))


def main():
    app = QApplication(sys.argv)
    editor = HTMLTextEditorApp()
    editor.window.show()
    sys.exit(app.exec())


if __name__ == "__main__":
    main()
