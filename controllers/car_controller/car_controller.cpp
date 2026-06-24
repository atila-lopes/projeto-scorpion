// Bibliotecas do Webots
#include <webots/Robot.hpp>
#include <webots/Motor.hpp>

// Biblioteca utilizada para obter o diretório atual
#include <filesystem>

// Bibliotecas padrão da linguagem
#include <iostream>
#include <fstream>
#include <string>

#include <webots/DistanceSensor.hpp>

using namespace webots;

int main() {

  // Cria a instância do robô
  Robot robot;

  // Obtém o passo de simulação definido no mundo do Webots
  int timestep =
      (int)robot.getBasicTimeStep();

  // Obtém os motores esquerdo e direito do robô
  Motor *leftMotor =
      robot.getMotor("left wheel motor");

  Motor *rightMotor =
      robot.getMotor("right wheel motor");

  // Verifica se ambos os motores foram encontrados
  if (!leftMotor || !rightMotor) {
    std::cout << "Motores nao encontrados!"
              << std::endl;
    return 1;
  }

  // Configura os motores para rotação contínua
  leftMotor->setPosition(INFINITY);
  rightMotor->setPosition(INFINITY);

  // Inicializa o robô parado
  leftMotor->setVelocity(0.0);
  rightMotor->setVelocity(0.0);
  
  DistanceSensor *ps[8];
  
  char sensorNames[8][4] = {
    "ps0", "ps1", "ps2", "ps3", "ps4", "ps5", "ps6", "ps7"
  };
  
  for (int i = 0; i < 8; i++){
    ps[i] = robot.getDistanceSensor(sensorNames[i]);
    ps[i]->enable(timestep);
  }

  // Exibe o diretório atual para auxiliar na depuração
  std::cout
    << std::filesystem::current_path()
    << std::endl;

  // Loop principal da simulação
  while (robot.step(timestep) != -1) {

    // Abre o arquivo contendo o comando enviado pela interface Web
    std::ifstream file(
      "../../worlds/command.txt"
    );

  double value[8];
  
  for (int i = 0; i < 8; i++)
    value[i] = ps[i]->getValue();
  
  const double LIMIT = 80.0;
  
  bool frontBlocked =
    value[0] > LIMIT ||
    value[1] > LIMIT ||
    value[6] > LIMIT ||
    value[7] > LIMIT;
  
  bool leftBlocked =
    value[5] > LIMIT ||
    value[6] > LIMIT;

  bool rightBlocked =
    value[1] > LIMIT ||
    value[2] > LIMIT;

  bool rearBlocked =
    value[3] > LIMIT ||
    value[4] > LIMIT;
  
    // Verifica se o arquivo foi aberto corretamente
    if (file) {
      std::cout << "Arquivo aberto!" << std::endl;
    }
    else {
      std::cout << "Nao consegui abrir o arquivo!" << std::endl;
    }

    // Caso não exista comando, mantém o robô parado
    std::string cmd = "S";

    // Lê o comando presente no arquivo
    if (file)
      file >> cmd;

    // Executa a ação correspondente ao comando recebido

    // Movimento para frente
    if (cmd == "F") {
      
      if (!frontBlocked) {
        leftMotor->setVelocity(6.0);
        rightMotor->setVelocity(6.0);
      } else {
        leftMotor->setVelocity(0.0);
        rightMotor->setVelocity(0.0);
      }

    }
    // Movimento para trás
    else if (cmd == "B") {
      if (!rearBlocked) {
        leftMotor->setVelocity(-6.0);
        rightMotor->setVelocity(-6.0);
      } else {
        leftMotor->setVelocity(0.0);
        rightMotor->setVelocity(0.0);
      }

    }
    // Rotação para a esquerda
    else if (cmd == "L") {

      if (!leftBlocked) {
        leftMotor->setVelocity(-3.0);
        rightMotor->setVelocity(3.0);
      } else {
        leftMotor->setVelocity(0.0);
        rightMotor->setVelocity(0.0);
      }


    }
    // Rotação para a direita
    else if (cmd == "R") {

      if (!rightBlocked) {
        leftMotor->setVelocity(3.0);
        rightMotor->setVelocity(-3.0);
      } else {
        leftMotor->setVelocity(0.0);
        rightMotor->setVelocity(0.0);
      }


    }
    // Qualquer outro comando mantém o robô parado
    else {

      leftMotor->setVelocity(0.0);
      rightMotor->setVelocity(0.0);
    }
  }

  return 0;
}