# Product Requirements Document: Web-Based Snake Game

**Version:** 1.0

**Author:** Gemini Code Assist

## 1. Overview

This document outlines the product requirements for "Змейка" (Snake), a modern, browser-based implementation of the classic arcade game. The objective is to create a simple, visually appealing, and engaging game for casual players. The project is built using standard web technologies (HTML, CSS, JavaScript) and is intended to be a fun, shareable portfolio piece.

## 2. Target Audience

*   **Casual Gamers:** Users of all ages looking for a quick and easy game to play in a web browser.
*   **Nostalgia Seekers:** Players who have fond memories of the original Snake game on older devices.
*   **Friends & Family:** The game should be simple enough to be shared with and enjoyed by anyone, regardless of their gaming experience.

## 3. Features & Functionality

### 3.1. Core Gameplay (Version 1.0 - Implemented)

*   **Game Board:** A fixed-size grid (20x20 tiles) where all gameplay occurs.
*   **Snake Control:** The player controls the snake's direction using the **Arrow keys** or **W/A/S/D** keys. The snake moves at a constant speed.
*   **Objective:** The primary goal is to guide the snake to eat apples that appear on the board.
*   **Growth:** Each time the snake eats an apple, it grows longer by one segment.
*   **Scoring:**
    *   The player's score increases by 1 for each apple eaten.
    *   The current score is displayed in real-time.
    *   A "Best Score" for the current session is tracked and displayed.
*   **Game Over Conditions:** The game ends if:
    *   The snake's head collides with any of the four walls of the game board.
    *   The snake's head collides with any part of its own body.

### 3.2. User Interface (Version 1.0 - Implemented)

The game is organized into three distinct screens:

*   **Main Menu Screen:**
    *   Displays the game title and a brief description.
    *   Features a "Play" button to transition to the game screen.
    *   Provides a hint for the controls.
*   **Game Screen:**
    *   Contains the main `canvas` for gameplay.
    *   An information panel displays the **Current Score**, **Best Score**, and **Game Status** (e.g., "Press an arrow key to start").
    *   Includes "Start" and "Menu" buttons for game control.
*   **Game Over Overlay:**
    *   A modal overlay that appears upon game over.
    *   Displays a "Game Over" message and the player's **Final Score**.
    *   Provides two actions:
        *   **"Try Again":** Resets the game and starts a new session.
        *   **"Main Menu":** Returns the player to the main menu screen.

### 3.3. Design and Aesthetics (Version 1.0 - Implemented)

*   **Visual Style:** A modern, dark theme with high-contrast elements.
*   **Color Palette:** Dark background (`#0f172a`), green snake (`#22c55e`), and red apple (`#ef4444`) for clear visibility.
*   **Responsiveness:** The layout is designed to be functional on both desktop and mobile screen sizes.

## 4. Future Enhancements (Potential Features for v1.1+)

The following features are proposed for future development to enhance the player experience.

*   **Persistent High Score:**
    *   **Requirement:** Use the browser's `localStorage` to save the player's all-time best score.
    *   **Benefit:** The best score will persist even after the browser tab is closed, providing a long-term goal for the player.
*   **Increasing Difficulty:**
    *   **Requirement:** The snake's movement speed should gradually increase as the player's score rises.
    *   **Benefit:** Adds a dynamic challenge and prevents the game from becoming too easy at higher scores.
*   **Pause/Resume Functionality:**
    *   **Requirement:** Allow the player to pause and resume the game using a key (e.g., `Spacebar` or `P`) or an on-screen button.
    *   **Benefit:** Improves user experience by allowing for interruptions without ending the game.
*   **Sound Effects:**
    *   **Requirement:** Add simple audio cues for key events:
        *   Eating an apple.
        *   Game over.
        *   UI button clicks.
    *   **Benefit:** Makes the game more immersive and provides satisfying feedback.

## 5. Technical Requirements

*   **Platform:** Modern Web Browsers (Chrome, Firefox, Safari, Edge).
*   **Core Technologies:** HTML5, CSS3, vanilla JavaScript (ES6+).
*   **Dependencies:** None. The project is self-contained.

## 6. Success Metrics

*   **Completion:** Successful implementation of all Version 1.0 features.
*   **Engagement:** (Informal) Positive feedback from users who play the game.
*   **Extensibility:** The codebase is clean and modular enough to easily accommodate the "Future Enhancements" listed above.

---

This document will be updated as the project evolves.