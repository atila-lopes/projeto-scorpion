#include <webots/Robot.hpp>
#include <webots/Motor.hpp>
#include <filesystem>
#include <iostream>

#include <fstream>
#include <string>
#include <iostream>

using namespace webots;

int main() {

  Robot robot;

  int timestep =
      (int)robot.getBasicTimeStep();

  Motor *leftMotor =
      robot.getMotor("left wheel motor");

  Motor *rightMotor =
      robot.getMotor("right wheel motor");

  if (!leftMotor || !rightMotor) {
    std::cout << "Motores nao encontrados!"
              << std::endl;
    return 1;
  }

  leftMotor->setPosition(INFINITY);
  rightMotor->setPosition(INFINITY);

  leftMotor->setVelocity(0.0);
  rightMotor->setVelocity(0.0);
  
  std::cout
    << std::filesystem::current_path()
    << std::endl;

  while (robot.step(timestep) != -1) {

    std::ifstream file(
      "C:/Users/atila/Documents/my_project/worlds/command.txt"
    );
    
    if (file) {
      std::cout << "Arquivo aberto!" << std::endl;
    }
    else {
      std::cout << "Nao consegui abrir o arquivo!" << std::endl;
    }

    std::string cmd = "S";

    if (file)
      file >> cmd;

    if (cmd == "F") {

      leftMotor->setVelocity(6.0);
      rightMotor->setVelocity(6.0);

    } else if (cmd == "B") {

      leftMotor->setVelocity(-6.0);
      rightMotor->setVelocity(-6.0);

    } else if (cmd == "L") {

      leftMotor->setVelocity(-3.0);
      rightMotor->setVelocity(3.0);

    } else if (cmd == "R") {

      leftMotor->setVelocity(3.0);
      rightMotor->setVelocity(-3.0);

    } else {

      leftMotor->setVelocity(0.0);
      rightMotor->setVelocity(0.0);
    }
  }

  return 0;
}