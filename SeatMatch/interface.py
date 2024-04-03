# -*- coding: utf-8 -*-
"""
date of creation:   30.01.2024
filename:           main.py
coded by:           Foxispythonlab
"""

############################ --- Imports --- ##################################

import json
import logging
import os
import pickle
import webbrowser

try:
    from icecream import ic  # ; ic.disable() to disable debug
except ImportError:  # Graceful fallback if IceCream isn't installed.
    ic = lambda *a: None if not a else (a[0] if len(a) == 1 else a)
try:
    from main import DataManager
except ImportError:
    pass
from internal_functions import get_buttons, Dialog, rpath
from math import cos, sin, radians
from PyQt6.QtWidgets import (
    QApplication,
    QPushButton,
    QGridLayout,
    QVBoxLayout,
    QHBoxLayout,
    QCheckBox,
    QLineEdit,
    QTextEdit,
    QComboBox,
    QSpinBox,
    QWidget,
    QLabel,
)

from PyQt6.QtCore import (
    QPointF,
    QRectF,
    QPoint,
    QRect,
    QSize,
    Qt
)

from PyQt6.QtGui import (
    QFontMetrics,
    QPaintEvent,
    QPainter,
    QPixmap,
    QColor,
    QIcon,
    QFont,
    QPen
)


######################### --- Inizializing --- ################################


class MainWindow(QWidget):
    def __init__(self, *buttons, data):
        super().__init__()

        self.setWindowIcon(QIcon(rpath("icon.png")))
        self.setWindowTitle("SeatMatch")

        self.setMinimumSize(1500, 825)
        self.setGeometry(0, 0, 1920, 1080)

        mlayout = QHBoxLayout()

        self.optionsWindow = OptionsWindow(buttons, self)
        self.playground = PlayGround()
        self.data = data

        mlayout.addWidget(self.optionsWindow, 1, Qt.AlignmentFlag.AlignCenter)
        mlayout.addWidget(self.playground, 3)

        self.setLayout(mlayout)


class OptionsWindow(QWidget):
    def __init__(self, buttons, parent=None):
        super().__init__(parent)

        self.setStyleSheet("QPushButton { border: None }")
        self.setMinimumSize(QSize(475, 825))
        self.setMaximumSize(QSize(600, 1080))

        layout = QVBoxLayout()
        layout.setSpacing(50)

        for i, field in enumerate(*buttons):
            for button in field:
                if "text" not in button.keys():
                    button["text"] = ""
            setattr(self, f"options{i}", Optionfiled(self, field))
            layout.addWidget(getattr(self, f"options{i}"), i, Qt.AlignmentFlag.AlignCenter)

        self.setLayout(layout)


class IconButton(QPushButton):
    def __init__(self, parent, icon, func, size, text, **kwargs):
        super().__init__(parent)

        self.setFixedSize(size)
        self._parent = parent
        self._func = func
        self._text = text
        self._iconPath = rpath(icon)
        self.icon = QPixmap(self._iconPath)
        if self._text:
            self.setNewText(text)
            ic(self._text)

        self.clicked.connect(pickle.partial(func, **kwargs))

    def setNewText(self, text):
        self.icon = QPixmap(self._iconPath)

        pen = QPainter(self.icon)
        pen.setRenderHint(QPainter().renderHints().Antialiasing, True)
        pen.setPen(QColor("black"))  # Set the pen color to blue
        font = QFont("Curior")
        size = self.geometry()
        fontsize = 15 + (size.width() + 15) * size.height() // 3300
        font.setPointSize(fontsize)  # Set the font size
        pen.setFont(font)

        # Calculate the size of the text
        font_metrics = QFontMetrics(font)
        text_width = font_metrics.horizontalAdvance(text)
        text_height = font_metrics.height()

        # Calculate the position to center the text
        center_x = int((self.icon.width() * 0.99 - text_width) // 2)
        center_y = int((self.icon.height() * 0.95 + text_height) // 2.5)

        pen.drawText(center_x, center_y, text)  # Draw the text at the center position
        pen.end()

    def setNewIcon(self, icon_path: str):
        self.icon = QPixmap(icon_path).scaled(self.geometry().size())
        self.update()

    def paintEvent(self, a0: QPaintEvent | None):
        super().paintEvent(a0)

        w = self.geometry().width()
        h = self.geometry().height()

        pen = QPainter(self)

        pen.setRenderHint(QPainter().renderHints().Antialiasing, True)
        pen.drawPixmap(QRect(0, 0, w, h), self.icon)

        pen.end()


class Optionfiled(QWidget):
    def __init__(self, parent, buttons):
        super().__init__(parent)

        layout = QGridLayout()
        layout.setSpacing(25)

        for i, button in enumerate(buttons):
            setattr(self, f"button{i}",
                    IconButton(parent, icon=button["icon"], func=button["func"], size=button["size"],
                               text=button["text"], **button["vars"]))
            layout.addWidget(getattr(self, f"button{i}"), *button["pos"], Qt.AlignmentFlag.AlignCenter)
        self.setLayout(layout)


class TableDropZone:
    def __init__(self, parent, x0, y0, rect: QRect, count: int = 4):
        self.pos = (int(x0), int(y0))
        self.rect = rect
        self.spaces = []
        self.parent = parent

        xdist = rect.width() * 0.5
        ydist = rect.height() * 0.5 / count if count else None

        x = rect.x() + rect.width() * 0.25
        y = rect.y() + rect.height() * 0.25

        ic(x, y, xdist, ydist)

        for seat in range(count):
            self.spaces.append(SeatDropZone(QRect(int(x), int(y + ydist * seat), int(xdist), int(ydist))))


class SeatDropZone:
    def __init__(self, rect):
        self.rect = rect
        self.pos = rect.topLeft
        self.label = None


class MoveableLabel(QLabel):
    def __init__(self, text, parent=None):
        super().__init__(parent)

        if text:
            self.border = False
        else:
            self.border = True

        self.setText(text)
        self.setAlignment(Qt.AlignmentFlag.AlignLeft)
        self.setMouseTracking(True)
        self.offset = None
        self.startpos = None

    def paintEvent(self, event):
        super().paintEvent(event)
        if self.border or not self.text():
            pen = QPainter(self)
            pen.setRenderHint(QPainter().renderHints().Antialiasing, True)
            pen.setPen(QColor("#707070"))

            xd = self.geometry().width()
            yd = self.geometry().height()
            pen.drawRoundedRect(QRectF(self.rect().x(), self.rect().y(), xd / 1.5, int(yd / 1.5)),
                                self.height() / 2, self.height() / 2)

    def mousePressEvent(self, event):
        self.startpos = (self.pos().x(), self.pos().y())
        if event.button() == Qt.MouseButton.LeftButton:
            self.offset = event.pos()

    def mouseMoveEvent(self, event):
        if self.offset is not None:
            new_pos = self.mapToParent(event.pos()) - self.offset
            self.move(new_pos)

    def mouseReleaseEvent(self, event):
        if event.button() == Qt.MouseButton.LeftButton:
            self.offset = None

            intersect = False
            for table in self.parent().tables:
                if self.geometry().intersects(table.rect):
                    for seat in table.spaces:
                        if seat.rect.contains(self.pos() + event.pos()):
                            intersect = True
                            ic(seat.label)
                            if seat.label is not None:
                                self.change_pos(seat.label)
                            else:
                                self.move_to(QPoint(seat.rect.topLeft()))
                            break

            if not intersect:
                ic("Not intersecting")
                self.move_to(self.startpos)

    def change_pos(self, other_label):
        self_pos = QPoint(*self.startpos)
        other_pos = other_label.pos()
        self.move(other_pos)
        other_label.move(self_pos)
        ic("Swaped", other_label.text())
        self.parent().update_tables()

    def move_to(self, position):
        if isinstance(position, QPoint):
            self.move(position)
        else:
            self.move(*position)
        self.parent().update_tables()


class PlayGround(QWidget):
    created = True
    tablePreset = 1

    def __init__(self, parent=None):
        super().__init__(parent)
        self.setGeometry(QRect(100, 100, 800, 500))

        self.tables = []
        self.names = []

    def clear(self):
        for name in self.names:
            name.hide()
            name.deleteLater()

        for table in self.tables:
            for seat in table.spaces:
                seat.label = None

    def setNames(self, names: list, count: int):
        self.clear()
        while len(names) < count:
            names.append("")
        self.names = [MoveableLabel(name, self) for name in names]
        for name in self.names:
            name.setParent(self)
            name.hide()
        self.formatEvent()
        self.arrangeLabels()

    def update_tables(self):
        for table in self.tables:
            tablelabels = [label for label in self.names if table.rect.contains(label.geometry().center())]
            for seat in table.spaces:
                seat.label = None
                for label in tablelabels:
                    if seat.rect.contains(label.geometry().center()):
                        seat.label = tablelabels.pop(tablelabels.index(label))
                        break

        check = []
        for table in self.tables:
            ic([(seat.label.text() if seat.label is not None else None) for seat in table.spaces])
            check += [seat.label for seat in table.spaces if seat.label is not None]
        ic(len(check))

    def arrangeLabels(self):
        ic([label.text() for label in self.names])
        self.update()
        count = (4 if len(self.tables) == 6 else 2)

        for i, e in enumerate(self.names):

            table = 0
            while i > count - 1:
                i -= count
                table += 1
            if i < len(self.tables[table].spaces):
                e.move(QPoint(self.tables[table].spaces[i].rect.topLeft()))
                e.show()
            else:
                e.hide()

        ic()
        self.created = True
        self.update_tables()

    def resizeEvent(self, event):
        self.created = False
        self.tables = []
        self.formatEvent()
        ic()

    def formatEvent(self):
        if self.names:
            maxlen = ic(max([len(name.text()) for name in self.names]))
            fontsize = int((self.geometry().height() / 7.5) / maxlen)
            ic(fontsize, int((self.geometry().height() / 50)))
            font = QFont("Curior", (fontsize if fontsize < 14 else 14), 5, False)
            for label in self.names:
                label.setFont(font)
                label.setFixedSize(int(self.geometry().width() / 12), int(self.geometry().height() / 35))

    def paintEvent(self, event):
        super().paintEvent(event)
        pen = QPainter(self)
        self.paintTables(pen)
        pen.end()
        ic()

    def paintTables(self, pen):

        pen.setRenderHint(QPainter().renderHints().Antialiasing, True)

        if self.tablePreset == 1:

            x_dist = self.geometry().width() / 4
            y_dist = self.geometry().height() / 4

            self.paintTable(pen, x_dist, y_dist, -25, count=4)
            self.paintTable(pen, x_dist * 2, y_dist, 0, count=4)
            self.paintTable(pen, x_dist * 3, y_dist, 25, count=4)
            self.paintTable(pen, x_dist, y_dist * 3, -35, count=4)
            self.paintTable(pen, x_dist * 2, y_dist * 3, 0, count=4)
            self.paintTable(pen, x_dist * 3, y_dist * 3, 35, count=4)

        elif self.tablePreset == 2:

            x_dist = self.geometry().width() / 6
            y_dist = self.geometry().height() / 4

            self.paintTable(pen, x_dist * 1, y_dist, 0, one=True, size=(6.2, 10))
            self.paintTable(pen, x_dist * 2, y_dist, 0, one=True, size=(6.2, 10))
            self.paintTable(pen, x_dist * 4, y_dist, 0, one=True, size=(6.2, 10))
            self.paintTable(pen, x_dist * 5, y_dist, 0, one=True, size=(6.2, 10))
            self.paintTable(pen, x_dist * 1, y_dist * 2, 0, one=True, size=(6.2, 10))
            self.paintTable(pen, x_dist * 2, y_dist * 2, 0, one=True, size=(6.2, 10))
            self.paintTable(pen, x_dist * 4, y_dist * 2, 0, one=True, size=(6.2, 10))
            self.paintTable(pen, x_dist * 5, y_dist * 2, 0, one=True, size=(6.2, 10))
            self.paintTable(pen, x_dist * 1, y_dist * 3, 0, one=True, size=(6.2, 10))
            self.paintTable(pen, x_dist * 2, y_dist * 3, 0, one=True, size=(6.2, 10))
            self.paintTable(pen, x_dist * 4, y_dist * 3, 0, one=True, size=(6.2, 10))
            self.paintTable(pen, x_dist * 5, y_dist * 3, 0, one=True, size=(6.2, 10))

        elif self.tablePreset == 3:

            x_dist = self.geometry().width() / 5
            y_dist = self.geometry().height() / 6

            self.paintTable(pen, x_dist * 1, y_dist * 2, 90, one=True, size=(8, 8))
            self.paintTable(pen, x_dist * 1, y_dist * 3, 90, one=True, size=(8, 8))
            self.paintTable(pen, x_dist * 1, y_dist * 4, 90, one=True, size=(8, 8))
            self.paintTable(pen, x_dist * 1, y_dist * 5, 90, one=True, size=(8, 8))
            self.paintTable(pen, x_dist * 1, y_dist * 1, 0, one=True, size=(5, 10))
            self.paintTable(pen, x_dist * 2, y_dist * 1, 0, one=True, size=(5, 10))
            self.paintTable(pen, x_dist * 3, y_dist * 1, 0, one=True, size=(5, 10))
            self.paintTable(pen, x_dist * 4, y_dist * 1, 0, one=True, size=(5, 10))
            self.paintTable(pen, x_dist * 4, y_dist * 5, 90, one=True, size=(8, 8))
            self.paintTable(pen, x_dist * 4, y_dist * 4, 90, one=True, size=(8, 8))
            self.paintTable(pen, x_dist * 4, y_dist * 3, 90, one=True, size=(8, 8))
            self.paintTable(pen, x_dist * 4, y_dist * 2, 90, one=True, size=(8, 8))

        if not self.created:
            self.arrangeLabels()
        self.created = True

    def paintTable(self, pen: QPainter, x0, y0, rotation, one=False, size=(8, 4), count=2):
        tableWidth = self.geometry().width() / size[0]
        tableHeight = self.geometry().height() / size[1]

        # Adds the DropZone to self.tables with its hitbox at the position
        hitbox = QRect(int(x0 - tableWidth / 1.8), int(y0 - tableHeight / 1.8),
                       int(tableWidth * 1.1), int(tableHeight * 1.1))

        if not self.created:
            self.tables.append(TableDropZone(self, x0, y0, hitbox, count=count))

        x0 = x0 - tableWidth / 2
        y0 = y0 - tableHeight / 2

        if not one:
            tableEdges = (QPointF(-tableWidth / 2, -tableHeight / 2), QPointF(-tableWidth / 2, tableHeight / 2),
                          QPointF(tableWidth / 2, -tableHeight / 2), QPointF(tableWidth / 2, tableHeight / 2),
                          QPointF(0, -tableHeight / 2), QPointF(0, tableHeight / 2))
        else:
            tableEdges = (QPointF(-tableWidth / 2, -tableHeight / 2), QPointF(-tableWidth / 2, tableHeight / 2),
                          QPointF(tableWidth / 2, -tableHeight / 2), QPointF(tableWidth / 2, tableHeight / 2))

        pen.save()

        # Translate and rotate pen - changes origin and rotation -> Easyer Rotation
        pen.translate(x0 + tableWidth / 2, y0 + tableHeight / 2)
        pen.rotate(rotation)

        legHeight = self.geometry().height() / 15

        pen.setPen(QPen(QColor("#6495ED"), 3, Qt.PenStyle.SolidLine))
        for edge in tableEdges:
            x = edge.x() + cos(radians(90 - rotation)) * legHeight
            y = edge.y() + sin(radians(90 - rotation)) * legHeight
            pen.drawLine(edge, QPointF(x, y))

        pen.setPen(QPen(QColor("#6495ED"), 3, Qt.PenStyle.SolidLine))
        pen.setBrush(QColor("#DEB887"))
        pen.drawRect(QRectF(tableEdges[0], tableEdges[3]))

        pen.restore()


# noinspection PyShadowingNames
class EnterNames(QWidget):
    def __init__(self, data):
        super().__init__(None)

        self.data = data
        self.setWindowTitle("SeatMatch - New Class")
        self.setWindowIcon(QIcon(rpath("Buttons//main.png")))
        self.setMinimumSize(QSize(500, 600))
        layout = QGridLayout()

        self.cname = QLineEdit(self)
        self.cname.setPlaceholderText("Class Name, e.g. 2d")

        self.names = QTextEdit(self)
        self.names.setPlaceholderText("Write all the Names, each on a new Line \ne.g. Carl\nMax")
        self.names.textChanged.connect(self.update_count)

        self.count = QSpinBox(self)
        self.count.setRange(4, 24)
        self.count.setValue(24)

        self.commit = QPushButton("Save")
        self.commit.clicked.connect(self.addClass)
        self.exit = QPushButton("Cancel")
        self.exit.clicked.connect(pickle.partial(self.close))

        layout.addWidget(self.cname, 0, 0, 1, 2)
        layout.addWidget(self.names, 1, 0, 1, 2)
        layout.addWidget(QLabel("Number of Places/Seats: "))
        layout.addWidget(self.count, 2, 1, 1, 1)
        layout.addWidget(self.commit, 3, 0, 1, 1)
        layout.addWidget(self.exit, 3, 1, 1, 1)
        self.setLayout(layout)

    def update_count(self):
        numNames = len([name for name in self.names.toPlainText().split("\n") if name])
        self.count.setRange((4 if numNames < 4 else 24 if numNames > 24 else numNames), 24)
        self.count.setValue((4 if numNames < 4 else 24 if numNames > 24 else numNames))

    def addClass(self):
        cname = self.cname.text() or "N/A"
        names = [name for name in self.names.toPlainText().split("\n") if name] or []

        if len(names) > 24 or len(names) < 4 or cname == "N/A":
            logging.warning("Invalid Input, lenght of names need to be between 4 and 24")
            dialog = Dialog("Invalid Input", "Cant read the names of the class",
                            "Please write each name on a new line", size=QSize(450, 120), type="OK")
            dialog.show()
            dialog.exec()
            return

        setattr(self.data, "names", names)
        setattr(self.data, "count", (int(self.count.text()) if self.count.text() else 24))
        setattr(self.data, "cname", cname)
        self.data.update_to_gui()
        self.close()


class ChangeSettings(QWidget):
    def __init__(self, data, parent=None):
        super().__init__(parent)

        self.data = data
        self.setWindowTitle("SeatMatch - Settings")
        self.setFixedSize(QSize(500, 600))

        layout = QGridLayout()

        titel = QLabel("Settings")
        titel.setFont(QFont("Curior New", 24, 2, False))
        titel.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.preload = QComboBox()
        self.preload.addItems([field.split(".")[0] for field in os.listdir("DataFiles\\")] + ["None"])

        self.favorites = QTextEdit()
        self.favorites.setPlaceholderText(
            "Please enter your class names into the field, seperated by new lines, if you don't find the class in the Options, make shure to add it once and save it then")
        self.favorites.setText("\n".join([field.split(".")[0] for field in os.listdir("DataFiles\\")]))

        self.display_options = QTextEdit()
        self.display_options.setReadOnly(True)
        self.display_options.setText("\n".join([field.split(".")[0] for field in os.listdir("DataFiles\\")]))

        self.commit = QPushButton("Save")
        self.commit.clicked.connect(self.saveSettings)
        self.exit = QPushButton("Cancel")
        self.exit.clicked.connect(pickle.partial(self.close))

        layout.addWidget(titel, 0, 0, 1, 3)
        layout.addWidget(QLabel("Preloaded Class:"))
        layout.addWidget(self.preload, 2, 0, 1, 3)
        layout.addWidget(QLabel("Options: "), 3, 0)
        layout.addWidget(QLabel("Your Favorites"), 3, 1, 1, 2)
        layout.addWidget(self.display_options, 4, 0)
        layout.addWidget(self.favorites, 4, 1, 1, 2)
        layout.addWidget(self.commit, 5, 1)
        layout.addWidget(self.exit, 5, 2)

        self.setLayout(layout)

    def saveSettings(self):
        preload_text = self.preload.currentText()
        favorites = [fav for fav in self.favorites.toPlainText().split("\n") if fav]
        if preload_text != "None":
            preload_text += ".seatMatch"

        if any([fav.strip() + ".seatMatch" not in os.listdir("DataFiles\\") for fav in favorites]):
            dialog = Dialog("Invalid Operation", "You can't chose a class that doesn't exists",
                            "In order to add the class, you need to create it first, open dokumentary ?",
                            accepted=lambda *args: webbrowser.open("https://Lesson-Gear.github.io/SeatMatch/doku",
                                                                   new=2), size=QSize(450, 120))
            dialog.show()
            dialog.exec()
            return

        with open(rpath("config.json"), "r") as f:
            current_data = json.loads(f.read())
        current_data["preloaded_class"] = preload_text
        current_data["favorites"] = [fav.strip() + ".seatMatch" for fav in favorites]

        with open(rpath("config.json"), "w") as f:
            f.write(json.dumps(current_data, indent=4))
        self.close()


######################### --- Main Programm --- ###############################


if __name__ == '__main__':
    app = QApplication([])
    data = DataManager()
    win = MainWindow(get_buttons(data))
    win.show()
    win.show()
    app.exec()
