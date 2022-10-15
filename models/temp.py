import os

if __name__ == '__main__':
    var= '004.mp4'
    os.system(f'python run.py --input examples/{var} --rectangle --landmarks --forehead --forehead_outline --fps')