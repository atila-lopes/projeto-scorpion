from vehicle import Driver
from controller import Keyboard

driver = Driver()
keyboard = Keyboard()

# Converte para inteiro (o Webots espera um int)
timestep = int(driver.getBasicTimeStep())
keyboard.enable(timestep)

print("Python: Controle remoto ativo. Pressione as setas.")
print("Clique na janela 3D para focar.")

while driver.step() != -1:
    key = keyboard.getKey()
    if key != -1:
        print(f"Tecla pressionada: {key}")
        if key == Keyboard.UP:
            driver.setCruisingSpeed(20.0)
            print("  Acelerando")
        elif key == Keyboard.DOWN:
            driver.setCruisingSpeed(0.0)
            print("  Parando")
        elif key == Keyboard.LEFT:
            driver.setSteeringAngle(-0.3)
            print("  Virando esquerda")
        elif key == Keyboard.RIGHT:
            driver.setSteeringAngle(0.3)
            print("  Virando direita")
        elif key == ord(' '):
            driver.setCruisingSpeed(0.0)
            driver.setSteeringAngle(0.0)
            print("  Parada total")