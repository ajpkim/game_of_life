////////////////////////////////////////////////////////////////////////////////
// Game of Life params
const x = 100
const y = 100
const initP = 0.33
const ms = 100
const cellSize = 8
////////////////////////////////////////////////////////////////////////////////

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const getCanvas = () => {
  return document.getElementById("myCanvas")
}

const initGrid = (x, y, initP) => {
  return Array(y)
    .fill()
    .map(() =>
      Array(x)
        .fill()
        .map(() => (Math.random() > initP ? 0 : 1)),
    )
}

const countAliveNeighbors = (grid) => {
  const rows = grid.length
  const cols = grid[0].length
  let res = []
  for (let y = 0; y < rows; y++) {
    res[y] = []
    for (let x = 0; x < cols; x++) {
      let total = 0
      // Compute the index ranges for neighbors
      let topRow = Math.max(y - 1, 0)
      let bottomRow = Math.min(y + 1, cols - 1)
      let leftCol = Math.max(x - 1, 0)
      let rightCol = Math.min(x + 1, rows - 1)
      // Use neighbor indices to accumulate neighbor vals
      for (let i = topRow; i <= bottomRow; i++) {
        for (let j = leftCol; j <= rightCol; j++) {
          if (i !== y || j !== x) {
            total += grid[i][j]
          }
        }
      }
      res[y][x] = total
    }
  }
  return res
}

const updateGrid = (grid) => {
  const rows = grid.length
  const cols = grid[0].length
  const neighbors = countAliveNeighbors(grid)

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let cell = grid[row][col]
      let cellNeighbors = neighbors[row][col]
      // Alive cell becomes dead
      if (cell === 1 && cellNeighbors !== 2 && cellNeighbors !== 3) {
        grid[row][col] = 0
      }
      // Dead cell becomes alive
      if (cell === 0 && cellNeighbors === 3) {
        grid[row][col] = 1
      }
    }
  }
}

const drawGrid = (grid, canvas, ctx, cellSize) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      const xStart = x * cellSize
      const yStart = y * cellSize
      ctx.fillStyle = grid[y][x] == 1 ? "white" : "black"
      ctx.fillRect(xStart, yStart, cellSize, cellSize)
    }
  }
}

const gameOfLife = async (x, y, initP, ms, cellSize) => {
  let grid = initGrid(x, y, initP)
  let canvas = getCanvas()
  let ctx = canvas.getContext("2d")

  while (true) {
    drawGrid(grid, canvas, ctx, cellSize)
    updateGrid(grid)
    await sleep(ms)
  }
}

gameOfLife(x, y, initP, ms, cellSize)
