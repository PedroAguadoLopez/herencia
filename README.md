---
title: 'Summoner''s Rift: Combat System'

---

# Summoner's Rift: Sistema de Combate por Turnos

## 1. Introducción
Este proyecto es un simulador interactivo de combate por turnos basado en el universo de *League of Legends*. El sistema permite al usuario elegir entre varios campeones y enfrentarse a una progresión de enemigos en la "Grieta del Invocador". El flujo del juego incluye el combate contra súbditos (minions), la destrucción de estructuras clave como torretas e inhibidores, y finalmente la destrucción del Nexo. Además, cuenta con mecánicas de progreso como la obtención de experiencia, subida de nivel, recompensas en oro y un sistema de tienda de objetos para mejorar las estadísticas del personaje durante la partida.

Esta documentación técnica tiene como propósito detallar la arquitectura orientada a objetos (POO) del proyecto. Se ha construido un motor lógico basado en herencia para gestionar las distintas entidades del juego de forma escalable. Las tecnologías utilizadas para el desarrollo incluyen HTML5 para el esqueleto estructural, CSS3 para el diseño visual de la interfaz de usuario, y JavaScript (ES6+) con un sistema de módulos para la lógica de combate. Adicionalmente, se hace uso de la API pública *Data Dragon* de Riot Games para cargar dinámicamente los retratos (splash arts e iconos) de los campeones.

## 2. Estructura de Archivos
El proyecto está organizado de forma modular para separar claramente la vista, los estilos y la lógica de negocio:

* **`/combat_system/`**: Carpeta principal de la aplicación.
  * `index.html`: Punto de entrada de la aplicación. Define la estructura de las pantallas de selección de campeón y de batalla, así como la estructura modal de la tienda.
  * **`/css/`**: Contiene `style.css` con todas las reglas de diseño.
  * **`/js/`**: 
    * `main.js`: Controlador principal del juego.
    * **`/models/`**: Contiene las clases del modelo de datos estructuradas mediante herencia (`entity.js`, `character.js`, `player.js`, `enemy.js` y las implementaciones específicas como `Minion.js` o `garen.js`).
* **`/images/`**: Directorio situado un nivel por encima de los scripts, utilizado para almacenar los recursos estáticos propios (iconos de torres, nexo, minions y el mapa).

**Justificación:** Esta arquitectura modular permite mantener el principio de responsabilidad única. El HTML y CSS se dedican exclusivamente a la interfaz, mientras que en JavaScript se separan los "modelos" (la definición pura de los personajes y sus atributos) del "controlador" (`main.js`), que es el que gestiona el DOM y el bucle del juego. Además, usar módulos (`export/import`) evita la contaminación del ámbito global.

## 3. Diagrama de Clases
La arquitectura del proyecto se asienta sobre una fuerte jerarquía de clases para evitar la duplicidad de código y centralizar las mecánicas comunes como el cálculo de daño.

```mermaid
classDiagram
    class Entity {
        +name: String
        +maxHealth: Number
        +health: Number
        +isAlive: Boolean
        +takeDamage(amount)
    }

    class Character {
        +level: Number
    }

    class GameStructure {
        +level: String
        +dmg: Number
        +attack(target)
    }

    class Player {
        +resourceType: String
        +maxResource: Number
        +resource: Number
        +attack(target)
        +useAbility(target)
    }

    class Enemy {
        +damage: Number
        +attack(target)
    }

    Entity <|-- Character
    Entity <|-- GameStructure
    Character <|-- Player
    Character <|-- Enemy
    Player <|-- CampeonesEspecíficos
    Enemy <|-- Orc