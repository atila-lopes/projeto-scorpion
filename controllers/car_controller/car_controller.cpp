#include <webots/Robot.hpp>
#include <webots/Motor.hpp>
#include <webots/DistanceSensor.hpp>

#include <iostream>
#include <fstream>
#include <filesystem>
#include <cmath>
#include <algorithm>

using namespace webots;

int main() {

  Robot robot;

  int timestep = (int)robot.getBasicTimeStep();

  Motor *leftMotor = robot.getMotor("left wheel motor");
  Motor *rightMotor = robot.getMotor("right wheel motor");

  if (!leftMotor || !rightMotor) {
    std::cout << "Motores nao encontrados!" << std::endl;
    return 1;
  }

  leftMotor->setPosition(INFINITY);
  rightMotor->setPosition(INFINITY);

  leftMotor->setVelocity(0);
  rightMotor->setVelocity(0);

  DistanceSensor *ps[8];

  const char *sensorNames[8] = {
      "ps0","ps1","ps2","ps3",
      "ps4","ps5","ps6","ps7"
  };

  for(int i=0;i<8;i++){
      ps[i]=robot.getDistanceSensor(sensorNames[i]);
      if(ps[i])
          ps[i]->enable(timestep);
  }

  std::cout
      << std::filesystem::current_path()
      << std::endl;

  while(robot.step(timestep)!=-1){

      std::ifstream file("../../worlds/command.txt");

      double x=0.0;
      double y=0.0;
      double speed=0.0;

      if(file){
          file>>x;
          file>>y;
          file>>speed;
      }

      double maxVelocity =
          6.28 * speed / 100.0;

      double left = y + x;
      double right = y - x;

      double m =
          std::max(
              std::abs(left),
              std::abs(right)
          );

      if(m>1.0){

          left/=m;
          right/=m;

      }

      left*=maxVelocity;
      right*=maxVelocity;

      leftMotor->setVelocity(left);
      rightMotor->setVelocity(right);

  }

  return 0;
}