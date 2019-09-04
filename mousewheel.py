# -*- coding: utf-8 -*-
import pythoncom
import pyHook
import time
import win32api
import win32con

def onMouseWheel(event):
    while(event.Wheel == -1):
        time.sleep(0.1)
        win32api.mouse_event(win32con.MOUSEEVENTF_WHEEL, 0, 0, -1)
    return True

hm = pyHook.HookManager()
hm.MouseWheel = onMouseWheel
hm.HookMouse()
pythoncom.PumpMessages()
