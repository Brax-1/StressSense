# Stress detection system based on face cues

## Project Setup
---
```
$ python3.8 -m venv env
$ source env/bin/activate
$ pip3 install -r requirements.txt
```

## Requirements
* dlib
* imutils
* opencv
* pillow
* pyautogui
* dlib

## Usage
### To process a file
```
$ python run.py --input examples/004.mp4 --rectangle --landmarks --forehead --forehead_outline --fps
```

* --input 0: specify the input. if input is an integer => webcam. If input is a string => a video path
* --rectangle: to display the rectangle around the detected face. (default: False)
* --landmarks: to display the landmarks of the detected face. (default: False)
* --forehead: to display a color rectangle on the forehead. (defalut: False)
* --forehead_outline: to display the outline around the forehead. (default: False)
* --fps: to show the framerate on the bottom left of the screen. (default: False)

* Press 'q' on the keyboard to quit the program.
