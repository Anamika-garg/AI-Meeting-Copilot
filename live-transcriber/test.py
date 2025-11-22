# import sounddevice as sd

# print(sd.query_devices())
# import sounddevice as sd
# import numpy as np

# SAMPLE_RATE = 16000

# def callback(indata, frames, time, status):
#     volume = np.linalg.norm(indata) * 10
#     print("Volume:", int(volume))

# with sd.InputStream(channels=1, samplerate=SAMPLE_RATE, callback=callback):
#     sd.sleep(10000)

print(client.models.list())
