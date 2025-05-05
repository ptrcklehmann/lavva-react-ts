// /Users/patrick.lehmann/code/lavva-react-ts/src/game/Gem.ts
import { Player } from "./Player"; // Assuming Player class is in the same directory

// Helper function (if not defined globally)
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export class Gem {
  x: number;
  y: number;
  radius: number;
  speed: number;
  distance: number | undefined; // Distance might not be calculated initially
  counted: boolean;
  // sound: string; // Consider how sounds will be handled in React

  constructor(canvasWidth: number) {
    this.x = Math.random() * canvasWidth;
    this.y = 0 - randomBetween(50, 150); // Start slightly above the canvas
    this.radius = randomBetween(40, 80);
    this.speed = Math.random() * 2 + 2;
    this.counted = false;
    // this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
  }

  update(player: Player) {
    this.y += this.speed;
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    this.distance = Math.sqrt(dx * dx + dy * dy);
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Define the gradient within the draw method or pass it if defined elsewhere
    const warningGrad = ctx.createLinearGradient(
      this.x - this.radius,
      this.y,
      this.x + this.radius,
      this.y
    );
    warningGrad.addColorStop(0, "yellow");
    warningGrad.addColorStop(1 / 6, "#FFFF87");
    warningGrad.addColorStop(2 / 6, "#EFEFA7");
    warningGrad.addColorStop(3 / 6, "#D5D4AE");
    warningGrad.addColorStop(4 / 6, "#FFFA15");
    warningGrad.addColorStop(5 / 6, "#DFDD60");
    warningGrad.addColorStop(1, "#FFF04C");

    ctx.beginPath();
    ctx.fillStyle = warningGrad;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
}
