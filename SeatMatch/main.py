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
import sys
import time
import webbrowser

try:
    from icecream import ic
    ic.configureOutput(prefix="SeatMatch | ")
    ic.configureOutput(outputFunction=logging.debug)
except ImportError:  # Graceful fallback if IceCream isn't installed.
    ic = lambda *a: None if not a else (a[0] if len(a) == 1 else a)
from random import shuffle
from internal_functions import getSOrder, get_buttons, checkForUpdates, Dialog, rpath

try:
    from interface import MainWindow, EnterNames, ChangeSettings
except ImportError:
    pass
from PyQt6.QtWidgets import QApplication, QFileDialog
from PyQt6.QtCore import QTimer, QSize


######################### --- Inizializing --- ################################

version = "1.0"
build = "1w0.6"


class DataManager:

    tablePreset = 1
    game = None
    names = None
    starting_names = None
    cname = None
    win = None
    count = 24

    def __init__(self):
        if os.path.exists(rpath("config.json")):
            with open(rpath("config.json"), "r") as f:
                setup = json.loads(f.read())
                for setting in setup:
                    setattr(self, setting, setup[setting])
        else:
            with open(rpath("config.json"), "w"):
                json.dump({
                    "preloaded_class": "None",
                    "favorites": [],
                    "version": version,
                    "build": build
                })

    def preload_class(self, mwin):
        win.playground.update()
        self.win = mwin
        if "preloaded_class" in dir(self) and self.preloaded_class != "None":
            with open(rpath(ic(f"DataFiles\\{getattr(self, "preloaded_class")}")), "r") as f_preload:
                classe = json.loads(f_preload.read())
                self.cname = classe["cname"]
                self.names = classe["names"]
                self.count = classe["count"]
                self.update_to_gui()

    def shuffle(self):
        if self.game is not None:
            self.game = None
            getattr(win.optionsWindow.options2, "button1").setNewIcon(rpath(ic(f"Buttons\\Iconpack\\game.png")))
            self.names = self.starting_names

        if self.names is None:
            logging.warning("Invalid Operation")
            dialog = Dialog("Invalid Operation", "There is nothing to shuffle",
                            "You need to load a class to create a new Seating order, open documentary ?",
                            accepted=lambda *args: webbrowser.open("https://Lesson-Gear.github.io/SeatMatch/doku",
                                                                   new=2), size=QSize(450, 120))
            dialog.show()
            dialog.exec()
            return
        shuffle(self.names)
        self.update_to_gui()

    def update_to_gui(self):
        ic(getattr(win.optionsWindow.options1, "button0")).setNewText(self.cname)
        win.setWindowTitle(f"SeatMatch - {self.cname}")
        win.playground.setNames(self.names, self.count)

    def open_file(self):
        """
        Not used but nice to have, if you want to open files
        :return: None, but reads a user defined files out and loads it
        """
        dialog = QFileDialog(win)
        dialog.setDirectory(os.path.expanduser('~'))
        dialog.setFileMode(QFileDialog.FileMode.ExistingFile)
        dialog.setNameFilter("Text File (*.txt);; Csv File (*.csv);; Json File (*.json);; SeatMatch File (*.seatMatch)")

        if not dialog.exec():
            return

        typ = ic(dialog.selectedNameFilter())
        file = ic(dialog.selectedFiles())

        try:
            with open(file[0], "r") as f:
                content = f.read()
        except FileNotFoundError | IsADirectoryError | PermissionError as ex:
            logging.warning("File can't be read - " + str(ex))
            dialog = Dialog("File Error", "A Error occurred",
                            "Ensure the file is Closed can be read without Administrator Permissions, do you want to try again",
                            accepted= lambda *args: self.open_file(), size=QSize(450, 120))
            dialog.show()
            dialog.exec()
            return
        try:
            if typ == "SeatMatch File (*.seatMatch)":
                d = ic(json.loads(content))
                self.names = d["names"]
                self.cname = d["cname"]

            else:
                if typ == "Text File (*.txt)":
                    if ", " in content:
                        sep = ", "
                    elif "," in content:
                        sep = ","
                    else:
                        sep = ";"
                    self.names = ic(content.split(sep))

                elif typ == "Csv File (*.csv)":
                    self.names = ic(content.split(";"))

                elif typ == "Json File (*.json)":
                    self.names = ic(json.loads(content))

                if len(self.names[0]) < 5:
                    self.cname = self.names.pop(0)
        except Exception as ex:
            logging.warning("Content not readable - " + str(ex))
            dialog = Dialog("Input Error", "The Class cant be read",
                            "Ensure you are useing the right seperator for the file type. open documentary ?",
                            accepted=lambda *args: webbrowser.open("https://Lesson-Gear.github.io/SeatMatch/doku", new=2),
                            size=QSize(450, 120))
            dialog.show()
            dialog.exec()
            return

        self.update_to_gui()

    def save(self):
        if self.names is None:
            logging.warning("Invalid Operation")
            dialog = Dialog("Invalid Operation", "There is nothing to be saved",
                            "You need to load a class to save it, open documentary ?",
                            accepted=lambda *args: webbrowser.open("https://Lesson-Gear.github.io/SeatMatch/doku",
                                                                   new=2), size=QSize(450, 120))
            dialog.show()
            dialog.exec()
            return
        data = {
            "cname": self.cname,
            "names": self.names,
                }
        content = json.dumps(data, indent=4)

        with open(rpath(f"DataFiles\\{self.cname}.seatMatch"), "w") as f:
            f.write(content)
        ic()

    def changeTablePreset(self):
        new = (1 if self.tablePreset == 3 else self.tablePreset + 1)
        self.tablePreset = new
        setattr(win.playground, "tablePreset", new)
        setattr(win.playground, "created", False)
        setattr(win.playground, "tables", [])
        win.playground.update()

    def useGame(self):
        if self.names is None:
            logging.warning("Invalid Operation")
            dialog = Dialog("Invalid Operation", "A Game without a class ? that's sad",
                            "You need to load a class to play the game, open documentary ?",
                            accepted=lambda *args: webbrowser.open("https://Lesson-Gear.github.io/SeatMatch/doku",
                                                                   new=2), size=QSize(450, 120))
            dialog.show()
            dialog.exec()
            return

        if self.game is None:
            getattr(win.optionsWindow.options2, "button1").setNewIcon(ic(rpath(f"Buttons\\Iconpack\\1.png")))
            self.starting_names = self.names[:]
            shuffle(self.names)
            self.game = ic(getSOrder(self.names))
            self.update_to_gui()

        else:
            getattr(win.optionsWindow.options2, "button1").setNewIcon(rpath(ic(f"Buttons\\Iconpack\\{7 - len(self.game)}.png")))
            if len(self.game) < 1:
                getattr(win.optionsWindow.options2, "button1").setNewIcon(rpath(ic(f"Buttons\\Iconpack\\game.png")))
                self.game = None
                self.names = self.starting_names[:]

            else:
                ic(len(self.game), self.game[0])
                self.names = list(self.game.pop(0))

            self.update_to_gui()

    def getClassPresets(self):
        classes = self.favorites
        while len(classes) < 10:
            classes.append("")
        ic(classes)
        return [(name[0:name.index(".")] if "." in name else name) for name in classes]

    def activateClass(self, button):
        if ic(button) not in dir(win.optionsWindow.options1):
            return
        bu = ic(getattr(win.optionsWindow.options1, button))
        active = ic(getattr(win.optionsWindow.options1, "button0"))
        active.setNewText(ic(getattr(bu, "_text")))
        for i in self.favorites:
            if i:
                ic(i.split(".")[0] == getattr(bu, "_text"), i)
                if i.split(".")[0] == getattr(bu, "_text"):
                    with open("DataFiles\\" + i, "r") as f:
                        dicty = ic(json.loads(f.read()))
                        self.names = ic(dicty["names"])
                        self.cname = dicty["cname"]
                        self.count = dicty["count"]
                        self.update_to_gui()
                        break

        win.update()

    def changeSettings(self):
        dialog = ChangeSettings(self)
        dialog.show()

    def addNames(self):
        dialog = EnterNames(self)
        dialog.show()

    def getFavorites(self):
        if "favorites" in dir(self):
            return [name.split(".")[0] for name in self.favorites]
        return [None]

    def to_start(self):
        self.names = [" " for _ in range(24)]
        self.cname = " "
        ic(getattr(win.optionsWindow.options1, "button0")).setNewText(" ")
        self.update_to_gui()

    @staticmethod
    def UpdateManager():
        status, code = checkForUpdates()
        logging.debug("Need updates: {}, Code: {}".format(status, code))


######################### --- Main Programm --- ###############################


if __name__ == '__main__':
    try:
        ic.enable()
        logging.basicConfig(filename=rpath('SeatMatch.log'), filemode='w', format='%(levelname)s - %(message)s', level=logging.DEBUG)
        logging.info(f"Starting SeatMatch {time.ctime()}\n")
        app = QApplication(sys.argv)
        data = DataManager()
        win = MainWindow(get_buttons(data), data=data)
        win.show()
        win.playground.repaint()
        data.preload_class(win)
        clock = QTimer()
        # clock.timeout.connect(data.UpdateManager)
        clock.setSingleShot(True)
        clock.start(800)
        app.exec()

    except Exception as ex:
        logging.exception("EXCEPTION - " + str(ex))
        # noinspection PyUnboundLocalVariable
        # app.exec()

    finally:
        logging.info(f"Finishing SeatMatch {time.ctime()}\n")
        with open(rpath("SeatMatch.log"), "r") as f:
            debug = f.read()
        dfile = os.listdir("Logs//")
        while len(dfile) > 4:
            os.remove(f"Logs//{dfile.pop(0)}")

        with open(rpath(f"Logs//SeatMatch_{time.strftime('%b_%d_%H-%M-%S')}.log"), "w") as f:
            f.write(debug)
