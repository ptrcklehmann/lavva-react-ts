// /Users/patrick.lehmann/code/lavva-react-ts/src/game/Blob.ts
import { Player } from "./Player"; // Assuming Player class is in the same directory

// Helper function (if not defined globally)
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export class Blob {
  x: number;
  y: number;
  radius: number;
  speed: number;
  distance: number | undefined; // Distance might not be calculated initially
  counted: boolean;
  // sound: string; // Consider how sounds will be handled in React
  // pop: boolean; // State like 'pop' might be managed differently

  constructor(canvasWidth: number) {
    this.x = Math.random() * canvasWidth;
    this.y = 0 - randomBetween(50, 150); // Start slightly above the canvas
    this.radius = randomBetween(25, 45);
    this.speed = Math.random() * 2 + 1;
    this.counted = false;
    // this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
    // this.pop = false;
  }

  update(player: Player) {
    this.y += this.speed;
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    this.distance = Math.sqrt(dx * dx + dy * dy);
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Define the gradient within the draw method or pass it if defined elsewhere
    const blobGrad = ctx.createLinearGradient(
      this.x - this.radius,
      this.y,
      this.x + this.radius,
      this.y
    );
    blobGrad.addColorStop(0, "red");
    blobGrad.addColorStop(1 / 6, "#FF0005");
    blobGrad.addColorStop(2 / 6, "#FF0012");
    blobGrad.addColorStop(3 / 6, "#FF0029");
    blobGrad.addColorStop(4 / 6, "#FF0049");
    blobGrad.addColorStop(5 / 6, "#FF0072");
    blobGrad.addColorStop(1, "#FF00A4");

    ctx.beginPath();
    ctx.fillStyle = blobGrad;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
}
