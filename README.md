# 🍭 KandyKaneKraft 🍬

A **HIGH-QUALITY** voxel game experience inspired by Minecraft but with a sweet twist! Build, explore, and survive in a colorful world made of candy, chocolate, and other delicious treats.

## Features

✨ **World Generation**
- Procedurally generated terrain using multi-octave Perlin noise
- Diverse biomes with different block types
- Water bodies and elevation variation
- Candy and sweet-themed blocks scattered throughout

🎮 **Gameplay Mechanics**
- Full 3D first-person movement and camera control
- Physics-based player movement with gravity and jumping
- Block placement and destruction (right/left click)
- Crosshair targeting system
- Smooth camera rotation with mouse look

🍬 **Block Types**
- Grass, Dirt, Stone (classic)
- Candy, Lollipop, Chocolate, Caramel (sweet!)
- Sugar, Ice, Sand, Water
- Each with unique colors and material properties

🎨 **Graphics**
- Modern Three.js rendering engine
- Shadow mapping for realistic lighting
- Fog effects for atmospheric depth
- Smooth antialiasing
- Physically-based materials

🎯 **Controls**
- **W/A/S/D** - Move forward, left, back, right
- **SPACE** - Jump
- **Mouse** - Look around (pointer lock on click)
- **Left Click** - Destroy blocks
- **Right Click** - Place blocks
- **1-8** - Select block type from hotbar

## Installation

```bash
npm install
```

## Running the Game

```bash
npm start
```

Then open your browser to **http://localhost:3000**

## Project Structure

```
.
├── src/
│   ├── index.js              # Main game loop and input handling
│   ├── Game.js               # Game engine and rendering setup
│   ├── Player.js             # Player controller and physics
│   ├── BlockManager.js        # Block creation and management
│   └── WorldGenerator.js      # Terrain generation algorithm
├── index.html                # Game HTML and UI
├── server.js                 # Development server
├── package.json              # Dependencies
└── README.md                 # This file
```

## Technologies

- **Three.js** - 3D graphics rendering
- **Cannon.js** - Physics simulation
- **Node.js** - Development server
- **ES6 Modules** - Modern JavaScript

## Future Enhancements

- 🌙 Day/night cycle with dynamic lighting
- 🎵 Sound effects and music
- 🧟 Mobs and creatures
- ⚔️ Combat system
- 💰 Mining and resource collection
- 🏗️ Crafting system
- 🌍 Infinite world generation
- 💾 Save/Load game progress
- 🔧 More block types and decorations
- 🎯 Game objectives and quests

## License

MIT - Feel free to use and modify!

---

**Created with ❤️ by the KandyKaneKraft Team**

*This is not affiliated with Minecraft. This is a high-quality voxel game inspired by the voxel genre.*
