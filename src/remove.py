import shutil
import os
import time

time.sleep(1)

path = os.getenv("APPDATA")

shutil.rmtree(os.path.join(path, "authme"), ignore_errors=True)
