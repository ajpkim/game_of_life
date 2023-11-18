import numpy as np
import pygame


def init_grid(x: int = 10, y: int = 10, prob_alive: float = 0.25):
    return np.random.choice(a=[0, 1], size=(x, y), p=[1 - prob_alive, prob_alive])


def count_alive_neighbors(grid: np.array):
    """
    Vectorized and uses use shifted views of padded grid to accumulate neighbor count
    into each cell position.
    """
    padded_grid = np.pad(grid, pad_width=1)
    neighbor_counts = (
        padded_grid[:-2, :-2]  # top left
        + padded_grid[:-2, 1:-1]  # top center
        + padded_grid[:-2, 2:]  # top right
        + padded_grid[1:-1, :-2]  # middle left
        + padded_grid[1:-1, 2:]  # middle right
        + padded_grid[2:, :-2]  # bottom left
        + padded_grid[2:, 1:-1]  # bottom center
        + padded_grid[2:, 2:]  # bottom right
    )
    return neighbor_counts


def step(grid: np.array):
    neighbor_counts = count_alive_neighbors(grid)
    alive_mask = (grid == 1) & ((neighbor_counts == 2) | (neighbor_counts == 3))
    dead_mask = (grid == 0) & (neighbor_counts == 3)
    # Update grid in-place
    grid[:] = np.where(alive_mask | dead_mask, 1, 0)


def game_of_life(
    x: int = 25, y: int = 25, prob_alive: float = 0.3, cell_size: int = 20, t: int = 50
):
    grid = init_grid(x, y, prob_alive)
    width = grid.shape[1] * cell_size
    height = grid.shape[0] * cell_size
    black = (0, 0, 0)
    white = (255, 255, 255)
    screen = pygame.display.set_mode([width, height])
    running = True

    while running:
        pygame.time.wait(t)
        screen.fill(black)

        for event in pygame.event.get():
            if event.type == pygame.quit:
                running = false

        for i in range(grid.shape[0]):
            for j in range(grid.shape[1]):
                color = white if grid[i, j] == 1 else black
                dims = [j * cell_size, i * cell_size, cell_size, cell_size]
                pygame.draw.rect(screen, color, dims)

        pygame.display.update()
        step(grid)
    pygame.quit()


def main():
    x = 100
    y = 100
    prob_alive = 0.3
    cell_size = 10
    t = 50
    game_of_life(x, y, prob_alive, cell_size, t)


if __name__ == "__main__":
    main()
