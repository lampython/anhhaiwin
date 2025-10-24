# giaodien_ui.py
from PyQt6 import QtCore, QtGui, QtWidgets

class Ui_MainWindow(object):
    def setupUi(self, MainWindow: QtWidgets.QMainWindow):
        MainWindow.setObjectName("MainWindow")
        MainWindow.resize(860, 560)

        self.centralwidget = QtWidgets.QWidget(parent=MainWindow)
        self.rootLayout = QtWidgets.QVBoxLayout(self.centralwidget)
        self.rootLayout.setContentsMargins(10, 10, 10, 10)
        self.rootLayout.setSpacing(10)

        self.tabWidget = QtWidgets.QTabWidget(parent=self.centralwidget)

        # === Tab: Nhập sản phẩm ===
        self.tab_nhap = QtWidgets.QWidget()
        self.formLayoutWidget = QtWidgets.QWidget(parent=self.tab_nhap)
        self.formLayoutWidget.setGeometry(QtCore.QRect(10, 10, 820, 240))
        self.formLayout = QtWidgets.QFormLayout(self.formLayoutWidget)
        self.formLayout.setContentsMargins(0, 0, 0, 0)
        self.formLayout.setVerticalSpacing(12)
        self.formLayout.setLabelAlignment(
            QtCore.Qt.AlignmentFlag.AlignRight | QtCore.Qt.AlignmentFlag.AlignVCenter
        )

        # Row: File HTML
        self.lblHtml = QtWidgets.QLabel(parent=self.formLayoutWidget)
        self.lblHtml.setText("File HTML:")
        self.formLayout.setWidget(0, QtWidgets.QFormLayout.ItemRole.LabelRole, self.lblHtml)

        wrapHtml = QtWidgets.QHBoxLayout()
        self.edtHtmlPath = QtWidgets.QLineEdit(parent=self.formLayoutWidget)
        self.edtHtmlPath.setReadOnly(True)
        self.edtHtmlPath.setPlaceholderText("Chưa chọn file .html")
        self.btnBrowseHtml = QtWidgets.QPushButton(parent=self.formLayoutWidget)
        self.btnBrowseHtml.setText("Chọn file HTML…")
        self.btnBrowseHtml.setMinimumHeight(32)
        wrapHtml.addWidget(self.edtHtmlPath, 1)
        wrapHtml.addWidget(self.btnBrowseHtml, 0)
        self.formLayout.setLayout(0, QtWidgets.QFormLayout.ItemRole.FieldRole, wrapHtml)

        # Row: Title
        self.lblTitle = QtWidgets.QLabel(parent=self.formLayoutWidget)
        self.lblTitle.setText("Title:")
        self.formLayout.setWidget(1, QtWidgets.QFormLayout.ItemRole.LabelRole, self.lblTitle)

        self.edtTitle = QtWidgets.QLineEdit(parent=self.formLayoutWidget)
        self.edtTitle.setPlaceholderText("Nhập tiêu đề sản phẩm…")
        self.formLayout.setWidget(1, QtWidgets.QFormLayout.ItemRole.FieldRole, self.edtTitle)

        # Row: Image URL
        self.lblImage = QtWidgets.QLabel(parent=self.formLayoutWidget)
        self.lblImage.setText("Image URL:")
        self.formLayout.setWidget(2, QtWidgets.QFormLayout.ItemRole.LabelRole, self.lblImage)

        self.edtImage = QtWidgets.QLineEdit(parent=self.formLayoutWidget)
        self.edtImage.setPlaceholderText("https://… (đường link ảnh)")
        self.formLayout.setWidget(2, QtWidgets.QFormLayout.ItemRole.FieldRole, self.edtImage)

        # Row: Link
        self.lblLink = QtWidgets.QLabel(parent=self.formLayoutWidget)
        self.lblLink.setText("Link:")
        self.formLayout.setWidget(3, QtWidgets.QFormLayout.ItemRole.LabelRole, self.lblLink)

        self.edtLink = QtWidgets.QLineEdit(parent=self.formLayoutWidget)
        self.edtLink.setPlaceholderText("https://… (link TikTok / sản phẩm)")
        self.formLayout.setWidget(3, QtWidgets.QFormLayout.ItemRole.FieldRole, self.edtLink)

        # Row: Button
        btnRow = QtWidgets.QHBoxLayout()
        btnRow.addStretch(1)
        self.btnAdd = QtWidgets.QPushButton(parent=self.formLayoutWidget)
        self.btnAdd.setText("Thêm sản phẩm mới vào file HTML")
        self.btnAdd.setMinimumHeight(38)
        btnRow.addWidget(self.btnAdd)
        self.formLayout.setLayout(4, QtWidgets.QFormLayout.ItemRole.FieldRole, btnRow)

        # Khu bên dưới để bạn dễ thêm bảng/preview sau
        self.bottomWidget = QtWidgets.QWidget(parent=self.tab_nhap)
        self.bottomWidget.setGeometry(QtCore.QRect(10, 260, 820, 250))
        self.bottomLayout = QtWidgets.QVBoxLayout(self.bottomWidget)
        self.lblHint = QtWidgets.QLabel(parent=self.bottomWidget)
        self.lblHint.setWordWrap(True)
        self.lblHint.setText(
            "Gợi ý: Bạn có thể thêm bảng danh sách sản phẩm, preview HTML, nút Export/Import CSV ở đây."
        )
        self.bottomLayout.addWidget(self.lblHint)

        self.tabWidget.addTab(self.tab_nhap, "Nhập sản phẩm")

        self.rootLayout.addWidget(self.tabWidget)
        MainWindow.setCentralWidget(self.centralwidget)

        self.statusbar = QtWidgets.QStatusBar(parent=MainWindow)
        MainWindow.setStatusBar(self.statusbar)

        MainWindow.setWindowTitle("TikTok Shop — Quản lý sản phẩm")
