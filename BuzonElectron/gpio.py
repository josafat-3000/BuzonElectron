from gpiozero import LED
from time import sleep

led = LED(4)
led.off()
sleep(0.1)
led.on()
