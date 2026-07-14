//--------------------------------------
// Bibliotecas do Webots
//--------------------------------------

#include <webots/DistanceSensor.hpp>
#include <webots/Motor.hpp>
#include <webots/Robot.hpp>


//--------------------------------------
// Bibliotecas da linguagem C++
//--------------------------------------

#include <algorithm>
#include <cmath>
#include <fstream>
#include <iostream>


//--------------------------------------
// Constantes
//--------------------------------------

const int QUANTIDADE_SENSORES = 8;

const double VELOCIDADE_MAXIMA_MOTOR = 6.28;


//--------------------------------------
// Namespace
//--------------------------------------

using namespace webots;


//--------------------------------------
// Função principal
//--------------------------------------

int main() {

    //----------------------------------
    // Inicialização do robô
    //----------------------------------

    Robot robo;

    int passoTempo =
        (int)robo.getBasicTimeStep();


    //----------------------------------
    // Inicialização dos motores
    //----------------------------------

    Motor *motorEsquerdo =
        robo.getMotor("left wheel motor");

    Motor *motorDireito =
        robo.getMotor("right wheel motor");

    if (!motorEsquerdo || !motorDireito) {

        std::cout
            << "Erro: motores do robô não encontrados."
            << std::endl;

        return 1;

    }

    motorEsquerdo->setPosition(INFINITY);
    motorDireito->setPosition(INFINITY);

    motorEsquerdo->setVelocity(0);
    motorDireito->setVelocity(0);


    //----------------------------------
    // Inicialização dos sensores
    //----------------------------------

    DistanceSensor *sensoresDistancia[QUANTIDADE_SENSORES];

    const char *nomesSensores[QUANTIDADE_SENSORES] = {
        "ps0", "ps1", "ps2", "ps3",
        "ps4", "ps5", "ps6", "ps7"
    };

    for (int i = 0; i < QUANTIDADE_SENSORES; i++) {

        sensoresDistancia[i] =
            robo.getDistanceSensor(
                nomesSensores[i]
            );

        if (sensoresDistancia[i]) {

            sensoresDistancia[i]->enable(
                passoTempo
            );

        }

    }


    //----------------------------------
    // Laço principal
    //----------------------------------

    while (robo.step(passoTempo) != -1) {

        //----------------------------------
        // Leitura do comando
        //----------------------------------

        std::ifstream arquivoComando(
            "../../data/command.txt"
        );

        double x = 0.0;
        double y = 0.0;
        double velocidade = 0.0;

        if (arquivoComando) {

            arquivoComando
                >> x
                >> y
                >> velocidade;

        }


        //----------------------------------
        // Cálculo das velocidades
        //----------------------------------

        double velocidadeMaxima =
            VELOCIDADE_MAXIMA_MOTOR *
            velocidade / 100.0;

        double velocidadeEsquerda =
            y + x;

        double velocidadeDireita =
            y - x;

        double maiorVelocidade =
            std::max(
                std::abs(velocidadeEsquerda),
                std::abs(velocidadeDireita)
            );

        if (maiorVelocidade > 1.0) {

            velocidadeEsquerda /= maiorVelocidade;
            velocidadeDireita /= maiorVelocidade;

        }

        velocidadeEsquerda *= velocidadeMaxima;
        velocidadeDireita *= velocidadeMaxima;


        //----------------------------------
        // Aplicação das velocidades
        //----------------------------------

        motorEsquerdo->setVelocity(
            velocidadeEsquerda
        );

        motorDireito->setVelocity(
            velocidadeDireita
        );

    }

    return 0;
}