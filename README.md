# dotfiles

Wayland dotfiles for Niri window manager.

## Contents

- `.zshrc` - Zsh config with Oh My Zsh and Powerlevel10k
- `p10k.zsh` - Powerlevel10k prompt settings
- `niri/` - Niri window manager config with DMS theme
- `swaylock/` - Lock screen colors
- `wlogout/` - Logout menu with animated GLSL lock screen background
- `fastfetch/` - System info display layout
- `scripts/` - Custom helper scripts for Niri
- `wallpapers/` - Wallpaper images

## Screenshots

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/e81e41c6-6008-4c8c-9a90-2a5dbc6c53ff" />

<img width="1920" height="1036" alt="image" src="https://github.com/user-attachments/assets/c0006b1d-47c2-4fcf-8fbc-8edb2903701d" />

<img width="948" height="1013" alt="image" src="https://github.com/user-attachments/assets/0e3bc385-5b1f-4744-9c4e-b55d42a9d890" />

<img width="1920" height="1079" alt="image" src="https://github.com/user-attachments/assets/3dd4feb7-e3d2-4d1a-bb6d-1d84e3f3d46d" />

## Scripts

The `scripts/` directory contains helper scripts for Niri. Install them to `~/.local/bin/`:

- `floating-terminal-toggle` - Toggle a floating Kitty terminal between workspaces
- `kitty-focus` - Focus an existing Kitty window, or launch a new one
- `niri-close` - Close the focused window

```bash
cp scripts/* ~/.local/bin/
chmod +x ~/.local/bin/*
```

## Lock screen animation

The lock screen uses a custom GLSL shader (`waves.frag`) rendered by `shaderbg`. You need two tools built from source.

### swaylock-plugin

```bash
git clone https://github.com/CaseyBullock/swaylock-plugin
cd swaylock-plugin
meson setup build
ninja -C build
sudo cp build/swaylock-plugin /usr/local/bin/
sudo chmod u+s /usr/local/bin/swaylock-plugin
```

### shaderbg

```bash
# Install build dependencies
sudo dnf install wayland-devel mesa-libEGL-devel meson ninja-build  # Fedora
# or: sudo apt install wayland-dev libegl-dev meson ninja-build     # Debian
# or: sudo pacman -S wayland mesa meson ninja                       # Arch

git clone https://git.sr.ht/~mstoeckl/shaderbg
cd shaderbg
meson setup build
ninja -C build
sudo cp build/shaderbg /usr/local/bin/
```

### shaderbg patch

The shader requires GLSL 1.30 for bitwise operations. In `main.c`, find `frag_prologue` and add `#version 130\n` at the start:

```c
static const char frag_prologue[] = "#version 130\n"
                    "uniform vec3 iResolution; "
                    // ... rest unchanged
```

Without this patch, shaders default to GLSL 1.10 and fail.

## Install

### Zsh and plugins

```bash
# Install Zsh
sudo dnf install zsh    # Fedora
# or: sudo apt install zsh    # Debian
# or: sudo pacman -S zsh      # Arch

# Install Oh My Zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Install Powerlevel10k theme
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k

# Install plugins
git clone --depth=1 https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
git clone --depth=1 https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

# Link configs
ln -sf ~/dotfiles/.zshrc ~/.zshrc
ln -sf ~/dotfiles/p10k.zsh ~/.p10k.zsh
```

### Wayland configs

```bash
git clone https://github.com/pixelrick420/dotfiles.git ~/dotfiles

ln -sf ~/dotfiles/swaylock ~/.config/swaylock
ln -sf ~/dotfiles/wlogout ~/.config/wlogout
ln -sf ~/dotfiles/niri ~/.config/niri
ln -sf ~/dotfiles/fastfetch ~/.config/fastfetch

cp ~/dotfiles/wallpapers/wallpaper.jpg ~/.local/share/wallpapers/
```

## Dependencies

- **zsh** - Shell
- **Oh My Zsh** - Zsh framework
- **powerlevel10k** - Zsh theme
- **zsh-autosuggestions** - Command suggestions from history
- **zsh-syntax-highlighting** - Command syntax highlighting
- **niri** - Window manager
- **wlogout** - Logout menu
- **swaylock-plugin** + **shaderbg** - Animated lock screen background
- **fastfetch** - System info display
