import shutil
import os

path = os.getenv("APPDATA")

shutil.rmtree(os.path.join(path, "authme"), ignore_errors=True)
