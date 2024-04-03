# -*- coding: utf-8 -*-
"""
date of creation:   30.01.2024
filename:           main.py
coded by:           Foxispythonlab
"""

############################ --- Imports --- ##################################

import json
import sys
import os
import webbrowser

import requests
from PyQt6.QtWidgets import QDialog, QDialogButtonBox, QVBoxLayout, QLabel
from PyQt6.QtCore import QSize, Qt
from PyQt6.QtGui import QIcon
from icecream import ic


######################### --- Inizializing --- ################################


def getSOrder(names: tuple):
    (n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11, n12, n13,
     n14, n15, n16, n17, n18, n19, n20, n21, n22, n23, n24) = names

    s1 = names
    s2 = (n20, n5, n10, n15, n24, n9, n14, n19, n4, n13, n18, n23, n8, n17, n22, n3, n12, n21, n2, n7, n16, n1, n6, n11)
    s3 = (n7, n24, n13, n22, n11, n4, n17, n2, n15, n8, n21, n6, n19, n12, n1, n10, n23, n16, n5, n14, n3, n20, n9, n18)
    s4 = (n14, n11, n8, n21, n18, n15, n12, n1, n22, n19, n16, n5, n2, n23, n20, n9, n6, n3, n24, n17, n10, n7, n4, n13)
    s5 = (n9, n18, n19, n16, n17, n22, n23, n20, n13, n2, n3, n24, n21, n6, n7, n4, n1, n10, n11, n8, n5, n14, n15, n12)
    s6 = (n6, n23, n13, n12, n10, n3, n21, n16, n14, n7, n1, n20, n18, n11, n5, n21, n22, n15, n9, n4, n2, n19, n17, n8)

    return [s1, s2, s3, s4, s5, s6]


# noinspection PyShadowingNames
def get_buttons(data):
    classes = data.getClassPresets()
    classes.reverse()

    b1 = ({"icon": "Buttons\\IconPack\\Shuffle.png", "func": lambda data: data.shuffle(),
           "size": QSize(425, 100), "vars": {"data": data}, "pos": (0, 0, 1, 2)},
          {"icon": "Buttons\\IconPack\\new_class.png", "func": lambda data: data.addNames(),
           "size": QSize(200, 60), "vars": {"data": data}, "pos": (1, 0, 1, 1)},
          {"icon": "Buttons\\IconPack\\save.png", "func": lambda data: data.save(),
           "size": QSize(200, 60), "vars": {"data": data}, "pos": (1, 1, 1, 1)}
          )

    b2 = ({"icon": "Buttons\\IconPack\\active_class_with_separating_line.png", "func": lambda *args: None,
           "size": QSize(425, 150), "text": "", "vars": {}, "pos": (0, 0, 1, 5)},
          {"icon": "Buttons\\IconPack\\existing_class.png", "func": lambda data: data.activateClass("button1"),
           "size": QSize(50, 50), "text": classes.pop(), "vars": {"data": data}, "pos": (2, 0, 1, 1)},
          {"icon": "Buttons\\IconPack\\existing_class.png", "func": lambda data: data.activateClass("button2"),
           "size": QSize(50, 50), "text": classes.pop(), "vars": {"data": data}, "pos": (2, 1, 1, 1)},
          {"icon": "Buttons\\IconPack\\existing_class.png", "func": lambda data: data.activateClass("button3"),
           "size": QSize(50, 50), "text": classes.pop(), "vars": {"data": data}, "pos": (2, 2, 1, 1)},
          {"icon": "Buttons\\IconPack\\existing_class.png", "func": lambda data: data.activateClass("button4"),
           "size": QSize(50, 50), "text": classes.pop(), "vars": {"data": data}, "pos": (2, 3, 1, 1)},
          {"icon": "Buttons\\IconPack\\existing_class.png", "func": lambda data: data.activateClass("button5"),
           "size": QSize(50, 50), "text": classes.pop(), "vars": {"data": data}, "pos": (2, 4, 1, 1)},
          {"icon": "Buttons\\IconPack\\existing_class.png", "func": lambda data: data.activateClass("button6"),
           "size": QSize(50, 50), "text": classes.pop(), "vars": {"data": data}, "pos": (3, 0, 1, 1)},
          {"icon": "Buttons\\IconPack\\existing_class.png", "func": lambda data: data.activateClass("button7"),
           "size": QSize(50, 50), "text": classes.pop(), "vars": {"data": data}, "pos": (3, 1, 1, 1)},
          {"icon": "Buttons\\IconPack\\existing_class.png", "func": lambda data: data.activateClass("button8"),
           "size": QSize(50, 50), "text": classes.pop(), "vars": {"data": data}, "pos": (3, 2, 1, 1)},
          {"icon": "Buttons\\IconPack\\existing_class.png", "func": lambda data: data.activateClass("button9"),
           "size": QSize(50, 50), "text": classes.pop(), "vars": {"data": data}, "pos": (3, 3, 1, 1)},
          {"icon": "Buttons\\IconPack\\existing_class.png", "func": lambda data: data.activateClass("button10"),
           "size": QSize(50, 50), "text": classes.pop(), "vars": {"data": data}, "pos": (3, 4, 1, 1)},
          )

    b3 = ({"icon": "Buttons\\IconPack\\change_seating_order.png", "func": lambda data: data.changeTablePreset(),
           "size": QSize(200, 60), "vars": {"data": data}, "pos": (0, 0, 1, 1)},
          {"icon": "Buttons\\IconPack\\game.png", "func": lambda data: data.useGame(),
           "size": QSize(200, 60), "vars": {"data": data}, "pos": (0, 1, 1, 1)},
          {"icon": "Buttons\\IconPack\\settings.png", "func": lambda data: data.changeSettings(),
           "size": QSize(425, 75), "vars": {"data": data}, "pos": (1, 0, 1, 2)})

    b4 = ({"icon": "Buttons\\shutdown.png", "func": lambda x: sys.exit(),
           "size": QSize(100, 100), "vars": {"x": "5"}, "pos": (0, 0, 1, 1)},
          {"icon": "Buttons\\info.png", "func": lambda: webbrowser.open("https://Lesson-Gear.github.io/", new=2),
           "size": QSize(100, 100), "vars": {}, "pos": (0, 1, 1, 1)},
          {"icon": "Buttons\\reset.png", "func": lambda data: data.to_start(),
           "size": QSize(100, 100), "vars": {"data": data}, "pos": (0, 2, 1, 1)},
          {"icon": "Buttons\\changeSeatingPlan.png", "func": lambda data: data.changeTablePreset(),
           "size": QSize(100, 100), "vars": {"data": data}, "pos": (0, 3, 1, 1)}
          )

    return b1, b2, b3


class Dialog(QDialog):
    def __init__(self, titel, t_1, t_2, accepted = lambda *args: None, rejected = lambda *args: None,
                 size: QSize = QSize(280, 120), type = "JN"):
        super().__init__()

        self.setStyleSheet("")
        self.setWindowIcon(QIcon(rpath("Buttons/main.png")))
        self.setWindowTitle("SeatMatch - " + str(titel))
        self.setFixedSize(size)
        self.accept_func = accepted
        self.reject_func = rejected

        if type == "JN":
            QBtn = QDialogButtonBox.StandardButton.Yes | QDialogButtonBox.StandardButton.No
            self.buttonBox = QDialogButtonBox(QBtn)
            self.buttonBox.accepted.connect(self.accept)
            self.buttonBox.rejected.connect(self.reject)

        else:
            QBtn = QDialogButtonBox.StandardButton.Ok
            self.buttonBox = QDialogButtonBox(QBtn)

        self.layout = QVBoxLayout()
        l1 = QLabel(t_1)
        l2 = QLabel(t_2)
        l1.setAlignment(Qt.AlignmentFlag.AlignCenter)
        l2.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.layout.addWidget(l1)
        self.layout.addWidget(l2)
        self.layout.addWidget(self.buttonBox)
        self.setLayout(self.layout)

    def accept(self):
        self.accept_func()
        super().accept()

    def reject(self):
        self.reject_func()
        super().reject()


def checkForUpdates():
    try:
        con = requests.get("https://Lesson-Gear.github.io/SeatMatch/version.json")
    except requests.exceptions.ConnectionError:
        return False, "NCTS"

    if con.status_code == 200:
        ic(con.json())
        with open("config.json", "r") as f:
            d = json.loads(f.read())
        if d["version"] == con.json()["version"]:
            return False, "UTD"
        elif float(d["version"]) < float(con.json()["version"]):
            ic("Open Dialog")
            dialog = Dialog("Updates", f"There are updates available, version: {con.json()["version"]}",
                            "Would you like to install them now ?",
                            lambda *args: webbrowser.open("https://Lesson-Gear.github.io/SeatMatch/download", new=2))
            dialog.show()
            dialog.exec()
            return True, dialog
        else:
            return False, "WoV"
    else:
        return False, "Faileure: {}".format(con.status_code)


def rpath(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    base_path = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base_path, relative_path)
