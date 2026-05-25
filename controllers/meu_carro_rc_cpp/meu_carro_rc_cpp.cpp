#define _USE_MATH_DEFINES
#include <cmath>
#include <webots/vehicle/Driver.hpp>
#include <webots/Keyboard.hpp>
#include <iostream>

using namespace webots;

const double MAX_SPEED_FWD = 28.0;
const double MAX_SPEED_REV = -10.0;
const double MAX_ANGLE_DEG = 16.0;
const double SPEED_STEP = 2.0;
const double ANGLE_STEP = 2.0;

int main() {
    Driver *driver = new Driver();
    Keyboard *keyboard = driver->getKeyboard();
    int timeStep = (int)driver->getBasicTimeStep();
    keyboard->enable(timeStep);

    double currentSpeed = 0.0;
    double currentAngleDeg = 0.0;

    auto setSpeed = [&](double speed) {
        if (speed > 0)
            currentSpeed = std::min(speed, MAX_SPEED_FWD);
        else
            currentSpeed = std::max(speed, MAX_SPEED_REV);
        driver->setCruisingSpeed(currentSpeed);
        std::cout << "Velocidade: " << currentSpeed << " km/h" << std::endl;
    };

    auto setAngle = [&](double angleDeg) {
        currentAngleDeg = std::max(-MAX_ANGLE_DEG, std::min(angleDeg, MAX_ANGLE_DEG));
        // CORREÇÃO: sinal positivo para que esquerda (negativo) vire à esquerda
        double angleRad = currentAngleDeg * M_PI / 180.0;
        driver->setSteeringAngle(angleRad);
        std::cout << "Ângulo: " << currentAngleDeg << " graus" << std::endl;
    };

    std::cout << "Controle C++ ATIVO (com RÉ e direção corrigida)" << std::endl;
    std::cout << " ↑ : Acelerar" << std::endl;
    std::cout << " ↓ : Ré/Freiar" << std::endl;
    std::cout << " ← : Esquerda" << std::endl;
    std::cout << " → : Direita" << std::endl;
    std::cout << " ESPAÇO : Parar" << std::endl;

    while (driver->step() != -1) {
        int key = keyboard->getKey();
        if (key != -1) {
            switch (key) {
                case Keyboard::UP:    setSpeed(currentSpeed + SPEED_STEP); break;
                case Keyboard::DOWN:  setSpeed(currentSpeed - SPEED_STEP); break;
                case Keyboard::LEFT:  setAngle(currentAngleDeg - ANGLE_STEP); break;
                case Keyboard::RIGHT: setAngle(currentAngleDeg + ANGLE_STEP); break;
                case 32:              setSpeed(0.0); setAngle(0.0); break;
            }
        }
    }

    delete driver;
    return 0;
}