# dotfiles

My Wayland (Niri) dotfiles.

## What's included

- **swaylock** — Lock screen config
- **wlogout** — Logout menu with animated GLSL lock screen background
- **niri** — Window manager config with DMS theme
- **fastfetch** — System info display
- **wallpapers** — Current wallpaper

## Lock screen animation

The lock screen uses a custom GLSL shader (`waves.frag`) rendered by `shaderbg`. This requires:

1. **swaylock-plugin** — Build from source:
   ```bash
   git clone https://github.com/CaseyBullock/swaylock-plugin
   cd swaylock-plugin
   meson setup build
   ninja -C build
   sudo cp build/swaylock-plugin /usr/local/bin/
   sudo chmod u+s /usr/local/bin/swaylock-plugin
   ```

2. **shaderbg** (mstoeckl version) — Build from source:
   ```bash
   sudo dnf install wayland-devel mesa-libEGL-devel meson ninja-build  # Fedora
   # or: sudo apt install wayland-dev libegl-dev meson ninja-build     # Ubuntu
   # or: sudo pacman -S wayland mesa meson ninja                       # Arch
   
   git clone https://git.sr.ht/~mstoeckl/shaderbg
   cd shaderbg
   # Patch main.c to add #version 130 to frag_prologue (see below)
   meson setup build
   ninja -C build
   sudo cp build/shaderbg /usr/local/bin/
   ```

### shaderbg patch

In `main.c`, find the `frag_prologue` and add `#version 130\n` at the start:

```c
static const char frag_prologue[] = "#version 130\n"
                    "uniform vec3 iResolution; "
                    // ... rest unchanged
```

Without this, shaders default to GLSL 1.10 which doesn't support bitwise operations.

## Install

```bash
git clone <repo-url> ~/dotfiles

ln -sf ~/dotfiles/swaylock ~/.config/swaylock
ln -sf ~/dotfiles/wlogout ~/.config/wlogout
ln -sf ~/dotfiles/niri ~/.config/niri
ln -sf ~/dotfiles/fastfetch ~/.config/fastfetch

cp ~/dotfiles/wallpapers/wallpaper.jpg ~/.local/share/wallpapers/
```

## Dependencies

- **niri** — Window manager
- **wlogout** — Logout menu
- **swaylock-plugin** + **shaderbg** — Animated lock screen
- **fastfetch** — System info (optional)
