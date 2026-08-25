# dotfiles

My Wayland (Niri) dotfiles.

## What's included

- **swaylock** - Lock screen config
- **wlogout** - Logout menu with animated GLSL lock screen background
- **niri** - Window manager config with DMS theme
- **fastfetch** - System info display
- **wallpapers** - Current wallpaper

## Screenshots

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/e81e41c6-6008-4c8c-9a90-2a5dbc6c53ff" />

<img width="1920" height="1036" alt="image" src="https://github.com/user-attachments/assets/c0006b1d-47c2-4fcf-8fbc-8edb2903701d" />

<img width="948" height="1013" alt="image" src="https://github.com/user-attachments/assets/0e3bc385-5b1f-4744-9c4e-b55d42a9d890" />

<img width="1920" height="1079" alt="image" src="https://github.com/user-attachments/assets/3dd4feb7-e3d2-4d1a-bb6d-1d84e3f3d46d" />



## Lock screen animation

The lock screen uses a custom GLSL shader (`waves.frag`) rendered by `shaderbg`. This requires:

1. **swaylock-plugin** - Build from source:
   ```bash
   git clone https://github.com/CaseyBullock/swaylock-plugin
   cd swaylock-plugin
   meson setup build
   ninja -C build
   sudo cp build/swaylock-plugin /usr/local/bin/
   sudo chmod u+s /usr/local/bin/swaylock-plugin
   ```

2. **shaderbg** (mstoeckl version) - Build from source:
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
git clone https://github.com/Pixelrick420/dotfiles.git ~/dotfiles

ln -sf ~/dotfiles/swaylock ~/.config/swaylock
ln -sf ~/dotfiles/wlogout ~/.config/wlogout
ln -sf ~/dotfiles/niri ~/.config/niri
ln -sf ~/dotfiles/fastfetch ~/.config/fastfetch

cp ~/dotfiles/wallpapers/wallpaper.jpg ~/.local/share/wallpapers/
```

## Dependencies

- **niri** - Window manager
- **wlogout** - Logout menu
- **swaylock-plugin** + **shaderbg** - Animated lock screen
- **fastfetch** - System info 
