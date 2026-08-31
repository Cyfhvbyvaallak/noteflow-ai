import subprocess
import time
import sys

def main():
    print("Starting backend server for testing...")
    server = subprocess.Popen([sys.executable, "run.py"])
    time.sleep(3)

    try:
        print("Running test_api.py...")
        result = subprocess.run([sys.executable, "test_api.py"], capture_output=False)
        print(f"Tests finished with returncode: {result.returncode}")
    finally:
        print("Stopping backend server...")
        server.terminate()
        server.wait()

if __name__ == "__main__":
    main()
