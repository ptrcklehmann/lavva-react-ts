interface MousePosition {
  x: number;
  y: number;
}

export class Player {
  x: number;
  y: number;
  radius: number;

  constructor(initialX: number, initialY: number) {
    this.x = initialX;
    this.y = initialY;
    this.radius = 50;
  }

  update(mouse: MousePosition) {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    // Add some damping to prevent jerky movement
    if (Math.abs(dx) > 1) {
      // Only move if the difference is significant
      this.x -= dx / 20; // Adjust division factor for desired speed
    }
    if (Math.abs(dy) > 1) {
      this.y -= dy / 20;
    }
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
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = blobGrad;
    ctx.fill();
    ctx.closePath(); // Good practice to close the path
  }
}
